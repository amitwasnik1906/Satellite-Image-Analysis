"use client"

import { createContext, useContext, useState, useEffect } from "react"

const AnalysisContext = createContext()

export const useAnalysis = () => {
  return useContext(AnalysisContext)
}

export const AnalysisProvider = ({ children }) => {
  const [history, setHistory] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        // In a real implementation, this would fetch from your API
        // const data = await getUserHistory('1')

        // For demo purposes, we'll use mock data
        const mockHistory = [
          {
            _id: "1",
            user_id: "1",
            input_type: "predefined_region",
            before_image_year: 2013,
            after_image_year: 2025,
            cloud_vis_url: "/placeholder.svg?height=400&width=600",
            cloud_change_map_url: "/placeholder.svg?height=400&width=600",
            analysis: {
              change_percentages: {
                urbanization: 15.2,
                deforestation: 8.7,
                water_body_change: 3.1,
              },
            },
            created_at: "2025-04-01T10:30:00.000Z",
          },
          {
            _id: "2",
            user_id: "1",
            input_type: "user_uploaded",
            before_image_year: 2018,
            after_image_year: 2023,
            cloud_vis_url: "/placeholder.svg?height=400&width=600",
            cloud_change_map_url: "/placeholder.svg?height=400&width=600",
            analysis: {
              change_percentages: {
                urbanization: 10.5,
                deforestation: 5.2,
                water_body_change: 1.8,
              },
            },
            created_at: "2025-03-28T14:15:00.000Z",
          },
        ]

        setHistory(mockHistory)
      } catch (err) {
        setError("Failed to fetch analysis history")
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    fetchHistory()
  }, [])

  const addAnalysis = (newAnalysis) => {
    setHistory((prevHistory) => [newAnalysis, ...prevHistory])
  }

  const value = {
    history,
    loading,
    error,
    addAnalysis,
  }

  return <AnalysisContext.Provider value={value}>{children}</AnalysisContext.Provider>
}

