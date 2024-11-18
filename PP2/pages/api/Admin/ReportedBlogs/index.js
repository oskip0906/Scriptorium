import prisma from '@/lib/prisma';
import verifyAdmin from '@/lib/Admin/verifyAdmin';

async function handler(req, res) {
    if (req.method !== 'GET') {
        return res.status(405).json({ error: "Method not allowed" });
    }
    
    let { page, amount } = req.query;
    !page || page < 0 ? page = 0 : page = page;
    !amount ? amount = 10 : amount = amount;
    try {
        const topReportedBlogs = await prisma.report.groupBy({
            by: ["blogPostId"],
            _count: {
                blogPostId: true
            },
            where: {
                blogPostId: {
                    not: null
                },
            },
            orderBy: {
                _count: {
                    blogPostId: "desc"
                }
            },
            skip: parseInt(page) * parseInt(amount),
            take: parseInt(amount)

        });
        const reportedBlogs = []
        topReportedBlogs.map(blog => {
            reportedBlogs.push({ blogPostId: blog.blogPostId, count: blog._count.blogPostId })
        })
        return res.status(200).json({ reportedBlogs });
    }
    catch (error) {
        console.log(error)
        return res.status(500).json({ error: error.message });
    }
}

export default verifyAdmin(handler);