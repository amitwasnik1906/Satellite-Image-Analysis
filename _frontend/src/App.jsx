import { Routes, Route } from "react-router-dom"
import { AnalysisProvider } from "./context/AnalysisContext"
import Navbar from "./components/Navbar"
import Footer from "./components/Footer"
import HomePage from "./pages/HomePage"
import UploadPage from "./pages/UploadPage"
import PredefinedRegionPage from "./pages/PredefinedRegionPage"
import HistoryPage from "./pages/HistoryPage"
import AboutPage from "./pages/AboutPage"

function App() {
  return (
    <AnalysisProvider>
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-grow container mx-auto px-4 py-8">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/upload" element={<UploadPage />} />
            <Route path="/predefined-regions" element={<PredefinedRegionPage />} />
            <Route path="/history" element={<HistoryPage />} />
            <Route path="/about" element={<AboutPage />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </AnalysisProvider>
  )
}

export default App

