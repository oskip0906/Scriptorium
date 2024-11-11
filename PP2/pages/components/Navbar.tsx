import React, { useEffect } from 'react'
import { useContext } from 'react'
import { AppContext } from '@/pages/components/AppVars'


function NavBar() {


  const context = useContext(AppContext);

  const setTheme = () => {
    const newTheme = localStorage.getItem('theme') === 'light' ? 'dark' : 'light';
    document.body.classList.remove('light', 'dark');
    document.body.classList.add(newTheme);
    localStorage.setItem('theme', newTheme); 
    context?.setTheme(newTheme);
  }




  return (
    <div className="flex justify-center mb-4">
    <button
      onClick={setTheme}
      className="px-4 py-2 bg-transparent text-gray-400 font-semibold border outline-none">
      Toggle Theme
    </button>
    </div>
  )
}

export default NavBar;