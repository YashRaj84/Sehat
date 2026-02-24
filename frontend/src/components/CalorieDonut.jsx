import React, { useState, useEffect } from "react";

// --- SUB-COMPONENT FOR MINI DONUTS ---
const MiniMacroDonut = ({ label, current, target, color }) => {
    const size = 50;
    const stroke = 5; 
    const radius = (size - stroke) / 2;
    const circumference = 2 * Math.PI * radius;
    const pct = Math.min((current / target) * 100, 100) || 0;
    const targetOffset = circumference - (pct / 100) * circumference;

    const [displayPct, setDisplayPct] = useState(pct);
    const [isHovered, setIsHovered] = useState(false);

    useEffect(() => {
        if (isHovered && pct > 0) {
            let currentVal = 0;
            const duration = 1000;
            const steps = 60;
            const stepTime = Math.abs(Math.floor(duration / steps));
            const increment = pct / steps;

            const timer = setInterval(() => {
                currentVal += increment;
                if (currentVal >= pct) {
                    setDisplayPct(pct);
                    clearInterval(timer);
                } else {
                    setDisplayPct(currentVal);
                }
            }, stepTime);

            return () => clearInterval(timer);
        } else {
            setDisplayPct(pct);
        }
    }, [isHovered, pct]);

    return (
        <div 
            className="mini-donut-wrapper"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            style={{ 
                display: "flex", flexDirection: "column", alignItems: "center", gap: "6px", cursor: "pointer",
                "--mini-circumference": circumference,
                "--mini-target": targetOffset
            }}
        >
            <div style={{ position: "relative", width: size, height: size }}>
                <svg width={size} height={size} style={{ transform: "rotate(-90deg)", overflow: "visible" }}>
                    
                    {/* Clean 3D Drop Shadow */}
                    <circle 
                        cx={size/2} cy={size/2} r={radius} 
                        fill="none" stroke="#1f2937" strokeWidth={stroke} 
                        style={{ filter: "drop-shadow(0px 8px 8px rgba(0,0,0,0.6))" }}
                    />
                    
                    {/* Glowing Colored Ring */}
                    <circle 
                        className="mini-donut-fill"
                        cx={size/2} cy={size/2} r={radius} 
                        fill="none" stroke={color} strokeWidth={stroke} 
                        strokeDasharray={circumference} 
                        strokeDashoffset={targetOffset} 
                        strokeLinecap="round" 
                        style={{ filter: `drop-shadow(0px 4px 6px ${color}80)` }} 
                    />
                </svg>

                <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "10px", fontWeight: "bold", color: "#fff", textShadow: "0 2px 4px rgba(0,0,0,0.8)" }}>
                    {Math.round(displayPct)}%
                </div>
            </div>
            <div style={{ textAlign: "center", marginTop: "4px" }}>
                <div style={{ fontSize: "11px", fontWeight: "bold", color: color, textTransform: "uppercase", textShadow: "0 1px 2px rgba(0,0,0,0.5)" }}>{label}</div>
                <div style={{ fontSize: "10px", color: "#9ca3af" }}>{current} / {target}g</div>
            </div>
        </div>
    );
};

// --- MAIN COMPONENT ---
const CalorieDonut = ({ log, goal, macroGoals }) => {
  const protein = Math.round(log?.totalProtein || 0);
  const carbs = Math.round(log?.totalCarbs || 0);
  const fats = Math.round(log?.totalFats || 0);
  const totalCalories = Math.round(log?.totalCalories || 0);
  const safeGoal = goal || 2000;

  const pGoal = macroGoals?.protein || 150;
  const cGoal = macroGoals?.carbs || 250;
  const fGoal = macroGoals?.fats || 70;

  const calPct = Math.min((totalCalories / safeGoal) * 100, 100);
  const circumference = 2 * Math.PI * 80;
  const targetOffset = circumference - (calPct / 100) * circumference;

  const [displayCal, setDisplayCal] = useState(totalCalories);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    if (isHovered && totalCalories > 0) {
        let current = 0;
        const duration = 1000; 
        const steps = 60; 
        const stepTime = Math.abs(Math.floor(duration / steps));
        const increment = totalCalories / steps;

        const timer = setInterval(() => {
            current += increment;
            if (current >= totalCalories) {
                setDisplayCal(totalCalories);
                clearInterval(timer);
            } else {
                setDisplayCal(Math.round(current));
            }
        }, stepTime);

        return () => clearInterval(timer);
    } else {
        setDisplayCal(totalCalories);
    }
  }, [isHovered, totalCalories]);

  return (
    <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "space-between", padding: "10px" }}>
        
        {/* HEADER */}
        <div style={{ width: "100%", display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px" }}>
            <h3 style={{ margin: 0, fontSize: "18px", color: "#fff", textShadow: "0 2px 4px rgba(0,0,0,0.3)" }}>Daily Energy</h3>
            
            <span 
                className="hover-badge" 
                style={{ fontSize: "12px", fontWeight: "bold", backgroundColor: "#1f2937", color: "#ff7e35", padding: "6px 10px", borderRadius: "8px", cursor: "default", boxShadow: "inset 0 2px 4px rgba(0,0,0,0.3)" }}
            >
                {totalCalories} / {safeGoal} kcal
            </span>
        </div>

        {/* MAIN CALORIE DONUT */}
        <div 
            className="donut-wrapper"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            style={{ 
                position: "relative", width: "180px", height: "180px", marginBottom: "20px", cursor: "pointer",
                "--target-offset": targetOffset,
                "--circumference": circumference
            }}
        >
            <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center" }}>
                <span style={{ fontSize: "38px", fontWeight: "900", color: "#fff", textShadow: "0 4px 12px rgba(0,0,0,0.5)" }}>
                    {displayCal} 
                </span>
                <span style={{ fontSize: "12px", fontWeight: "bold", color: "#9ca3af", letterSpacing: "1px", textShadow: "0 2px 4px rgba(0,0,0,0.5)" }}>CONSUMED</span>
            </div>
            
            <svg width="180" height="180" style={{ transform: "rotate(-90deg)", overflow: "visible" }}>
                
                {/* Background Shadow */}
                <circle 
                    cx="90" cy="90" r="80" 
                    fill="none" stroke="#1f2937" strokeWidth="14" 
                    style={{ filter: "drop-shadow(0px 15px 20px rgba(0,0,0,0.8))" }}
                />
                
                {/* Main Calorie Ring */}
                <circle 
                    className="main-donut-fill"
                    cx="90" cy="90" r="80" 
                    fill="none" stroke="#ff7e35" strokeWidth="14" 
                    strokeDasharray={circumference} 
                    strokeDashoffset={targetOffset} 
                    strokeLinecap="round"
                    style={{ filter: "drop-shadow(0px 8px 16px rgba(255, 126, 53, 0.5))" }}
                />
            </svg>
        </div>

        {/* MINI MACRO DONUTS ROW */}
        <div style={{ display: "flex", justifyContent: "space-around", width: "100%", borderTop: "1px solid #374151", paddingTop: "24px" }}>
            <MiniMacroDonut label="Protein" current={protein} target={pGoal} color="#a855f7" />
            <MiniMacroDonut label="Carbs" current={carbs} target={cGoal} color="#3b82f6" />
            
            {/* 🔥 NEW: Fats color changed to Yellow Ochre (#eab308) */}
            <MiniMacroDonut label="Fats" current={fats} target={fGoal} color="#eab308" />
        </div>

        {/* --- STYLES FOR ANIMATIONS --- */}
        <style>{`
            .hover-badge { transition: transform 0.5s ease; display: inline-block; }
            .hover-badge:hover { transform: scale(1.08); }

            .main-donut-fill { transition: stroke-dashoffset 1s ease-out; }
            .donut-wrapper:hover .main-donut-fill { animation: drawRing 1s cubic-bezier(0.4, 0, 0.2, 1) forwards; }
            @keyframes drawRing { 0% { stroke-dashoffset: var(--circumference); } 100% { stroke-dashoffset: var(--target-offset); } }

            .mini-donut-fill { transition: stroke-dashoffset 1s ease-out; }
            .mini-donut-wrapper:hover .mini-donut-fill { animation: drawMiniRing 1s cubic-bezier(0.4, 0, 0.2, 1) forwards; }
            @keyframes drawMiniRing { 0% { stroke-dashoffset: var(--mini-circumference); } 100% { stroke-dashoffset: var(--mini-target); } }
        `}</style>
    </div>
  );
};

export default CalorieDonut;