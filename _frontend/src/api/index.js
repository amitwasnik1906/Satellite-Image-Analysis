import axios from "axios"

const API_URL = import.meta.env.VITE_BACKEND_DOMAIN

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

// Analysis API
export const analyzePredefinedRegion = async(analysisData, userId) => {
    try {
        const response = await api.post(`/analysis/predefined_region/${userId}`, analysisData)
        return response.data
    } catch (error) {
        console.error("Error analyzing region:", error)
        throw error
    }
}


export const analyzeUserUploadedRegion = async(analysisData, userId) => {
    try {
        const formData = new FormData();
        formData.append('before_image', analysisData.before_image);
        formData.append('after_image', analysisData.after_image);
        formData.append('before_image_year', analysisData.before_image_year);
        formData.append('after_image_year', analysisData.after_image_year);

        const response = await api.post(`/analysis/user_uploaded_region/${userId}`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
        return response.data;
    } catch (error) {
        console.error("Error analyzing custom region:", error)
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