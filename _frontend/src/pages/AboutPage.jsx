import { Github, Linkedin, Mail, Globe, Users, Database } from "lucide-react"

const AboutPage = () => {
  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">About SatelliteVision</h1>

      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Project Overview</h2>
        <p className="text-gray-600 mb-4">
          SatelliteVision is a powerful platform for analyzing satellite imagery to detect and visualize changes in land
          use over time. Our advanced AI model can identify urbanization, deforestation, water body changes, and other
          land transformations with high accuracy.
        </p>
        <p className="text-gray-600 mb-4">
          This tool is designed for researchers, environmental scientists, urban planners, and anyone interested in
          monitoring and understanding how our planet's surface is changing.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
          <div className="flex flex-col items-center text-center">
            <Globe className="h-12 w-12 text-green-600 mb-4" />
            <h3 className="text-lg font-semibold mb-2">Global Coverage</h3>
            <p className="text-gray-600">
              Analyze satellite imagery from anywhere on Earth with our comprehensive database.
            </p>
          </div>

          <div className="flex flex-col items-center text-center">
            <Database className="h-12 w-12 text-green-600 mb-4" />
            <h3 className="text-lg font-semibold mb-2">Advanced AI</h3>
            <p className="text-gray-600">
              Powered by state-of-the-art deep learning models trained on extensive satellite data.
            </p>
          </div>

          <div className="flex flex-col items-center text-center">
            <Users className="h-12 w-12 text-green-600 mb-4" />
            <h3 className="text-lg font-semibold mb-2">User-Friendly</h3>
            <p className="text-gray-600">
              Intuitive interface designed for both experts and newcomers to satellite analysis.
            </p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Technology Stack</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h3 className="text-lg font-semibold mb-3">Frontend</h3>
            <ul className="space-y-2 text-gray-600">
              <li className="flex items-center">
                <span className="w-3 h-3 bg-green-500 rounded-full mr-2"></span>
                ReactJS with Vite
              </li>
              <li className="flex items-center">
                <span className="w-3 h-3 bg-green-500 rounded-full mr-2"></span>
                TailwindCSS for styling
              </li>
              <li className="flex items-center">
                <span className="w-3 h-3 bg-green-500 rounded-full mr-2"></span>
                React Router for navigation
              </li>
              <li className="flex items-center">
                <span className="w-3 h-3 bg-green-500 rounded-full mr-2"></span>
                Axios for API requests
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-3">Backend</h3>
            <ul className="space-y-2 text-gray-600">
              <li className="flex items-center">
                <span className="w-3 h-3 bg-green-500 rounded-full mr-2"></span>
                FastAPI (Python)
              </li>
              <li className="flex items-center">
                <span className="w-3 h-3 bg-green-500 rounded-full mr-2"></span>
                MongoDB for data storage
              </li>
              <li className="flex items-center">
                <span className="w-3 h-3 bg-green-500 rounded-full mr-2"></span>
                Cloudinary for image storage
              </li>
              <li className="flex items-center">
                <span className="w-3 h-3 bg-green-500 rounded-full mr-2"></span>
                Custom AI model for change detection
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Meet the Team</h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="w-24 h-24 bg-gray-200 rounded-full mx-auto mb-4 flex items-center justify-center">
              <Users className="h-12 w-12 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold">John Doe</h3>
            <p className="text-gray-600 mb-2">Lead Developer</p>
            <div className="flex justify-center space-x-2">
              <a href="#" className="text-gray-500 hover:text-gray-700">
                <Github className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-500 hover:text-gray-700">
                <Linkedin className="h-5 w-5" />
              </a>
            </div>
          </div>

          <div className="text-center">
            <div className="w-24 h-24 bg-gray-200 rounded-full mx-auto mb-4 flex items-center justify-center">
              <Users className="h-12 w-12 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold">Jane Smith</h3>
            <p className="text-gray-600 mb-2">AI Researcher</p>
            <div className="flex justify-center space-x-2">
              <a href="#" className="text-gray-500 hover:text-gray-700">
                <Github className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-500 hover:text-gray-700">
                <Linkedin className="h-5 w-5" />
              </a>
            </div>
          </div>

          <div className="text-center">
            <div className="w-24 h-24 bg-gray-200 rounded-full mx-auto mb-4 flex items-center justify-center">
              <Users className="h-12 w-12 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold">Alex Johnson</h3>
            <p className="text-gray-600 mb-2">GIS Specialist</p>
            <div className="flex justify-center space-x-2">
              <a href="#" className="text-gray-500 hover:text-gray-700">
                <Github className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-500 hover:text-gray-700">
                <Linkedin className="h-5 w-5" />
              </a>
            </div>
          </div>
        </div>

        <div className="mt-8 text-center">
          <h3 className="text-lg font-semibold mb-2">Contact Us</h3>
          <p className="text-gray-600 mb-4">Have questions or suggestions? We'd love to hear from you!</p>
          <a href="mailto:contact@satellitevision.com" className="btn-primary inline-flex items-center">
            <Mail className="mr-2 h-5 w-5" />
            Email Us
          </a>
        </div>
      </div>
    </div>
  )
}

export default AboutPage

