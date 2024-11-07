import React from 'react'
import { useState, useRef } from 'react'
import Terminal from '@/pages/Runner/Terminal'


 const languages = ['python', 'javascript', 'java', 'c', 'c++']
 const index = () => {
  const [language, setLanguage] = useState('javascript')
  

  return (
    <div>
            <select 
            value={language}
            onChange={(e) => setLanguage(e.target.value)}>
            {languages.map((lang) => (
              <option key={lang} value={lang}>{lang}</option>
            ))}
            </select>
        <Terminal lang={language}/>
    </div>
  )
}

export default index