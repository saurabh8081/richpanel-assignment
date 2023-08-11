'use client';
import React, { useState, useContext, useEffect } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { useRouter } from 'next/navigation'; // Corrected the import statement
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Icon } from '@iconify/react';


const Register = () => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const { user, loading, register, error, success } = useContext(AuthContext);
    const router = useRouter();

    useEffect(() => {
        if (success) router.push('/login');
    }, [success]);

    useEffect(() => {
        if (user) router.push('/profile');
    }, [user]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        await register(name, email, password);
    };

    if (loading) {
        return <h1>Loading...</h1>
    }

    return (
        <>
            <Header />
            <div className="bg-blue-800 flex items-center justify-center h-screen font-roboto">
                <div className="bg-white p-4 rounded shadow-md w-80">
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <p className="text-center text-sm font-medium mb-2">Create Account</p>
                        <div>
                            <label
                                htmlFor="name"
                                className="block text-sm font-medium mb-1"
                            >
                                Name
                            </label>
                            <input
                                type="text"
                                placeholder="name"
                                onChange={(e) => setName(e.target.value)}
                                value={name}
                                className="w-full border rounded p-1 text-sm focus:outline-none focus:border-blue-400"
                            />
                        </div>
                        <div>
                            <label
                                htmlFor="email"
                                className="block text-sm font-medium mb-1"
                            >
                                Email
                            </label>
                            <input
                                type="text"
                                placeholder="email"
                                onChange={(e) => setEmail(e.target.value)}
                                value={email}
                                className="w-full border rounded p-1 text-sm focus:outline-none focus:border-blue-400"
                            />
                        </div>
                        <div>
                            <label
                                htmlFor="password"
                                className="block text-sm font-medium mb-1">
                                Password
                            </label>
                            <input
                                type="password"
                                placeholder="Password"
                                onChange={(e) => setPassword(e.target.value)}
                                value={password}
                                className="w-full border rounded p-1 text-sm focus:outline-none focus:border-blue-400 mb-6"
                            />
                        </div>
                        <button
                            type="submit"
                            className="w-full bg-blue-800 text-white rounded py-1 text-sm hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400"
                        >
                            Sign Up
                        </button>
                    </form>
                    <p className="text-center text-sm font-robot mt-4">
                        Already have an account?{" "}
                        <a href="/login" className="text-blue-500">
                            Login
                        </a>
                    </p>{
                        error &&
                        <p className="text-center text-sm font-robot mt-2 bg-red-600 p-2 rounded-lg text-white">
                            <Icon icon="ic:sharp-error" className="inline-block align-middle mr-1" /> {error}
                        </p>}
                        {success &&
                    <p className="text-center text-sm font-robot mt-2 bg-green-600 p-2 rounded-lg text-white">
                        <Icon icon="ooui:success" className="inline-block align-middle mr-1" /> {success}
                    </p>}
                </div>
            </div>
            <Footer />
        </>
    );
};

export default Register;