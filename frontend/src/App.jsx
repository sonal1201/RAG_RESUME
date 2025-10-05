import React from "react";
import { Routes, Route } from "react-router-dom";

import Upload from "./pages/Upload.jsx";
import Search from "./pages/Search.jsx";
import Jobs from "./pages/Jobs.jsx";
import Candidate from "./pages/Candidate.jsx";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";

function App() {
  return (
    <Routes>
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
  );
}

export default App;
