import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchStates, fetchDistricts, fetchTaluks, fetchPincodes, searchPincodes, getExportURL } from "../services/api";
import Loader from "../components/Loader";
import ErrorMsg from "../components/ErrorMsg";
import { Download, Search, X, FolderSearch, ChevronLeft, ChevronRight } from "lucide-react";

export default function Explore() {
  const navigate = useNavigate();

  const [states, setStates] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [taluks, setTaluks] = useState([]);
  const [selState, setSelState] = useState("");
  const [selDistrict, setSelDistrict] = useState("");
  const [selTaluk, setSelTaluk] = useState("");

  const [data, setData] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [limit] = useState(20);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState(null);
  const [searchLoading, setSearchLoading] = useState(false);

  useEffect(() => { fetchStates().then(setStates).catch((e) => setError(e.message)); }, []);

  useEffect(() => {
    if (!selState) { setDistricts([]); setSelDistrict(""); return; }
    fetchDistricts(selState).then(setDistricts).catch((e) => setError(e.message));
    setSelDistrict(""); setSelTaluk("");
  }, [selState]);

  useEffect(() => {
    if (!selState || !selDistrict) { setTaluks([]); setSelTaluk(""); return; }
    fetchTaluks(selState, selDistrict).then(setTaluks).catch((e) => setError(e.message));
    setSelTaluk("");
  }, [selState, selDistrict]);

  useEffect(() => {
    setLoading(true); setError(null);
    const params = { page, limit };
    if (selState) params.state = selState;
    if (selDistrict) params.district = selDistrict;
    if (selTaluk) params.taluk = selTaluk;

    fetchPincodes(params)
      .then((res) => { setData(res.data); setTotal(res.total); })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [selState, selDistrict, selTaluk, page, limit]);

  useEffect(() => { setPage(1); }, [selState, selDistrict, selTaluk]);

  useEffect(() => {
    if (!searchQuery.trim()) { setSearchResults(null); return; }
    setSearchLoading(true);
    const timer = setTimeout(() => {
      searchPincodes(searchQuery).then((results) => { setSearchResults(results); setSearchLoading(false); }).catch(() => setSearchLoading(false));
    }, 400);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  const totalPages = Math.ceil(total / limit);
  const displayData = searchResults !== null ? searchResults : data;
  const showPagination = searchResults === null;

  const handleExport = () => {
    const params = {};
    if (selState) params.state = selState;
    if (selDistrict) params.district = selDistrict;
    if (selTaluk) params.taluk = selTaluk;
    window.open(getExportURL(params), "_blank");
  };

  return (
    <div className="container-main">
      {/* Header */}
      <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "center", gap: "20px", marginBottom: "40px" }}>
        <div>
          <h1 style={{ fontSize: "36px", fontWeight: "700", color: "#f8fafc", margin: "0 0 12px 0", letterSpacing: "-0.5px" }}>Explore Pin Codes</h1>
          <p style={{ fontSize: "18px", color: "#cbd5e1", margin: 0, fontWeight: "400" }}>Search and filter India's postal codes</p>
        </div>
        <button onClick={handleExport} className="btn-primary">
          <Download size={18} /> Export CSV
        </button>
      </div>

      <div className="premium-card" style={{ padding: "40px", marginBottom: "40px" }}>
        {/* Search Bar */}
        <div style={{ position: "relative", marginBottom: "32px" }}>
          <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-fuchsia-400" size={24} />
          <input
            type="text"
            placeholder="Search pincode, office name, district..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="input-premium"
            style={{ paddingLeft: "64px" }}
          />
          {searchLoading && (
            <span style={{ position: "absolute", right: "32px", top: "50%", transform: "translateY(-50%)", color: "#60a5fa", fontSize: "16px", fontWeight: "600" }}>Loading...</span>
          )}
        </div>

        {/* Filters Row */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "32px" }}>
          <div>
            <label style={{ display: "block", fontSize: "14px", fontWeight: "600", color: "#94a3b8", textTransform: "uppercase", marginBottom: "12px", letterSpacing: "0.5px" }}>State</label>
            <select value={selState} onChange={(e) => setSelState(e.target.value)} className="select-premium">
              <option value="">All States</option>
              {states.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          <div>
            <label style={{ display: "block", fontSize: "14px", fontWeight: "600", color: "#94a3b8", textTransform: "uppercase", marginBottom: "12px", letterSpacing: "0.5px" }}>District</label>
            <select value={selDistrict} onChange={(e) => setSelDistrict(e.target.value)} disabled={!selState} className="select-premium">
              <option value="">All Districts</option>
              {districts.map((d) => <option key={d} value={d}>{d}</option>)}
            </select>
          </div>
          <div>
            <label style={{ display: "block", fontSize: "14px", fontWeight: "600", color: "#94a3b8", textTransform: "uppercase", marginBottom: "12px", letterSpacing: "0.5px" }}>Taluk</label>
            <select value={selTaluk} onChange={(e) => setSelTaluk(e.target.value)} disabled={!selDistrict} className="select-premium">
              <option value="">All Taluks</option>
              {taluks.map((t) => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>
        </div>
      </div>

      {/* Results Info */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
        <p style={{ fontSize: "16px", fontWeight: "500", color: "#cbd5e1", margin: 0 }}>
          {searchResults !== null
            ? `${searchResults.length} search result(s)`
            : `Showing ${data.length} of ${total.toLocaleString("en-IN")} results`}
        </p>
        {searchResults !== null && (
          <button onClick={() => { setSearchQuery(""); setSearchResults(null); }} className="flex items-center gap-2 hover:bg-slate-700 transition" style={{ background: "rgba(30, 41, 59, 0.6)", border: "1px solid rgba(255,255,255,0.1)", color: "#a78bfa", fontSize: "15px", fontWeight: "600", padding: "8px 16px", borderRadius: "10px", cursor: "pointer" }}><X size={16} /> Clear filters</button>
        )}
      </div>

      {error && <ErrorMsg message={error} />}
      {loading && !searchLoading && <Loader />}

      {/* Data Table */}
      {!loading && (
        <div className="table-wrapper">
          <table className="data-table">
            <thead>
              <tr>
                <th>Pincode</th>
                <th>Office</th>
                <th>Type</th>
                <th>Delivery</th>
                <th>Taluk</th>
                <th>District</th>
                <th>State</th>
              </tr>
            </thead>
            <tbody>
              {displayData.length === 0 ? (
                <tr>
                  <td colSpan={7} style={{ padding: "100px 20px", textAlign: "center", color: "#94a3b8" }}>
                    <FolderSearch size={64} className="mx-auto mb-6 text-fuchsia-500/50" />
                    <p style={{ fontWeight: "700", fontSize: "20px", margin: "0 0 10px 0", color: "#f8fafc" }}>No records found</p>
                    <p style={{ fontSize: "16px", margin: 0 }}>Try adjusting your filters.</p>
                  </td>
                </tr>
              ) : (
                displayData.map((item, idx) => (
                  <tr key={item._id || idx} onClick={() => navigate(`/pincode/${item.pincode}`)}>
                    <td style={{ color: "#60a5fa", fontWeight: "700", fontFamily: "monospace", fontSize: "16px" }}>{item.pincode}</td>
                    <td style={{ fontWeight: "600", color: "#f8fafc" }}>{item.officeName}</td>
                    <td style={{ color: "#94a3b8" }}>{item.officeType}</td>
                    <td>
                      <span className={item.deliveryStatus?.toLowerCase() === "delivery" ? "badge-delivery" : "badge-non-delivery"}>
                        {item.deliveryStatus}
                      </span>
                    </td>
                    <td>{item.taluk}</td>
                    <td>{item.districtName}</td>
                    <td>{item.stateName}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Pagination */}
      {showPagination && totalPages > 1 && (
        <div style={{ display: "flex", justifyContent: "center", gap: "10px", alignItems: "center", marginTop: "40px" }}>
          <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1} className="pagination-btn flex items-center gap-1"><ChevronLeft size={18}/> Prev</button>
          <div style={{ display: "flex", gap: "8px" }}>
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              let pageNum;
              if (totalPages <= 5) pageNum = i + 1;
              else if (page <= 3) pageNum = i + 1;
              else if (page >= totalPages - 2) pageNum = totalPages - 4 + i;
              else pageNum = page - 2 + i;
              return (
                <button key={pageNum} onClick={() => setPage(pageNum)} className={`pagination-btn ${page === pageNum ? 'active' : ''}`}>{pageNum}</button>
              );
            })}
          </div>
          <button onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page === totalPages} className="pagination-btn flex items-center gap-1">Next <ChevronRight size={18}/></button>
        </div>
      )}
    </div>
  );
}
