import { prisma } from "./prisma";

export const handlePostTags = async (
    newPostId: string,
    responseTags: string[]
) => {
    const existingTags = await prisma.tag.findMany();

    const existingTagLabels = existingTags.map((tag) => tag.label);

    const newTags = responseTags.filter((tag) => {
        return !existingTagLabels.includes(tag);
    });

    await prisma.tag.createMany({
        data: newTags.map((tag) => {
            return {
                label: tag,
            };
        }),
        skipDuplicates: true,
    });

    const allTags = await prisma.tag.findMany();

    await prisma.postTag.createMany({
        data: allTags
            .filter((tag) => {
                return responseTags?.includes(tag.label);
            })
            .map((tag) => {
                return {
                    postId: newPostId,
                    tagId: tag.id,
                };
            }),
    });

    const postWithTags = await prisma.post.findUnique({
        where: {
            id: newPostId,
        },
        include: {
            postTags: {
                include: {
                    tag: true,
                },
            },
        },
    });

    return postWithTags;
};
