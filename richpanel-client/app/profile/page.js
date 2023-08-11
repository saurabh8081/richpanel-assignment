'use client';
import React, { useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation'; // Corrected the import statement
import { AuthContext } from '../../context/AuthContext';
import Header from '../../components/Header';
import Footer from '@/components/Footer';
import Link from 'next/link';

const Profile = () => {
    const { user, loading } = useContext(AuthContext);
    const [activeColumn, setActiveColumn] = useState(null);
    const router = useRouter();
    const [orderPlan, setOrderPlan] = useState({});

    const plans = [
        {
            planName: 'Mobile',
            monthlyPrice: 100,
            yearlyPrice: 1000,
            videoQuality: 'Good',
            resolution: '480p',
            devices: 'Phone+Tablet',
            activeScreens: 1
        },
        {
            planName: 'Basic',
            monthlyPrice: 200,
            yearlyPrice: 2000,
            videoQuality: 'Good',
            resolution: '720p',
            devices: 'Phone+Tablet+Computer+TV',
            activeScreens: 3
        },
        {
            planName: 'Standard',
            monthlyPrice: 500,
            yearlyPrice: 5000,
            videoQuality: 'Better',
            resolution: '1080p',
            devices: 'Phone+Tablet+Computer+TV',
            activeScreens: 5
        },
        {
            planName: 'Premium',
            monthlyPrice: 700,
            yearlyPrice: 7000,
            videoQuality: 'Best',
            resolution: '4K+HDR',
            devices: 'Phone+Tablet+Computer+TV',
            activeScreens: 10
        }
    ];



    const [billingCycle, setBillingCycle] = useState('Monthly');

    useEffect(() => {
        if (!user) router.push('/login');
    }, [user]);

    if (loading) {
        return <h1>Loading...</h1>
    }

    const BillingCycleToggle = ({ className }) => {

        return (
            <div className={`flex justify-start text-xs ${className}`}>
                <div className="bg-primary p-4 rounded-full flex justify-center items-center cursor-pointer">
                    <button
                        className={`font-bold focus:outline-none border-blue-500 rounded-full p-2 px-4 ${billingCycle === 'Monthly' ? 'bg-white text-primary' : 'text-white'
                            }`}
                        onClick={() => setBillingCycle('Monthly')}
                    >
                        Monthly
                    </button>
                    <button
                        className={`font-bold focus:outline-none border-blue-500 rounded-full p-2 px-4 ml-2 ${billingCycle === 'Yearly' ? 'bg-white text-primary' : 'text-white'
                            }`}
                        onClick={() => setBillingCycle('Yearly')}
                    >
                        Yearly
                    </button>
                </div>
            </div>
        )
    }

    const selectPlan = (plan) => {
        const selectedPlan = {
            planName: plan.planName,
            billingCycle: billingCycle,
            planPrice: billingCycle === 'Monthly' ? plan.monthlyPrice : plan.yearlyPrice
        };
        setOrderPlan(selectedPlan);
    };


    return (
        <>
            <Header />
            <div className="text-center font-roboto font-medium">
                <p className="mt-4 text-xl font-medium">Choose the right plan for you</p>
                <table className="m-auto w-[70rem]">
                    <thead>
                        <tr>
                            <th className="text-left p-2">
                                {/* Using the BillingCycleToggle component for table heading */}
                                <BillingCycleToggle />
                            </th>
                            {plans.map((plan, index) => (
                                <th
                                key={index}
                                    className={`text-center p-2 cursor-pointer ${activeColumn === index ? 'opacity-100' : 'opacity-50'}`}
                                    onClick={() => { setActiveColumn(index); selectPlan(plan); }}
                                >
                                    <div className="triangle-container">
                                        <div className="square-div rounded p-2 bg-primary text-white w-32 h-32 flex justify-center items-center m-auto">
                                            <p className="font-medium">{plan.planName}</p>
                                        </div>
                                        {activeColumn === index &&
                                            <div className="triangle"></div>
                                        }
                                    </div>
                                </th>

                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <th className="text-left border-b p-2">
                                {billingCycle === 'Monthly' ? 'Monthly' : 'Yearly'} Price
                            </th>
                            {plans.map((plan, index) => (
                                <td
                                key={index}
                                    className={`align-top text-center border-b p-2 cursor-pointer ${activeColumn === index ? 'text-primary' : ''}`}
                                    onClick={() => { setActiveColumn(index); selectPlan(plan); }}
                                >
                                    {billingCycle === 'Monthly' ? `₹ ${plan.monthlyPrice}` : `₹ ${plan.yearlyPrice}`}
                                </td>
                            ))}
                        </tr>
                        <tr>
                            <th className="text-left border-b p-2">Video Quality</th>
                            {plans.map((plan, index) => (
                                <td
                                key={index}
                                    className={`align-top text-center border-b p-2 cursor-pointer ${activeColumn === index ? 'text-primary' : ''}`}
                                    onClick={() => { setActiveColumn(index); selectPlan(plan); }}
                                >{plan.videoQuality}</td>
                            ))}
                        </tr>
                        <tr>
                            <th className="text-left border-b p-2">Resolution</th>
                            {plans.map((plan, index) => (
                                <td
                                key={index}
                                    className={`align-top text-center border-b p-2 cursor-pointer ${activeColumn === index ? 'text-primary' : ''}`}
                                    onClick={() => { setActiveColumn(index); selectPlan(plan); }}
                                >{plan.resolution.replace(/\+/g, ' + ')} </td>
                            ))}
                        </tr>
                        <tr>
                            <th className="text-left p-2 align-top">Devices you can use to watch</th>
                            {plans.map((plan, index) => (
                                <td
                                key={index}
                                    className={`align-top text-center border-b p-2 cursor-pointer ${activeColumn === index ? 'text-primary' : ''}`}
                                    onClick={() => { setActiveColumn(index); selectPlan(plan); }}
                                >
                                    {plan.devices.split('+').map(device => (
                                        <div key={device.trim()}>{device.trim()}</div>
                                    ))}
                                </td>
                            ))}
                        </tr>
                    </tbody>
                </table>
                <div className='flex justify-center'>
                    {activeColumn !== null ? (
                        <Link
                            href={{
                                pathname: '/payment',
                                query: {
                                    planName: orderPlan.planName,
                                    billingCycle: orderPlan.billingCycle,
                                    planPrice: orderPlan.planPrice?.toString()
                                }
                            }}
                            className="bg-primary text-white rounded-md px-40 py-3 mt-4"
                        >
                            Next
                        </Link>
                    ) : (
                        <div className="w-fit bg-primary text-white rounded-md px-40 py-3 mt-4 opacity-50 cursor-not-allowed">
                            Next
                        </div>
                    )}
                </div>
                {/* <button className="bg-primary text-white rounded-md px-40 py-3 mt-4">Next</button> */}
            </div>
            <Footer />
        </>
    );
};

export default Profile;