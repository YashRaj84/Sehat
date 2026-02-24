import React, { useState } from "react";
import Navbar from "../components/Navbar";
import api from "../api/axios";

const Profile = () => {
  // Pre-fill form with user data from localStorage
  const user = JSON.parse(localStorage.getItem("user")) || {};
  
  const [form, setForm] = useState({
    name: user.name || "",
    age: user.age || "",
    height: user.height || "",
    weight: user.weight || "",
    goal: user.goal || "fat_loss",
    activityLevel: user.activityLevel || "moderate",
    dietType: user.dietType || "veg"
  });

  const [status, setStatus] = useState("");

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSave = async (e) => {
    e.preventDefault();
    setStatus("Saving...");
    try {
      // Assumes you create a PUT /users/profile route in backend
      const res = await api.put("/users/profile", form);
      localStorage.setItem("user", JSON.stringify(res.data.user)); // Update local storage
      setStatus("Profile Updated Successfully!");
      setTimeout(() => setStatus(""), 3000);
    } catch (err) {
      console.error(err);
      setStatus("Failed to update profile. (Check backend route)");
    }
  };

  return (
    <div style={styles.container}>
      <Navbar />
      <div style={styles.mainContent}>
        
        <div style={styles.header}>
            <h1 style={styles.pageTitle}>My Profile</h1>
            <p style={styles.pageSubtitle}>Update your metrics to recalculate goals.</p>
        </div>

        <div style={styles.card}>
            {status && <div style={styles.statusBanner(status.includes("Success"))}>{status}</div>}

            <form onSubmit={handleSave} style={styles.formGrid}>
                
                {/* Basic Info */}
                <div style={styles.sectionTitle}>Basic Info</div>
                <div style={styles.inputGroup}><label style={styles.label}>Full Name</label><input style={styles.input} name="name" value={form.name} onChange={handleChange} /></div>
                
                {/* Metrics */}
                <div style={styles.sectionTitle}>Body Metrics</div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "15px" }}>
                    <div style={styles.inputGroup}><label style={styles.label}>Age</label><input style={styles.input} name="age" type="number" value={form.age} onChange={handleChange} /></div>
                    <div style={styles.inputGroup}><label style={styles.label}>Height (cm)</label><input style={styles.input} name="height" type="number" value={form.height} onChange={handleChange} /></div>
                    <div style={styles.inputGroup}><label style={styles.label}>Weight (kg)</label><input style={styles.input} name="weight" type="number" value={form.weight} onChange={handleChange} /></div>
                </div>

                {/* Goals */}
                <div style={styles.sectionTitle}>Preferences</div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "15px" }}>
                    <div style={styles.inputGroup}>
                        <label style={styles.label}>Goal</label>
                        <select name="goal" value={form.goal} onChange={handleChange} style={styles.input}>
                            <option value="fat_loss">Fat Loss</option>
                            <option value="maintenance">Maintenance</option>
                            <option value="muscle_gain">Muscle Gain</option>
                        </select>
                    </div>
                    <div style={styles.inputGroup}>
                        <label style={styles.label}>Activity Level</label>
                        <select name="activityLevel" value={form.activityLevel} onChange={handleChange} style={styles.input}>
                            <option value="sedentary">Sedentary</option>
                            <option value="light">Lightly Active</option>
                            <option value="moderate">Moderately Active</option>
                            <option value="heavy">Very Active</option>
                        </select>
                    </div>
                </div>

                <button type="submit" style={styles.saveBtn}>Save Changes</button>

            </form>
        </div>

      </div>
    </div>
  );
};

const styles = {
  container: { minHeight: "100vh", backgroundColor: "#111827", color: "#ffffff", fontFamily: "'Inter', sans-serif" },
  mainContent: { maxWidth: "700px", margin: "0 auto", padding: "30px 24px" },
  header: { marginBottom: "30px" },
  pageTitle: { fontSize: "32px", fontWeight: "800", margin: "0 0 8px 0" },
  pageSubtitle: { color: "#9ca3af", margin: 0, fontSize: "16px" },
  card: { backgroundColor: "#1f2937", borderRadius: "24px", padding: "30px", border: "1px solid #374151" },
  formGrid: { display: "flex", flexDirection: "column", gap: "20px" },
  sectionTitle: { fontSize: "18px", fontWeight: "bold", color: "#ff7e35", borderBottom: "1px solid #374151", paddingBottom: "10px", marginTop: "10px" },
  inputGroup: { display: "flex", flexDirection: "column", gap: "8px" },
  label: { fontSize: "12px", fontWeight: "bold", color: "#9ca3af", textTransform: "uppercase" },
  input: { width: "100%", padding: "14px", backgroundColor: "#111827", border: "1px solid #374151", borderRadius: "10px", color: "#ffffff", fontSize: "16px", outline: "none", boxSizing: "border-box" },
  saveBtn: { width: "100%", padding: "16px", backgroundColor: "#ff7e35", color: "#ffffff", border: "none", borderRadius: "12px", fontSize: "16px", fontWeight: "bold", cursor: "pointer", marginTop: "20px" },
  statusBanner: (isSuccess) => ({ padding: "15px", borderRadius: "10px", marginBottom: "20px", fontWeight: "bold", textAlign: "center", backgroundColor: isSuccess ? "rgba(34, 197, 94, 0.1)" : "rgba(239, 68, 68, 0.1)", color: isSuccess ? "#4ade80" : "#f87171", border: `1px solid ${isSuccess ? "#22c55e" : "#ef4444"}` })
};

export default Profile;