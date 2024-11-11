
import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import Terminal from '@/pages/components/Terminal'
import NavBar from '@/pages/components/Navbar'
import refresh from '@/lib/refresh'
import { saveCode, deleteCode, forkCode } from '@/lib/CodeController'



const index = () => {

  const languages = ['python', 'javascript', 'java', 'c', 'cpp']
  const [language, setLanguage] = useState('python')
  const [code, setCode] = useState('# Type your code here')
  const [output , setOutput] = useState('Output')
  const [error, setError] = useState('')
  const [run, setRun] = useState(false)
  const [input, setInput] = useState('')
  let tags = []
  let description = 'description'
  const router = useRouter()
  const { id } = router.query


  const fetchCode = async (id: string) => {
    const response = await fetch(`/api/CodeTemplates?id=${id}`);
    const data = await response.json();    
    return data;
  };


  useEffect(() => {
    if (id) {
      fetchCode(id as string).then((data) => {
        setCode(data.code)
        setLanguage(data.language)
        tags = data.tags
        description = data.description
        refresh()
      })
    }
  }, [id])






  return (
    <div className="fade-in p-4 mb-4">
      <NavBar />

      <div className="border p-4">
        <div className="flex items-center justify-between ">
            <div className=" font-semibold ">Code Execution</div>
            
            <div className="flex items-center space-x-4">
              <select 
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="p-2 rounded-lg">
                {languages.map((lang) => (
                  <option key={lang} value={lang} className="">
                    {lang}
                  </option>
                ))}
              </select>

              <button className=" font-bold py-2 px-4 rounded"
              onClick={() => setRun(true)}>
                Run code
              </button>
            </div>
        </div>
        <div className="flex space-x-4">

            <button className="" onClick={() => {
              forkCode(id as string, code, language, 'title', {}, 'description')
            }}>
                <i className="fas fa-code-branch"></i> 
            </button>

            <button className="" onClick={() => {
              saveCode(id as string, code, language, 'title', {}, 'description')
            }}>
                <i className="fas fa-save"></i> 
            </button>


            <button className="" onClick={() =>{
              deleteCode(id as string, code, language, 'title', {}, 'description')
            }}>
                <i className="fas fa-trash-alt"></i> 
            </button>
        </div>  
          <div className='flex flex-row mt-4'>
            <Terminal 
            lang={language} code={code} setOutput={setOutput} setError={setError} run={run} setRun={setRun} input={input}
            />

            <div className="flex flex-col w-screen h-screen px-4">
                <textarea
                  className="mb-4 p-2 border rounded-lg w-full h-1/2 outline-none"
                  placeholder="Type your input here..."
                  onChange={(e) => setInput(e.target.value)}
                />

                <div className="p-2 border rounded-lg h-1/2 overflow-auto ">
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
    </div>
  )

}

export default index