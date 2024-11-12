
import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import Terminal from '@/pages/components/Terminal'
import NavBar from '@/pages/components/Navbar'
import refresh from '@/lib/refresh'
import { saveCode, deleteCode, forkCode } from '@/lib/CodeController'

const languages = ['python', 'javascript', 'java', 'c', 'cpp']

interface RequestBody {
  language: string;
  code: string;
  input: string;
}

const index = () => {

  const [language, setLanguage] = useState('python')
  const [code, setCode] = useState('# Type your code here')
  const [output , setOutput] = useState('Output')
  const [error, setError] = useState('')
  const [input, setInput] = useState('')
  let tags: Array<Object> = []
  let description = 'description'
  const router = useRouter()
  const { id } = router.query


  const fetchCode = async (id: string) => {
    const response = await fetch(`/api/CodeTemplates?id=${id}`);
    const data = await response.json();    
    console.log(data);
    return data;
  };


  const runCode = async () => {
    const req: RequestBody = { language: language, code: code, input: input ?? '' };
    const response = await fetch('/api/CodeRunner', {
      method: 'POST', 
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(req)
    });
    const data = await response.json();
    setOutput(data.output ?? 'Failed to run');
    setError(data.error ?? '');
  }



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
              onClick={() => runCode()}>
                Run code
              </button>
            </div>
        </div>
        <div className="flex space-x-4">

            <button className="" onClick={() => {
              forkCode(id as string)
            }}>
                <i className="fas fa-code-branch"></i> 
            </button>

            <button className="" onClick={() => {
              saveCode(id as string, code, language, 'title', tags, description)
            }}>
                <i className="fas fa-save"></i> 
            </button>


            <button className="" onClick={() =>{
              deleteCode(id as string)
            }}>
                <i className="fas fa-trash-alt"></i> 
            </button>
        </div>  
          <div className='flex flex-row mt-4'>
            <Terminal 
            lang={language} code={code} setCode={setCode}
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