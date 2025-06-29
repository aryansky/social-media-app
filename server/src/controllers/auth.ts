import { z } from "zod";
import { catchAsync } from "../utils/catchAsync";
import { AppError } from "../utils/AppError";
import { prisma } from "../utils/prisma";
import { NextFunction, Request, Response } from "express";
import bcrypt from "bcrypt";

const signupUserSchema = z.object({
    username: z.string().min(5).max(32),
    password: z.string().min(5).max(32),
    displayName: z.string().min(5).optional(),
    email: z.string().email(),
});

export const createNewUser = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
        const parsedSchema = signupUserSchema.safeParse(req.body);

        if (!parsedSchema.success) {
            throw new AppError("Invalid inputs", 400);
        }

        const existingUser = await prisma.user.findFirst({
            where: {
                OR: [
                    { username: parsedSchema.data.username },
                    { email: parsedSchema.data.email },
                ],
            },
        });
        if (existingUser)
            throw new AppError("Username or email already taken", 409);

        const user = await prisma.user.create({
            data: {
                username: parsedSchema.data.username,
                email: parsedSchema.data.email,
                displayName:
                    parsedSchema.data.displayName || parsedSchema.data.username,
            },
        });

        const hashedPassword = await bcrypt.hash(
            parsedSchema.data.password,
            12
        );

        await prisma.account.create({
            data: {
                provider: "credentials",
                providerId: user.id,
                userId: user.id,
                password: hashedPassword,
            },
        });

        res.status(201).json({
            message: "User created successfully",
            userId: user.id,
        });
    }
);
