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
    <div className="max-w-3xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-2">{resume.name}</h2>
      <p className="text-sm text-gray-500 mb-2">Skills: {resume.skills.join(", ")}</p>
      <p className="text-sm text-gray-700 mb-2">Summary: {resume.summary}</p>
      <p className="text-sm text-gray-600 mb-4">Full Resume Text:</p>
      <pre className="bg-gray-100 p-4 rounded max-h-96 overflow-auto">{resume.rawText}</pre>

      <button
        onClick={handleDownload}
        className="mt-4 bg-blue-500 text-white px-4 py-2 rounded"
      >
        Download Resume
      </button>
    </div>
  );
};

export default Candidate;
