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
    <div className="w-full h-full flex flex-col items-center justify-between font-sans">
      
      {/* Header */}
      <div className="w-full flex justify-between items-center mb-6">
         <h3 className="m-0 text-xl font-display font-bold text-on-surface tracking-tight">Hydration</h3>
         <span 
            className="text-xs font-bold bg-secondary-container text-on-secondary-container px-3 py-1.5 rounded-full cursor-default border border-secondary/10"
         >
            {current} / {userGoal} ml
         </span>
      </div>

      <div className="water-sphere mb-6">
            {!isEmpty && (
                <div className="water-level" style={{ height: `${visualHeight}%` }}>
                    <div className="wave-back"></div>
                    <div className="wave-front"></div>
                    <div className="water-body"></div>
                </div>
            )}
            <div className="water-text">
                <span className="amount font-display tracking-tighter">{displayPercentage}%</span>
            </div>
      </div>

      {/* --- SLEEK, MINIMALISTIC STEPPER CONTROLS --- */}
      <div className="w-full flex flex-col items-center gap-3">
          
          <div className="flex items-center gap-4">
              <button 
                onClick={() => adjustAmount(-50)} 
                className="w-10 h-10 rounded-full bg-surface-neutral hover:bg-surface-dim text-on-surface-variant flex items-center justify-center transition-colors shadow-sm border border-surface-dim"
              >
                 <span className="material-symbols-outlined text-sm">remove</span>
              </button>
              
              <div className="flex items-baseline justify-center w-20">
                  <input 
                    type="number" 
                    value={amount} 
                    onChange={(e) => setAmount(Number(e.target.value))} 
                    className="w-14 text-right bg-transparent border-none text-on-background text-xl font-bold p-0 focus:ring-0 focus:outline-none hide-arrows"
                  />
                  <span className="text-sm text-on-surface-variant font-bold ml-1">ml</span>
              </div>
              
              <button 
                onClick={() => adjustAmount(50)} 
                className="w-10 h-10 rounded-full bg-surface-neutral hover:bg-surface-dim text-on-surface-variant flex items-center justify-center transition-colors shadow-sm border border-surface-dim"
              >
                  <span className="material-symbols-outlined text-sm">add</span>
              </button>
          </div>

          <button 
            onClick={() => handleUpdate(amount)} disabled={adding || amount <= 0}
            className="w-full max-w-[200px] mt-2 py-3 rounded-full bg-primary hover:bg-secondary text-on-primary font-bold transition-all shadow-sm flex items-center justify-center gap-2 disabled:opacity-50"
          >
            <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>water_drop</span>
            Add Water
          </button>

          <button 
             onClick={() => handleUpdate(-amount)} 
             className="text-xs text-on-surface-variant hover:text-error underline transition-colors mt-1"
          >
            Remove {amount}ml
          </button>
      </div>

      <style>{`
        /* Input Arrow Hiding */
        .hide-arrows::-webkit-inner-spin-button, .hide-arrows::-webkit-outer-spin-button { -webkit-appearance: none; margin: 0; }
        .hide-arrows { -moz-appearance: textfield; }

        /* Sphere Elements */
        .water-sphere { position: relative; width: 160px; height: 160px; border-radius: 50%; border: 4px solid #e1e3e4; background: #f8f9fa; box-shadow: inset 0 4px 10px rgba(0,0,0,0.05), 0 8px 16px rgba(0,0,0,0.1); overflow: hidden; z-index: 1; }
        /* Using blue for water even in green theme for semantics, but lighter */
        .water-level { position: absolute; bottom: 0; left: 0; width: 100%; transition: height 1s cubic-bezier(0.4, 0, 0.2, 1); z-index: 2; }
        .water-body { position: absolute; inset: 0; background: linear-gradient(180deg, #3b82f6 0%, #2563eb 100%); z-index: 3; border-radius: 0 0 160px 160px; }
        .wave-front { position: absolute; bottom: 100%; left: 0; width: 200%; height: 26px; margin-bottom: -10px; background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 800 88.7'%3E%3Cpath d='M800 56.9c-155.5 0-204.9-50-405.5-49.9-200 0-250 49.9-394.5 49.9v31.8h800v-.2-31.6z' fill='%233b82f6'/%3E%3C/svg%3E"); background-size: 50% 100%; animation: waveMove 2.5s linear infinite; z-index: 2; }
        .wave-back { position: absolute; bottom: 100%; left: 0; width: 200%; height: 30px; margin-bottom: -10px; background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 800 88.7'%3E%3Cpath d='M800 56.9c-155.5 0-204.9-50-405.5-49.9-200 0-250 49.9-394.5 49.9v31.8h800v-.2-31.6z' fill='%233b82f6' opacity='0.5'/%3E%3C/svg%3E"); background-size: 50% 100%; animation: waveMove 4s linear infinite; z-index: 1; }
        .water-text { position: absolute; inset: 0; display: flex; justify-content: center; align-items: center; z-index: 10; pointer-events: none; }
        /* Mixed blend mode so text shows up against both light background and dark water */
        .amount { font-size: 32px; font-weight: 900; color: #181c1a; text-shadow: 0 2px 4px rgba(255,255,255,0.8); mix-blend-mode: overlay; z-index: 20;}
        /* Workaround for blend mode not always playing nice with text-shadow */
        .water-level + .water-text .amount { color: #ffffff; text-shadow: 0 2px 6px rgba(0,0,0,0.4); mix-blend-mode: normal; }
        
        @keyframes waveMove { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }
      `}</style>
    </div>
  );
};

export default WaterTracker;