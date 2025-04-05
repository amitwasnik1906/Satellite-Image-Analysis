const LoadingSpinner = ({ size = "medium", message = "Loading..." }) => {
    const sizeClasses = {
      small: "w-5 h-5",
      medium: "w-8 h-8",
      large: "w-12 h-12",
    }
  
    return (
      <div className="flex flex-col items-center justify-center">
        <div
          className={`${sizeClasses[size]} border-4 border-gray-300 border-t-green-600 rounded-full animate-spin`}
        ></div>
        {message && <p className="mt-2 text-gray-600">{message}</p>}
      </div>
    )
  }
  
  export default LoadingSpinner
  
  