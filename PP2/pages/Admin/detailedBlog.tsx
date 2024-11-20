import React, { useContext, useEffect, useState}  from 'react'
import { AppContext } from '@/pages/components/AppVars'
import { useRouter } from 'next/router'
import DetailedView from '@/pages/Blogs/detailedView'
import { toast } from 'react-toastify'

interface reportsArray {
    id: number;
    reason: string;
    createdUserId: number;
    blogPostId: number;
}

function detailedBlog() {

    const context = useContext(AppContext);
    const router = useRouter();

    if (!context?.admin) {
        router.push('/');
    }

    const [reports, setReports] = useState<reportsArray[]>([]);
    const [reportCount, setReportCount] = useState(0);
    const [loadedAll, setLoadedAll] = useState(false);

    const blogId = router.query.id;
    const fetchAllReports = async (page: number) => {
        const data = await fetch(`/api/Admin/ReportedBlogs/GetReports?id=${blogId}&page=${page}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,   
    }    
        })
        const response = await data.json();
        if (response.reports.length === 0) {
            setLoadedAll(true);
             return;
        }
        setReports([...reports, ...response.reports]);
     }

    useEffect(() => {
        if (router.isReady) {
            fetchAllReports(0);
        }
    }, [router.isReady]);


    const hideContent = async () => {
        const response = await fetch(`/api/Admin/HideContent`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
            },
            body: JSON.stringify({
                blogPostId: blogId})
        });

        if (!response.ok) {
            toast.error('Error hiding content!');
            return;
        }

        toast.success('Content hidden successfully!');
    }

  return (

    <div>
        {context?.admin === "True" ? 
        <div>
            <button 
            onClick={hideContent} 
            className="px-4 py-2 rounded-md shadow"
            >
            Hide Content
            </button>

            <DetailedView />
            <ul className="space-y-4">
                <div className="text-lg font-semibold mb-2">Reports</div>
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

                {loadedAll ? <div>Loaded all reports</div> :
                <button
                onClick={() => { fetchAllReports(reportCount+1); setReportCount(reportCount+1)}}
                className="px-4 py-2 rounded-md border shadow hover:shadow-md active:shadow-sm transition"
                >
                Load More
                </button>
                }
        </div> 

        : <div>Not Admin</div>}

    </div>
  )
}

export default detailedBlog