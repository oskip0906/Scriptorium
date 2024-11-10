import React, { useEffect } from 'react'
import { useContext } from 'react'
import { AppContext } from '@/pages/components/AppVars'


function NavBar() {


  const context = useContext(AppContext);

  const setTheme = () => {
    context?.setTheme(context.theme === 'light' ? 'dark' : 'light');
  }

  useEffect(() => {
    console.log("Theme changed to: ", context?.theme);
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

export default NavBar;