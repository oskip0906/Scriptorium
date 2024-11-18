import React, { useContext, useEffect } from 'react'
import { AppContext } from '@/pages/components/AppVars'

interface adminResponse {
    status: string;
}





function index() {


    const context = useContext(AppContext);

    const getData = async () => {
        await fetch('/api/Admin/ReportedBlogs', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'page': '1',
                "amount": "10",
                "authorization": `Bearer ${localStorage.getItem('accessToken')}`
            }
        }).then(res => res.json()).then(data => console.log(data));

        await fetch('/api/Admin/ReportedComments', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'page': '1',
                "amount": "10",
                "authorization": `Bearer ${localStorage.getItem('accessToken')}`

    }
        }).then(res => res.json()).then(data => console.log(data));
    }


        useEffect(() => {
            getData();
        }, []);



  return (
    <div> 
        {context?.admin === 'True' ? 
            <div>
            <h1>Welcome Admin</h1>


            <div>
                <h2>Reported Blogs</h2>

            </div>
            <div>
                <h2>Reported Comments</h2>

            </div>
        </div>
        
            
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        : <></>}










        {context?.admin === 'False' ? <h1>You are not an admin</h1>: <></>}

    </div>
  )
}

export default index