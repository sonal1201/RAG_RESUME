import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import API from "../api";
import { toast } from "react-hot-toast";

const Candidate = () => {
  const { id } = useParams();
  const [resume, setResume] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCandidate = async () => {
      try {
        const res = await API.get(`/candidates/${id}`);
        setResume(res.data.resume);
      } catch (err) {
        console.error(err);
        toast.error(err.response?.data?.error || "Failed to fetch candidate");
      } finally {
        setLoading(false);
      }
    };
    fetchCandidate();
  }, [id]);

  const handleDownload = () => {
    if (!resume) return;
    const link = document.createElement("a");
    link.href = resume.fileUrl;
    link.download = resume.fileUrl.split("/").pop();
    link.click();
  };

  if (loading) return <div className="p-4">Loading...</div>;
  if (!resume) return <div className="p-4">Candidate not found</div>;

  return (
    <div className="relative min-h-screen overflow-hidden" style={{ background: "#f3f4f6", color: "#111827" }}>
      <div className="blob blob-1"></div>
      <div className="blob blob-2"></div>
      <div className="blob blob-3"></div>

      <div className="relative z-10 max-w-4xl mx-auto px-6 py-10">
        <h2 className="text-4xl font-extrabold mb-4" style={{ color: "#1e3a8a" }}>{resume.name}</h2>
        <p className="text-sm mb-2" style={{ color: "#6b7280" }}>Skills: {resume.skills.join(", ")}</p>
        <p className="text-sm mb-4" style={{ color: "#374151" }}>Summary: {resume.summary}</p>
        <p className="text-sm mb-2" style={{ color: "#6b7280" }}>Full Resume Text:</p>
        <pre className="bg-white p-4 rounded-xl shadow border max-h-96 overflow-auto" style={{ borderColor: "#e5e7eb" }}>{resume.rawText}</pre>

        <button
          onClick={handleDownload}
          className="mt-6 px-5 py-2 rounded-md text-white"
          style={{ background: "linear-gradient(90deg,#2563eb,#1e3a8a)" }}
        >
          Download Resume
        </button>
      </div>
    </div>
  );
};

export default Candidate;
