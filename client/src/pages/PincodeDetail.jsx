import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { fetchPincodeDetail } from "../services/api";
import Loader from "../components/Loader";
import ErrorMsg from "../components/ErrorMsg";
import { ChevronLeft, Map, Building, Home, MapPin, Compass, CircleDot } from "lucide-react";

export default function PincodeDetail() {
  const { pincode } = useParams();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    fetchPincodeDetail(pincode)
      .then(setData)
      .catch((e) => setError(e.response?.data?.error || e.message))
      .finally(() => setLoading(false));
  }, [pincode]);

  if (loading) return <Loader />;
  if (error) return <ErrorMsg message={error} />;

  return (
    <div className="container-main" style={{ maxWidth: "1024px" }}>
      {/* Back link */}
      <Link to="/explore" className="flex items-center gap-2 text-base font-semibold text-fuchsia-400 no-underline mb-10 px-5 py-2.5 rounded-xl transition-all hover:bg-slate-800/50" style={{ background: "rgba(30, 41, 59, 0.4)", border: "1px solid rgba(255,255,255,0.1)" }}>
        <ChevronLeft size={18} /> Back to Explore
      </Link>

      {/* Title */}
      <div style={{ marginBottom: "40px", display: "flex", alignItems: "center", flexWrap: "wrap", gap: "24px" }}>
        <span style={{ padding: "16px 28px", backgroundImage: "linear-gradient(135deg, #7c3aed 0%, #d946ef 100%)", color: "white", borderRadius: "20px", fontFamily: "monospace", fontSize: "32px", fontWeight: "700", boxShadow: "0 10px 25px -5px rgba(192, 38, 211, 0.5)" }}>
          {pincode}
        </span>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <span style={{ color: "#f8fafc", fontSize: "24px", fontWeight: "700", letterSpacing: "-0.5px" }}>
            PIN Code Details
          </span>
          <span style={{ color: "#94a3b8", fontSize: "16px", fontWeight: "500" }}>
            {data.length} post office(s) found in this region
          </span>
        </div>
      </div>

      {/* Cards */}
      <div style={{ display: "flex", flexDirection: "column", gap: "32px" }}>
        {data.map((item, idx) => (
          <div key={item._id || idx} className="premium-card" style={{ padding: "40px" }}>
            {/* Office Header */}
            <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "flex-start", gap: "24px", marginBottom: "32px", paddingBottom: "32px", borderBottom: "1px solid #334155" }}>
              <div>
                <h2 style={{ fontSize: "26px", fontWeight: "700", color: "#f8fafc", margin: "0 0 12px 0", letterSpacing: "-0.5px" }}>{item.officeName}</h2>
                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                  <span style={{ fontSize: "15px", fontWeight: "600", color: "#cbd5e1", background: "#0f172a", border: "1px solid #334155", padding: "6px 14px", borderRadius: "8px" }}>{item.officeType} Office</span>
                </div>
              </div>
              <span className={item.deliveryStatus?.toLowerCase() === "delivery" ? "badge-delivery" : "badge-non-delivery"} style={{ fontSize: "15px", padding: "8px 18px" }}>
                {item.deliveryStatus}
              </span>
            </div>

            {/* Details Grid */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "24px" }}>
              {[
                { label: "State", value: item.stateName, icon: <Map size={24} className="text-violet-400" /> },
                { label: "District", value: item.districtName, icon: <Building size={24} className="text-fuchsia-400" /> },
                { label: "Taluk", value: item.taluk, icon: <Home size={24} className="text-orange-400" /> },
                { label: "Division", value: item.divisionName, icon: <MapPin size={24} className="text-rose-400" /> },
                { label: "Region", value: item.regionName, icon: <Compass size={24} className="text-sky-400" /> },
                { label: "Circle", value: item.circleName, icon: <CircleDot size={24} className="text-emerald-400" /> },
              ].map((field) => (
                <div key={field.label} style={{ background: "rgba(15, 23, 42, 0.5)", borderRadius: "16px", padding: "20px", border: "1px solid rgba(255,255,255,0.05)" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "12px" }}>
                    <span>{field.icon}</span>
                    <p style={{ fontSize: "13px", fontWeight: "600", color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.5px", margin: 0 }}>
                      {field.label}
                    </p>
                  </div>
                  <p style={{ fontSize: "18px", color: "#f8fafc", fontWeight: "600", margin: 0 }}>
                    {field.value || "—"}
                  </p>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
