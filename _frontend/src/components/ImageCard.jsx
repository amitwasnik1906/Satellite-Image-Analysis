const ImageCard = ({ title, imageUrl, description }) => {
    return (
      <div className="card overflow-hidden">
        <div className="h-48 overflow-hidden">
          <img
            src={imageUrl || "/placeholder.svg?height=200&width=400"}
            alt={title}
            className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
          />
        </div>
        <div className="p-4">
          <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
          {description && <p className="text-gray-600 mt-2">{description}</p>}
        </div>
      </div>
    )
  }
  
  export default ImageCard
  
  