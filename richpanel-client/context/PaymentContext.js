'use client';
import React, { createContext, useState, useEffect } from 'react';
import { loadStripe } from "@stripe/stripe-js";
import api from '../utils/api';
import { useRouter } from 'next/navigation';
import { handleApiError } from '../utils/errorHandler';

export const PaymentContext = createContext();

export const PaymentProvider = ({ children }) => {
    const [paymentStatus, setPaymentStatus] = useState(null);
    const [loading, setLoading] = useState(true);
    const [subscription, setSubscription] = useState({
        status: null,
        startDate: null,
        endDate: null
    });

    const router = useRouter();

    const POLLING_INTERVAL = 5000; // Every 30 seconds. Adjust as needed.

    useEffect(() => {
        if (subscription.status === 'active') {
            router.push('/active');
        }
    }, [subscription]);  // <-- Add subscription as dependency    
    
    const subscribe = async ({ paymentMethodId, planName, billingCycle }) => {
        try {
            setLoading(true);

            // Initialize Stripe
            const stripe = await loadStripe("pk_test_51NddRfSA42VdnRC4eNcXDJBRW74qiTsHR3XRdKQLIj0P3xz8nMi3SHlx1vKFKxEafqFuqlm1bARQRGNHUi5dW4N600hFKFBYe7");

            const res = await api.post('/subscriptions/create', { paymentMethodId, planName, billingCycle });

        } catch (error) {
            console.log("Response", error.response);

            if (error.response && error.response.status === 402 && error.response.data.error === "Payment requires authentication.") {
                const invoiceRes = await api.get(`/invoices/${error.response.data.subscription.latest_invoice}`);
                console.log("Invoice", invoiceRes.data.data.hosted_invoice_url);

                if (invoiceRes.data && invoiceRes.data.payment_intent && invoiceRes.data.payment_intent.client_secret) {
                    const result = await stripe.confirmCardPayment(invoiceRes.data.payment_intent);
                    console.log("Result", result);
                    if (result.error) {
                        setPaymentStatus("Payment failed. Please try again.");
                    } else if (result.paymentIntent && result.paymentIntent.status === 'succeeded') {
                        setPaymentStatus("Payment confirmed!");
                    }
                }
                else if (invoiceRes.data && invoiceRes.data.data && invoiceRes.data.data.hosted_invoice_url) {
                    // Open the payment URL in a popup
                    const width = 500;
                    const height = 600;
                    const left = (window.innerWidth - width) / 2;
                    const top = (window.innerHeight - height) / 2;
                    const invoiceWindow = window.open(invoiceRes.data.data.hosted_invoice_url, 'authenticationWindow', `width=${width},height=${height},top=${top},left=${left}`);

                    if (invoiceWindow) {
                        const checkInterval = setInterval(() => {
                            if (invoiceWindow.closed) {
                                clearInterval(checkInterval);
                                checkPaymentStatus(); // This function checks the payment status (you might need to implement it)
                            }
                        }, 500);
                    } else {
                        setPaymentStatus("Unable to open the payment page. Please disable pop-up blockers and try again.");
                    }
                }
                else {
                    setPaymentStatus("Failed to fetch invoice details. Please try again.");
                }
            } else {
                setPaymentStatus(error.response ? error.response.data.msg : "An error occurred. Please try again.");
            }
            handleApiError(error);
        } finally {
            setLoading(false);
        }
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');  // Months are 0-based
        const year = date.getFullYear();
    
        return `${day}/${month}/${year}`;
    }

    const checkPaymentStatus = async () => {
        try {
            const statusRes = await api.get('/subscriptions/status');
    
            if (statusRes.data) {
                const { localStatus, stripeStatus, startDate, endDate } = statusRes.data;
                console.log("Status", statusRes.data);

                if (statusRes.data.localStatus === "active") {
                    router.push('/active');
                }
    
                // ... [rest of your existing logic]
    
                // Update the subscription object in the state if required
                setSubscription(prevSubscription => ({
                    ...prevSubscription, 
                    status: stripeStatus, 
                    startDate: formatDate(startDate), 
                    endDate: formatDate(endDate)
                }));
    
            } else {
                setPaymentStatus("Failed to fetch subscription status. Please try again.");
            }
        } catch (error) {
            console.error("Error fetching subscription status: ", error);
            setPaymentStatus("An error occurred while checking subscription status. Please try again.");
        }
    };         

    return (
        <PaymentContext.Provider value={{ subscribe, paymentStatus, loading, setPaymentStatus, subscription }}>
            {children}
        </PaymentContext.Provider>
    );    
};