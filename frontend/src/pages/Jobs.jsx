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
    <div className="max-w-3xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Job Matching</h2>

      <textarea
        rows={6}
        value={jobDescription}
        onChange={(e) => setJobDescription(e.target.value)}
        placeholder="Paste job description here"
        className="border p-2 w-full mb-4 rounded"
      ></textarea>

      <button
        onClick={handleMatch}
        className="bg-blue-500 text-white px-4 py-2 rounded mb-4"
        disabled={loading}
      >
        {loading ? "Finding Matches..." : "Find Matches"}
      </button>

      {results.length > 0 && (
        <div className="space-y-4">
          {results.map(({ candidate, score, reasoning }) => (
            <div
              key={candidate._id}
              className="border p-4 rounded hover:shadow"
            >
              <h3 className="text-xl font-semibold">{candidate.name}</h3>
              <p className="text-sm text-gray-500">Skills: {candidate.skills.join(", ")}</p>
              <p className="text-sm text-gray-500 mt-1">Match: {score}%</p>
              <p className="text-sm text-gray-700 mt-2">Reasoning: {reasoning}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Jobs;
