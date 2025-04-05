"use client"

import { useState } from "react"
import { Calendar, Clock, MapPin, AlertCircle, ExternalLink } from "lucide-react"
import LoadingSpinner from "../components/LoadingSpinner"
import AnalysisResult from "../components/AnalysisResult"
import { useAnalysis } from "../context/AnalysisContext"

const HistoryPage = () => {
  const { history, loading, error } = useAnalysis()
  const [selectedAnalysis, setSelectedAnalysis] = useState(null)

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  const formatTime = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const handleRowClick = (analysis) => {
    setSelectedAnalysis(analysis)
  }

  const closeDetails = () => {
    setSelectedAnalysis(null)
  }

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Analysis History</h1>

      {loading ? (
        <div className="flex justify-center py-12">
          <LoadingSpinner message="Loading analysis history..." />
        </div>
      ) : error ? (
        <div className="p-4 bg-red-50 text-red-700 rounded-md flex items-start">
          <AlertCircle className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" />
          <span>{error}</span>
        </div>
      ) : history.length === 0 ? (
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <p className="text-gray-600 mb-4">You haven't performed any analyses yet.</p>
          <div className="flex justify-center space-x-4">
            <a href="/upload" className="btn-primary">
              Upload Images
            </a>
            <a href="/predefined-regions" className="btn-secondary">
              Explore Regions
            </a>
          </div>
        </div>
      ) : !selectedAnalysis ? (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Type
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Date
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Years
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Changes
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {history.map((item) => (
                  <tr key={item._id} className="hover:bg-gray-50 cursor-pointer" onClick={() => handleRowClick(item)}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        {item.input_type === "predefined_region" ? (
                          <MapPin className="h-5 w-5 text-green-500 mr-2" />
                        ) : (
                          <ExternalLink className="h-5 w-5 text-blue-500 mr-2" />
                        )}
                        <span className="text-sm text-gray-900">
                          {item.input_type === "predefined_region" ? "Sample Region" : "Uploaded"}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{formatDate(item.created_at)}</div>
                      <div className="text-sm text-gray-500">{formatTime(item.created_at)}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {item.before_image_year} → {item.after_image_year}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        Urban: {item.analysis.change_percentages.urbanization}%
                      </div>
                      <div className="text-sm text-gray-500">
                        Forest: {item.analysis.change_percentages.deforestation}%
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <button className="text-green-600 hover:text-green-800">View</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-800">Analysis Details</h2>
            <button type="button" onClick={closeDetails} className="text-gray-500 hover:text-gray-700">
              &larr; Back to history
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <div className="flex items-center mb-2">
                <Calendar className="h-5 w-5 text-gray-500 mr-2" />
                <span className="text-gray-700 font-medium">Date:</span>
                <span className="ml-2">{formatDate(selectedAnalysis.created_at)}</span>
              </div>
              <div className="flex items-center mb-2">
                <Clock className="h-5 w-5 text-gray-500 mr-2" />
                <span className="text-gray-700 font-medium">Time:</span>
                <span className="ml-2">{formatTime(selectedAnalysis.created_at)}</span>
              </div>
              <div className="flex items-center mb-2">
                <MapPin className="h-5 w-5 text-gray-500 mr-2" />
                <span className="text-gray-700 font-medium">Type:</span>
                <span className="ml-2">
                  {selectedAnalysis.input_type === "predefined_region" ? "Sample Region" : "User Uploaded"}
                </span>
              </div>
            </div>

            <div>
              <div className="mb-2">
                <span className="text-gray-700 font-medium">Years Compared:</span>
                <span className="ml-2">
                  {selectedAnalysis.before_image_year} to {selectedAnalysis.after_image_year}
                </span>
              </div>
              <div className="mb-2">
                <span className="text-gray-700 font-medium">Duration:</span>
                <span className="ml-2">
                  {selectedAnalysis.after_image_year - selectedAnalysis.before_image_year} years
                </span>
              </div>
            </div>
          </div>

          <AnalysisResult
            result={{
              change_map_url: selectedAnalysis.cloud_change_map_url,
              change_percentages: selectedAnalysis.analysis.change_percentages,
            }}
            beforeImage={selectedAnalysis.cloud_vis_url}
            afterImage={selectedAnalysis.cloud_change_map_url}
            beforeYear={selectedAnalysis.before_image_year}
            afterYear={selectedAnalysis.after_image_year}
          />
        </div>
      )}
    </div>
  )
}

export default HistoryPage

