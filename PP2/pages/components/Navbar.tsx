import React, {useState, useEffect, useContext} from 'react'
import { AppContext } from '@/pages/components/AppVars'
import { useRouter } from 'next/router'

function NavBar() {

  const router = useRouter();
  const context = useContext(AppContext);

  const [profile, setProfile] = useState({userName: '', avatar: ''});
  const [menuOpen, setMenuOpen] = useState(false);




  const setTheme = () => {
    const newTheme = localStorage.getItem('theme') === 'light' ? 'dark' : 'light';
    document.body.classList.remove('light', 'dark');
    document.body.classList.add(newTheme);
    localStorage.setItem('theme', newTheme); 
    context?.setTheme(newTheme);
  }

  useEffect(() => {
    const fetchProfile = async () => {

      if (context?.userID) {
        const response = await fetch(`/api/Profile/${context.userID}`);
        if (!response.ok) {
          console.error('Failed to fetch profile data');
          return;
        }


        const data = await response.json();

        setProfile({
          userName: data.userName,
          avatar: data.avatar,
        });
      }
      
    };

    const checkAdmin = async () => await fetch('/api/auth/verifyAdmin', {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json',
          'authorization': `Bearer ${localStorage.getItem('accessToken')}`
      },
  }).then(res => res.json()).then(data => {context?.setAdmin(data.status)});

    checkAdmin();
    fetchProfile();
  }, [context?.userID]);



  return (
    <div className="flex justify-between items-center p-4 mb-4 shadow-md" id="navbar">
      
      <div className="flex items-center space-x-8">
        <button
          onClick={setTheme}
          className="p-1 bg-transparent text-3xl rounded border">
          {context?.theme === 'light' ? '🌑' : '☀️'}
        </button>
        
        {profile.userName && (
          <div className="flex items-center space-x-2">
            <img
              src={profile.avatar}
              alt={"avatar"}
              className="w-8 h-8 rounded-full"
            />

            <span className="cta-primary font-bold text-2xl">{profile.userName}</span>
          </div>
        )}
      </div>

      <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="block lg:hidden text-3xl bg-transparent text-gray-500 p-2"
          aria-label="Toggle Menu">
          ☰
      </button>

      <nav className={`flex flex-col space-y-4 ${menuOpen ? 'block' : 'hidden'} lg:flex lg:flex-row lg:space-y-0 lg:space-x-4`}>
        <button
          onClick={() => router.push('/')}
          id="navButton"
          className={router.pathname === '/' ? 'active' : ''}>
          Home
        </button>

        <button
          onClick={() => router.push('/profile')}
          id="navButton"
          className={router.pathname === '/profile' ? 'active' : ''}>
          Profile
        </button>

        <button
          onClick={() => router.push('/Blogs')}
          id="navButton"
          className={router.pathname === '/Blogs' ? 'active' : ''}>
          Blog Posts
        </button>

        <button
          onClick={() => router.push('/Templates')}
          id="navButton"
          className={router.pathname === '/Templates' ? 'active' : ''}>
          Code Templates
        </button>

        {context?.admin === 'True' ? 
        <button
          onClick={() => router.push('/Admin')}
          id="navButton"
          className={router.pathname === '/Admin' ? 'active' : ''}>
        Admin</button> 
          
        
        
        
        
        :<></>}
      </nav>

    </div>
  )
}

export default NavBar;