import React from 'react'
import Editor, { DiffEditor, useMonaco, loader } from '@monaco-editor/react';





function Terminal() {
  return (
    <div>
        <Editor height="90vh" defaultLanguage="javascript" defaultValue="// some> code" />
    </div>
  )
}

export default Terminal