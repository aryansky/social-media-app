import { NextFunction, Request, Response } from "express";
import { prisma } from "../utils/prisma";
import { catchAsync } from "../utils/catchAsync";
import { AppError } from "../utils/AppError";

const getUserFollowing = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
        const user = await prisma.user.findUnique({
            where: {
                id: req.user!.id,
            },
            select: {
                username: true,
                following: {
                    select: {
                        following: {
                            select: {
                                id: true,
                                username: true,
                                displayName: true,
                            },
                        },
                    },
                },
            },
        });
        if (!user) {
            throw new AppError("User not found", 400);
        }
        res.json({
            username: user.username,
            following: user.following.map((f) => f.following),
        });
    }
);
const getUserFollowers = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
        const user = await prisma.user.findUnique({
            where: {
                id: req.user!.id,
            },
            select: {
                username: true,
                follower: {
                    select: {
                        follower: {
                            select: {
                                id: true,
                                username: true,
                                displayName: true,
                            },
                        },
                    },
                },
            },
        });
        if (!user) {
            throw new AppError("User not found", 400);
        }
        res.json({
            username: user.username,
            followers: user.follower.map((f) => f.follower),
        });
    }
);
const followUser = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
        const { userId } = req.params;
        const user = await prisma.user.findUnique({
            where: {
                id: userId,
            },
        });
        if (!user) {
            throw new AppError("User not found", 400);
        } else if (req.user!.id === userId) {
            throw new AppError("Cannot follow yourself", 400);
        }

        const alreadyFollowing = await prisma.follow.findUnique({
            where: {
                followerId_followingId: {
                    followerId: req.user!.id,
                    followingId: user.id,
                },
            },
        });

        if (alreadyFollowing) {
            throw new AppError("Already following the user", 400);
        }

        const newFollower = await prisma.follow.create({
            data: {
                followerId: req.user!.id,
                followingId: user.id,
            },
        });

        res.json({
            msg: `You are following ${user.username}`,
            newFollower,
        });
    }
);
const unFollowUser = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
        const { userId } = req.params;
        const user = await prisma.user.findUnique({
            where: {
                id: userId,
            },
        });
        if (!user) {
            throw new AppError("User not found", 400);
        }
        const isFollowing = await prisma.follow.findUnique({
            where: {
                followerId_followingId: {
                    followerId: req.user!.id,
                    followingId: user.id,
                },
            },
        });

        if (!isFollowing) {
            throw new AppError("You are not following that user.", 400);
        }

        const unFollowed = await prisma.follow.delete({
            where: {
                followerId_followingId: {
                    followerId: req.user!.id,
                    followingId: user.id,
                },
            },
        });

        res.json({
            msg: `You have unfollowed ${user.username}`,
            unFollowed,
        });
    }
);

export { getUserFollowers, getUserFollowing, followUser, unFollowUser };
