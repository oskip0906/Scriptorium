import prisma from '@/lib/prisma';
export default async function hideComment(CommentID) {
    try {
        const Comment = await prisma.Comment.findUnique({
            where: {
                id: CommentID
            }
        });
        if (!Comment) {
            return null;
        }
        await prisma.Comment.update({
            where: {
                id: CommentID
            },
            data: {
                inappropriate: true,
            }
        });
        return Comment;
    }
    catch (error) {
        return null;
    }
}

