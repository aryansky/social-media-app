import { NextFunction, Request, Response } from "express";
import { prisma } from "../utils/prisma";
import { catchAsync } from "../utils/catchAsync";

const getAllTags = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
        const allTags = await prisma.tag.findMany();

        res.json({
            allTags,
        });
    }
);

export { getAllTags };
