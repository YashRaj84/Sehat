import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import logoVideo from "../assets/logo.mp4"; 

function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  
  // NEW: State to track password visibility
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await login(email, password);
      navigate("/dashboard");
    } catch (err) {
      setError("Invalid email or password");
    } finally {
      setLoading(false);
    }
  };

  const styles = {
    pageContainer: { position: "relative", width: "100vw", height: "100vh", overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Inter', sans-serif" },
    backgroundVideo: { position: "absolute", top: 0, left: 0, width: "100%", height: "100%", objectFit: "cover", zIndex: 0 },
    overlay: { position: "absolute", top: 0, left: 0, width: "100%", height: "100%", backgroundColor: "rgba(17, 24, 39, 0.6)", zIndex: 1 }, 
    contentWrapper: { position: "relative", zIndex: 10, width: "100%", maxWidth: "400px", padding: "20px" },
    
    card: {
      backgroundColor: "rgba(31, 41, 55, 0.4)", 
      backdropFilter: "blur(12px)",              
      border: "1px solid rgba(255, 255, 255, 0.15)",
      borderRadius: "24px",
      padding: "30px",
      boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5)",
      display: "flex",
      flexDirection: "column",
      gap: "20px"
    },

    logoHeader: { textAlign: "center", marginBottom: "20px", fontSize: "32px" },
    title: { fontSize: "28px", fontWeight: "700", marginBottom: "8px", textAlign: "center", color: "#fff", textShadow: "0 2px 4px rgba(0,0,0,0.5)" },
    subtitle: { fontSize: "14px", color: "#e5e7eb", textAlign: "center", marginBottom: "30px", textShadow: "0 1px 2px rgba(0,0,0,0.5)" }, 
    inputGroup: { display: "flex", flexDirection: "column", gap: "8px" },
    label: { fontSize: "12px", fontWeight: "bold", color: "#d1d5db", textTransform: "uppercase", letterSpacing: "0.5px" },
    
    input: { width: "100%", padding: "16px", backgroundColor: "rgba(17, 24, 39, 0.6)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "12px", color: "#ffffff", fontSize: "16px", outline: "none", boxSizing: "border-box" },
    
    // NEW: Styles for the toggle button inside the input
    inputWrapper: { position: "relative", width: "100%" },
    toggleBtn: { 
        position: "absolute", 
        right: "16px", 
        top: "50%", 
        transform: "translateY(-50%)", 
        background: "none", 
        border: "none", 
        color: "#9ca3af", 
        fontSize: "12px", 
        fontWeight: "bold", 
        cursor: "pointer", 
        textTransform: "uppercase",
        letterSpacing: "0.5px"
    },

    button: { width: "100%", padding: "16px", backgroundColor: "#ff7e35", color: "#ffffff", border: "none", borderRadius: "30px", fontSize: "16px", fontWeight: "bold", cursor: "pointer", marginTop: "10px", boxShadow: "0 4px 12px rgba(255, 126, 53, 0.3)" },
    footerLink: { textAlign: "center", fontSize: "13px", color: "#d1d5db", marginTop: "20px" },
    linkSpan: { color: "#ff7e35", fontWeight: "bold", cursor: "pointer", marginLeft: "5px" },
    error: { backgroundColor: "rgba(239, 68, 68, 0.2)", color: "#f87171", padding: "12px", borderRadius: "8px", fontSize: "13px", textAlign: "center", border: "1px solid #ef4444", marginBottom: "10px" }
  };

  return (
    <div style={styles.pageContainer}>
      <video src={logoVideo} autoPlay loop muted playsInline style={styles.backgroundVideo} />
      <div style={styles.overlay}></div>
      <div style={styles.contentWrapper}>
        <div style={styles.card}>
            <div style={styles.logoHeader}>
                🍅 <span style={{fontWeight: "900", color: "#fff", letterSpacing: "1px", textShadow: "0 2px 10px rgba(0,0,0,0.5)"}}>SEHAT</span>
            </div>
            <div>
                <h1 style={styles.title}>Welcome Back</h1>
                <p style={styles.subtitle}>Enter your details to access your dashboard.</p>
            </div>
            
            {error && <div style={styles.error}>{error}</div>}
            
            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
                <div style={styles.inputGroup}>
                    <label style={styles.label}>Email Address</label>
                    <input type="email" placeholder="name@example.com" value={email} onChange={(e) => setEmail(e.target.value)} style={styles.input} required />
                </div>
                
                <div style={styles.inputGroup}>
                    <label style={styles.label}>Password</label>
                    {/* NEW: Input wrapper to hold the absolute positioned button */}
                    <div style={styles.inputWrapper}>
                        <input 
                            type={showPassword ? "text" : "password"} 
                            placeholder="••••••••" 
                            value={password} 
                            onChange={(e) => setPassword(e.target.value)} 
                            style={{ ...styles.input, paddingRight: "60px" }} // Added right padding so text doesn't hide behind the button
                            required 
                        />
                        <button 
                            type="button" 
                            onClick={() => setShowPassword(!showPassword)}
                            style={styles.toggleBtn}
                        >
                            {showPassword ? "Hide" : "Show"}
                        </button>
                    </div>
                </div>

                <button type="submit" disabled={loading} style={{ ...styles.button, opacity: loading ? 0.7 : 1 }}>
                    {loading ? "Signing In..." : "Log In"}
                </button>
            </form>
            
            <p style={styles.footerLink}>Don't have an account? <span style={styles.linkSpan} onClick={() => navigate("/register")}>Sign up free</span></p>
        </div>
      </div>
    </div>
  );
}

export default Login;