'use client';
import React, { useState, useContext, useEffect } from 'react';
import { useRouter } from 'next/navigation'; // corrected the import statement
import { AuthContext } from '../../context/AuthContext';
import Header from '../../components/Header';
import Footer from '@/components/Footer';

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const { user, loading, login, error, success } = useContext(AuthContext);
    const router = useRouter();

    useEffect(() => {
        if (user) router.push('/profile');
    }, [user]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        await login(email, password);
    };

    if (loading) {
        return <h1>Loading...</h1>
    }

    return (
        <>
        <Header />
        <div className="bg-blue-800 flex items-center justify-center h-screen font-roboto">
            <div className="bg-white p-8 rounded shadow-md w-96">
                <form onSubmit={handleSubmit} className="space-y-4">
                    <p className="text-center text-sm font-medium mb-4">Login to your account</p>
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium mb-1">
                            Email
                        </label>
                        <input type="text" placeholder="Email" onChange={e => setEmail(e.target.value)} value={email}
                            className="w-full border rounded p-2 text-sm font-light focus:outline-none focus:border-blue-400"
                        />
                    </div>
                    <div>
                        <label htmlFor="password" className="block text-sm font-medium mb-1">
                            Password
                        </label>
                        <input type="password" placeholder="Password" onChange={e => setPassword(e.target.value)} value={password}
                            className="w-full border rounded p-2 text-sm font-light focus:outline-none focus:border-blue-400 mb-8"
                        />
                    </div>
                    <button type="submit" className="w-full bg-blue-800 text-white text-sm rounded py-2 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400">Login</button>
                </form>
                <p className="text-center text-sm font-roboto mt-6">
                    New to My App? <a href="/signup" className="text-blue-500">Sign Up</a>
                </p>
            </div>
        </div>
        <Footer />
        </>
    );
};

export default Login;