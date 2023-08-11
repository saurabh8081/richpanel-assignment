"use client";
import { loadStripe } from "@stripe/stripe-js";
import { useSearchParams } from 'next/navigation';
import {
    Elements,
    CardElement,
    useStripe,
    useElements,
} from "@stripe/react-stripe-js";
import { useContext, useEffect } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { PaymentContext } from "@/context/PaymentContext";
import { AuthContext } from "@/context/AuthContext";
import { useRouter } from 'next/navigation';

const stripePromise = loadStripe("pk_test_51NddRfSA42VdnRC4eNcXDJBRW74qiTsHR3XRdKQLIj0P3xz8nMi3SHlx1vKFKxEafqFuqlm1bARQRGNHUi5dW4N600hFKFBYe7"); // Ensure to use your public key here, not the secret one.

function PaymentForm() {
    const { subscribe,  subscription } = useContext(PaymentContext);
    const { loading } = useContext(AuthContext);
    const formatBillingCycle = (cycle) => {
        if (cycle === "Monthly") return "month";
        if (cycle === "Yearly") return "year";
        return cycle;
    }

    const router = useRouter();
    
    const searchParams = useSearchParams();
    const planName = searchParams.get('planName');
    const billingCycle = searchParams.get('billingCycle');
    const planPrice = searchParams.get('planPrice');

    const orderPlan = {
        planName: planName,
        billingCycle: billingCycle,
        planPrice: planPrice,
    };
    const stripe = useStripe();
    const elements = useElements();

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (!stripe || !elements) {
            return;
        }
    
        const cardElement = elements.getElement(CardElement);
        const { error, paymentMethod } = await stripe.createPaymentMethod({
            type: "card",
            card: cardElement,
        });
    
        if (error) {
            console.log(error);
            // Handle errors accordingly
        } else {
            try {
                await subscribe({ 
                    paymentMethodId: paymentMethod.id,
                    planName: orderPlan.planName,
                    billingCycle: orderPlan.billingCycle
                });                              
                // Handle successful subscription (e.g., navigate user to a thank you page or show success message)
            } catch (error) {
                // Handle API error (though, it might already be handled within the subscribe method)
                console.error(error);
            }
        }
    };

    useEffect(() => {
        if (subscription.status === 'active') {
            router.push('/active');
        }
    }, [subscription]);

    if (loading) {
        return <h1>Loading...</h1>
    }
    
    return (
        <div className="flex justify-center items-center h-screen w-full bg-blue-800 font-roboto">
            <div className="bg-white shadow-md rounded-md w-fit">
                <div className="flex">
                    <form onSubmit={handleSubmit} className="w-fit px-10 py-12">
                        <h1 className="w-fit text-xl mb-4">Complete Payment</h1>
                        <p className="w-fit mb-2 text-xs">
                            Enter your Credit or Debit card details below
                        </p>
                        <div className="border rounded p-3 mb-4 w-fit">
                            <CardElement options={{hidePostalCode: true}} className="w-80" />
                        </div>
                        <button
                            type="submit"
                            disabled={!stripe}
                            className="w-fit px-4 bg-blue-800 text-white text-sm rounded py-2 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400"
                        >
                            Confirm Payment
                        </button>
                    </form>
                    <div className="px-10 py-12 rounded bg-[#f4f5f6] w-[23rem]">
                        <h2 className="text-lg mb-4">Order Summary</h2>
                        <table className="w-full text-sm">
                            <tbody>
                                <tr className="h-9 border-b">
                                    <td>Plan Name</td>
                                    <td className="text-right">{orderPlan.planName}</td>
                                </tr>
                                <tr className="h-9 border-b">
                                    <td>Billing Cycle</td>
                                    <td className="text-right">{orderPlan.billingCycle}</td>
                                </tr>
                                <tr className="h-9 border-b">
                                    <td>Plan Price</td>
                                    <td className="text-right">₹ {orderPlan.planPrice}/{orderPlan.billingCycle == 'Monthly' ? 'mo' : 'yr'}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>

                </div>
            </div>
        </div>
    );
}

function PaymentPage() {
    return (
        <>
            <Header />
            <Elements stripe={stripePromise}>
                <PaymentForm />
            </Elements>
            <Footer />
        </>
    );
}

export default PaymentPage;