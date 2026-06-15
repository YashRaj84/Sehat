import React, { useState, useEffect } from "react";

// --- SUB-COMPONENT FOR MINI DONUTS ---
const MiniMacroDonut = ({ label, current, target, colorClass, strokeColor }) => {
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
            className="mini-donut-wrapper flex flex-col items-center gap-1.5 cursor-pointer"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            style={{ 
                "--mini-circumference": circumference,
                "--mini-target": targetOffset
            }}
        >
            <div className="relative" style={{ width: size, height: size }}>
                <svg width={size} height={size} style={{ transform: "rotate(-90deg)", overflow: "visible" }}>
                    
                    {/* Background */}
                    <circle 
                        cx={size/2} cy={size/2} r={radius} 
                        fill="none" className="stroke-surface-dim" strokeWidth={stroke} 
                    />
                    
                    {/* Colored Ring */}
                    <circle 
                        className="mini-donut-fill"
                        cx={size/2} cy={size/2} r={radius} 
                        fill="none" stroke={strokeColor} strokeWidth={stroke} 
                        strokeDasharray={circumference} 
                        strokeDashoffset={targetOffset} 
                        strokeLinecap="round" 
                    />
                </svg>

                <div className="absolute inset-0 flex items-center justify-center text-[10px] font-bold text-on-surface">
                    {Math.round(displayPct)}%
                </div>
            </div>
            <div className="text-center mt-1">
                <div className={`text-[11px] font-bold uppercase ${colorClass}`}>{label}</div>
                <div className="text-[10px] text-on-surface-variant font-medium">{current} / {target}g</div>
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
  const circumference = 2 * Math.PI * 90; // Increased radius to 90
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
    <div className="w-full h-full flex flex-col items-center justify-center font-sans gap-8">
        
        {/* MAIN CALORIE DONUT */}
        <div 
            className="donut-wrapper relative w-[200px] h-[200px] cursor-pointer"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            style={{ 
                "--target-offset": targetOffset,
                "--circumference": circumference
            }}
        >
            <div className="absolute inset-0 flex flex-col justify-center items-center">
                <span className="text-[44px] font-black text-on-surface leading-none font-display text-primary tracking-tight">
                    {Math.max(0, safeGoal - displayCal).toLocaleString()} 
                </span>
                <span className="text-xs font-bold text-on-surface-variant uppercase mt-1">REMAINING</span>
            </div>
            
            <svg width="200" height="200" style={{ transform: "rotate(-90deg)", overflow: "visible" }}>
                {/* Background Ring */}
                <circle 
                    cx="100" cy="100" r="90" 
                    fill="none" className="stroke-surface-variant" strokeWidth="16" 
                />
                {/* Main Calorie Ring */}
                <circle 
                    className="main-donut-fill"
                    cx="100" cy="100" r="90" 
                    fill="none" stroke="#0e6c4a" strokeWidth="16" 
                    strokeDasharray={circumference} 
                    strokeDashoffset={targetOffset} 
                    strokeLinecap="round"
                />
            </svg>
            <style>{`
                .main-donut-fill { transition: stroke-dashoffset 1s ease-out; }
                .donut-wrapper:hover .main-donut-fill { animation: drawRing 1s cubic-bezier(0.4, 0, 0.2, 1) forwards; }
                @keyframes drawRing { 0% { stroke-dashoffset: var(--circumference); } 100% { stroke-dashoffset: var(--target-offset); } }
            `}</style>
        </div>

        {/* MINI MACRO DONUTS ROW */}
        <div className="flex justify-center gap-8 w-full">
            <MiniMacroDonut label="Protein" current={protein} target={pGoal} colorClass="text-[#3B82F6]" strokeColor="#3B82F6" />
            <MiniMacroDonut label="Carbs" current={carbs} target={cGoal} colorClass="text-[#F59E0B]" strokeColor="#F59E0B" />
            <MiniMacroDonut label="Fats" current={fats} target={fGoal} colorClass="text-[#8B5CF6]" strokeColor="#8B5CF6" />
        </div>

        {/* --- STYLES FOR ANIMATIONS --- */}
        <style>{`

            .mini-donut-fill { transition: stroke-dashoffset 1s ease-out; }
            .mini-donut-wrapper:hover .mini-donut-fill { animation: drawMiniRing 1s cubic-bezier(0.4, 0, 0.2, 1) forwards; }
            @keyframes drawMiniRing { 0% { stroke-dashoffset: var(--mini-circumference); } 100% { stroke-dashoffset: var(--mini-target); } }
        `}</style>
    </div>
  );
};

export default CalorieDonut;