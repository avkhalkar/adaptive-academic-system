import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { User } from "../models/user.model.js";
import { UserProgress } from "../models/userProgress.model.js";
import { clerkClient } from "@clerk/express";
import { getAuth } from "@clerk/express";   

const syncUser = asyncHandler(async (req, res) => {
    const { userId } = getAuth(req);

    // Fetch from Clerk for latest metadata
    const clerkUser = await clerkClient.users.getUser(userId);

    // Update or Create
    const user = await User.findOneAndUpdate(
        { clerkId: userId },
        {
            $setOnInsert: {
                email: clerkUser.emailAddresses[0].emailAddress,
                username: clerkUser.username || clerkUser.emailAddresses[0].emailAddress.split("@")[0],
            },
            $set: {
                // Updateable fields on login if needed
            }
        },
        { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    if (!user) {
        throw new ApiError(500, "Something went wrong while syncing user")
    }

    // Get user progress
    let progress = await UserProgress.findOne({ userId: user.clerkId });
    if (!progress) {
        progress = await UserProgress.create({ userId: user.clerkId });
    }

    const userWithProgress = user.toObject();
    userWithProgress.progress = progress;

    return res.status(200).json(
        new ApiResponse(200, { user: userWithProgress }, "User synced successfully")
    )
});

const getCurrentUser = asyncHandler(async (req, res) => {
    const { userId } = getAuth(req);
    const user = await User.findOne({ clerkId: userId });

    if (!user) {
        throw new ApiError(404, "User not found")
    }

    const progress = await UserProgress.findOne({ userId: user.clerkId });
    const userWithProgress = user.toObject();
    userWithProgress.progress = progress;

    return res.status(200).json(
        new ApiResponse(200, { user: userWithProgress }, "User fetched successfully")
    )
});

const updateCurrentUser = asyncHandler(async (req, res) => {
    const { userId } = getAuth(req);
    const { preferences, onboardingCompleted } = req.body;

    const cleanupUpdate = {};
    if (onboardingCompleted !== undefined) cleanupUpdate.onboardingCompleted = onboardingCompleted;
    if (preferences) {
        // Dot notation for nested updates to avoid overwriting entire object
        if (preferences.defaultStudyMode) cleanupUpdate["preferences.defaultStudyMode"] = preferences.defaultStudyMode;
        if (preferences.defaultSessionDuration) cleanupUpdate["preferences.defaultSessionDuration"] = preferences.defaultSessionDuration;
    }

    const user = await User.findOneAndUpdate(
        { clerkId: userId },
        { $set: cleanupUpdate },
        { new: true, runValidators: true }
    );

    if (!user) {
        throw new ApiError(404, "User not found")
    }

    return res.status(200).json(
        new ApiResponse(200, { user }, "User updated successfully")
    )
});

export {
    syncUser,
    getCurrentUser,
    updateCurrentUser
}
