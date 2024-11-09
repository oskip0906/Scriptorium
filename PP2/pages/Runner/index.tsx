import React, { useEffect } from 'react'
import { useState } from 'react'
import Terminal from '@/pages/components/Terminal'
import Navbar from '@/pages/components/Navbar'
 const languages = ['python', 'javascript', 'java', 'c', 'c++']
 const index = () => {
 const [language, setLanguage] = useState('javascript')
 const [test, setTest] = useState(false)
  const click = () => {
    setTest(!test)
  }



  return (
    <div className='bg-cta-background'>
      <Navbar />
      <div className="flex items-center justify-between bg-cta-primary text-main-text">
          <div className="text-main-text font-semibold ">Code Execution</div>
          <div className="flex items-center space-x-4">
            <select 
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="bg-cta-primary text-main-text p-2 rounded-lg"
            >
              {languages.map((lang) => (
                <option key={lang} value={lang} className="text-main-text">
                  {lang}
                </option>
              ))}
            </select>
            <button className="bg-cta-button text-main-text font-bold py-2 px-4 rounded">
              Submit
            </button>
          </div>
       </div>
        <div className='flex flex-row'>
          <Terminal lang={language}/>
          <div className="flex flex-col w-screen h-screen p-4">
              <textarea
                className="border border-cta-border p-2 rounded-lg w-full h-1/2 text-main-text bg-cta-background"
                placeholder="Type your code here..."
              />
              <div className="mt-2 p-2 bg-cta-background text-main-text border border-cta-border rounded-lg h-1/2 overflow-auto text-main-text">
                Output
              </div>
          </div>

        </div>
    </div>
  )
}

export default index