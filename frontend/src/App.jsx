import React from "react";
import { Routes, Route, Link, useNavigate } from "react-router-dom";

import Upload from "./pages/Upload.jsx";
import Search from "./pages/Search.jsx";
import Jobs from "./pages/Jobs.jsx";
import Candidate from "./pages/Candidate.jsx";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import LogoutButton from "./components/LogoutButton.jsx";

const Layout = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col" style={{ background: "#f3f4f6", color: "#111827", fontFamily: "Inter, sans-serif" }}>
      <nav className="px-4 py-3" style={{ background: "#1e3a8a", color: "white" }}>
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <Link to="/" className="font-semibold">AI Resume Matcher</Link>
          <div className="flex items-center gap-4">
            <Link to="/">Home</Link>
            <Link to="/upload">Upload</Link>
            <Link to="/search">Search</Link>
            <Link to="/jobs">Jobs</Link>
            <LogoutButton />
          </div>
        </div>
      </nav>
      <main className="flex-1">
        {children}
      </main>
      <footer className="px-4 py-6" style={{ background: "#f3f4f6" }}>
        <div className="max-w-5xl mx-auto text-sm text-gray-600">© 2025 AI Resume Matcher. All rights reserved.</div>
      </footer>
    </div>
  );
};

const Home = () => {
  const navigate = useNavigate();
  return (
    <div className="max-w-5xl mx-auto p-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
        <div>
          <h1 className="text-4xl font-bold mb-3" style={{ color: "#1e3a8a" }}>AI Resume Matcher</h1>
          <p className="text-gray-700 mb-5">Upload resumes, search candidates, match jobs, and get insights with AI</p>
          <button onClick={() => navigate("/register")} className="px-5 py-2 rounded text-white" style={{ background: "#2563eb" }}>Get Started</button>
        </div>
        <img alt="hero" className="w-full rounded" src="https://example.com/hero-image.png" />
      </div>
      <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[{title:"Upload Resumes", description:"Easily upload multiple resumes in PDF/DOCX format."},{title:"Search Candidates", description:"Search candidates by skills, experience, or keywords."},{title:"Job Matching", description:"Find the best candidates for any job description."},{title:"Candidate Profiles", description:"View detailed candidate info and download resumes."}].map((f) => (
          <div key={f.title} className="bg-white p-4 rounded shadow">
            <div className="font-semibold mb-1">{f.title}</div>
            <div className="text-sm text-gray-600">{f.description}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/upload"
          element={
            <ProtectedRoute>
              <Upload />
            </ProtectedRoute>
          }
        />
        <Route
          path="/search"
          element={
            <ProtectedRoute>
              <Search />
            </ProtectedRoute>
          }
        />
        <Route
          path="/jobs"
          element={
            <ProtectedRoute>
              <Jobs />
            </ProtectedRoute>
          }
        />
        <Route
          path="/candidates/:id"
          element={
            <ProtectedRoute>
              <Candidate />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Layout>
  );
}

export default App;
