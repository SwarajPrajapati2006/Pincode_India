import { NavLink } from "react-router-dom";
import { useState } from "react";
import { MapPin, LayoutDashboard, Search, Info, Menu as MenuIcon, X } from "lucide-react";

export default function Navbar() {
  const [open, setOpen] = useState(false);

  const links = [
    { to: "/", label: "Dashboard", icon: <LayoutDashboard className="w-5 h-5 inline" /> },
    { to: "/explore", label: "Explore", icon: <Search className="w-5 h-5 inline" /> },
    { to: "/about", label: "About", icon: <Info className="w-5 h-5 inline" /> },
  ];

  return (
    <nav className="nav-bar sticky top-0 z-50">
      <div className="container-main" style={{ padding: "0 24px" }}>
        <div className="flex items-center justify-between" style={{ height: "80px" }}>
          {/* Logo */}
          <NavLink to="/" className="flex items-center gap-3 group" style={{ textDecoration: "none" }}>
            <div className="flex items-center justify-center w-11 h-11 rounded-full bg-gradient-to-br from-violet-600 to-fuchsia-500 shadow-xl shadow-fuchsia-500/20 group-hover:scale-105 transition-transform">
              <MapPin className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-violet-200 to-orange-200 tracking-tight">
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
                  borderRadius: "9999px",
                  fontSize: "15px",
                  fontWeight: "700",
                  textDecoration: "none",
                  transition: "all 0.3s ease",
                  backgroundColor: isActive ? "transparent" : "transparent",
                  backgroundImage: isActive ? "linear-gradient(135deg, #7c3aed 0%, #d946ef 100%)" : "none",
                  color: isActive ? "white" : "#cbd5e1"
                })}
              >
                <span className="mr-2 opacity-80">{link.icon}</span>
                {link.label}
              </NavLink>
            ))}
          </div>

          <button
            onClick={() => setOpen(!open)}
            className="md:hidden p-2 rounded-xl text-slate-300 hover:bg-slate-800/50 transition-colors"
          >
            {open ? <X className="w-7 h-7" /> : <MenuIcon className="w-7 h-7" />}
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
                  display: "block", padding: "14px 20px", borderRadius: "16px", fontSize: "16px", fontWeight: "700",
                  textDecoration: "none", backgroundImage: isActive ? "linear-gradient(135deg, #7c3aed 0%, #d946ef 100%)" : "none", color: isActive ? "white" : "#cbd5e1"
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
