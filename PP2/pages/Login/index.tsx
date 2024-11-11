import React, { useState } from 'react';
import { useRouter } from 'next/router';

const LoginPage = () => {
    const [userName, setUserName] = useState('');
    const [password, setPassword] = useState('');
    const router = useRouter();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            const response = await fetch('/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ userName, password })
            });

            if (!response.ok) {
                alert('Login failed');
                return;
            }

            const { accessToken, refreshToken } = await response.json();
            localStorage.setItem('accessToken', accessToken);
            localStorage.setItem('refreshToken', refreshToken);
            console.log('Login successful');
            router.push('/');

        } 
        catch (error) {
            alert('Login failed');
            return;
        }
    };

    return (
        <div className="container mx-auto p-4 max-w-md">
            <h1 className="text-2xl font-bold mb-4">Login</h1>

            <form onSubmit={handleLogin} className="space-y-4">
                <div>
                    <label htmlFor="userName" className="block text-sm font-medium">
                        Username
                    </label>
                    <input
                        type="text"
                        id="userName"
                        value={userName}
                        onChange={(e) => setUserName(e.target.value)}
                        className="mt-1 block w-full px-3 py-2 border rounded-md shadow-sm outline-none focus:ring focus:border sm:text-sm"
                    />
                </div>

                <div>
                    <label htmlFor="password" className="block text-sm font-medium">
                        Password
                    </label>
                    <input
                        type="password"
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="mt-1 block w-full px-3 py-2 border rounded-md shadow-sm outline-none focus:ring focus:border sm:text-sm"
                    />
                </div>

                <button
                    type="submit"
                    className="w-full py-2 px-4 rounded-md shadow outline-none">
                    Log In
                </button>
            </form>
        </div>
    );
};

export default LoginPage;