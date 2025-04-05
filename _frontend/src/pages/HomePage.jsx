import React from "react";
import { Link } from "react-router-dom";
import { Upload, Map, History } from "lucide-react";

const HomePage = () => {
  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-12">
        <h1 className="text-5xl font-bold text-gray-800 mb-4">Satellite Image Analysis</h1>
        <p className="text-xl text-gray-600">
          Detect and visualize changes in land use, urbanization, deforestation, and water bodies.
        </p>
      </div>

      <div className="bg-gradient-to-br from-green-500 to-teal-600 rounded-xl p-8 mb-12 shadow-xl text-white">
        <h2 className="text-3xl font-bold mb-8 text-center">Choose your detection method</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Link to="/upload" className="bg-white/20 backdrop-blur-sm rounded-xl p-6 flex items-center hover:bg-white/30 transition-all duration-300 border border-white/40">
            <Upload className="h-12 w-12 text-white mr-4 flex-shrink-0" />
            <div>
              <h3 className="text-2xl font-semibold mb-1">Upload Images</h3>
              <p className="text-white/80">Upload your own before and after satellite images</p>
            </div>
          </Link>

          <Link to="/predefined-regions" className="bg-white/20 backdrop-blur-sm rounded-xl p-6 flex items-center hover:bg-white/30 transition-all duration-300 border border-white/40">
            <Map className="h-12 w-12 text-white mr-4 flex-shrink-0" />
            <div>
              <h3 className="text-2xl font-semibold mb-1">Sample Images</h3>
              <p className="text-white/80">Use our predefined satellite imagery regions</p>
            </div>
          </Link>
        </div>
      </div>

      <div className="text-center mb-16">
        <Link to="/history" className="inline-flex items-center px-8 py-4 text-lg font-medium text-green-700 bg-green-100 rounded-full hover:bg-green-200 transition-colors duration-300">
          <History className="mr-2 h-6 w-6" />
          View Analysis History
        </Link>
      </div>

      <div className="mb-12">
        <h2 className="text-3xl font-bold text-center mb-10">How It Works</h2>
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <div className="absolute -top-3 -left-3 bg-green-600 text-white rounded-full h-8 w-8 flex items-center justify-center font-bold shadow-lg">1</div>
            <div className="bg-gray-100 h-full p-6 rounded-lg">
              <h3 className="text-xl font-semibold mb-3">Select Images</h3>
              <p className="text-gray-600">Upload satellite images or choose from our collection of predefined regions</p>
            </div>
          </div>
          
          <div className="flex-1 relative">
            <div className="absolute -top-3 -left-3 bg-green-600 text-white rounded-full h-8 w-8 flex items-center justify-center font-bold shadow-lg">2</div>
            <div className="bg-gray-100 h-full p-6 rounded-lg">
              <h3 className="text-xl font-semibold mb-3">AI Analysis</h3>
              <p className="text-gray-600">Our AI model detects and quantifies changes between the images</p>
            </div>
          </div>
          
          <div className="flex-1 relative">
            <div className="absolute -top-3 -left-3 bg-green-600 text-white rounded-full h-8 w-8 flex items-center justify-center font-bold shadow-lg">3</div>
            <div className="bg-gray-100 h-full p-6 rounded-lg">
              <h3 className="text-xl font-semibold mb-3">View Results</h3>
              <p className="text-gray-600">Get detailed visualizations and statistics about land transformation</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;