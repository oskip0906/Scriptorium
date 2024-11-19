import React, { useContext, useEffect, useState}  from 'react'
import { AppContext } from '@/pages/components/AppVars'
import { useRouter } from 'next/router'

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
        return detailedComment();
    }
}


interface Comment {
    blogPostId: number;
    content: string;
    createdUserId: number;
    id: number;
    inappropriate: boolean;
    rating: number;
    repliedToId: number | null;
    reportCount: number;
}


interface reportsArray {
    id: number;
    reason: string;
    createdUserId: number;
    blogPostId: number;
}

function detailedComment() {

    const context = useContext(AppContext);
    const router = useRouter();
    const commentId = router.query.id;
    const [reports, setReports] = useState<reportsArray[]>([]);
    const [comment, setComment] = useState<Comment>({} as Comment);
    const [username, setUsername] = useState('');
    const fetchAllReports = async () => {
        const data = await fetch(`/api/Admin/ReportedComments/GetReports?id=${commentId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                "authorization": `Bearer ${localStorage.getItem('accessToken')}`   
    }    
        })
        const response = await data.json();
        setReports(response.reports);
    }


    const fetchComment = async () => {

        const data = await fetch(`/api/Comments?id=${commentId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                "authorization": `Bearer ${localStorage.getItem('accessToken')}`   
        }    
            })
            const response = await data.json();
            setComment(response);

            console.log(response);
            setUsername(response.createdBy.userName);
    }


    const hideContent = async () => {
        const data = await fetch(`/api/Admin/HideContent`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                "authorization": `Bearer ${localStorage.getItem('accessToken')}`
            },
            body: JSON.stringify({
                commentId: commentId})
        })

        const response = await data.json();

    }

    useEffect(() => {
        if (router.isReady) {
        fetchComment();
        fetchAllReports();
        }
    }, [router.isReady])




  return (
    <div>
        
    {context?.admin === 'True' ? 
    <div>
        <h1>Admin</h1> 
        <button onClick={hideContent}> Hide Content</button>
            <ul>
                <div>Reports</div>

                <div>
                CommentId: {comment.id}
                Content {comment.content}   
                Created BY: {username}
    
                </div>
                {reports.map((report: reportsArray) => {
                    return (
                        <li key={report.id}>
                            ReportID: {report.id}
                            Reason: {report.reason}
                            CreatedBy: {report.createdUserId}
                        </li>
                    )
                })}
            </ul>
            

    </div>
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    : <h1>Not Admin</h1>}
    </div>
  )
}

export default middleware