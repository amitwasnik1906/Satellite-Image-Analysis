"use client"

import { useState, useEffect } from "react"
import { Map, Calendar, AlertCircle } from "lucide-react"
import LoadingSpinner from "../components/LoadingSpinner"
import RegionCard from "../components/RegionCard"
import AnalysisResult from "../components/AnalysisResult"
import { getAvailableRegions, analyzePredefinedRegion } from "../api/index"
import { useUser } from "@clerk/clerk-react"

const PredefinedRegionPage = () => {
  const [regions, setRegions] = useState([])
  const [selectedRegion, setSelectedRegion] = useState(null)
  const [beforeYear, setBeforeYear] = useState("")
  const [afterYear, setAfterYear] = useState("")
  const [loading, setLoading] = useState(false)
  const [fetchingRegions, setFetchingRegions] = useState(true)
  const [error, setError] = useState(null)
  const [result, setResult] = useState(null)
  const { user } = useUser();

  // Available years for demonstration
  const availableYears = ["2011","2012","2013", "2014","2015", "2016","2017", "2018", "2018","2019", "2020", "2021", "2022","2023","2024", "2025"]

  useEffect(() => {
    const fetchRegions = async () => {
      try {
        const available_regions_from_api = await getAvailableRegions()
        setRegions(available_regions_from_api)

      } catch (err) {
        setError("Failed to fetch available regions")
        console.error(err)
      } finally {
        setFetchingRegions(false)
      }
    }

    fetchRegions()
  }, [])

  const handleRegionSelect = (region) => {
    setSelectedRegion(region)
    setResult(null)
    setError(null)
    // Reset years when changing region
    setBeforeYear("")
    setAfterYear("")
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!selectedRegion || !beforeYear || !afterYear) {
      setError("Please select a region and both years")
      return
    }

    if (beforeYear >= afterYear) {
      setError("Before year must be earlier than after year")
      return
    }

    setLoading(true)
    setError(null)

    try {
      console.log("clicked");

      const data = await analyzePredefinedRegion({
        _id: selectedRegion._id,
        folder: selectedRegion.folder,
        before_image_year: parseInt(beforeYear),
        after_image_year: parseInt(afterYear)
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

  const resetSelection = () => {
    setSelectedRegion(null)
    setBeforeYear("")
    setAfterYear("")
    setResult(null)
    setError(null)
  }

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Predefined Regions</h1>

      {fetchingRegions ? (
        <div className="flex justify-center py-12">
          <LoadingSpinner message="Loading available regions..." />
        </div>
      ) : error && !selectedRegion ? (
        <div className="p-4 bg-red-50 text-red-700 rounded-md flex items-start">
          <AlertCircle className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" />
          <span>{error}</span>
        </div>
      ) : !selectedRegion ? (
        <>
          <p className="text-gray-600 mb-6">
            Select a predefined region to analyze satellite imagery and detect changes over time.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
            {regions.map((region) => (
              <RegionCard key={region._id} region={region} onClick={handleRegionSelect} />
            ))}
          </div>
        </>
      ) : loading ? (
        <div className="flex flex-col items-center py-12">
          <LoadingSpinner message="Analyzing region..." />

          <div className="mt-6 p-4 bg-gray-50 rounded-lg border border-gray-200 shadow-sm text-center">
            <p className="text-gray-700 font-medium">This analysis takes a while, please do not refresh the page.</p>
            <p className="mt-3 text-sm text-gray-500 italic">
              Don't worry! Even if you refresh, you can find your analysis results in the History section.
            </p>
          </div>
        </div>
      ) : !result ? (
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-800">{selectedRegion.name}</h2>
            <button type="button" onClick={resetSelection} className=" cursor-pointer text-gray-500 hover:text-gray-700">
              &larr; Back to all regions
            </button>
          </div>

          <div className="mb-6">
            <img
              src={selectedRegion.sample_url || "/placeholder.svg"}
              alt={selectedRegion.name}
              className="w-full object-cover rounded-lg"
            />
          </div>

          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-gray-700 font-semibold mb-2">Select Old Image Year</label>
                <div className="relative">
                  <select
                    value={beforeYear}
                    onChange={(e) => setBeforeYear(e.target.value)}
                    className="input-field pl-10"
                  >
                    <option value="">Select Year</option>
                    {availableYears.map((year) => (
                      <option key={`before-${year}`} value={year}>
                        {year}
                      </option>
                    ))}
                  </select>
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                </div>
              </div>

              <div>
                <label className="block text-gray-700 font-semibold mb-2">Select Recent Image Year</label>
                <div className="relative">
                  <select
                    value={afterYear}
                    onChange={(e) => setAfterYear(e.target.value)}
                    className="input-field pl-10"
                  >
                    <option value="">Select Year</option>
                    {availableYears.map((year) => (
                      <option key={`after-${year}`} value={year}>
                        {year}
                      </option>
                    ))}
                  </select>
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                </div>
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
                className="btn-primary flex items-center justify-center min-w-[200px] bg-blue-500 text-white font-semibold py-2 px-4 rounded shadow hover:bg-blue-600 transition duration-200 cursor-pointer"
              >
                <Map className="mr-2 h-5 w-5" />
                Analyze Region
              </button>
            </div>
          </form>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-md p-6">
          <AnalysisResult selectedAnalysis={result} />
        </div>
      )}
    </div>
  )
}

export default PredefinedRegionPage
