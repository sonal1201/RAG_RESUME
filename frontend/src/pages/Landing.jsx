import React from "react";
import { useNavigate } from "react-router-dom";
import Logo from "../components/Logo.jsx";

const Landing = () => {
  const navigate = useNavigate();

  const features = [
    {
      title: "Upload Multiple Resumes",
      desc: "Effortlessly upload and process hundreds of resumes at once with our intelligent batch processing system.",
    },
    {
      title: "Smart Parse & Embed",
      desc: "Advanced AI automatically extracts and structures key information from resumes for instant analysis.",
    },
    {
      title: "Natural Language Queries",
      desc: "Ask questions in plain English and get precise AI-driven answers with supporting evidence snippets.",
    },
    {
      title: "Intelligent Job Matching",
      desc: "Our AI analyzes skills, experience, and qualifications to find the perfect candidate-job fit.",
    },
  ];

  const stats = [
    { value: "10x", label: "Faster Hiring" },
    { value: "99.9%", label: "Accuracy" },
    { value: "500+", label: "Companies" },
  ];

  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "HR Manager, TechCorp",
      quote:
        "This tool completely transformed our hiring process. The AI insights are incredibly accurate and save us countless hours every week.",
      avatar: "SJ",
    },
    {
      name: "Michael Torres",
      role: "Senior Recruiter, InnovateLabs",
      quote:
        "The resume matching capabilities are phenomenal. We can identify top candidates instantly and focus on what really matters.",
      avatar: "MT",
    },
    {
      name: "Priya Sharma",
      role: "Talent Acquisition Lead, FutureTech",
      quote:
        "Parsing resumes and answering complex queries is seamless. The AI truly understands our hiring needs and delivers results.",
      avatar: "PS",
    },
  ];

  return (
    <div className="relative min-h-screen overflow-hidden" style={{ background: "#f3f4f6", color: "#111827" }}>
      {/* Animated background elements using existing blob classes */}
      <div className="blob blob-1"></div>
      <div className="blob blob-2"></div>
      <div className="blob blob-3"></div>

      {/* Navbar */}
      <nav className=" relative z-10 max-w-7xl mx-auto px-6 py-6">
        <div className="flex items-center justify-between backdrop-blur-sm rounded-2xl px-6 py-4 shadow" style={{ background: "#ffffff", border: "1px solid #e5e7eb" }}>
          <div className="flex items-center gap-2">
            <Logo size={30} />
            <span className="text-2xl font-bold" style={{ background: "linear-gradient(90deg,#2563eb,#1e3a8a)", WebkitBackgroundClip: "text", color: "transparent" }}>
              MatchCV
            </span>
          </div>
          <div className="flex gap-3 items-center">
            <button
              onClick={() => navigate("/login")}
              className="px-4 py-2 rounded-md border"
              style={{ borderColor: "#e5e7eb", color: "#111827" }}
            >
              Login
            </button>
            <button
              onClick={() => navigate("/register")}
              className="px-4 py-2 rounded-md text-white shadow"
              style={{ background: "linear-gradient(90deg,#2563eb,#1e3a8a)" }}
            >
              Get Started
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <header className="relative z-10 max-w-7xl mx-auto px-6 pt-20 pb-32">
        <div className="text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium mb-6" style={{ background: "rgba(37,99,235,0.1)", color: "#2563eb" }}>
            <span>AI-Powered Recruitment Revolution</span>
          </div>

          <h1 className="font-extrabold mb-6 leading-tight" style={{ fontSize: "clamp(2.5rem,6vw,4.5rem)", color: "#111827" }}>
            Find the Perfect
            <br />
            <span className="text-4xl md:text-6xl lg:text-8xl" style={{ background: "linear-gradient(90deg,#2563eb,#1e3a8a)", WebkitBackgroundClip: "text", color: "transparent" }}>
              Candidate, Faster
            </span>
          </h1>

          <p className="mx-auto mb-12" style={{ maxWidth: 800, color: "#6b7280", fontSize: "1.125rem", lineHeight: 1.6 }}>
            Transform your hiring process with AI-powered resume analysis, intelligent candidate matching, and instant insights that help you make better decisions.
          </p>

          <div className="flex gap-4 justify-center flex-wrap">
            <button
              onClick={() => navigate("/register")}
              className="text-lg px-8 py-3 rounded-md text-white shadow flex items-center gap-2"
              style={{ background: "linear-gradient(90deg,#2563eb,#1e3a8a)" }}
            >
              Get Started <span aria-hidden="true">→</span>
            </button>
          </div>

          {/* Stats */}
          <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-3xl mx-auto">
            {[{ value: "10x", label: "Faster Hiring" },{ value: "99.9%", label: "Accuracy" },{ value: "500+", label: "Companies" }].map((stat, index) => (
              <div key={index} className="flex flex-col items-center gap-2">
                <div className="text-4xl font-bold" style={{ color: "#111827" }}>{stat.value}</div>
                <div className="text-sm" style={{ color: "#6b7280" }}>{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </header>

      {/* Features Section */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 py-24">
        <div className="text-center mb-16">
          <h2 className="font-bold mb-4" style={{ fontSize: "clamp(2rem,5vw,3rem)", color: "#111827" }}>
            Powerful Features
          </h2>
          <p className="mx-auto" style={{ maxWidth: 640, color: "#6b7280", fontSize: "1.125rem" }}>
            Everything you need to streamline your recruitment process and find the best talent.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <div
              key={index}
              className="group relative p-8 rounded-2xl shadow border"
              style={{ background: "#ffffff", borderColor: "#e5e7eb" }}
            >
              <div className="absolute inset-0 rounded-2xl" style={{ background: "linear-gradient(90deg,#2563eb,#1e3a8a)", opacity: 0.04 }}></div>
              <h3 className="text-xl font-semibold mb-3" style={{ color: "#111827" }}>{feature.title}</h3>
              <p style={{ color: "#6b7280" }}>{feature.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 py-24">
        <div className="text-center mb-16">
          <h2 className="font-bold mb-4" style={{ fontSize: "clamp(2rem,5vw,3rem)", color: "#111827" }}>
            Loved by Recruiters
          </h2>
          <p style={{ color: "#6b7280", fontSize: "1.125rem" }}>
            See what hiring professionals say about our platform.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((t, index) => (
            <div
              key={index}
              className="p-8 rounded-2xl shadow border"
              style={{ background: "#ffffff", borderColor: "#e5e7eb" }}
            >
              <div className="flex items-center gap-4 mb-6">
                <div className="w-14 h-14 rounded-full flex items-center justify-center font-bold text-lg"
                     style={{ background: "linear-gradient(90deg,#2563eb,#1e3a8a)", color: "#fff" }}>
                  {t.avatar}
                </div>
                <div>
                  <h4 className="font-semibold" style={{ color: "#111827" }}>{t.name}</h4>
                  <p className="text-sm" style={{ color: "#6b7280" }}>{t.role}</p>
                </div>
              </div>
              <p className="italic" style={{ color: "#6b7280" }}>
                "{t.quote}"
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative z-10 max-w-5xl mx-auto px-6 py-24">
        <div
          className="relative overflow-hidden rounded-3xl p-12 md:p-16 text-center shadow"
          style={{ background: "linear-gradient(90deg,#2563eb,#1e3a8a)" }}
        >
          <div className="relative z-10">
            <h2 className="font-bold mb-4" style={{ color: "#fff", fontSize: "clamp(2rem,5vw,3rem)" }}>
              Ready to Transform Your Hiring?
            </h2>
            <p className="mb-8 mx-auto" style={{ color: "rgba(255,255,255,0.9)", fontSize: "1.125rem", maxWidth: 640 }}>
              Join hundreds of companies using AI to find better candidates faster.
            </p>
            <button
              onClick={() => navigate("/register")}
              className="text-lg px-8 py-3 rounded-md shadow"
              style={{ background: "#fff", color: "#1e3a8a" }}
            >
              Start Your Free Trial
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 mt-24" style={{ background: "#ffffff", borderTop: "1px solid #e5e7eb" }}>
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="text-lg font-semibold" style={{ color: "#111827" }}>AI Resume Matcher</span>
            </div>
            <p className="text-sm" style={{ color: "#6b7280" }}>
              © 2025 AI Resume Matcher. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
