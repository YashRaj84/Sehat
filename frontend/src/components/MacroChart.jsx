import React from "react";

const MacroChart = ({ log, goals }) => {
  // 1. Get Totals
  const protein = log.totalProtein || 0;
  const carbs = log.totalCarbs || 0;
  const fats = log.totalFats || 0;
  
  // 2. Calculate Total Grams for ratios
  const totalGrams = protein + carbs + fats;
  
  // Avoid division by zero
  const p = totalGrams ? (protein / totalGrams) * 100 : 0;
  const c = totalGrams ? (carbs / totalGrams) * 100 : 0;
  const f = totalGrams ? (fats / totalGrams) * 100 : 0;

  // 3. SVG Geometry Logic (Circle Circumference)
  const radius = 70;
  const circumference = 2 * Math.PI * radius; // ~440px
  
  // Calculate stroke offsets
  // We stack them: Protein starts at 0, Carbs starts after Protein, Fats after both
  const pOffset = circumference - (p / 100) * circumference;
  const cOffset = circumference - (c / 100) * circumference;
  const fOffset = circumference - (f / 100) * circumference;

  return (
    <div style={{
      background: "white",
      padding: "24px",
      borderRadius: "20px",
      boxShadow: "0 4px 20px rgba(0,0,0,0.05)",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      width: "100%",
      maxWidth: "360px" // Keep it contained
    }}>
      <h3 style={{ margin: "0 0 20px 0", color: "#334155", alignSelf: "flex-start" }}>
        Macro Split
      </h3>

      <div style={{ position: "relative", width: "200px", height: "200px" }}>
        {/* CENTER TEXT */}
        <div style={{
            position: "absolute", top: 0, left: 0, width: "100%", height: "100%",
            display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center"
        }}>
            <span style={{ fontSize: "28px", fontWeight: "800", color: "#1e293b" }}>
                {Math.round(log.totalCalories || 0)}
            </span>
            <span style={{ fontSize: "12px", color: "#64748b", fontWeight: "600" }}>kcal eaten</span>
        </div>

        {/* SVG CHART */}
        <svg width="200" height="200" viewBox="0 0 200 200" style={{ transform: "rotate(-90deg)" }}>
            {/* Background Circle (Grey) */}
            <circle cx="100" cy="100" r={radius} fill="none" stroke="#f1f5f9" strokeWidth="20" />

            {/* FATS (Orange) - Bottom Layer */}
            <circle cx="100" cy="100" r={radius} fill="none" stroke="#fb923c" strokeWidth="20"
                strokeDasharray={circumference}
                strokeDashoffset={circumference - ((p+c+f)/100)*circumference} 
                strokeLinecap="round"
                style={{ transition: "stroke-dashoffset 1s ease" }}
            />

            {/* CARBS (Blue) - Middle Layer */}
            <circle cx="100" cy="100" r={radius} fill="none" stroke="#818cf8" strokeWidth="20"
                strokeDasharray={circumference}
                strokeDashoffset={circumference - ((p+c)/100)*circumference}
                strokeLinecap="round"
                style={{ transition: "stroke-dashoffset 1s ease" }}
            />

            {/* PROTEIN (Purple) - Top Layer */}
            <circle cx="100" cy="100" r={radius} fill="none" stroke="#a78bfa" strokeWidth="20"
                strokeDasharray={circumference}
                strokeDashoffset={pOffset} 
                strokeLinecap="round"
                style={{ transition: "stroke-dashoffset 1s ease" }}
            />
        </svg>
      </div>

      {/* LEGEND */}
      <div style={{ display: "flex", gap: "20px", marginTop: "24px", width: "100%", justifyContent: "center" }}>
        
        <MacroLegend color="#a78bfa" label="Protein" val={protein} total={goals.proteinGoal} />
        <MacroLegend color="#818cf8" label="Carbs" val={carbs} total={goals.carbsGoal} />
        <MacroLegend color="#fb923c" label="Fats" val={fats} total={goals.fatsGoal} />

      </div>
    </div>
  );
};

// Helper Sub-component for clean code
const MacroLegend = ({ color, label, val, total }) => (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
        <span style={{ fontSize: "12px", color: "#64748b", marginBottom: "4px", display: "flex", alignItems: "center", gap: "6px" }}>
            <span style={{ width: "8px", height: "8px", borderRadius: "50%", background: color }}></span>
            {label}
        </span>
        <span style={{ fontWeight: "700", color: "#334155", fontSize: "16px" }}>{Math.round(val)}g</span>
        <span style={{ fontSize: "10px", color: "#94a3b8" }}>/ {total}g</span>
    </div>
);

export default MacroChart;