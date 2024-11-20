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
    const [reportCount, setReportCount] = useState(0);
    const [loadedAll, setLoadedAll] = useState(false);
    const fetchAllReports = async (page: number) => {
        const data = await fetch(`/api/Admin/ReportedComments/GetReports?id=${commentId}&page=${page}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,   
    }    
        })
        const response = await data.json();
        if (!response || !response.reports) {
            return 
        }
        if (response.reports.length === 0) {
            setLoadedAll(true);
             return;
        }
        setReports([...reports, ...response.reports]);
     }


    const fetchComment = async () => {

        const data = await fetch(`/api/Comments?id=${commentId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,   
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
                'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
            },
            body: JSON.stringify({
                commentId: commentId})
        })

        const response = await data.json();

    }

    useEffect(() => {
        if (router.isReady) {
        fetchComment();
        fetchAllReports(0);
        }
    }, [router.isReady])




  return (
    <div>
        
    {context?.admin === 'True' ? 
    <div>
        <div className="space-y-4">
  <button
    onClick={hideContent}
    className="px-4 py-2 rounded-md border shadow hover:shadow-md active:shadow-sm transition"
  >
    Hide Content
  </button>

  <ul className="space-y-4">
    <div className="text-lg font-semibold">Reports</div>

    <div className="p-4 border rounded-lg shadow-sm">
      <p className="text-sm">
        <span className="font-medium">Comment ID:</span> {comment.id}
      </p>
      <p className="text-sm">
        <span className="font-medium">Content:</span> {comment.content}
      </p>
      <p className="text-sm">
        <span className="font-medium">Created By:</span> {username}
      </p>
    </div>

    {reports.map((report: reportsArray) => (
      <li
        key={report.id}
        className="p-4 border rounded-lg shadow-sm"
      >
        <p className="text-sm">
          <span className="font-medium">Report ID:</span> {report.id}
        </p>
        <p className="text-sm">
          <span className="font-medium">Reason:</span> {report.reason}
        </p>
        <p className="text-sm">
          <span className="font-medium">Created By:</span> {report.createdUserId}
        </p>
      </li>
    ))}
  </ul>
</div>

{loadedAll ? <div>Loaded all reports</div> :
                <button
                onClick={() => { fetchAllReports(reportCount+1); setReportCount(reportCount+1)}}
                className="px-4 py-2 rounded-md border shadow hover:shadow-md active:shadow-sm transition"
                >
                Load More
                </button>
                }
            
    </div>
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    : <h1>Not Admin</h1>}
    </div>
  )
}

export default middleware