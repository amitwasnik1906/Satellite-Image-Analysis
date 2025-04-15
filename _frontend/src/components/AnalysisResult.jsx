// src/components/AnalysisResult.jsx
import { CheckCircle, Printer } from 'lucide-react'
import { useRef } from 'react'
import { useReactToPrint } from 'react-to-print'

const AnalysisResult = ({ selectedAnalysis }) => {
  const { analysis, before_image_year, after_image_year, cloud_vis_url, cloud_change_map_url } = selectedAnalysis || {};  
  
  // Create a reference to the printable content
  const printRef = useRef(null);
  
  // Set up the print handler with the correct contentRef option
  const handlePrint = useReactToPrint({
    // This is where the fix is - proper usage of contentRef
    contentRef: printRef,
    documentTitle: `Environmental Analysis ${before_image_year}-${after_image_year}`,
  });
  
  return (
    <div>
      <div className="bg-white rounded-lg overflow-hidden">
        <div className="">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <CheckCircle className="h-6 w-6 text-green-500 mr-2" />
              <h3 className="text-xl font-semibold text-gray-800">Analysis Results</h3>
            </div>
            
            {/* Print button */}
            <button 
              onClick={handlePrint}
              className="flex items-center px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors cursor-pointer"
            >
              <Printer className="h-4 w-4 mr-2" />
              <span>Print/Save PDF</span>
            </button>
          </div>
          
          {/* Wrap the content to be printed in a div with the ref */}
          <div ref={printRef}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <h4 className="text-lg font-medium text-gray-700 mb-3">Change Percentages</h4>
                {analysis?.critical_changes && (
                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm font-medium text-gray-700">Urbanization</span>
                        <span className="text-sm font-medium text-gray-700">
                          {analysis.critical_changes.urbanization?.toFixed(2) || 0}%
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2.5">
                        <div 
                          className="bg-blue-600 h-2.5 rounded-full" 
                          style={{ width: `${Math.min(100, Math.max(0, analysis.critical_changes.urbanization || 0))}%` }}
                        ></div>
                      </div>
                    </div>
                    
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm font-medium text-gray-700">Deforestation</span>
                        <span className="text-sm font-medium text-gray-700">
                          {analysis.critical_changes.deforestation?.toFixed(2) || 0}%
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2.5">
                        <div 
                          className="bg-red-600 h-2.5 rounded-full" 
                          style={{ width: `${Math.min(100, Math.max(0, analysis.critical_changes.deforestation || 0))}%` }}
                        ></div>
                      </div>
                    </div>
                    
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm font-medium text-gray-700">Water Changes</span>
                        <span className="text-sm font-medium text-gray-700">
                          {analysis.critical_changes.water_changes?.toFixed(2) || 0}%
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2.5">
                        <div 
                          className="bg-cyan-600 h-2.5 rounded-full" 
                          style={{ width: `${Math.min(100, Math.max(0, analysis.critical_changes.water_changes || 0))}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
              
              <div>
                <h4 className="text-lg font-medium text-gray-700 mb-3">Time Period</h4>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-md">
                  <div className="text-center">
                    <span className="block text-sm text-gray-500">Before</span>
                    <span className="block text-lg font-semibold">{before_image_year}</span>
                  </div>
                  <div className="text-gray-400">→</div>
                  <div className="text-center">
                    <span className="block text-sm text-gray-500">After</span>
                    <span className="block text-lg font-semibold">{after_image_year}</span>
                  </div>
                  <div className="text-center">
                    <span className="block text-sm text-gray-500">Duration</span>
                    <span className="block text-lg font-semibold">{after_image_year - before_image_year} years</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-1 gap-6 ">
              <div className='mt-3 '>
                <h4 className="text-lg font-bold text-gray-800 mb-3">Changes in Region</h4>
                {cloud_vis_url && (
                  <div className="border border-gray-300 rounded-lg overflow-hidden">
                    <img 
                      src={cloud_vis_url} 
                      alt={`Satellite image from ${before_image_year} to ${after_image_year}`} 
                      className="w-full h-auto object-cover"
                    />
                  </div>
                )}
              </div>
              
              <div className='mt-3'>
                <h4 className="text-lg font-bold text-gray-700 mb-3">Critical Environmental Changes</h4>
                {cloud_change_map_url && (
                  <div className="border border-gray-200 rounded-lg overflow-hidden">
                    <img 
                      src={cloud_change_map_url} 
                      alt={`Change map from ${before_image_year} to ${after_image_year}`} 
                      className="w-full h-auto object-cover"
                    />
                  </div>
                )}
              </div>
            </div>

            <div className="mt-8">
              <h4 className="text-lg font-medium text-gray-700 mb-3">Detailed Land Cover Changes</h4>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 border border-gray-200 rounded-lg">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Land Cover Type</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Initial (%)</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Final (%)</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Change (%)</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {analysis?.change_percentages && analysis.change_percentages.map((item, index) => (
                      <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{item.class}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.initial.toFixed(2)}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.final.toFixed(2)}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            item.change > 0 
                              ? 'bg-green-100 text-green-800' 
                              : item.change < 0 
                                ? 'bg-red-100 text-red-800' 
                                : 'bg-gray-100 text-gray-800'
                          }`}>
                            {item.change > 0 ? '+' : ''}{item.change.toFixed(2)}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AnalysisResult