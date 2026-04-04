import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { fetchPincodeDetail } from "../services/api";
import Loader from "../components/Loader";
import ErrorMsg from "../components/ErrorMsg";

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
      <Link to="/explore" style={{ display: "inline-flex", alignItems: "center", gap: "8px", fontSize: "16px", fontWeight: "600", color: "#60a5fa", textDecoration: "none", marginBottom: "40px", padding: "10px 20px", background: "#1e293b", border: "1px solid #334155", borderRadius: "10px", transition: "all 0.2s" }} onMouseOver={e=>e.target.style.background='#334155'} onMouseOut={e=>e.target.style.background='#1e293b'}>
        ← Back to Explore
      </Link>

      {/* Title */}
      <div style={{ marginBottom: "40px", display: "flex", alignItems: "center", flexWrap: "wrap", gap: "24px" }}>
        <span style={{ padding: "16px 28px", background: "#3b82f6", color: "white", borderRadius: "16px", fontFamily: "monospace", fontSize: "32px", fontWeight: "700" }}>
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
                { label: "State", value: item.stateName, icon: "🗺️" },
                { label: "District", value: item.districtName, icon: "🏢" },
                { label: "Taluk", value: item.taluk, icon: "🏘️" },
                { label: "Division", value: item.divisionName, icon: "📍" },
                { label: "Region", value: item.regionName, icon: "🧭" },
                { label: "Circle", value: item.circleName, icon: "⭕" },
              ].map((field) => (
                <div key={field.label} style={{ background: "#0f172a", borderRadius: "12px", padding: "20px", border: "1px solid #334155" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "12px" }}>
                    <span style={{ fontSize: "16px" }}>{field.icon}</span>
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
