import React from "react";
import Header from "../../components/Header";
import Footer from "../../components/Footer";

const Active = ({ planName, planCircle, startDate, renewDate }) => {
  return (
    <>
    <Header/>
    <div className="bg-blue-800 h-screen flex justify-center items-center font-roboto text-lg">
      <div className="bg-white p-8 shadow-md rounded-2xl w-5/12">
        {" "}
        {/* Adjust the width as needed */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">Current Plan Details</h2>
          <button className="text-blue-600 hover:text-blue-800 bg-white hover:bg-red-600 px-2 py-1 rounded">
            Cancel
          </button>
        </div>
        <p className="mb-2">:: {planName}</p>
        <p>:: {planCircle}</p>
        <button className="bg-white text-blue-800 border border-blue-800 hover:bg-blue-600 hover:text-white mt-4 px-4 py-2 rounded">
          Change Plan
        </button>
        <p className="mt-4">
          Your Subscription has started on {startDate} and will auto renew on{" "}
          {renewDate}.
        </p>
      </div>
    </div>
    <Footer />
    </>
  );
};

export default Active;