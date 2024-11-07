import React, { useEffect, useRef } from 'react'
import Editor, { DiffEditor, useMonaco, loader } from '@monaco-editor/react';

// given a language

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
        <Editor height="90vh" 
        defaultLanguage='javascript'
        defaultValue="// some> code"
        onMount={onMount}
        language={lang}
        />
    </div>
  )
}

export default Terminal