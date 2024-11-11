import React, { useContext, useEffect, useRef } from 'react'
import Editor from '@monaco-editor/react';
import { AppContext } from '@/pages/components/AppVars';

interface TerminalProps {
  lang: string;
  code?: string;
  setOutput?: React.Dispatch<React.SetStateAction<string>>;
  setError?: React.Dispatch<React.SetStateAction<string>>;
  run?: boolean;
  setRun?: React.Dispatch<React.SetStateAction<boolean>>;
  input?: string;
}

interface RequestBody {
  language: string;
  code: string;
  input: string;
}


const Terminal: React.FC<TerminalProps> = ({ lang, code, setOutput, setError, run, setRun, input }) => {


  const context = useContext(AppContext);

  const theme = context?.theme;
  
  const editorRef = useRef(null);


  function onMount(editor: any) {
    editorRef.current = editor;    
  }
  useEffect(() => {
    if (run) {
      runCode();
    }
  }
  , [run])
  
  const runCode = async () => {
    const editor: any = editorRef.current;
    if (!editor || !setOutput || !setError || !setRun) return;

    const req: RequestBody = { language: lang, code: editor.getValue(), input: input ?? '' };
    const response = await fetch('/api/CodeRunner', {
      method: 'POST', 
      body: JSON.stringify(req)
    });
    const data = await response.json();
    setOutput(data.output ?? 'Failed to run');
    setError(data.error ?? '');
    setRun(false);
  }

  return (
    <div>
        <Editor
        height='90vh'
        width = '50vw'  
        defaultLanguage={lang}
        defaultValue={'// write your code here'}
        value={code}
        onMount={onMount}
        language={lang}
        theme={theme === 'light' ? 'vs-light' : 'vs-dark'}
        options= {{
          fontSize: 16,
          minimap: { enabled: false },
          wordWrap: 'on',
          lineNumbers: 'on'
        }}
        />
    </div>
  )
}

export default Terminal