import React, { useContext, useEffect, useState } from 'react'
import { AppContext } from '@/pages/components/AppVars'
import { useRouter } from 'next/router'

interface blogsArray {
    blogPostId: number;
    count: number;
}

interface commentsArray {
    commentId: number;
    count: number;
}



function middleware() {
    const context = useContext(AppContext);

    if (context?.admin === 'False') {
        return (
            <div>
                <h1>You are not an admin</h1>
            </div>
        )
    }
    else {
        return index();
    }
}




function index() {


    const context = useContext(AppContext);
    const router = useRouter();
    const [blogPage, setBlogPage] = useState(0);
    const [commentPage, setCommentPage] = useState(0);
    const [blogs, setBlogs] = useState<blogsArray[]>([]);
    const [comments, setComments] = useState<commentsArray[]>([]);


    const fetchReportedBlogs = async () => {
  
        const data = await fetch(`/api/Admin/ReportedBlogs?page=${blogPage}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                "authorization": `Bearer ${localStorage.getItem('accessToken')}`
            },

        })
        const response = await data.json();

        setBlogs(response.reportedBlogs);
        console.log(response.reportedBlogs);
    }
   
    const fetchReportedComments = async () => { 
        const data = await fetch(`/api/Admin/ReportedComments?page=${commentPage}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                "authorization": `Bearer ${localStorage.getItem('accessToken')}`
            }
        })
        const response = await data.json();
        setComments(response.reportedComments);
        console.log(response.reportedComments);
    }

    
    useEffect(() => {
        fetchReportedBlogs();
    }
    , [blogPage]);

    useEffect(() => {
        fetchReportedComments();
    }, [commentPage]);
        




  return (
    <div> 
        {context?.admin === 'True' ? 
            <div>
            <h1>Welcome Admin</h1>
            <div>
                <h2>Reported Blogs</h2>
                <div> 
                    <ul>
                        {blogs.map((blog: any) => {
                            console.log(blog)
                            return <li key={blog.blogPostId}>
                                <h3>BlogID: {blog.blogPostId} Reports: {blog.count} </h3>
                                <button onClick={() => {
                                    router.push(`/Admin/detailedBlog?id=${blog.blogPostId}`)
                                }}> View Reports</button>

                                </li>
                        })}
                    </ul>
                    <button
                    onClick={
                        () => {
                            setBlogPage(blogPage - 1);
                        }
                    }> Previous page</button>
                    <button
                    onClick={
                        () => {
                            setBlogPage(blogPage + 1);
                    }}
                    > Next page</button>
                </div>
            </div>
            <div>
                <h2>Reported Comments</h2>
                <div> 
                <ul>
                        {comments.map((comment: any) => {
                            console.log(comment)
                            return <li key={comment.commentId}>
                                <h3>CommentID: {comment.commentId} Reports: {comment.count} </h3>
                                <button onClick={() => {
                                    router.push(`/Admin/detailedComment?id=${comment.commentId}`)

                                }}> View Reports</button>

                                </li>
                        })}
                    </ul>
                    <button
                    onClick={
                        () => {
                            setCommentPage(commentPage - 1);
                        }
                    }> Previous page</button>
                    <button
                    onClick={
                        () => {
                            setCommentPage(commentPage + 1);
                    }}
                    > Next page</button>
                </div>
            </div>
        </div>
        
            
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        : <></>}










        {context?.admin === 'False' ? <h1>You are not an admin</h1>: <></>}

    </div>
  )
}

export default middleware