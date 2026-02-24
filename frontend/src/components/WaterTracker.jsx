import { useState } from "react";
import api from "../api/axios";

const WaterTracker = ({ log, userGoal, onUpdate }) => {
  const [adding, setAdding] = useState(false);
  const [amount, setAmount] = useState(250);

  const current = log?.waterConsumed || 0;
  const rawPercentage = (current / userGoal) * 100;
  const displayPercentage = Math.round(rawPercentage);
  const isEmpty = current === 0;
  const visualHeight = Math.min(rawPercentage, 100);

  const handleUpdate = async (val) => {
    try {
      setAdding(true);
      await api.patch("/log/water", { amount: val });
      onUpdate();
    } catch (err) {
      console.error(err);
    } finally {
      setAdding(false);
    }
  };

  const adjustAmount = (delta) => setAmount((prev) => Math.max(0, prev + delta));

  return (
    <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", alignItems: "center", padding: "10px" }}>
      
      {/* Header */}
      <div style={{ width: "100%", display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
         <h3 style={{ margin: 0, fontSize: "18px", color: "#fff" }}>Hydration</h3>
         <span 
            className="hover-badge" 
            style={{ fontSize: "12px", fontWeight: "bold", color: "#0ea5e9", backgroundColor: "#1f2937", padding: "6px 10px", borderRadius: "8px", boxShadow: "inset 0 2px 4px rgba(0,0,0,0.3)", cursor: "default" }}
         >
            {current} / {userGoal} ml
         </span>
      </div>

      <div className="water-sphere">
            {!isEmpty && (
                <div className="water-level" style={{ height: `${visualHeight}%` }}>
                    <div className="wave-back"></div>
                    <div className="wave-front"></div>
                </div>
            )}
            <div className="water-text">
                <span className="amount">{displayPercentage}%</span>
            </div>
      </div>

      {/* --- SLEEK, MINIMALISTIC STEPPER CONTROLS --- */}
      <div style={{ marginTop: "28px", width: "100%", maxWidth: "200px" }}>
          
          {/* Glassmorphism Pill Stepper */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", background: "rgba(30, 41, 59, 0.4)", backdropFilter: "blur(8px)", borderRadius: "30px", padding: "4px 6px", border: "1px solid rgba(255,255,255,0.05)" }}>
              <button 
                onClick={() => adjustAmount(-50)} 
                className="stepper-btn"
              >−</button>
              
              <div style={{ display: "flex", alignItems: "baseline", justifyContent: "center", flex: 1 }}>
                  <input 
                    type="number" 
                    value={amount} 
                    onChange={(e) => setAmount(Number(e.target.value))} 
                    className="hide-arrows smooth-input"
                  />
                  <span style={{ fontSize: "12px", color: "#64748b", fontWeight: "600", marginLeft: "2px" }}>ml</span>
              </div>
              
              <button 
                onClick={() => adjustAmount(50)} 
                className="stepper-btn"
              >+</button>
          </div>

          <button 
            onClick={() => handleUpdate(amount)} disabled={adding || amount <= 0}
            className="add-water-btn"
            style={{ opacity: adding ? 0.7 : 1 }}
          >
            Add Water
          </button>

          <div style={{ textAlign: "center", marginTop: "12px" }}>
             <button onClick={() => handleUpdate(-amount)} style={{ background: "none", border: "none", color: "#64748b", fontSize: "11px", cursor: "pointer", textDecoration: "underline", transition: "color 0.2s" }} onMouseOver={(e) => e.target.style.color = "#ef4444"} onMouseOut={(e) => e.target.style.color = "#64748b"}>
                Remove {amount}ml
             </button>
          </div>
      </div>

      <style>{`
        .hover-badge { transition: transform 0.5s ease; display: inline-block; }
        .hover-badge:hover { transform: scale(1.08); }

        /* --- NEW MINIMALISTIC UI STYLES --- */
        .stepper-btn {
            width: 32px;
            height: 32px;
            border-radius: 50%;
            background: transparent;
            border: none;
            color: #94a3b8;
            font-size: 20px;
            font-weight: 300;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: all 0.2s ease;
        }
        .stepper-btn:hover {
            background: rgba(255, 255, 255, 0.1);
            color: #ffffff;
        }
        .stepper-btn:active {
            transform: scale(0.85);
        }

        .smooth-input {
            width: 50px;
            text-align: right;
            background: transparent;
            border: none;
            color: #ffffff;
            font-size: 18px;
            font-weight: 700;
            outline: none;
            transition: color 0.2s ease;
        }
        .smooth-input:focus {
            color: #0ea5e9;
        }

        .add-water-btn {
            width: 100%;
            margin-top: 14px;
            padding: 12px;
            border-radius: 30px; /* Pill shape */
            background: linear-gradient(135deg, #0ea5e9, #2563eb);
            color: white;
            border: none;
            font-weight: 600;
            font-size: 14px;
            cursor: pointer;
            transition: all 0.2s ease;
            box-shadow: 0 4px 12px rgba(14, 165, 233, 0.2);
        }
        .add-water-btn:hover:not(:disabled) {
            box-shadow: 0 6px 16px rgba(14, 165, 233, 0.4);
            transform: translateY(-2px);
        }
        .add-water-btn:active:not(:disabled) {
            transform: translateY(1px);
        }

        /* Input Arrow Hiding */
        .hide-arrows::-webkit-inner-spin-button, .hide-arrows::-webkit-outer-spin-button { -webkit-appearance: none; margin: 0; }
        .hide-arrows { -moz-appearance: textfield; }

        /* Sphere Elements */
        .water-sphere { position: relative; width: 180px; height: 180px; border-radius: 50%; border: 4px solid #1e293b; background: #111827; box-shadow: 0 8px 16px rgba(0,0,0,0.4); overflow: hidden; z-index: 1; }
        .water-level { position: absolute; bottom: 0; left: 0; width: 100%; background: linear-gradient(180deg, #0ea5e9 0%, #2563eb 100%); transition: height 1s cubic-bezier(0.4, 0, 0.2, 1); z-index: 2; }
        .wave-front { position: absolute; top: -20px; left: 0; width: 200%; height: 22px; background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 800 88.7'%3E%3Cpath d='M800 56.9c-155.5 0-204.9-50-405.5-49.9-200 0-250 49.9-394.5 49.9v31.8h800v-.2-31.6z' fill='%230ea5e9'/%3E%3C/svg%3E"); background-size: 50% 100%; animation: waveMove 2.5s linear infinite; z-index: 2; }
        .wave-back { position: absolute; top: -24px; left: 0; width: 200%; height: 25px; background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 800 88.7'%3E%3Cpath d='M800 56.9c-155.5 0-204.9-50-405.5-49.9-200 0-250 49.9-394.5 49.9v31.8h800v-.2-31.6z' fill='%230ea5e9' opacity='0.5'/%3E%3C/svg%3E"); background-size: 50% 100%; animation: waveMove 4s linear infinite; z-index: 1; }
        .water-text { position: absolute; inset: 0; display: flex; justify-content: center; align-items: center; z-index: 10; pointer-events: none; }
        .amount { font-size: 36px; font-weight: 900; color: #ffffff; text-shadow: 0 2px 6px rgba(0,0,0,0.8); }
        @keyframes waveMove { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }
      `}</style>
    </div>
  );
};

export default WaterTracker;