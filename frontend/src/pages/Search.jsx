import React, { useState } from "react";
import API from "../api";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";

const Search = () => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSearch = async () => {
    if (!query.trim()) return toast.error("Enter a search query");

    try {
      setLoading(true);
      const res = await API.post("/search", { query });
      setResults(res.data.results);
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.error || "Search failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Search Candidates</h2>

      <div className="flex mb-4 gap-2">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search candidates by skills/experience"
          className="border p-2 flex-1 rounded"
        />
        <button
          onClick={handleSearch}
          className="bg-blue-500 text-white px-4 py-2 rounded"
          disabled={loading}
        >
          {loading ? "Searching..." : "Search"}
        </button>
      </div>

      {results.length > 0 && (
        <div className="space-y-4">
          {results.map(({ resume, score, snippet }) => (
            <div
              key={resume._id}
              onClick={() => navigate(`/candidates/${resume._id}`)}
              className="border p-4 rounded cursor-pointer hover:shadow"
            >
              <h3 className="text-xl font-semibold">{resume.name}</h3>
              <p className="text-sm text-gray-500">Skills: {resume.skills.join(", ")}</p>
              <p className="text-sm text-gray-700 mt-1">
                Snippet: {snippet || "No relevant snippet"}
              </p>
              <p className="text-sm text-gray-500 mt-1">Score: {score.toFixed(2)}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Search;
