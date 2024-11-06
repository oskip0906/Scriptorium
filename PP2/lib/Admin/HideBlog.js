import prisma from '@/lib/prisma';
export default async function hideBlog(blogPostId) {
    try {
        const blogPost = await prisma.BlogPost.findUnique({
            where: {
                id: blogPostId
            }
        });
        if (!blogPost) {
            return null;
        }
        await prisma.BlogPost.update({
            where: {
                id: blogPostId
            },
            data: {
                inappropriate: true,
            }
        });
        return blogPost;
    }
    catch (error) {
        return null;
    }
}

