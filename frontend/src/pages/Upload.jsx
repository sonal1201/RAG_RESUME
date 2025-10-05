import React, { useState, useRef } from "react";
import API from "../api";
import LogoutButton from "../components/LogoutButton.jsx";
import { toast } from "react-hot-toast";

const Upload = () => {
  const [files, setFiles] = useState([]);
  const [progress, setProgress] = useState(0);
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const inputRef = useRef(null);

  const handleFileChange = (e) => {
    const selected = Array.from(e.target.files || []);
    setFiles((prev) => [...prev, ...selected]);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const dropped = Array.from(e.dataTransfer.files || []);
    setFiles((prev) => [...prev, ...dropped]);
  };

  const removeFile = (index) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleUpload = async () => {
    if (!files || files.length === 0) {
      toast.error("Please select files to upload");
      return;
    }

    const formData = new FormData();
    files.forEach((file) => formData.append("files", file));

    try {
      setUploading(true);
      setProgress(0);

      const res = await API.post("/resume/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
        onUploadProgress: (e) => {
          if (!e.total) return;
          const percent = Math.round((e.loaded * 100) / e.total);
          setProgress(percent);
        },
      });

      toast.success("Files uploaded successfully");
      setFiles([]);
      setProgress(0);
      console.log(res.data.resumes);
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.error || "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden" style={{ background: "#f3f4f6", color: "#111827" }}>
      <div className="blob blob-1"></div>
      <div className="blob blob-2"></div>
      <div className="blob blob-3"></div>

      <div className="relative z-10 max-w-6xl mx-auto px-6 pb-14 pt-8">
        <h2 className="text-4xl font-extrabold mb-2" style={{ color: "#1e3a8a" }}>Upload Resumes</h2>
        <p className="mb-6" style={{ color: "#6b7280" }}>Drag and drop multiple PDF/DOCX files or browse to select.</p>

        <div
          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
          className="rounded-2xl border-2 border-dashed p-8 text-center bg-white/80 backdrop-blur-sm"
          style={{ borderColor: dragOver ? "#2563eb" : "#e5e7eb" }}
        >
          <div className="mb-4 text-sm" style={{ color: "#6b7280" }}>Drop files here</div>
          <button
            onClick={() => inputRef.current?.click()}
            className="px-5 py-2 rounded-md text-white"
            style={{ background: "linear-gradient(90deg,#2563eb,#1e3a8a)" }}
          >
            Browse Files
          </button>
          <input
            ref={inputRef}
            type="file"
            multiple
            accept=".pdf,.doc,.docx"
            onChange={handleFileChange}
            className="hidden"
          />
        </div>

        {files.length > 0 && (
          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {files.map((file, idx) => (
              <div key={`${file.name}-${idx}`} className="p-4 rounded-xl bg-white shadow border" style={{ borderColor: "#e5e7eb" }}>
                <div className="flex items-center justify-between">
                  <div className="truncate mr-3">
                    <div className="font-medium" title={file.name} style={{ color: "#111827" }}>{file.name}</div>
                    <div className="text-sm" style={{ color: "#6b7280" }}>{Math.round(file.size / 1024)} KB</div>
                  </div>
                  <button onClick={() => removeFile(idx)} className="px-2 py-1 rounded border" style={{ borderColor: "#e5e7eb", color: "#6b7280" }}>Remove</button>
                </div>
              </div>
            ))}
          </div>
        )}

        {uploading && (
          <div className="mt-6 w-full bg-gray-200 rounded h-3">
            <div
              className="h-3 rounded"
              style={{ width: `${progress}%`, background: "linear-gradient(90deg,#2563eb,#1e3a8a)" }}
            ></div>
          </div>
        )}

        <div className="mt-6 flex gap-3">
          <button
            onClick={handleUpload}
            className="px-6 py-3 rounded-md text-white disabled:opacity-60"
            style={{ background: "linear-gradient(90deg,#2563eb,#1e3a8a)" }}
            disabled={uploading || files.length === 0}
          >
            {uploading ? "Uploading..." : `Upload ${files.length || "Files"}`}
          </button>
          <button
            onClick={() => { setFiles([]); setProgress(0); }}
            className="px-6 py-3 rounded-md border"
            style={{ borderColor: "#e5e7eb", color: "#111827" }}
            disabled={uploading || files.length === 0}
          >
            Clear
          </button>
        </div>
      </div>
    </div>
  );
};

export default Upload;
