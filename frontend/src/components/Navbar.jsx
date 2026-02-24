import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import logoVideo from "../assets/logo.mp4";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const user = JSON.parse(localStorage.getItem("user")) || {};

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  const navLinks = [
    { name: "Dashboard", path: "/dashboard", icon: "📊" },
    { name: "History & Trends", path: "/history", icon: "📈" },
    { name: "My Profile", path: "/profile", icon: "👤" },
  ];

  return (
    <>
      <nav style={styles.nav}>
        <div style={styles.navContent}>
          {/* LOGO */}
          <div style={{ display: "flex", alignItems: "center", gap: "12px", cursor: "pointer" }} onClick={() => navigate("/dashboard")}>
             <video src={logoVideo} autoPlay loop muted playsInline style={styles.logoVideo} />
             <span style={styles.logoText}>SEHAT</span>
          </div>

          {/* HAMBURGER BUTTON */}
          <button onClick={() => setIsOpen(true)} style={styles.hamburgerBtn}>
             ☰
          </button>
        </div>
      </nav>

      {/* SLIDING SIDE DRAWER */}
      {isOpen && (
        <div style={styles.overlay} onClick={() => setIsOpen(false)}>
          <div style={styles.drawer} onClick={(e) => e.stopPropagation()}>
            
            <div style={styles.drawerHeader}>
                <div>
                    <div style={{ fontWeight: "bold", fontSize: "18px", color: "#fff" }}>{user.name}</div>
                    <div style={{ fontSize: "12px", color: "#9ca3af" }}>{user.email}</div>
                </div>
                <button onClick={() => setIsOpen(false)} style={styles.closeBtn}>✕</button>
            </div>

            <div style={styles.linkContainer}>
                {navLinks.map((link) => {
                    const isActive = location.pathname === link.path;
                    return (
                        <button 
                            key={link.name}
                            onClick={() => { setIsOpen(false); navigate(link.path); }}
                            style={styles.navLink(isActive)}
                        >
                            <span>{link.icon}</span> {link.name}
                        </button>
                    );
                })}
            </div>

            <div style={{ marginTop: "auto", padding: "20px" }}>
                <button onClick={handleLogout} style={styles.logoutBtn}>
                    🚪 Log Out
                </button>
            </div>

          </div>
        </div>
      )}
    </>
  );
};

const styles = {
  nav: { position: "sticky", top: 0, zIndex: 40, backgroundColor: "rgba(17, 24, 39, 0.8)", backdropFilter: "blur(12px)", borderBottom: "1px solid #1f2937", padding: "12px 24px" },
  navContent: { maxWidth: "1200px", margin: "0 auto", display: "flex", justifyContent: "space-between", alignItems: "center" },
  logoVideo: { height: "36px", borderRadius: "8px", objectFit: "cover" },
  logoText: { fontSize: "20px", fontWeight: "900", color: "#fff", letterSpacing: "1px" },
  hamburgerBtn: { background: "none", border: "none", color: "#fff", fontSize: "24px", cursor: "pointer" },
  
  overlay: { position: "fixed", inset: 0, backgroundColor: "rgba(0,0,0,0.6)", zIndex: 50, display: "flex", justifyContent: "flex-end" },
  drawer: { width: "300px", height: "100%", backgroundColor: "#111827", borderLeft: "1px solid #374151", display: "flex", flexDirection: "column", animation: "slideIn 0.3s ease-out" },
  drawerHeader: { padding: "20px", borderBottom: "1px solid #1f2937", display: "flex", justifyContent: "space-between", alignItems: "center" },
  closeBtn: { background: "none", border: "none", color: "#9ca3af", fontSize: "20px", cursor: "pointer" },
  linkContainer: { padding: "20px", display: "flex", flexDirection: "column", gap: "10px" },
  navLink: (isActive) => ({
      width: "100%", textAlign: "left", padding: "16px", borderRadius: "12px", border: "none",
      backgroundColor: isActive ? "rgba(255, 126, 53, 0.1)" : "transparent",
      color: isActive ? "#ff7e35" : "#d1d5db", fontWeight: "bold", fontSize: "16px", cursor: "pointer",
      display: "flex", gap: "12px", transition: "all 0.2s"
  }),
  logoutBtn: { width: "100%", padding: "16px", borderRadius: "12px", border: "1px solid #ef4444", backgroundColor: "rgba(239, 68, 68, 0.1)", color: "#ef4444", fontWeight: "bold", cursor: "pointer", fontSize: "16px" }
};

// Add this to your global CSS or just let React handle it dynamically if supported
document.head.insertAdjacentHTML("beforeend", `<style>@keyframes slideIn { from { transform: translateX(100%); } to { transform: translateX(0); } }</style>`);

export default Navbar;