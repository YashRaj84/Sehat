import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import logoVideo from "../assets/logo.mp4"; 

function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  
  // 🔥 New State for Password Toggle
  const [showPassword, setShowPassword] = useState(false);

  const [form, setForm] = useState({
    name: "", email: "", password: "",
    age: "", gender: "male", height: "", weight: "",
    activityLevel: "moderate", dietType: "veg", allergies: [],
    goal: "fat_loss"
  });

  const totalSteps = 6;
  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });
  const handleSelect = (name, value) => setForm({ ...form, [name]: value });

  const handleNext = () => {
    setError("");
    if (step === 1 && (!form.name || !form.email || !form.password)) return setError("Please fill all fields");
    if (step === 2 && !form.gender) return setError("Select a gender");
    if (step === 3 && !form.age) return setError("Enter your age");
    if (step === 4 && (!form.height || !form.weight)) return setError("Enter height and weight");
    setStep(prev => Math.min(prev + 1, totalSteps));
  };

  const handleBack = () => setStep(prev => Math.max(prev - 1, 1));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await register({ ...form, age: Number(form.age), height: Number(form.height), weight: Number(form.weight) });
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
      setLoading(false);
    }
  };

  const styles = {
    pageContainer: { position: "relative", width: "100vw", minHeight: "100vh", overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Inter', sans-serif" },
    backgroundVideo: { position: "absolute", top: 0, left: 0, width: "100%", height: "100%", objectFit: "cover", zIndex: 0 },
    overlay: { position: "absolute", top: 0, left: 0, width: "100%", height: "100%", backgroundColor: "rgba(17, 24, 39, 0.6)", zIndex: 1 },
    contentWrapper: { position: "relative", zIndex: 10, width: "100%", maxWidth: "450px", padding: "20px", display: "flex", flexDirection: "column", height: "100vh", justifyContent: "center" },
    card: {
      backgroundColor: "rgba(31, 41, 55, 0.4)", 
      backdropFilter: "blur(12px)",
      border: "1px solid rgba(255, 255, 255, 0.15)",
      borderRadius: "24px",
      padding: "30px",
      boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5)",
      display: "flex",
      flexDirection: "column",
      maxHeight: "90vh",
      overflowY: "auto"
    },
    header: { textAlign: "center", marginBottom: "20px" },
    logoHeader: { fontSize: "28px", fontWeight: "900", color: "#fff", marginBottom: "20px", letterSpacing: "1px", textShadow: "0 2px 10px rgba(0,0,0,0.5)" },
    progressContainer: { display: "flex", gap: "6px", marginBottom: "10px" },
    progressDash: (active) => ({ height: "4px", flex: 1, borderRadius: "2px", backgroundColor: active ? "#ff7e35" : "rgba(255,255,255,0.2)", transition: "background 0.3s ease" }),
    stepLabel: { color: "#ff7e35", fontSize: "12px", fontWeight: "bold", textTransform: "uppercase", letterSpacing: "1px" },
    title: { fontSize: "24px", fontWeight: "700", marginBottom: "8px", textAlign: "center", color: "white", textShadow: "0 2px 4px rgba(0,0,0,0.5)" },
    subtitle: { fontSize: "14px", color: "#e5e7eb", textAlign: "center", marginBottom: "24px", textShadow: "0 1px 2px rgba(0,0,0,0.5)" },
    inputGroup: { marginBottom: "15px" },
    label: { display: "block", fontSize: "11px", fontWeight: "bold", color: "#d1d5db", marginBottom: "6px", textTransform: "uppercase" },
    input: { width: "100%", padding: "14px", backgroundColor: "rgba(17, 24, 39, 0.6)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "10px", color: "#ffffff", fontSize: "16px", outline: "none", boxSizing: "border-box" },
    selectionGrid: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" },
    selectionCard: (selected) => ({ padding: "16px", borderRadius: "14px", border: selected ? "2px solid #ff7e35" : "1px solid rgba(255,255,255,0.1)", backgroundColor: selected ? "rgba(255, 126, 53, 0.2)" : "rgba(17, 24, 39, 0.4)", color: selected ? "#ff7e35" : "#d1d5db", cursor: "pointer", textAlign: "center", fontWeight: "bold", transition: "all 0.2s" }),
    button: { width: "100%", padding: "16px", backgroundColor: "#ffffff", color: "#111827", border: "none", borderRadius: "30px", fontSize: "16px", fontWeight: "bold", cursor: "pointer", marginTop: "20px" },
    backButton: { background: "none", border: "none", color: "#d1d5db", fontSize: "14px", cursor: "pointer", fontWeight: "600", width: "100%", textAlign: "center", marginTop: "10px" },
    error: { backgroundColor: "rgba(239, 68, 68, 0.2)", color: "#f87171", padding: "10px", borderRadius: "8px", fontSize: "13px", textAlign: "center", marginBottom: "20px", border: "1px solid #ef4444" }
  };

  return (
    <div style={styles.pageContainer}>
      <video src={logoVideo} autoPlay loop muted playsInline style={styles.backgroundVideo} />
      <div style={styles.overlay}></div>
      <div style={styles.contentWrapper}>
        <div style={styles.card}>
            <div style={styles.header}>
                <div style={styles.logoHeader}>🍅 SEHAT</div>
                <div style={styles.progressContainer}>
                    {[...Array(totalSteps)].map((_, i) => <div key={i} style={styles.progressDash(i < step)}></div>)}
                </div>
                <div style={styles.stepLabel}>Step {step} of {totalSteps}</div>
            </div>

            <h2 style={styles.title}>
                {step === 1 && "Account Details"}
                {step === 2 && "Select Gender"}
                {step === 3 && "How old are you?"}
                {step === 4 && "Body Metrics"}
                {step === 5 && "Activity Level"}
                {step === 6 && "Your Goal"}
            </h2>
            
            <p style={styles.subtitle}>
                {step === 1 && "Start your journey by creating a secure account."}
                {step === 2 && "This helps us calculate your metabolic rate."}
                {step === 3 && "Age influences your daily energy needs."}
                {step === 4 && "We need this to build your personalized plan."}
                {step === 5 && "Be honest! This changes your calorie budget."}
                {step === 6 && "What do you want to achieve?"}
            </p>

            {error && <div style={styles.error}>{error}</div>}

            <div style={{ flex: 1 }}>
                {step === 1 && (
                    <>
                        <div style={styles.inputGroup}>
                          <label style={styles.label}>Full Name</label>
                          <input style={styles.input} name="name" value={form.name} onChange={handleChange} placeholder="John Doe" autoComplete="off" />
                        </div>
                        
                        <div style={styles.inputGroup}>
                          <label style={styles.label}>Email</label>
                          <input style={styles.input} name="email" value={form.email} onChange={handleChange} placeholder="name@example.com" autoComplete="off" />
                        </div>
                        
                        <div style={styles.inputGroup}>
                          <label style={styles.label}>Password</label>
                          <div style={{ position: "relative", display: "flex", alignItems: "center" }}>
                            <input 
                              style={{ ...styles.input, paddingRight: "60px" }} // Added padding to prevent text hiding behind the button
                              name="password" 
                              type={showPassword ? "text" : "password"} // Toggle type
                              value={form.password} 
                              onChange={handleChange} 
                              placeholder="••••••••" 
                              autoComplete="new-password" // Kills the browser autocomplete
                            />
                            <button 
                              type="button" 
                              onClick={() => setShowPassword(!showPassword)} 
                              style={{ position: "absolute", right: "15px", background: "none", border: "none", color: "#ff7e35", cursor: "pointer", fontSize: "12px", fontWeight: "bold", textTransform: "uppercase" }}
                            >
                              {showPassword ? "Hide" : "Show"}
                            </button>
                          </div>
                        </div>
                    </>
                )}
                {/* Steps 2-6 remain unchanged */}
                {step === 2 && (<div style={styles.selectionGrid}><div style={styles.selectionCard(form.gender === "male")} onClick={() => handleSelect("gender", "male")}>👨 Male</div><div style={styles.selectionCard(form.gender === "female")} onClick={() => handleSelect("gender", "female")}>👩 Female</div></div>)}
                {step === 3 && (<div style={{ textAlign: "center", margin: "20px 0" }}><div style={{ fontSize: "50px" }}>🎂</div><input type="number" name="age" value={form.age} onChange={handleChange} style={{ fontSize: "40px", width: "100px", background: "transparent", border: "none", borderBottom: "2px solid #ff7e35", color: "white", textAlign: "center", outline: "none" }} placeholder="25" /></div>)}
                {step === 4 && (<><div style={styles.inputGroup}><label style={styles.label}>Height (cm)</label><input style={styles.input} name="height" type="number" value={form.height} onChange={handleChange} placeholder="175" /></div><div style={styles.inputGroup}><label style={styles.label}>Weight (kg)</label><input style={styles.input} name="weight" type="number" value={form.weight} onChange={handleChange} placeholder="70" /></div></>)}
                {step === 5 && (<div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>{[{ val: "sedentary", label: "Sedentary" }, { val: "light", label: "Light Active" }, { val: "moderate", label: "Moderate" }, { val: "heavy", label: "Very Active" }].map((opt) => (<div key={opt.val} onClick={() => handleSelect("activityLevel", opt.val)} style={{ ...styles.selectionCard(form.activityLevel === opt.val), textAlign: "left", display: "flex", justifyContent: "space-between" }}><span>{opt.label}</span>{form.activityLevel === opt.val && <span>✓</span>}</div>))}</div>)}
                {step === 6 && (<div style={{ display: "flex", gap: "10px", flexDirection: "column" }}><label style={styles.label}>Goal</label><div style={{ display: "flex", gap: "10px" }}>{['fat_loss', 'maintenance', 'muscle_gain'].map(g => (<button key={g} type="button" onClick={() => handleSelect("goal", g)} style={{ flex: 1, padding: "10px", borderRadius: "10px", border: form.goal === g ? "2px solid #ff7e35" : "1px solid rgba(255,255,255,0.1)", background: form.goal === g ? "#ff7e35" : "transparent", color: form.goal === g ? "white" : "#d1d5db", cursor: "pointer" }}>{g.replace("_", " ")}</button>))}</div></div>)}
            </div>

            <div>
                <button onClick={step === totalSteps ? handleSubmit : handleNext} disabled={loading} style={{ ...styles.button, opacity: loading ? 0.7 : 1 }}>{loading ? "Processing..." : (step === totalSteps ? "Finish" : "Next")}</button>
                {step > 1 && <button onClick={handleBack} style={styles.backButton}>Back</button>}
                {step === 1 && <p style={{ textAlign: "center", fontSize: "12px", color: "#d1d5db", marginTop: "15px" }}>Already have an account? <span onClick={() => navigate("/login")} style={{ color: "#ff7e35", cursor: "pointer", fontWeight: "bold" }}>Log in</span></p>}
            </div>
        </div>
      </div>
    </div>
  );
}

export default Register;