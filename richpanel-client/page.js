// ifacet/client/components/Profile.js
'use client';
// ifacet/client/components/Profile.js
import React, { useContext, useEffect } from 'react';
import { useRouter } from 'next/navigation'; // corrected the import statement
import { AuthContext } from '@/context/AuthContext';

const Profile = () => {
    const { student, loading, logout } = useContext(AuthContext);
    const router = useRouter();

    useEffect(() => {
        if (!student) {
            router.push('/login');
        }
    }, [student, router]);

    const handleLogout = async () => {
        await logout();
        router.push('/login');
    };

    if (loading) return <Loader/>;

    return (
        <div className='mx-8 xs:mx-12 sm:mx-16 md:mx-20 lg:mx-28 xl:mx-36 3xl:mx-96'>
            <h1>Welcome, {student && student.firstName} {student && student.lastName}</h1>
            <p><strong>Username:</strong> {student && student.username}</p>
            <p><strong>Email:</strong> {student && student.email}</p>
            <p><strong>Mobile Number:</strong> {student && student.mobileNumber}</p>
            <p><strong>Gender:</strong> {student && student.gender}</p>
            <p><strong>State:</strong> {student && student.state}</p>
            <p><strong>City:</strong> {student && student.city}</p>
            <p><strong>College Name:</strong> {student && student.collegeName}</p>
            <p><strong>Pincode:</strong> {student && student.pincode}</p>

            <button onClick={handleLogout}>Logout</button>
        </div>
    );
};

export default Profile;
