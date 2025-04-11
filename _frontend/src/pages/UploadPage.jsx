"use client"

import { useState, useEffect } from "react"
import { Upload, AlertCircle, CheckCircle } from "lucide-react"
import LoadingSpinner from "../components/LoadingSpinner"
import AnalysisResult from "../components/AnalysisResult"
import { analyzeUserUploadedRegion } from "../api"
import { useUser } from "@clerk/clerk-react"

const UploadPage = () => {
  const [beforeImage, setBeforeImage] = useState(null)
  const [afterImage, setAfterImage] = useState(null)
  const [before_image_year, set_before_image_year] = useState(null)
  const [after_image_year, set_after_image_year] = useState(null)

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [result, setResult] = useState(null)

  const { user } = useUser();

  // Clean up object URLs when component unmounts or images change
  useEffect(() => {
    return () => {
      // Clean up object URLs when component unmounts
      if (beforeImage?.preview) {
        URL.revokeObjectURL(beforeImage.preview)
      }
      if (afterImage?.preview) {
        URL.revokeObjectURL(afterImage.preview)
      }
    }
  }, [])

  const handleBeforeImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      // Revoke previous URL if it exists
      if (beforeImage?.preview) {
        URL.revokeObjectURL(beforeImage.preview)
      }
      setBeforeImage({
        file,
        preview: URL.createObjectURL(file),
      })
    }
  }

  const handleAfterImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      // Revoke previous URL if it exists
      if (afterImage?.preview) {
        URL.revokeObjectURL(afterImage.preview)
      }
      setAfterImage({
        file,
        preview: URL.createObjectURL(file),
      })
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!beforeImage || !afterImage) {
      setError("Please upload both before and after images")
      return
    }

    if (!before_image_year || !after_image_year) {
      setError("Please enter both before and after image years")
      return
    }

    setLoading(true)
    setError(null)

    try {
      console.log("clicked");

      const data = await analyzeUserUploadedRegion({
        before_image: beforeImage.file,
        after_image: afterImage.file,
        before_image_year: parseInt(before_image_year),
        after_image_year: parseInt(after_image_year)
      },
        user.id
      )

      setResult(data.analysis)

    } catch (err) {
      setError("An error occurred during analysis. Please try again.")
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const resetForm = () => {
    // Clean up object URLs before resetting
    if (beforeImage?.preview) {
      URL.revokeObjectURL(beforeImage.preview)
    }
    if (afterImage?.preview) {
      URL.revokeObjectURL(afterImage.preview)
    }

    setBeforeImage(null)
    setAfterImage(null)
    set_before_image_year(null)
    set_after_image_year(null)
    setResult(null)
    setError(null)
  }

  // Prevent default on input container clicks to avoid navigation issues
  const handleContainerClick = (e) => {
    if (e.target === e.currentTarget) {
      e.preventDefault()
    }
  }

  const currentYear = new Date().getFullYear()

  return (
    loading ? (
      <div className="flex flex-col items-center py-12">
        <LoadingSpinner message="Analyzing region..." />

        <div className="mt-6 p-4 bg-gray-50 rounded-lg border border-gray-200 shadow-sm text-center">
          <p className="text-gray-700 font-medium">This analysis takes a while, please do not refresh the page.</p>
          <p className="mt-3 text-sm text-gray-500 italic">
            Don't worry! Even if you refresh, you can find your analysis results in the History section.
          </p>
        </div>
      </div>
    ): 
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Upload Satellite Images</h1>

      {!result ? (
        <div className="bg-white rounded-lg shadow-md p-6">
          <form onSubmit={handleSubmit}>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-gray-700 font-semibold mb-2">Older Image </label>
                <div
                  className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-green-500 transition-colors relative"
                  onClick={handleContainerClick}
                >
                  {beforeImage ? (
                    <div className="relative">
                      <img
                        src={beforeImage.preview}
                        alt="Before"
                        className="mx-auto max-h-48 object-contain"
                      />
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation()
                          if (beforeImage?.preview) {
                            URL.revokeObjectURL(beforeImage.preview)
                          }
                          setBeforeImage(null)
                        }}
                        className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1 transform translate-x-1/2 -translate-y-1/2"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </button>
                      <p className="mt-2 text-sm text-gray-500">{beforeImage.file.name}</p>
                    </div>
                  ) : (
                    <div className="py-8">
                      <Upload className="mx-auto h-12 w-12 text-gray-400" />
                      <p className="mt-2 text-sm text-gray-500">Click or drag file to upload</p>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleBeforeImageChange}
                        onClick={e => e.stopPropagation()}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      />
                    </div>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-gray-700 font-semibold mb-2">Newer Image</label>
                <div
                  className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-green-500 transition-colors relative"
                  onClick={handleContainerClick}
                >
                  {afterImage ? (
                    <div className="relative">
                      <img
                        src={afterImage.preview}
                        alt="After"
                        className="mx-auto max-h-48 object-contain"
                      />
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation()
                          if (afterImage?.preview) {
                            URL.revokeObjectURL(afterImage.preview)
                          }
                          setAfterImage(null)
                        }}
                        className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1 transform translate-x-1/2 -translate-y-1/2"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </button>
                      <p className="mt-2 text-sm text-gray-500">{afterImage.file.name}</p>
                    </div>
                  ) : (
                    <div className="py-8">
                      <Upload className="mx-auto h-12 w-12 text-gray-400" />
                      <p className="mt-2 text-sm text-gray-500">Click or drag file to upload</p>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleAfterImageChange}
                        onClick={e => e.stopPropagation()}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-gray-700 font-semibold mb-2">
                  Before Image Year
                  <span className="text-red-500 ml-1">*</span>
                </label>
                <div className="relative">
                  <input
                    type="number"
                    value={before_image_year || ''}
                    onChange={(e) => set_before_image_year(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                    placeholder="Enter year (e.g., 2010)"
                    min="1900"
                    max={currentYear}
                    required
                  />
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                    <span className="text-gray-500">YYYY</span>
                  </div>
                </div>
                <p className="mt-1 text-sm text-gray-500">Year the older image was taken</p>
              </div>

              <div>
                <label className="block text-gray-700 font-semibold mb-2">
                  After Image Year
                  <span className="text-red-500 ml-1">*</span>
                </label>
                <div className="relative">
                  <input
                    type="number"
                    value={after_image_year || ''}
                    onChange={(e) => set_after_image_year(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                    placeholder="Enter year (e.g., 2023)"
                    min="1900"
                    max={currentYear}
                    required
                  />
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                    <span className="text-gray-500">YYYY</span>
                  </div>
                </div>
                <p className="mt-1 text-sm text-gray-500">Year the newer image was taken</p>
              </div>
            </div>

            {error && (
              <div className="mb-6 p-4 bg-red-50 text-red-700 rounded-md flex items-start">
                <AlertCircle className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <div className="flex justify-center">
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-3 bg-green-600 text-white font-medium rounded-md cursor-pointer hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50 flex items-center justify-center min-w-[200px]"
              >
                {loading ? (
                  <LoadingSpinner size="small" message="Analyzing..." />
                ) : (
                  <>
                    <Upload className="mr-2 h-5 w-5" />
                    Submit for Analysis
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      ) : (
        <div className="">
          <div className="flex justify-end mb-4 ">
            <button
              onClick={resetForm}
              className="px-4 py-2 bg-gray-200 text-gray-700  cursor-pointer rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400 transition-colors"
            >
              &larr; Analyze New Images
            </button>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <AnalysisResult selectedAnalysis={result} />
          </div>
        </div>
      )}
    </div>
  )
}

export default UploadPage