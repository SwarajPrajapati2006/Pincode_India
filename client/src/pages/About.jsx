import { Link } from "react-router-dom";
import { Database, Zap, Atom, Search, ArrowRight, MapPin } from "lucide-react";

export default function About() {
  return (
    <div className="container-main" style={{ maxWidth: "1000px" }}>
      {/* Header */}
      <div style={{ textAlign: "center", marginBottom: "80px", marginTop: "40px" }}>
        <div className="inline-flex items-center justify-center w-24 h-24 rounded-3xl mb-8 shadow-[0_10px_40px_-10px_rgba(192,38,211,0.6)]" style={{
          backgroundImage: "linear-gradient(135deg, #7c3aed 0%, #d946ef 100%)"
        }}>
          <MapPin size={48} className="text-white" />
        </div>
        <h1 style={{ fontSize: "52px", fontWeight: "700", color: "#f8fafc", margin: "0 0 24px 0", letterSpacing: "-1px" }}>
          About PinCode India
        </h1>
        <p style={{ fontSize: "20px", color: "#94a3b8", margin: "0 auto", maxWidth: "700px", lineHeight: "1.6", fontWeight: "400" }}>
          A robust, full-stack architecture providing lightning-fast access to India's complete postal directory.
        </p>
      </div>

      {/* Info Cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "32px", marginBottom: "80px" }}>
        {[
          { icon: <Database size={36} className="text-violet-400"/>, title: "Enterprise Database", desc: "Powered by MongoDB Atlas serving over 154,000 indexed pincode records with fast queries." },
          { icon: <Zap size={36} className="text-orange-400"/>, title: "Robust Backend", desc: "High-performance Node.js REST APIs featuring aggregation pipelines and precise data sanitization." },
          { icon: <Atom size={36} className="text-fuchsia-400"/>, title: "Modern Frontend", desc: "Built on React 18 & Vite. Utilizes Tailwind CSS and Recharts for clean data visualization." },
          { icon: <Search size={36} className="text-sky-400"/>, title: "Advanced Features", desc: "Predictive debounced search, cascading geographic filters, paginated data grids, and CSV exports." },
        ].map((card) => (
          <div key={card.title} className="premium-card group" style={{ padding: "40px" }}>
            <span className="inline-block mb-6 p-4 rounded-2xl bg-slate-900/50 border border-white/5 group-hover:scale-110 transition-transform">{card.icon}</span>
            <h3 style={{ fontSize: "24px", fontWeight: "700", color: "#f8fafc", margin: "0 0 16px 0" }}>{card.title}</h3>
            <p style={{ fontSize: "16px", color: "#cbd5e1", lineHeight: "1.7", margin: 0, fontWeight: "400" }}>{card.desc}</p>
          </div>
        ))}
      </div>

      {/* Tech Stack */}
      <div className="premium-card" style={{ padding: "64px 40px", marginBottom: "80px", textAlign: "center" }}>
        <h2 style={{ fontSize: "28px", fontWeight: "700", color: "#f8fafc", margin: "0 0 40px 0", letterSpacing: "-0.5px" }}>Technology Stack</h2>
        <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "16px" }}>
          {["React 18", "Vite", "Node.js", "Express.js", "MongoDB Atlas", "Mongoose", "Recharts", "React Router v6", "Axios"].map((tech) => (
            <span key={tech} style={{
              padding: "12px 24px", background: "#0f172a", border: "1px solid #334155", color: "#f8fafc",
              borderRadius: "12px", fontSize: "16px", fontWeight: "600"
            }}>
              {tech}
            </span>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div style={{ textAlign: "center", paddingBottom: "64px" }}>
        <Link to="/explore" className="btn-primary" style={{ padding: "16px 36px", fontSize: "18px" }}>
          Start Exploring Directory <ArrowRight size={20} />
        </Link>
      </div>
    </div>
  );
}
