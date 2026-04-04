import { useEffect, useState } from "react";
import { fetchStats, fetchStateDistribution, fetchDeliveryDistribution } from "../services/api";
import Loader from "../components/Loader";
import ErrorMsg from "../components/ErrorMsg";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from "recharts";

function StatCard({ label, value, icon, bg, color }) {
  return (
    <div className="premium-card">
      <div style={{ padding: "32px", display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div>
          <p style={{ fontSize: "16px", fontWeight: "600", color: "#94a3b8", margin: "0 0 12px 0", letterSpacing: "0.5px", textTransform: "uppercase" }}>{label}</p>
          <p style={{ fontSize: "40px", fontWeight: "700", color: "#f8fafc", margin: 0, letterSpacing: "-0.5px" }}>
            {typeof value === "number" ? value.toLocaleString("en-IN") : value}
          </p>
        </div>
        <div style={{
          width: "56px", height: "56px", borderRadius: "16px", display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: "28px", background: bg, color: color
        }}>
          {icon}
        </div>
      </div>
    </div>
  );
}

const PIE_COLORS = ["#f59e0b", "#ef4444"]; // amber-500, red-500

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [stateDist, setStateDist] = useState([]);
  const [deliveryDist, setDeliveryDist] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const load = async () => {
      try {
        const [s, sd, dd] = await Promise.all([fetchStats(), fetchStateDistribution(), fetchDeliveryDistribution()]);
        setStats(s); setStateDist(sd); setDeliveryDist(dd);
      } catch (err) { setError(err.message); } finally { setLoading(false); }
    };
    load();
  }, []);

  if (loading) return <Loader />;
  if (error) return <ErrorMsg message={error} />;

  const pieData = deliveryDist
    ? [{ name: "Delivery", value: deliveryDist.delivery }, { name: "Non-Delivery", value: deliveryDist.nonDelivery }]
    : [];

  return (
    <div className="container-main">
      <div style={{ marginBottom: "40px" }}>
        <h1 style={{ fontSize: "36px", fontWeight: "700", margin: "0 0 12px 0", letterSpacing: "-0.5px", color: "#f8fafc" }}>Dashboard</h1>
        <p style={{ fontSize: "18px", color: "#94a3b8", margin: 0, fontWeight: "400" }}>Overview of India's postal network</p>
      </div>

      {stats && (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "24px", marginBottom: "40px" }}>
          <StatCard label="Total Pin Codes" value={stats.totalPincodes} icon="📌" bg="rgba(59, 130, 246, 0.15)" color="#60a5fa" /> {/* blue */}
          <StatCard label="States / UTs" value={stats.totalStates} icon="🗺️" bg="rgba(148, 163, 184, 0.15)" color="#cbd5e1" /> {/* slate */}
          <StatCard label="Delivery Offices" value={stats.deliveryOffices} icon="📬" bg="rgba(245, 158, 11, 0.15)" color="#fbbf24" /> {/* amber */}
          <StatCard label="Non-Delivery Offices" value={stats.nonDeliveryOffices} icon="📭" bg="rgba(239, 68, 68, 0.15)" color="#f87171" /> {/* red */}
        </div>
      )}

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "32px" }}>
        {/* Bar Chart */}
        <div className="premium-card" style={{ gridColumn: window.innerWidth > 1024 ? "span 2" : "auto", padding: "32px" }}>
          <h2 style={{ fontSize: "20px", fontWeight: "600", color: "#f8fafc", margin: "0 0 32px 0" }}>State-wise Distribution</h2>
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={stateDist.slice(0, 15)} margin={{ top: 5, right: 20, left: 10, bottom: 65 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
              <XAxis dataKey="state" tick={{ fill: "#94a3b8", fontSize: 12, fontWeight: "500", fontFamily: "Inter" }} angle={-45} textAnchor="end" interval={0} axisLine={{stroke: '#334155'}} tickLine={false} />
              <YAxis tick={{ fill: "#94a3b8", fontSize: 12, fontWeight: "500", fontFamily: "Inter" }} axisLine={{stroke: '#334155'}} tickLine={false} />
              <Tooltip cursor={{ fill: "#334155" }} contentStyle={{ backgroundColor: "#0f172a", borderRadius: "12px", border: "1px solid #334155", color: "#f8fafc", boxShadow: "0 10px 15px -3px rgba(0,0,0,0.5)", fontFamily: "Inter", fontWeight: "500" }} />
              <Bar dataKey="count" fill="#3b82f6" radius={[4, 4, 0, 0]} maxBarSize={56} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Pie Chart */}
        <div className="premium-card" style={{ padding: "32px" }}>
          <h2 style={{ fontSize: "20px", fontWeight: "600", color: "#f8fafc", margin: "0 0 32px 0" }}>Delivery Status</h2>
          <ResponsiveContainer width="100%" height={400}>
            <PieChart>
              <Pie data={pieData} cx="50%" cy="45%" outerRadius={130} innerRadius={80} paddingAngle={2} dataKey="value" stroke="none">
                {pieData.map((_, idx) => <Cell key={idx} fill={PIE_COLORS[idx]} />)}
              </Pie>
              <Tooltip contentStyle={{ backgroundColor: "#0f172a", borderRadius: "12px", border: "1px solid #334155", color: "#f8fafc", boxShadow: "0 10px 15px -3px rgba(0,0,0,0.5)", fontFamily: "Inter", fontWeight: "500" }} />
              <Legend wrapperStyle={{ fontFamily: "Inter", fontSize: 15, fontWeight: "500", color: "#cbd5e1" }} verticalAlign="bottom" height={36} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
