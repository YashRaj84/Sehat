import React, { useEffect, useState } from "react";
import api from "../api/axios";
import logoVideo from "../assets/logo.mp4"; // <--- IMPORT LOGO

// Components
import Navbar from "../components/Navbar";
import AddMeal from "../components/AddMeal";
import WaterTracker from "../components/WaterTracker";
import CalorieDonut from "../components/CalorieDonut";
import FoodTimeline from "../components/FoodTimeline";

function Dashboard() {
  const [log, setLog] = useState(null);
  const [loading, setLoading] = useState(true);
  const user = JSON.parse(localStorage.getItem("user")) || {};

  const fetchLog = async () => {
    try {
      const res = await api.get("/log/today");
      setLog(res.data);
    } catch (err) {
      console.error("Error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchLog(); }, []);


  if (loading) return <div style={{...styles.container, justifyContent: "center"}}>Loading...</div>;
  if (!log) return <div style={{...styles.container, justifyContent: "center", color: "#ef4444"}}>Failed to load data.</div>;

  // --- GOAL CALCULATIONS ---
  const calorieGoal = user.dailyCalorieLimit || 2000;
  
  const macroGoals = {
      protein: Math.round((calorieGoal * 0.25) / 4), 
      carbs: Math.round((calorieGoal * 0.50) / 4),   
      fats: Math.round((calorieGoal * 0.25) / 9)     
  };

  return (
    <div style={styles.container}>
      
      {/* --- NAVIGATION --- */}
      <Navbar />

      <div style={styles.mainContent}>
        
        <div style={{ marginBottom: "30px" }}>
            <h1 style={styles.pageTitle}>Today's Overview</h1>
            <p style={styles.pageSubtitle}>Let's keep your nutrition on track.</p>
        </div>

        {/* --- VISUALS GRID --- */}
        <div style={styles.gridContainer}>
            <div style={styles.card}>
                <CalorieDonut log={log} goal={calorieGoal} macroGoals={macroGoals} />
            </div>
            <div style={styles.card}>
                 <WaterTracker log={log} userGoal={user.waterGoal || 2500} onUpdate={fetchLog} />
            </div>
        </div>

        {/* --- LOGGING AREA --- */}
        <div style={styles.loggingGrid}>
            <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
                <div style={styles.card}>
                    <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "20px" }}>
                         <span style={{ fontSize: "24px" }}>🍽️</span>
                         <h3 style={styles.cardTitle}>Log Meal</h3>
                    </div>
                    <AddMeal onAdded={fetchLog} />
                </div>
                <FoodTimeline items={log.foodItems} onRefresh={fetchLog} />
            </div>

            {/* Sidebar Tip */}
            <div>
                <div style={styles.tipCard}>
                    <h3 style={{ fontSize: "16px", fontWeight: "bold", marginBottom: "8px", color: "#fff" }}>💡 Pro Tip</h3>
                    <p style={{ fontSize: "13px", lineHeight: "1.5", color: "#cbd5e1" }}>
                        Tracking your water intake is just as important as your calories for maintaining energy levels throughout the day.
                    </p>
                </div>
            </div>
        </div>

      </div>
    </div>
  );
}

const styles = {
  container: { minHeight: "100vh", backgroundColor: "#111827", color: "#ffffff", fontFamily: "'Inter', sans-serif", display: "flex", flexDirection: "column" },
  mainContent: { maxWidth: "1200px", width: "100%", margin: "0 auto", padding: "30px 24px", boxSizing: "border-box" },
  pageTitle: { fontSize: "32px", fontWeight: "800", margin: "0 0 8px 0" },
  pageSubtitle: { color: "#9ca3af", margin: 0, fontSize: "16px" },
  gridContainer: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "24px", marginBottom: "30px" },
  card: { backgroundColor: "#1f2937", borderRadius: "24px", padding: "24px", border: "1px solid #374151", boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)", display: "flex", flexDirection: "column", justifyContent: "center" },
  cardTitle: { margin: 0, fontSize: "18px", fontWeight: "700" },
  loggingGrid: { display: "grid", gridTemplateColumns: "2fr 1fr", gap: "24px" },
  tipCard: { backgroundColor: "#3b82f6", backgroundImage: "linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)", borderRadius: "24px", padding: "24px", position: "sticky", top: "100px" }
};

export default Dashboard;