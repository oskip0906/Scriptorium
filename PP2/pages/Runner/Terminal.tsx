import React, { useEffect, useRef } from 'react'
import Editor, { DiffEditor, useMonaco, loader } from '@monaco-editor/react';



interface TerminalProps {
  language: string;
}



const Terminal: React.FC<TerminalProps> = ({ language }) => {

  const editorRef = useRef(null);

  function onMount(editor: any) {
    editorRef.current = editor;
  }


  function handleEditorChange(value:any) {
    // console.log('here is the current model value:', value);
  }

    function handleEditorValidation(markers:any) {
      console.log('onValidate:', markers);
  }


  return (
    <div>
        <Editor height="90vh" 
        defaultLanguage="javascript" 
        defaultValue="// some> code"
        onMount={onMount}
      onChange={handleEditorChange}
      onValidate={handleEditorValidation}

        />
    </div>
  )
}

export default Terminal