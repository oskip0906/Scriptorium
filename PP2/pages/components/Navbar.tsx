import React, { useState, useEffect, useContext } from 'react';
import { AppContext } from '@/pages/components/AppVars';
import { useRouter } from 'next/router';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function NavBar() {
  const router = useRouter();
  const context = useContext(AppContext);

  const [profile, setProfile] = useState({ userName: '', avatar: '' });
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('userID');
    context?.setUserID('');
    context?.setAdmin('');
    router.push('/Login');
    setProfile({ userName: '', avatar: '' });
  };

  const setTheme = () => {
    const newTheme = localStorage.getItem('theme') === 'light' ? 'dark' : 'light';
    document.body.classList.remove('light', 'dark');
    document.body.classList.add(newTheme);
    localStorage.setItem('theme', newTheme);
    context?.setTheme(newTheme);
  };

  useEffect(() => {
    if (!context?.userID) {
      return;
    }

    const fetchProfile = async () => {
      const response = await fetch(`/api/Profile/${context.userID}`);

      if (!response.ok) {
        console.log('Error fetching profile');
        return;
      }
        
      const data = await response.json();
      let avatarBase64 = '';

      if (data.avatar) {
        const avatarResponse = await fetch(data.avatar);
        if (avatarResponse.ok) {
          const avatarJson = await avatarResponse.json();
          avatarBase64 = Buffer.from(avatarJson.imageBuffer).toString('base64');
        }
      }

      setProfile({
        userName: data.userName,
        avatar: avatarBase64 ? `data:image/jpeg;base64,${avatarBase64}` : '',
      });
    };

    const checkAdmin = async () => {
      const response = await fetch('/api/auth/verifyAdminToken', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
        },
      });

      if (!response.ok) {
        console.log('Error verifying admin token');
        return;
      }

      const data = await response.json();
      context?.setAdmin(data.status);
    };

    fetchProfile();
    checkAdmin();
  }, [context?.userID]);

  return (
    <div>
      <ToastContainer position="top-center" autoClose={1500} theme={context?.theme}/>

      <div className="flex justify-between items-center p-4 shadow-lg mb-4" id="navbar">
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
                alt="avatar"
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

        <nav
          className={`flex flex-col space-y-4 ${
            menuOpen ? 'block' : 'hidden'
          } lg:flex lg:flex-row lg:space-y-0 lg:space-x-4`}>

          <button
            onClick={() => router.push('/')}
            id="navButton"
            className={router.pathname === '/' ? 'active' : ''}>
            Home
          </button>

          {context?.userID && (
            <button
              onClick={() => router.push('/Profile')}
              id="navButton"
              className={router.pathname.startsWith('/Profile') ? 'active' : ''}>
              Profile
            </button>
          )}

          <button
            onClick={() => router.push('/Runner')}
            id="navButton"
            className={router.pathname.startsWith('/Runner') ? 'active' : ''}>
            Code Execution
          </button>

          <button
            onClick={() => router.push('/Blogs')}
            id="navButton"
            className={router.pathname.startsWith('/Blogs') ? 'active' : ''}>
            Blog Posts
          </button>

          <button
            onClick={() => router.push('/Templates')}
            id="navButton"
            className={router.pathname.startsWith('/Templates') ? 'active' : ''}>
            Code Templates
          </button>

          <button
            onClick={handleLogout}
            id="navButton"
            className={(router.pathname.startsWith('/Logout') || router.pathname.startsWith('/Login')) ? 'active' : ''}>
            {context?.userID ? 'Logout' : 'Login'}
          </button>

          {context?.admin === 'True' && (
            <button
              onClick={() => router.push('/Admin')}
              id="navButton"
              className={router.pathname.startsWith('/Admin') ? 'active' : ''}>
              Admin
            </button>
          )}
        </nav>
      </div>

    </div>
  );
}

export default NavBar;