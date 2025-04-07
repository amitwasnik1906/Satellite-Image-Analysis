import { Github } from "lucide-react"

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white py-8">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <h3 className="text-xl font-bold">SatelliteVision</h3>
            <p className="text-gray-300 mt-2">Satellite Image Analysis for Land Transformation</p>
          </div>

          <div className="flex space-x-4">
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-300 hover:text-white"
            >
              <Github className="h-6 w-6" />
            </a>
            
          </div>
        </div>

        <div className="mt-8 border-t border-gray-700 pt-4 text-center text-gray-300 text-sm">
          <p>&copy; {new Date().getFullYear()} SatelliteVision. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}

export default Footer

