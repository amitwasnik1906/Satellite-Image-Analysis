"use client"

import { MapPin } from "lucide-react"

const RegionCard = ({ region, onClick }) => {
  return (
    <div
      className="card overflow-hidden cursor-pointer transform transition-transform hover:scale-105 border border-gray-200 rounded-lg shadow-sm"
        onClick={() => onClick(region)}
    >
      <div className=" h-56 overflow-hidden">
        <img
          src={region.sample_url || "/placeholder.svg?height=200&width=400"}
          alt={region.name}
          className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
        />
      </div>
      <div className="p-4">
        <div className="flex items-center mb-2">
          <MapPin className="h-5 w-5 text-green-600 mr-2" />
          <h3 className="text-lg font-semibold text-gray-800">{region.name}</h3>
        </div>
        {/* {region.folder && <p className="text-gray-600">Folder: {region.folder}</p>} */}
      </div>
    </div>
  )
}

export default RegionCard

