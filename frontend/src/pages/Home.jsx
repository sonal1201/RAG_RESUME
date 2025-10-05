import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api";

const Home = () => {
  const navigate = useNavigate();
  const [resumes, setResumes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await API.get("/candidates");
        setResumes(res.data.resumes || []);
      } catch (e) {
        // ignore here; nav still works
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const totalResumes = resumes.length;
  const lastUpload = resumes[0]?.createdAt ? new Date(resumes[0].createdAt).toLocaleDateString() : "—";
  const startOfToday = (() => { const d = new Date(); d.setHours(0,0,0,0); return d; })();
  const resumesToday = resumes.filter(r => r.createdAt && new Date(r.createdAt) >= startOfToday).length;

  const recent = resumes.slice(0, 6);

  return (
    <div className="relative min-h-screen overflow-hidden" style={{ background: "#f3f4f6", color: "#111827" }}>
      <div className="blob blob-1"></div>
      <div className="blob blob-2"></div>
      <div className="blob blob-3"></div>

      <section className="relative z-10 max-w-6xl mx-auto px-6 pt-16 pb-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
          <div>
            <div className="inline-block px-3 py-1 rounded-full text-xs text-white mb-3" style={{ background: "#2563eb" }}>Welcome</div>
            <h1 className="text-5xl font-extrabold mb-4" style={{ color: "#1e3a8a" }}>Your Dashboard</h1>
            <p className="text-gray-700 mb-6 text-lg">Manage your uploads, search candidates, and match jobs – all in one place.</p>
            <div className="flex gap-3">
              <button onClick={() => navigate("/upload")} className="px-5 py-3 rounded text-white" style={{ background: "linear-gradient(90deg,#2563eb,#1e3a8a)" }}>Upload Resumes</button>
              <button onClick={() => navigate("/search")} className="px-5 py-3 rounded border" style={{ borderColor: "#2563eb", color: "#2563eb" }}>Search</button>
            </div>
          </div>
          <div className="relative">
            <div className="rounded-xl bg-white shadow-xl p-6">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-left">
                <div className="p-4 rounded-lg border" style={{ borderColor: "#e5e7eb" }}>
                  <div className="text-gray-500 text-sm mb-1">Resumes Parsed</div>
                  <div className="text-2xl font-bold">{loading ? "…" : totalResumes}</div>
                </div>
                <div className="p-4 rounded-lg border" style={{ borderColor: "#e5e7eb" }}>
                  <div className="text-gray-500 text-sm mb-1">Parsed Today</div>
                  <div className="text-2xl font-bold">{loading ? "…" : resumesToday}</div>
                </div>
                <div className="p-4 rounded-lg border" style={{ borderColor: "#e5e7eb" }}>
                  <div className="text-gray-500 text-sm mb-1">Last Upload</div>
                  <div className="text-lg font-semibold truncate" title={lastUpload}>{loading ? "…" : lastUpload}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Recent Candidates */}
      <section className="relative z-10 max-w-6xl mx-auto px-6 pb-6">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-xl font-semibold" style={{ color: "#111827" }}>Recent Candidates</h3>
          <button onClick={() => navigate("/candidates")} className="text-sm" style={{ color: "#2563eb" }}>View All</button>
        </div>
        {loading ? (
          <div className="text-sm" style={{ color: "#6b7280" }}>Loading…</div>
        ) : recent.length === 0 ? (
          <div className="text-sm" style={{ color: "#6b7280" }}>No candidates yet. Upload resumes to see them here.</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {recent.map((r) => (
              <div key={r._id} onClick={() => navigate(`/candidates/${r._id}`)} className="p-4 rounded-xl bg-white shadow border cursor-pointer hover:shadow-lg transition" style={{ borderColor: "#e5e7eb" }}>
                <div className="font-medium truncate" title={r.name} style={{ color: "#111827" }}>{r.name}</div>
                <div className="text-sm mt-1 truncate" style={{ color: "#6b7280" }}>Skills: {Array.isArray(r.skills) ? r.skills.slice(0, 6).join(", ") : ""}</div>
                <div className="text-xs mt-2" style={{ color: "#6b7280" }}>{new Date(r.createdAt).toLocaleDateString()}</div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Quick Actions + Features */}
      <section className="relative z-10 max-w-6xl mx-auto px-6 pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="bg-white rounded-xl shadow p-5 border" style={{ borderColor: "#e5e7eb" }}>
            <div className="text-lg font-semibold mb-3">Quick Actions</div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button onClick={() => navigate("/upload")} className="px-4 py-3 rounded text-white" style={{ background: "linear-gradient(90deg,#2563eb,#1e3a8a)" }}>Upload</button>
              <button onClick={() => navigate("/search")} className="px-4 py-3 rounded border" style={{ borderColor: "#2563eb", color: "#2563eb" }}>Search</button>
              <button onClick={() => navigate("/jobs")} className="px-4 py-3 rounded border" style={{ borderColor: "#2563eb", color: "#2563eb" }}>Match Jobs</button>
              <button onClick={() => navigate("/candidates")} className="px-4 py-3 rounded border" style={{ borderColor: "#2563eb", color: "#2563eb" }}>View Candidates</button>
            </div>
          </div>
          <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
            {[{title:"Upload Resumes", description:"Add multiple PDF/DOCX files in one go."},{title:"Search Candidates", description:"Find people by skills, experience, and keywords."},{title:"Job Matching", description:"Paste a JD to discover best-fit candidates."},{title:"Candidate Profiles", description:"Open details and download resumes quickly."}].map((f) => (
              <div key={f.title} className="feature-card bg-white p-5 rounded-xl shadow">
                <div className="text-lg font-semibold mb-2">{f.title}</div>
                <div className="text-sm text-gray-600">{f.description}</div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
