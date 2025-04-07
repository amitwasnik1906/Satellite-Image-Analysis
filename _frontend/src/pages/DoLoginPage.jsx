import React from "react";
import { Link } from "react-router-dom";
import { SignInButton } from "@clerk/clerk-react";
import { LockKeyhole } from "lucide-react";

const DoLoginPage = () => {
  return (
    <div className="max-w-4xl mx-auto text-center">
      <div className="bg-gradient-to-br from-green-500 to-teal-600 rounded-xl p-8 mb-12 shadow-xl text-white">
        <div className="flex flex-col items-center justify-center py-12">
          <LockKeyhole className="h-24 w-24 text-white mb-6" />
          <h1 className="text-4xl font-bold mb-4">Login Required</h1>
          <p className="text-xl mb-8">
            Please sign in to access this feature
          </p>
          <div className="mb-6">
            <SignInButton className="bg-white text-green-700 hover:bg-green-100 px-6 py-3 rounded-lg text-lg font-medium transition-colors" />
          </div>
          <Link 
            to="/" 
            className="text-white hover:text-green-100 underline mt-4"
          >
            Return to Home
          </Link>
        </div>
      </div>
      
      <div className="mb-12">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Why Sign In?</h2>
        <p className="text-lg text-gray-600 mb-6">
          Signing in allows you to:
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-gray-100 p-6 rounded-lg">
            <h3 className="text-xl font-semibold mb-3">Save Your Analysis</h3>
            <p className="text-gray-600">Store your satellite image analysis results for future reference</p>
          </div>
          
          <div className="bg-gray-100 p-6 rounded-lg">
            <h3 className="text-xl font-semibold mb-3">Track History</h3>
            <p className="text-gray-600">Access your previous analysis sessions and compare results over time</p>
          </div>
          
          <div className="bg-gray-100 p-6 rounded-lg">
            <h3 className="text-xl font-semibold mb-3">Enhanced Features</h3>
            <p className="text-gray-600">Get access to advanced analysis tools and personalized settings</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DoLoginPage;
