import React, { useState } from "react";
import { Link } from "react-router-dom";
import LogoutButton from "../components/LogoutButton.jsx";
import Logo from "../components/Logo.jsx";

const Layout = ({ children }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);


  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <div className="min-h-screen top-3 flex flex-col" style={{ background: "#f3f4f6", color: "#111827", fontFamily: "Inter, sans-serif" }}>
      <header className="sticky top-0 z-50 w-full" style={{ background: "#ffffff", backdropFilter: "blur(8px)", WebkitBackdropFilter: "blur(8px)", borderBottom: "1px solid #e5e7eb" }}>
        <nav className="max-w-7xl mx-auto px-6 py-3">
          <div className="flex items-center justify-between rounded-2xl px-6 py-3 shadow" style={{ background: "#ffffff", border: "1px solid #e5e7eb" }}>
            <Link to="/home" className="flex items-center gap-2 font-semibold">
              <Logo size={30}/>
              <span className="text-2xl" style={{ background: "linear-gradient(90deg,#2563eb,#1e3a8a)", WebkitBackgroundClip: "text", color: "transparent" }}>MatchCV</span>
            </Link>
            
            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-4 text-sm">
              <Link to="/home" className="px-3 py-2 rounded hover:bg-gray-100" style={{ color: "#111827" }}>Home</Link>
              <Link to="/upload" className="px-3 py-2 rounded hover:bg-gray-100" style={{ color: "#111827" }}>Upload</Link>
              <Link to="/search" className="px-3 py-2 rounded hover:bg-gray-100" style={{ color: "#111827" }}>Search</Link>
              <Link to="/jobs" className="px-3 py-2 rounded hover:bg-gray-100" style={{ color: "#111827" }}>Jobs</Link>
              <Link to="/candidates" className="px-3 py-2 rounded hover:bg-gray-100" style={{ color: "#111827" }}>Candidates</Link>
              <div className="ml-2">
                <LogoutButton />
              </div>
            </div>

            {/* Mobile Hamburger Button */}
            <div className="md:hidden flex items-center gap-2">
              <button
                onClick={toggleMenu}
                className="p-2 rounded-lg hover:bg-gray-100"
                style={{ color: "#111827" }}
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  {isMenuOpen ? (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  )}
                </svg>
              </button>
            </div>
          </div>

          {/* Mobile Navigation Menu */}
          {isMenuOpen && (
            <div className="md:hidden mt-2 backdrop-blur-sm rounded-2xl shadow" style={{ background: "#ffffff", border: "1px solid #e5e7eb" }}>
              <div className="px-6 py-4 space-y-2">
                <Link 
                  to="/home" 
                  className="block px-3 py-2 rounded hover:bg-gray-100" 
                  style={{ color: "#111827" }}
                  onClick={() => setIsMenuOpen(false)}
                >
                  Home
                </Link>
                <Link 
                  to="/upload" 
                  className="block px-3 py-2 rounded hover:bg-gray-100" 
                  style={{ color: "#111827" }}
                  onClick={() => setIsMenuOpen(false)}
                >
                  Upload
                </Link>
                <Link 
                  to="/search" 
                  className="block px-3 py-2 rounded hover:bg-gray-100" 
                  style={{ color: "#111827" }}
                  onClick={() => setIsMenuOpen(false)}
                >
                  Search
                </Link>
                <Link 
                  to="/jobs" 
                  className="block px-3 py-2 rounded hover:bg-gray-100" 
                  style={{ color: "#111827" }}
                  onClick={() => setIsMenuOpen(false)}
                >
                  Jobs
                </Link>
                <Link 
                  to="/candidates" 
                  className="block px-3 py-2 rounded hover:bg-gray-100" 
                  style={{ color: "#111827" }}
                  onClick={() => setIsMenuOpen(false)}
                >
                  Candidates
                </Link>
                <div className="pt-2 border-t" style={{ borderColor: "#e5e7eb" }}>
                  <LogoutButton />
                </div>
              </div>
            </div>
          )}
        </nav>
      </header>
      <main className="flex-1">
        {children}
      </main>
      <footer className="px-4 py-6" style={{ background: "#f3f4f6" }}>
        <div className="max-w-7xl mx-auto text-sm" style={{ color: "#6b7280" }}>© 2025 MatchCV. All rights reserved.</div>
      </footer>
    </div>
  );
};

export default Layout;
