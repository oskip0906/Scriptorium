import prisma from '@/lib/prisma';
import verifyUser from '@/lib/verifyUser';

async function handler(req, res) {
    
    if (req.method === "POST") {
        
        try {
            const { content, blogPostId, repliedToId } = req.body;

            if (!content || (!blogPostId && !repliedToId) || (blogPostId && repliedToId)) {
                return res.status(400).json({ error: "Invalid or missing parameters" });
            }

            if (!repliedToId) {

                const blogPost = await prisma.BlogPost.findUnique({
                    where: { id: blogPostId },
                });

                if (!blogPost) {
                    return res.status(404).json({ error: "Blog post not found" });
                }

                const newComment = await prisma.Comment.create({
                    data: {
                        content: content,
                        blogPostId: blogPostId,
                        createdUserId: req.user.id,
                    },
                });

                return res.status(201).json(newComment);
            }
            else {   

                const parentComment = await prisma.Comment.findUnique({
                    where: { id: repliedToId },
                });

                if (!parentComment) {
                    return res.status(404).json({ error: "Parent comment not found" });
                }

                const newComment = await prisma.Comment.create({
                    data: {
                        content: content,
                        repliedToId: repliedToId,
                        createdUserId: req.user.id,
                    },
                });

                return res.status(201).json(newComment);
            }
        } 
        
        catch (error) {
            return res.status(500).json({ error: error.message });
        }

    }

    else if (req.method === "GET") {

        try {
            const { content, repliedToId, blogPostId, createdUserId, order, page, pageSize } = req.query;

            if (!page || !pageSize) {
                return res.status(400).json({ error: "Page or page size missing"});
            }

            if (!order || order !== "asc" && order !== "desc") {    
                return res.status(400).json({ error: "Order must be specified as either asc or desc" });
            }

            const searchFilters = [];

            if (content) {
                searchFilters.push({ content: { contains: content } });
            }
            if (repliedToId) {
                searchFilters.push({ repliedToId: parseInt(repliedToId) });
            }
            if (blogPostId) {
                searchFilters.push({ blogPostId: parseInt(blogPostId) });
            }
            if (createdUserId) {
                searchFilters.push({ createdUserId: parseInt(createdUserId) });
            }
            if (req.user && req.user.id) {
                searchFilters.push({
                    OR: [
                        { inappropriate: false },
                        { AND: [{ inappropriate: true }, { createdUserId: req.user.id }] }
                    ]
                });
            }

            const comments = await prisma.Comment.findMany({
                where: { AND: searchFilters },  
                include: { 
                    createdBy: {
                        select: { userName: true }
                    }
                },
                orderBy: { rating: order },
                skip: (parseInt(page) - 1) * parseInt(pageSize),
                take: parseInt(pageSize)
            });

            if (comments.length === 0) {
                return res.status(404).json({ error: "No comments found" });
            }

            return res.status(200).json(comments);
        }

        catch (error) {
            return res.status(500).json({ error: error.message });
        }

    }

    else {
        return res.status(405).json({ error: "Method not allowed" });
    }
    
}

export default verifyUser(handler); 