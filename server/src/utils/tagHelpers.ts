import { prisma } from "./prisma";

export const handlePostTags = async (newPostId: string, responseTags: string[]) => {
    await prisma.$transaction(async (tx) => {
        const existingTagLabels = (await tx.tag.findMany({ select: { label: true } })).map(
            (tag) => tag.label
        );

        const newTags = responseTags.filter((tag) => !existingTagLabels.includes(tag));

        await tx.tag.createMany({
            data: newTags.map((tag) => ({ label: tag })),
            skipDuplicates: true,
        });

        const tagsToBeAdded = await tx.tag.findMany({
            where: {
                label: {
                    in: responseTags,
                },
            },
        });

        await tx.postTag.deleteMany({
            where: {
                postId: newPostId,
            },
        });

        await tx.postTag.createMany({
            data: tagsToBeAdded.map((tag) => {
                return {
                    postId: newPostId,
                    tagId: tag.id,
                };
            }),
        });
    });

    const postWithTags = await prisma.post.findUnique({
        where: {
            id: newPostId,
        },
        select: {
            id: true,
            title: true,
            content: true,
            createdAt: true,
            updatedAt: true,
            user: true,
            postTags: {
                select: {
                    tag: true,
                },
            },
        },
    });

    return {
        ...postWithTags,
        postTags: postWithTags?.postTags.map((t) => t.tag),
    };
};
