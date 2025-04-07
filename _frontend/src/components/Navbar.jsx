"use client"

import { useState } from "react"
import { Link, useLocation } from "react-router-dom"
import { Menu, X, Satellite } from "lucide-react"
import { SignedIn, SignedOut, SignInButton, UserButton, useUser } from "@clerk/clerk-react";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const location = useLocation()
  const { user } = useUser();

  console.log(user);

  const navigation = [
    { name: "Home", href: "/" },
    { name: "Upload Images", href: "/upload" },
    { name: "Predefined Regions", href: "/predefined-regions" },
    { name: "History", href: "/history" },
    { name: "About", href: "/about" },
  ]

  const isActive = (path) => location.pathname === path

  return (
    <nav className="bg-green-700 text-white shadow-md">

      <div className="container mx-auto px-4">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <Satellite className="h-8 w-8" />
              <span className="text-xl font-bold">SatelliteVision</span>
            </Link>
          </div>

          {/* Desktop menu */}
          <div className="hidden md:flex items-center space-x-4">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={`px-3 py-2 rounded-md text-sm font-medium ${isActive(item.href) ? "bg-green-800 text-white" : "text-white hover:bg-green-600"
                  }`}
              >
                {item.name}
              </Link>
            ))}
            <div className="flex items-center ">
              <SignedOut>
                <SignInButton className="bg-white text-green-700 hover:bg-green-100 px-4 py-2 rounded-md text-sm font-medium transition-colors" />
              </SignedOut>
              <SignedIn>
                <UserButton />
              </SignedIn>
            </div>
          </div>


          {/* Mobile menu button */}
          <div className="flex md:hidden items-center">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-white hover:bg-green-600 focus:outline-none"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <div className="flex items-center absolute right-0 mr-4">
              <SignedOut>
                <SignInButton className="bg-white text-green-700 hover:bg-green-100 px-4 py-2 rounded-md text-sm font-medium transition-colors" />
              </SignedOut>
              <SignedIn>
                <UserButton />
              </SignedIn>
            </div>
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={`block px-3 py-2 rounded-md text-base font-medium ${isActive(item.href) ? "bg-green-800 text-white" : "text-white hover:bg-green-600"
                  }`}
                onClick={() => setIsMenuOpen(false)}
              >
                {item.name}
              </Link>
            ))}

          </div>
        </div>
      )}
    </nav>
  )
}

export default Navbar

