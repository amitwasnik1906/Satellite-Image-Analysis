// src/components/AnalysisResult.jsx
import { CheckCircle } from 'lucide-react'

const AnalysisResult = ({ result, beforeImage, afterImage, beforeYear, afterYear, onReset }) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center justify-center mb-6 text-green-600">
        <CheckCircle className="h-8 w-8 mr-2" />
        <h2 className="text-2xl font-bold">Analysis Complete</h2>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div>
          <h3 className="text-lg font-semibold mb-2">Before Image {beforeYear && `(${beforeYear})`}</h3>
          <img 
            src={beforeImage || "/placeholder.svg"} 
            alt="Before" 
            className="w-full h-64 object-cover rounded-lg"
          />
        </div>
        
        <div>
          <h3 className="text-lg font-semibold mb-2">After Image {afterYear && `(${afterYear})`}</h3>
          <img 
            src={afterImage || "/placeholder.svg"} 
            alt="After" 
            className="w-full h-64 object-cover rounded-lg"
          />
        </div>
      </div>
      
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-2">Change Detection Results</h3>
        <div className="bg-gray-50 p-4 rounded-lg">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <h4 className="font-medium text-gray-700">Urbanization</h4>
              <div className="mt-2 text-2xl font-bold text-green-600">
                {result.change_percentages.urbanization}%
              </div>
            </div>
            
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <h4 className="font-medium text-gray-700">Deforestation</h4>
              <div className="mt-2 text-2xl font-bold text-green-600">
                {result.change_percentages.deforestation}%
              </div>
            </div>
            
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <h4 className="font-medium text-gray-700">Water Body Change</h4>
              <div className="mt-2 text-2xl font-bold text-green-600">
                {result.change_percentages.water_body_change}%
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-2">Change Visualization</h3>
        <img 
          src={result.change_map_url || "/placeholder.svg"} 
          alt="Change Map" 
          className="w-full h-64 object-cover rounded-lg"
        />
        <p className="mt-2 text-sm text-gray-500">
          Areas highlighted in red indicate significant changes between the two images.
        </p>
      </div>
      
      <div className="flex justify-center space-x-4">
        {onReset && (
          <button
            type="button"
            onClick={onReset}
            className="btn-secondary"
          >
            Analyze New Images
          </button>
        )}
        <button
          type="button"
          className="btn-primary"
          onClick={() => {
            // In a real app, this would download a PDF report
            alert('PDF report download would start here')
          }}
        >
          Download Report
        </button>
      </div>
    </div>
  )
}

export default AnalysisResult