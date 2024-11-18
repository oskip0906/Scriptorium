import React, { useContext, useEffect, useState}  from 'react'
import { AppContext } from '@/pages/components/AppVars'
import { useRouter } from 'next/router'
import DetailedView from '@/pages/Blogs/detailedView'

interface reportsArray {
    id: number;
    reason: string;
    createdUserId: number;
    blogPostId: number;
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
        return detailedBlog();
    }
}


function detailedBlog() {

    const context = useContext(AppContext);
    const router = useRouter();
    const [reports, setReports] = useState<reportsArray[]>([]);
    const blogId = router.query.id;
    const fetchAllReports = async () => {
        const data = await fetch(`/api/Admin/ReportedBlogs/GetReports?id=${blogId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                "authorization": `Bearer ${localStorage.getItem('accessToken')}`   
    }    
        })
        const response = await data.json();
        console.log(response);
        setReports(response.reports);
    }

    const fetchBlogData= async(id: string) => {
        const data = await fetch(`/api/BlogPosts?id=${id}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                "authorization": `Bearer ${localStorage.getItem('accessToken')}`
            }
        })
        const response = await data.json();
        console.log(response);
    }
    useEffect(() => {
        if (router.isReady) {
            fetchAllReports();
            fetchBlogData(blogId as string);
        }
    }, [router.isReady]);


    const hideContent = async () => {
        const data = await fetch(`/api/Admin/HideContent?blogPostId=`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                "authorization": `Bearer ${localStorage.getItem('accessToken')}`
            },
            body: JSON.stringify({
                blogPostId: blogId})
        })

        const response = await data.json();
        console.log(response);

    }

  return (




    <div>
        {context?.admin === "True" ? 
        <div>
            <h1>Admin</h1>
            <button onClick={hideContent}> Hide Content</button>
            <DetailedView />
            <ul>
                <div>Reports</div>
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
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        : <div>Not Admin</div>}

    </div>
  )
}

export default middleware