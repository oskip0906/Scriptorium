import React, { useRef } from 'react'
import Editor, { DiffEditor, useMonaco, loader } from '@monaco-editor/react';


interface TerminalProps {
  lang: string;
}



const Terminal: React.FC<TerminalProps> = ({ lang }) => {

  const editorRef = useRef(null);

  function onMount(editor: any) {
    editorRef.current = editor;    

  }
  

  return (
    <div>
        <Editor
        height='90vh'
        width = '50vw'  
        onMount={onMount}
        language={lang}
        theme= 'vs-dark'
        />
    </div>
  )
}

export default Terminal