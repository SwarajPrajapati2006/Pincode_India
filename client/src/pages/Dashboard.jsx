import { useEffect, useState } from "react";
import { fetchStats, fetchStateDistribution, fetchDeliveryDistribution } from "../services/api";
import Loader from "../components/Loader";
import ErrorMsg from "../components/ErrorMsg";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from "recharts";
import { MapPin, Map, MailCheck, MailX } from "lucide-react";

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
          width: "64px", height: "64px", borderRadius: "20px", display: "flex", alignItems: "center", justifyContent: "center",
          background: bg, color: color, boxShadow: `0 8px 24px -8px ${color}`
        }}>
          {icon}
        </div>
      </div>
    </div>
  );
}

const PIE_COLORS = ["#10b981", "#f43f5e"]; // emerald-500 (Delivery), rose-500 (Non-Delivery)

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
          <StatCard label="Total Pin Codes" value={stats.totalPincodes} icon={<MapPin size={32} />} bg="rgba(139, 92, 246, 0.15)" color="#a78bfa" />
          <StatCard label="States / UTs" value={stats.totalStates} icon={<Map size={32} />} bg="rgba(249, 115, 22, 0.15)" color="#fb923c" />
          <StatCard label="Delivery Offices" value={stats.deliveryOffices} icon={<MailCheck size={32} />} bg="rgba(16, 185, 129, 0.15)" color="#34d399" />
          <StatCard label="Non-Delivery Offices" value={stats.nonDeliveryOffices} icon={<MailX size={32} />} bg="rgba(244, 63, 94, 0.15)" color="#fb7185" />
        </div>
      )}

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "32px" }}>
        {/* Bar Chart */}
        <div className="premium-card" style={{ gridColumn: window.innerWidth > 1024 ? "span 2" : "auto", padding: "32px" }}>
          <h2 style={{ fontSize: "20px", fontWeight: "600", color: "#f8fafc", margin: "0 0 32px 0" }}>State-wise Distribution</h2>
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={stateDist.slice(0, 15)} margin={{ top: 5, right: 20, left: 10, bottom: 65 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
              <XAxis dataKey="state" tick={{ fill: "#a78bfa", fontSize: 13, fontWeight: "600", fontFamily: "Inter" }} angle={-45} textAnchor="end" interval={0} axisLine={{stroke: 'rgba(255,255,255,0.1)'}} tickLine={false} />
              <YAxis tick={{ fill: "#94a3b8", fontSize: 12, fontWeight: "500", fontFamily: "Inter" }} axisLine={{stroke: 'rgba(255,255,255,0.1)'}} tickLine={false} />
              <Tooltip cursor={{ fill: "rgba(139, 92, 246, 0.1)" }} contentStyle={{ backgroundColor: "rgba(15, 23, 42, 0.9)", backdropFilter: "blur(12px)", borderRadius: "16px", border: "1px solid rgba(255,255,255,0.1)", color: "#f8fafc", boxShadow: "0 20px 40px -10px rgba(0,0,0,0.5)", fontFamily: "Inter", fontWeight: "600" }} />
              <Bar dataKey="count" fill="url(#colorUv)" radius={[6, 6, 0, 0]} maxBarSize={56} />
              <defs>
                <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#d946ef" stopOpacity={0.9}/>
                  <stop offset="95%" stopColor="#7c3aed" stopOpacity={0.9}/>
                </linearGradient>
              </defs>
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
              <Tooltip contentStyle={{ backgroundColor: "rgba(15, 23, 42, 0.9)", backdropFilter: "blur(12px)", borderRadius: "16px", border: "1px solid rgba(255,255,255,0.1)", color: "#f8fafc", boxShadow: "0 20px 40px -10px rgba(0,0,0,0.5)", fontFamily: "Inter", fontWeight: "600" }} />
              <Legend wrapperStyle={{ fontFamily: "Inter", fontSize: 15, fontWeight: "500", color: "#cbd5e1" }} verticalAlign="bottom" height={36} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
