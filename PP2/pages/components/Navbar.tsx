import React, { useEffect } from 'react'
import { useContext } from 'react'
import { AppContext } from '@/pages/components/AppVars'


function NavBar() {


  const context = useContext(AppContext);

  const setTheme = () => {
    context?.setTheme(context.theme === 'light' ? 'dark' : 'light');
  }

  useEffect(() => {
    console.log("Theme changed to", context?.theme);
    document.body.classList.remove('light', 'dark');
    document.body.classList.add(context?.theme === 'light' ? 'light' : 'dark');
  }, [context?.theme]);


  return (
    <div className="flex justify-center mb-8">
    <button
      onClick={setTheme}
      className="px-4 py-2 bg-gray-400 font-semibold rounded-lg shadow-md focus:outline-none">
      Toggle Theme
    </button>
    </div>
  )
}

export default NavBar;