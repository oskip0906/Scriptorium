import React, { useEffect, useState, useContext } from 'react'
import { useRouter } from 'next/router'
import Terminal from '@/pages/components/Terminal'
import { AppContext } from '@/pages/components/AppVars'
const languages = ['python', 'javascript', 'java', 'c', 'cpp', 'ruby', 'rust', 'swift', 'r', 'php', 'go'];

interface RequestBody {
  language: string;
  code: string;
  input: string;
}


const index = () => {

  
  const context = useContext(AppContext);
  const [language, setLanguage] = useState('python')
  const [code, setCode] = useState('# Type your code here')
  const [output , setOutput] = useState('Output')
  const [error, setError] = useState('')
  const [input, setInput] = useState('')
  const [title, setTitle] = useState('Code Runner')
  let tags: Array<Object> = []
  let description = 'description'
  const router = useRouter()
  const { id } = router.query


  const saveCode = async (id: string, code: string, language: string, title: string, tags: Array<Object>, desc: string) => {
    


    const response = await fetch(`/api/CodeTemplates/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'authorization': 'Bearer '+ localStorage.getItem('accessToken')
      },
      body: JSON.stringify({ code, language, title, tags, desc })
    });
    const data = await response.json();

    if (!response.ok) {
      alert(data.error);
      return;
    }

    alert('Code saved successfully!');

  }

  const deleteCode = async (id: string) => {

    const response = await fetch(`/api/CodeTemplates/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'authorization': 'Bearer ' + localStorage.getItem('accessToken')
      }
    });
    const data = await response.json();

    if (!response.ok) {
      alert(data.error)
      return;
    }

    console.log(data);
    alert('Code deleted successfully!');

    setTimeout(() => {
      router.push('/Runner?id=0');
    }, 500);

  }

  const forkCode = async (id: string) => {

    const response = await fetch(`/api/CodeTemplates/Fork`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'authorization': 'Bearer ' + localStorage.getItem('accessToken')
      },
      body: JSON.stringify({ id })
    });
    const data = await response.json();
    if (!response.ok) {
      alert(data.error);
      return;
    }

    console.log(data);
    alert('Code forked successfully!');

    setTimeout(() => {
      router.push(`/Runner?id=${data.id}`);
    }, 500);
  }

  const fetchCode = async (id: string) => {
    const response = await fetch(`/api/CodeTemplates?id=${id}`);
    const data = await response.json();    
    console.log(data);
    return data;
  };

  const runCode = async () => {
    const req: RequestBody = { language: language ?? 'python', code: code ?? '#', input: input ?? '' };
    console.log(req)
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
        setCode(data.code ?? '# Type your code here')
        setLanguage(data.language ?? 'python')
        tags = data.tags ?? []
        description = data.description ?? 'description'
        setTitle(data.title ?? 'Code Runner')
       })
    }
  }, [id])

  return (
    <div className="p-4 mb-4">

      <div className="border p-4">
        <div className="flex items-center justify-between ">
            <div className="text-xl font-semibold ">{title}</div>

            { context?.userID ?
            <div className="flex space-x-4">
                <button className="text-xl rounded px-4" onClick={() => {
                  forkCode(id as string)
                }}>
                  <i className="fas fa-code-branch"></i> 
                </button>

                <button className="text-xl rounded px-4" onClick={() =>{
                  deleteCode(id as string)
                }}>
                  <i className="fas fa-trash-alt"></i> 
                </button>

                <button className="text-xl rounded px-4" onClick={() => {
                  saveCode(id as string, code, language, 'title', tags, description)
                }}>
                  <i className="fas fa-save"></i> 
                </button>
            </div> 
            : <> </>
            }
            
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
              onClick={() => {
                console.log(code)
                runCode()

              }
              }>
                Run code
              </button>
            </div>
        </div>
  
        <div className='flex flex-row mt-4'>
            <Terminal 
            lang={language} code={code} setCode={setCode}
            />

            <div className="flex flex-col w-screen h-screen px-4">
                <textarea
                  className="mb-4 p-2 border rounded-lg w-full h-1/2 outline-none"
                  placeholder="Type your input here separated by newlines..."
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