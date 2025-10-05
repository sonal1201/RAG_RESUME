import React from "react";
import { Routes, Route } from "react-router-dom";


import Upload from "./pages/Upload.jsx";
import Search from "./pages/Search.jsx";
import Jobs from "./pages/Jobs.jsx";
import Candidate from "./pages/Candidate.jsx";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import Landing from "./pages/Landing.jsx";
import Layout from "./pages/Layout.jsx";
import Home from "./pages/Home.jsx";
import Candidates from "./pages/Candidates.jsx";

function App() {
  return (
    
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/home" element={<ProtectedRoute><Layout><Home /></Layout></ProtectedRoute>} />
        <Route path="/upload" element={<ProtectedRoute><Layout><Upload /></Layout></ProtectedRoute>} />
        <Route path="/search" element={<ProtectedRoute><Layout><Search /></Layout></ProtectedRoute>} />
        <Route path="/jobs" element={<ProtectedRoute><Layout><Jobs /></Layout></ProtectedRoute>} />
        <Route path="/candidates" element={<ProtectedRoute><Layout><Candidates /></Layout></ProtectedRoute>} />
        <Route path="/candidates/:id" element={<ProtectedRoute><Layout><Candidate /></Layout></ProtectedRoute>} />
      </Routes>
   
  );
}

export default App;
