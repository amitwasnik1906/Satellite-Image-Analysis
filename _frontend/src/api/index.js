import axios from "axios"

const API_URL = "http://localhost:8000"

const api = axios.create({
    baseURL: API_URL,
    headers: {
        "Content-Type": "application/json",
    },
})

// Regions API
export const getAvailableRegions = async() => {
    try {
        const response = await api.get("/available-regions")
        return response.data
    } catch (error) {
        console.error("Error fetching regions:", error)
        throw error
    }
}

export const addPredefinedRegion = async(regionData) => {
    try {
        const response = await api.post("/available-regions", regionData)
        return response.data
    } catch (error) {
        console.error("Error adding region:", error)
        throw error
    }
}

// Analysis API
export const analyzePredefinedRegion = async(analysisData) => {
    try {
        const response = await api.post("/analysis/predefined_region", analysisData)
        return response.data
    } catch (error) {
        console.error("Error analyzing region:", error)
        throw error
    }
}

// History API
export const getUserHistory = async(userId) => {
    try {
        const response = await api.get(`/history/${userId}`)
        return response.data
    } catch (error) {
        console.error("Error fetching history:", error)
        throw error
    }
}

export default api