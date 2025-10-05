import React, { useEffect, useState } from "react";
import API from "../api";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";

const Candidates = () => {
  const [resumes, setResumes] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const res = await API.get("/candidates");
        setResumes(res.data.resumes || []);
      } catch (err) {
        console.error(err);
        toast.error(err.response?.data?.error || "Failed to fetch candidates");
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, []);

  return (
    <div className="relative min-h-screen overflow-hidden" style={{ background: "#f3f4f6", color: "#111827" }}>
      <div className="blob blob-1"></div>
      <div className="blob blob-2"></div>
      <div className="blob blob-3"></div>

      <div className="relative z-10 max-w-6xl mx-auto px-6 py-10">
        <h2 className="text-4xl font-extrabold mb-3" style={{ color: "#1e3a8a" }}>Candidates</h2>
        <p className="mb-6" style={{ color: "#6b7280" }}>All uploaded resumes</p>

        {loading ? (
          <div>Loading...</div>
        ) : resumes.length === 0 ? (
          <div className="text-sm" style={{ color: "#6b7280" }}>No candidates yet. Upload resumes to see them here.</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {resumes.map((r) => (
              <div
                key={r._id}
                onClick={() => navigate(`/candidates/${r._id}`)}
                className="p-5 rounded-xl bg-white shadow border cursor-pointer hover:shadow-lg transition"
                style={{ borderColor: "#e5e7eb" }}
              >
                <div className="font-semibold truncate" title={r.name} style={{ color: "#111827" }}>{r.name}</div>
                <div className="text-sm mt-1 truncate" style={{ color: "#6b7280" }}>Skills: {Array.isArray(r.skills) ? r.skills.slice(0, 6).join(", ") : ""}</div>
                <div className="text-xs mt-2" style={{ color: "#6b7280" }}>{new Date(r.createdAt).toLocaleString()}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Candidates;
