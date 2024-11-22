import React, { useContext, useEffect, useState}  from 'react'
import { AppContext } from '@/lib/AppVars';
import { useRouter } from 'next/router'
import { toast } from 'react-toastify'
import { motion } from "framer-motion";




interface Comment {
    blogPostId: number;
    content: string;
    createdUserId: number;
    createdBy: {
      userName: string;
    };
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


    useEffect(() => {
        if (router.isReady) {
            fetchComment(router.query.id ?? "0");
        }
    }, [router.isReady])

    const fetchComment = async (id: string | string[]) => {
        const data = await fetch(`/api/Comments?id=${id}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            }
        })
        const response = await data.json();
        console.log(response);
        setComment(response);

      }

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


    const hideContent = async () => {
        const response = await fetch(`/api/Admin/HideContent`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
            },
            body: JSON.stringify({
                commentId: commentId})
        })

        if (!response.ok) {
            toast.error('Error hiding content!');
            return;
        }

        toast.success('Content hidden successfully!');

    }

    useEffect(() => {
        if (router.isReady) {
        fetchAllReports(0);
        }
    }, [router.isReady])




  return (
    <div>
        
    {context?.admin === 'True' ? 
 <div className="flex flex-col items-center p-6 space-y-6 min-h-screen">
 {/* Hide Content Button */}
 <motion.button
   onClick={hideContent}
   className="px-6 py-3 rounded-md border shadow hover:shadow-lg active:shadow-sm transition"
   whileHover={{ scale: 1.05 }}
   whileTap={{ scale: 0.95 }}
 >
   Hide Content
 </motion.button>

 {/* Comments and Reports Section */}
 <div className="w-full max-w-2xl space-y-6">
   {/* Comment Section */}
   <div className="space-y-4">
     <h2 className="text-xl font-bold text-center">Comment</h2>
     <motion.div
       className="p-6 border rounded-lg shadow-md"
       initial={{ opacity: 0, y: 20 }}
       animate={{ opacity: 1, y: 0 }}
       transition={{ duration: 0.5 }}
     >
       <p className="text-sm">
         <span className="font-medium">Comment ID:</span> {comment.id}
       </p>
       <p className="text-sm">
         <span className="font-medium">Content:</span> {comment.content}
       </p>
       <p className="text-sm">
         <span className="font-medium">Created By:</span> {comment.createdBy?.userName}
       </p>
     </motion.div>
   </div>

   {/* Reports Section */}
   <div className="space-y-4">
     <h2 className="text-xl font-bold text-center">Reports</h2>
     <ul className="space-y-4">
       {reports.map((report: reportsArray) => (
         <motion.li
           key={report.id}
           className="p-6 border rounded-lg shadow-md"
           initial={{ opacity: 0, y: 20 }}
           animate={{ opacity: 1, y: 0 }}
           transition={{ duration: 0.5, delay: 0.1 }}
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
         </motion.li>
       ))}
     </ul>
   </div>
 </div>

 {/* Load More Button */}
 {loadedAll ? (
   <motion.div
     className="text-center font-medium"
     initial={{ opacity: 0 }}
     animate={{ opacity: 1 }}
     transition={{ duration: 0.3 }}
   >
     Loaded all reports
   </motion.div>
 ) : (
   <motion.button
     onClick={() => {
       fetchAllReports(reportCount + 1);
       setReportCount(reportCount + 1);
     }}
     className="px-6 py-3 rounded-md border shadow hover:shadow-lg active:shadow-sm transition"
     whileHover={{ scale: 1.05 }}
     whileTap={{ scale: 0.95 }}
   >
     Load More
   </motion.button>
 )}
</div>
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    : <h1>Not Admin</h1>}
    </div>
  )
}

export default detailedComment 