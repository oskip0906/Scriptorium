import React from 'react'
interface ReportProps {
    blogPostId?: number
    commentId?: number
}
interface Report {
    reason: string
    blogPostId?: number
    commentId?: number
}

function Reports(props: ReportProps) {


    const createReport = async (report: Report) => {
        if (report.blogPostId){
            const data = await fetch(`/api/Report/Blog`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    "authorization": `Bearer ${localStorage.getItem('accessToken')}`
                },
                body: JSON.stringify(report),
            });
            const response = await data.json();
            console.log(response);
        }
        else if (report.commentId){
            const data = await fetch(`/api/Report/Comment`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    "authorization": `Bearer ${localStorage.getItem('accessToken')}`
                },
                body: JSON.stringify(report),
            });
            const response = await data.json();
            console.log(response);
        }

    }


  return (
    <div>
        <button onClick={() => createReport({reason: "spam", blogPostId: props.blogPostId, commentId: props.commentId })}>Report Blog</button>
    </div>
  )
}

export default Reports