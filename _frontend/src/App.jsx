import { Routes, Route } from "react-router-dom"
import Navbar from "./components/Navbar"
import Footer from "./components/Footer"
import HomePage from "./pages/HomePage"
import UploadPage from "./pages/UploadPage"
import PredefinedRegionPage from "./pages/PredefinedRegionPage"
import HistoryPage from "./pages/HistoryPage"
import AboutPage from "./pages/AboutPage"
import { ClerkProvider, SignedIn, SignedOut } from '@clerk/clerk-react';
import DoLoginPage from "./pages/DoLoginPage"

// Import your Publishable Key
const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY
if (!PUBLISHABLE_KEY) {
  throw new Error("Missing Publishable Key")
}



function App() {
  
  return (
    <ClerkProvider publishableKey={PUBLISHABLE_KEY} afterSignOutUrl="/">

        <div className="flex flex-col min-h-screen">
          <Navbar />
          <main className="flex-grow container mx-auto px-4 py-8">
            <Routes>
              <Route path="/" element={<HomePage />} />

              <Route path="/upload" element={<>
                <SignedOut>
                  <DoLoginPage />
                </SignedOut>
                <SignedIn>
                  <UploadPage />
                </SignedIn>
              </>} />

              <Route path="/predefined-regions" element={<>
                <SignedOut>
                  <DoLoginPage />
                </SignedOut>
                <SignedIn>
                  <PredefinedRegionPage />
                </SignedIn>
              </>} />

              <Route path="/history" element={<>
                <SignedOut>
                  <DoLoginPage />
                </SignedOut>
                <SignedIn>
                  <HistoryPage />
                </SignedIn>
              </>} />
              <Route path="/about" element={<AboutPage />} />
            </Routes>
          </main>
          <Footer />
        </div>

    </ClerkProvider>
  )
}

export default App

