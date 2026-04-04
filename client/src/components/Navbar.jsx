import { NavLink } from "react-router-dom";
import { useState } from "react";

export default function Navbar() {
  const [open, setOpen] = useState(false);

  const links = [
    { to: "/", label: "Dashboard", icon: "📊" },
    { to: "/explore", label: "Explore", icon: "🔍" },
    { to: "/about", label: "About", icon: "ℹ️" },
  ];

  return (
    <nav className="nav-bar sticky top-0 z-50">
      <div className="container-main" style={{ padding: "0 24px" }}>
        <div className="flex items-center justify-between" style={{ height: "80px" }}>
          {/* Logo */}
          <NavLink to="/" className="flex items-center gap-3" style={{ textDecoration: "none" }}>
            <div style={{
              width: "44px", height: "44px", backgroundColor: "#3b82f6", /* blue-500 */
              borderRadius: "12px", display: "flex", alignItems: "center", justifyContent: "center",
              color: "white", fontSize: "22px"
            }}>
              📌
            </div>
            <span style={{ fontSize: "24px", fontWeight: "700", color: "white", letterSpacing: "-0.5px" }}>
              PinCode India
            </span>
          </NavLink>

          {/* Desktop Links */}
          <div className="hidden md:flex items-center gap-3">
            {links.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.to === "/"}
                style={({ isActive }) => ({
                  padding: "10px 20px",
                  borderRadius: "10px",
                  fontSize: "16px",
                  fontWeight: "600",
                  textDecoration: "none",
                  transition: "all 0.2s ease",
                  backgroundColor: isActive ? "#3b82f6" : "transparent", /* blue-500 */
                  color: isActive ? "white" : "#cbd5e1" /* slate-300 */
                })}
              >
                <span className="mr-2 opacity-80">{link.icon}</span>
                {link.label}
              </NavLink>
            ))}
          </div>

          <button
            onClick={() => setOpen(!open)}
            className="md:hidden"
            style={{ padding: "10px", borderRadius: "10px", background: "transparent", border: "none", color: "#cbd5e1", cursor: "pointer", fontSize: "22px" }}
          >
            {open ? "✕" : "☰"}
          </button>
        </div>

        {/* Mobile Menu */}
        {open && (
          <div className="md:hidden pb-5 pt-3 flex flex-col gap-2" style={{ borderTop: "1px solid #1e293b" }}>
            {links.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.to === "/"}
                onClick={() => setOpen(false)}
                style={({ isActive }) => ({
                  display: "block", padding: "12px 20px", borderRadius: "10px", fontSize: "16px", fontWeight: "600",
                  textDecoration: "none", backgroundColor: isActive ? "#3b82f6" : "transparent", color: isActive ? "white" : "#cbd5e1"
                })}
              >
                <span className="mr-3">{link.icon}</span>{link.label}
              </NavLink>
            ))}
          </div>
        )}
      </div>
    </nav>
  );
}
