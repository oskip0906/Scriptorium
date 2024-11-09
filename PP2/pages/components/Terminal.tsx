import React, { useContext, useRef } from 'react'
import Editor, { DiffEditor, useMonaco, loader } from '@monaco-editor/react';
import { AppContext } from '@/pages/components/AppVars';

interface TerminalProps {
  lang: string;
}



const Terminal: React.FC<TerminalProps> = ({ lang }) => {


  const context = useContext(AppContext);

  const theme = context?.theme;


  
  
  const editorRef = useRef(null);





  function onMount(editor: any) {
    editorRef.current = editor;    
  }


  

  return (
    <div>
        <Editor
        height='90vh'
        width = '50vw'  
        defaultLanguage='javascript'
        defaultValue="// some> code"
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