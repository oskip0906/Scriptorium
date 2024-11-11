
import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import Terminal from '@/pages/components/Terminal'
import Navbar from '@/pages/components/Navbar'
  const languages = ['python', 'javascript', 'java', 'c', 'c++']


  

  async function fetchCode(id: string) {
    const response = await fetch(`/api/CodeTemplates?id=${id}`);
    const data = await response.json();
    console.log(data)
    return data
  }


  const index = () => {
    const [language, setLanguage] = useState('javascript')
    const [code, setCode] = useState('// write your code here')
    const [output , setOutput] = useState('Output')
    const [error, setError] = useState('')
    const [run, setRun] = useState(false)
    const [input, setInput] = useState('')

    const router = useRouter()
    const { id } = router.query



    useEffect(() => {
      if (id) {
        fetchCode(id as string).then((data) => {
          setCode(data.code)
          setLanguage(data.language)
        })
      }
    }, [id])




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
            <button className="bg-cta-button text-main-text font-bold py-2 px-4 rounded"
             onClick={() => setRun(true)}
             >
              Run code
            </button>
          </div>
       </div>
        <div className='flex flex-row'>
          <Terminal 
          lang={language} code={code} setOutput={setOutput} setError={setError} run={run} setRun={setRun} input={input}/>
          <div className="flex flex-col w-screen h-screen p-4">
              <textarea
                className="border border-cta-border p-2 rounded-lg w-full h-1/2 text-main-text bg-cta-background"
                placeholder="Type your code here..."
                onChange={(e) => setInput(e.target.value)}
              />
              <div className="mt-2 p-2 bg-cta-background text-main-text border border-cta-border rounded-lg h-1/2 overflow-auto text-main-text">
                {output.split('\n').map((line, index) => (
                  <div key={index}>{line}</div>
                ))}
                {error.split('\n').map((line, index) => (
                  <div key={index}>{line}</div>
                ))}
              </div>
          </div>

        </div>
    </div>
  )
}

export default index