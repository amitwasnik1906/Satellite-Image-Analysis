"use client"

import { useState } from "react"
import { Upload, AlertCircle } from "lucide-react"
import LoadingSpinner from "../components/LoadingSpinner"
import AnalysisResult from "../components/AnalysisResult"
import { useAnalysis } from "../context/AnalysisContext"

const UploadPage = () => {
  const { addAnalysis } = useAnalysis()
  const [beforeImage, setBeforeImage] = useState(null)
  const [afterImage, setAfterImage] = useState(null)
  const [regionName, setRegionName] = useState("")
  const [notes, setNotes] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [result, setResult] = useState(null)

  const handleBeforeImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      setBeforeImage({
        file,
        preview: URL.createObjectURL(file),
      })
    }
  }

  const handleAfterImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
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

    setLoading(true)
    setError(null)

    // In a real implementation, you would upload the images to the backend
    // For now, we'll simulate a response after a delay
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000))

      // Simulate a successful response
      const analysisResult = {
        visualization_url: beforeImage.preview, // Just for demo
        change_map_url: afterImage.preview, // Just for demo
        change_percentages: {
          urbanization: 15.2,
          deforestation: 8.7,
          water_body_change: 3.1,
        },
      }

      setResult(analysisResult)

      // Add to history
      const newAnalysisRecord = {
        _id: Date.now().toString(),
        user_id: "1",
        input_type: "user_uploaded",
        before_image_year: new Date().getFullYear() - 5, // Just for demo
        after_image_year: new Date().getFullYear(),
        cloud_vis_url: beforeImage.preview,
        cloud_change_map_url: afterImage.preview,
        analysis: {
          change_percentages: analysisResult.change_percentages,
        },
        created_at: new Date().toISOString(),
      }

      addAnalysis(newAnalysisRecord)
    } catch (err) {
      setError("An error occurred during analysis. Please try again.")
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const resetForm = () => {
    setBeforeImage(null)
    setAfterImage(null)
    setRegionName("")
    setNotes("")
    setResult(null)
    setError(null)
  }

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Upload Satellite Images</h1>

      {!result ? (
        <div className="bg-white rounded-lg shadow-md p-6">
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-gray-700 font-semibold mb-2">Before Image (Older)</label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-green-500 transition-colors">
                  {beforeImage ? (
                    <div className="relative">
                      <img
                        src={beforeImage.preview || "/placeholder.svg"}
                        alt="Before"
                        className="mx-auto max-h-48 object-contain"
                      />
                      <button
                        type="button"
                        onClick={() => setBeforeImage(null)}
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
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      />
                    </div>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-gray-700 font-semibold mb-2">After Image (Newer)</label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-green-500 transition-colors">
                  {afterImage ? (
                    <div className="relative">
                      <img
                        src={afterImage.preview || "/placeholder.svg"}
                        alt="After"
                        className="mx-auto max-h-48 object-contain"
                      />
                      <button
                        type="button"
                        onClick={() => setAfterImage(null)}
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
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="mb-6">
              <label className="block text-gray-700 font-semibold mb-2">Region Name (Optional)</label>
              <input
                type="text"
                value={regionName}
                onChange={(e) => setRegionName(e.target.value)}
                className="input-field"
                placeholder="e.g., Mumbai Suburbs, Amazon Rainforest"
              />
            </div>

            <div className="mb-6">
              <label className="block text-gray-700 font-semibold mb-2">Notes (Optional)</label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="input-field"
                rows="3"
                placeholder="Add any additional information about these images"
              ></textarea>
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
                className="btn-primary flex items-center justify-center min-w-[200px]"
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
        <AnalysisResult
          result={result}
          beforeImage={beforeImage.preview}
          afterImage={afterImage.preview}
          onReset={resetForm}
        />
      )}
    </div>
  )
}

export default UploadPage

