import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { StudySession } from "../models/studySession.model.js";
import { UserProgress } from "../models/userProgress.model.js";
import { calculateSessionXP, checkLevelUp } from "../utils/xpCalculator.js";
import { uploadOnCloudinary, deleteAsset } from "../utils/cloudinary.js";
import { getAuth } from "@clerk/express";
import mongoose from "mongoose";
import fs from "fs";
import path from "path";

// Start a new session
export const startSession = asyncHandler(async (req, res) => {
    const { userId } = getAuth(req);
    const { subjectId, taskId, mode } = req.body;

    // Check if there is an active session
    const activeSession = await StudySession.findOne({
        userId,
        endTime: null,
        isAbandoned: false
    });

    if (activeSession) {
        throw new ApiError(400, "You already have an active session!");
    }

    const session = await StudySession.create({
        userId,
        subjectId,
        taskId: taskId || null,
        mode,
        startTime: new Date()
    });

    return res.status(201).json(
        new ApiResponse(201, { session }, "Session started successfully")
    );
});

// Complete a session (Log time + Award XP)
export const endSession = asyncHandler(async (req, res) => {
    const { userId } = getAuth(req);
    const { sessionId } = req.params;
    const { notes } = req.body;

    if (!mongoose.isValidObjectId(sessionId)) {
        throw new ApiError(400, "Invalid Session ID format");
    }

    const session = await StudySession.findOne({
        _id: sessionId,
        userId,
        endTime: null
    });

    if (!session) {
        throw new ApiError(404, "Active session not found or already ended");
    }

    // 1. Calculate Duration
    const endTime = new Date();
    const durationMinutes = Math.round((endTime - new Date(session.startTime)) / 1000 / 60);

    // Minimum 1 minutes to count
    if (durationMinutes < 1) {
        session.isAbandoned = true;
        session.endTime = endTime;
        await session.save();
        throw new ApiError(400, "Session too short to count!");
    }

    // 2. Get User Progress for Streak info
    let userProgress = await UserProgress.findOne({ userId });
    if (!userProgress) {
        userProgress = await UserProgress.create({ userId });
    }

    // 3. Calculate XP
    const { totalXP, bonusXP } = calculateSessionXP(
        durationMinutes,
        session.mode,
        userProgress.currentStreak
    );

    // 4. Update Session
    session.endTime = endTime;
    session.durationMinutes = durationMinutes;
    session.xpEarned = totalXP;
    session.notes = notes || "";
    await session.save();

    // 5. Update User Progress (Atomic increment)
    userProgress.totalXP += totalXP;
    userProgress.totalStudyMinutes += durationMinutes;
    if (session.mode === 'focus') userProgress.focusSessionCount++;
    else userProgress.freeSessionCount++;

    // Check Level Up
    const newLevel = checkLevelUp(userProgress.totalXP, userProgress.currentLevel);
    if (newLevel) {
        userProgress.currentLevel = newLevel;
        // Optionally add a notification flag here
    }

    await userProgress.save();

    return res.status(200).json(
        new ApiResponse(200, {
            session,
            xpEarned: totalXP,
            bonusXP,
            newLevel: newLevel || userProgress.currentLevel
        }, "Session completed! XP Awarded.")
    );
});

// Get Active Session
export const getActiveSession = asyncHandler(async (req, res) => {
    const { userId } = getAuth(req);

    const session = await StudySession.findOne({
        userId,
        endTime: null,
        isAbandoned: false
    }).populate('subjectId', 'name color');

    return res.status(200).json(
        new ApiResponse(200, { session }, "Active session check")
    );
});
// Upload file to a session (limit: 1 file per session)
// Upload file to a session (limit: 1 file per session)
export const uploadSessionFiles = asyncHandler(async (req, res) => {
    const { userId } = getAuth(req);
    const { sessionId } = req.params;

    if (!mongoose.isValidObjectId(sessionId)) {
        throw new ApiError(400, "Invalid Session ID format");
    }

    const session = await StudySession.findOne({
        _id: sessionId,
        userId
    });

    if (!session) {
        throw new ApiError(404, "Session not found");
    }

    if (!req.file) {
        throw new ApiError(400, "No file provided");
    }

    // Check if session already has a file - delete old one first
    if (session.tempFiles.length > 0) {
        const oldFileUrl = session.tempFiles[0];
        // If it's a local file, delete it from fs
        if (oldFileUrl.includes('/uploads/')) {
             const filename = oldFileUrl.split('/uploads/').pop();
             const localPath = path.join('public', 'uploads', filename);
             if (fs.existsSync(localPath)) fs.unlinkSync(localPath);
        } else {
             await deleteAsset(oldFileUrl);
        }
        session.tempFiles = [];
    }

    let fileUrl = null;

    // 1. Try Cloudinary if configured
    if (process.env.CLOUDINARY_CLOUD_NAME && process.env.CLOUDINARY_API_KEY) {
        const result = await uploadOnCloudinary(req.file.path);
        if (result) {
            fileUrl = result.secure_url;
        }
    }

    // 2. Fallback to local storage if Cloudinary unavailable/failed
    if (!fileUrl) {
        try {
            const uploadsDir = path.join('public', 'uploads');
            if (!fs.existsSync(uploadsDir)){
                fs.mkdirSync(uploadsDir, { recursive: true });
            }
            
            // req.file.path is in public/temp (from Multer)
            // Use filename from Multer which is already unique
            const filename = req.file.filename; 
            const targetPath = path.join(uploadsDir, filename);
            
            // Check if source file exists (it might have been deleted by failed uploadOnCloudinary)
            // But strict uploadOnCloudinary deletes on error.
            // If Cloudinary failed, we have lost the file??
            // Wait, uploadOnCloudinary takes the path. If it fails, it unlinks it.
            // So if Cloudinary was attempted and failed, file is gone.
            // We only have the file if Cloudinary was NOT attempted.
            
            if (fs.existsSync(req.file.path)) {
                fs.renameSync(req.file.path, targetPath);
                
                // Construct full URL
                const baseUrl = `${req.protocol}://${req.get('host')}`;
                fileUrl = `${baseUrl}/uploads/${filename}`;
            } else {
               throw new Error("File missing after processing attempt");
            }
        } catch (e) {
            console.error("Local file save failed:", e);
            throw new ApiError(500, "Failed to upload file (Cloudinary missing and local save failed)");
        }
    }

    // Store the URL in session
    session.tempFiles = [fileUrl];
    await session.save();

    return res.status(200).json(
        new ApiResponse(200, {
            fileUrl: fileUrl
        }, "File uploaded successfully")
    );
});

// Delete a file from a session
export const deleteSessionFile = asyncHandler(async (req, res) => {
    const { userId } = getAuth(req);
    const { sessionId } = req.params;
    const { fileUrl } = req.body;

    if (!mongoose.isValidObjectId(sessionId)) {
        throw new ApiError(400, "Invalid Session ID format");
    }

    if (!fileUrl) {
        throw new ApiError(400, "File URL is required");
    }

    const session = await StudySession.findOne({
        _id: sessionId,
        userId
    });

    if (!session) {
        throw new ApiError(404, "Session not found");
    }

    // Check if file exists in session
    if (!session.tempFiles.includes(fileUrl)) {
        throw new ApiError(404, "File not found in session");
    }

    // Delete
    if (fileUrl.includes('/uploads/')) {
         const filename = fileUrl.split('/uploads/').pop();
         const localPath = path.join('public', 'uploads', filename);
         if (fs.existsSync(localPath)) {
            try {
                fs.unlinkSync(localPath);
            } catch (e) {
                console.error("Local file delete error:", e);
            }
         }
    } else {
        // Delete from Cloudinary
        await deleteAsset(fileUrl);
    }

    // Remove URL from session's tempFiles array
    session.tempFiles = session.tempFiles.filter(url => url !== fileUrl);
    await session.save();

    return res.status(200).json(
        new ApiResponse(200, {
            deletedFile: fileUrl,
            remainingFiles: session.tempFiles
        }, "File deleted successfully")
    );
});

// Get session files - Frontend uses this to fetch file URLs
export const getSessionFiles = asyncHandler(async (req, res) => {
    const { userId } = getAuth(req);
    const { sessionId } = req.params;

    if (!mongoose.isValidObjectId(sessionId)) {
        throw new ApiError(400, "Invalid Session ID format");
    }

    const session = await StudySession.findOne({
        _id: sessionId,
        userId
    }).select("tempFiles");

    if (!session) {
        throw new ApiError(404, "Session not found");
    }

    return res.status(200).json(
        new ApiResponse(200, {
            files: session.tempFiles
        }, "Session files fetched successfully")
    );
});