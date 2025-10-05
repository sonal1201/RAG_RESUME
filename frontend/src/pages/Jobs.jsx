import React, { useState } from "react";
import API from "../api";
import { toast } from "react-hot-toast";

const Jobs = () => {
  const [jobDescription, setJobDescription] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleMatch = async () => {
    if (!jobDescription.trim()) return toast.error("Enter a job description");

    try {
      setLoading(true);
      const res = await API.post("/jobs", { jobDescription });
      setResults(res.data.results);
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.error || "Job matching failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden" style={{ background: "#f3f4f6", color: "#111827" }}>
      <div className="blob blob-1"></div>
      <div className="blob blob-2"></div>
      <div className="blob blob-3"></div>

      <div className="relative z-10 max-w-6xl mx-auto px-6 py-10">
        <h2 className="text-4xl font-extrabold mb-3" style={{ color: "#1e3a8a" }}>Job Matching</h2>
        <p className="mb-6" style={{ color: "#6b7280" }}>Paste a job description to find the best matching candidates.</p>

        <textarea
          rows={8}
          value={jobDescription}
          onChange={(e) => setJobDescription(e.target.value)}
          placeholder="Paste job description here..."
          className="w-full p-4 rounded-lg border focus:outline-none focus:ring-2"
          style={{ borderColor: "#e5e7eb" }}
        ></textarea>

        <div className="mt-4">
          <button
            onClick={handleMatch}
            className="px-6 py-3 rounded-md text-white disabled:opacity-60"
            style={{ background: "linear-gradient(90deg,#2563eb,#1e3a8a)" }}
            disabled={loading}
          >
            {loading ? "Finding Matches..." : "Find Matches"}
          </button>
        </div>

        {results.length > 0 && (
          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4">
            {results.map(({ candidate, score, reasoning }, idx) => (
              <div key={candidate._id || idx} className="p-5 rounded-xl bg-white shadow border hover:shadow-lg transition" style={{ borderColor: "#e5e7eb" }}>
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <h3 className="text-xl font-semibold truncate" title={candidate.email} style={{ color: "#111827" }}>
                      {candidate.email}
                    </h3>
                    <p className="text-sm mt-1" style={{ color: "#6b7280" }}>
                      Skills: {Array.isArray(candidate.skills) ? candidate.skills.join(", ") : ""}
                    </p>
                    <p className="text-sm mt-2" style={{ color: "#374151" }}>
                      Reasoning: {reasoning || "Relevant skills/experience match the job description."}
                    </p>
                  </div>
                  <div className="flex-shrink-0 text-right">
                    <div className="text-sm" style={{ color: "#6b7280" }}>Match</div>
                    <div className="text-lg font-semibold" style={{ color: "#1f2937" }}>{score}%</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {!loading && results.length === 0 && (
          <div className="mt-10 text-center text-sm" style={{ color: "#6b7280" }}>
            Paste a job description and click Find Matches.
          </div>
        )}
      </div>
    </div>
  );
};

export default Jobs;
