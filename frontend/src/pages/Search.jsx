import React, { useState } from "react";
import API from "../api";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";

const Search = () => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const navigate = useNavigate();

  const handleSearch = async () => {
    if (!query.trim()) return toast.error("Enter a search query");

    try {
      setLoading(true);
      setSearched(true);
      const res = await API.post("/search", { query });
      setResults(res.data.results || []);
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.error || "Search failed");
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
        <h2 className="text-4xl font-extrabold mb-3" style={{ color: "#1e3a8a" }}>Search Candidates</h2>
        <p className="mb-6" style={{ color: "#6b7280" }}>Find candidates by skills, experience, or keywords.</p>

        <div className="flex flex-col md:flex-row gap-3 mb-6">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="e.g., React, Node, Python, Data Analyst"
            className="flex-1 p-3 rounded-lg border focus:outline-none focus:ring-2"
            style={{ borderColor: "#e5e7eb" }}
          />
          <button
            onClick={handleSearch}
            className="px-5 py-3 rounded-md text-white disabled:opacity-60"
            style={{ background: "linear-gradient(90deg,#2563eb,#1e3a8a)" }}
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
                className="p-5 rounded-xl bg-white shadow border cursor-pointer hover:shadow-lg transition"
                style={{ borderColor: "#e5e7eb" }}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <h3 className="text-xl font-semibold truncate" title={resume.name} style={{ color: "#111827" }}>
                      {resume.name}
                    </h3>
                    <p className="text-sm mt-1" style={{ color: "#6b7280" }}>
                      Skills: {Array.isArray(resume.skills) ? resume.skills.join(", ") : ""}
                    </p>
                    <p className="text-sm mt-2" style={{ color: "#374151" }}>
                      Snippet: {snippet || "No relevant snippet"}
                    </p>
                  </div>
                  <div className="flex-shrink-0 text-right">
                    <div className="text-sm" style={{ color: "#6b7280" }}>Score</div>
                    <div className="text-lg font-semibold" style={{ color: "#1f2937" }}>{Number(score).toFixed(2)}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {!loading && searched && results.length === 0 && (
          <div className="mt-10 text-center text-sm" style={{ color: "#6b7280" }}>
            No candidates found with the skills
          </div>
        )}

        {!loading && !searched && (
          <div className="mt-10 text-center text-sm" style={{ color: "#6b7280" }}>
            Try searching for technologies, roles, or keywords.
          </div>
        )}
      </div>
    </div>
  );
};

export default Search;
