import React, { useEffect } from 'react'
import { useContext } from 'react'
import { AppContext } from '@/pages/components/AppVars'


function navbar() {


  const context = useContext(AppContext);

  const setTheme = () => {
    context?.setTheme(context.theme === 'light' ? 'dark' : 'light');
  }

  useEffect(() => {
    document.body.classList.remove('light', 'dark');
    document.body.classList.add(context?.theme === 'light' ? 'light' : 'dark');
  }, [context?.theme]);


  return (
    <div>
    <button
    onClick={setTheme}
    >Theme</button>        


    </div>
  )
}

export default navbar