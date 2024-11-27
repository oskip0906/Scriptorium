import prisma from '@/lib/prisma';
import verifyAdmin from '@/lib/Admin/verifyAdmin';

async function handler(req, res) {
    if (req.method !== 'GET') {
        return res.status(405).json({ error: "Method not allowed" });
    }

    let { page, amount } = req.query;
    !page || page < 0 ? page = 0 : page = page;
    !amount ? amount = 5 : amount = amount;
    
    try {
        const topReportedComments = await prisma.report.groupBy({
            by: ["commentId"],
            _count: {
                commentId: true
            },
            where: {
                commentId: {
                    not: null
                },
            },
            orderBy: {
                _count: {
                    commentId: "desc"
                }
            },
            skip: parseInt(page) * parseInt(amount),
            take: parseInt(amount)
        });

        const reportedComments = []
        const commentIds = []
        topReportedComments.map(comment => {
            reportedComments.push({ commentId: comment.commentId, count: comment._count.commentId })
            commentIds.push(comment.commentId)
        })

        const corrBlog = await prisma.Comment.findMany({
            where: {
                id: {
                    in: commentIds
                }
            },
            select: {
                blogPostId: true,
                id: true
            }
        })

        corrBlog.map((corr) => {
            reportedComments.map((comm) => {
                if (corr.id === comm.commentId){
                    comm.blogPostId = corr.blogPostId
                }
            })
        })
        console.log(reportedComments)
        return res.status(200).json({ reportedComments });
    }
    catch (error) {
        return res.status(500).json({ error: error.message });
    }
}

export default verifyAdmin(handler);