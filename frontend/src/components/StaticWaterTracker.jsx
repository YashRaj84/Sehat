import React from "react";

const StaticWaterTracker = ({ log, userGoal }) => {
  const current = log?.waterConsumed || 0;
  const safeGoal = userGoal || 2500;
  const rawPercentage = (current / safeGoal) * 100;
  const displayPercentage = Math.round(rawPercentage);
  const fillPercentage = Math.min(rawPercentage, 100);

  // We are creating a simple SVG human body mask
  // The water fills up from the bottom

  return (
    <div className="w-full h-full flex flex-col items-center justify-between font-sans">
      
      {/* Header */}
      <div className="w-full flex justify-between items-center mb-4">
         <h3 className="m-0 text-xl font-display font-bold text-on-surface tracking-tight">Hydration</h3>
         <span className="inline-block text-xs font-bold bg-primary-container text-on-primary-container px-3 py-1.5 rounded-full cursor-default transition-all duration-300 hover:scale-105 hover:bg-primary/20 hover:shadow-sm">
            {current} / {safeGoal} ml
         </span>
      </div>

      {/* Premium Apple Health Style Silhouette */}
      <div className="relative w-28 h-56 mx-auto mt-8 flex justify-center items-center">
          <svg viewBox="0 0 100 200" className="w-full h-full drop-shadow-sm overflow-visible">
             <defs>
                 {/* Single continuous enclosed vector path meticulously patterned after the reference image */}
                 <clipPath id="human-clip">
                     <path d="M 44 32 A 14 14 0 1 1 56 32 C 56 35, 60 38, 64 38 L 76 38 A 6 6 0 0 1 82 44 L 82 110 A 6 6 0 0 1 70 110 L 70 50 A 3 3 0 0 0 64 50 Q 62 85 64 120 L 64 185 A 6 6 0 0 1 52 185 L 52 100 A 2 2 0 0 0 48 100 L 48 185 A 6 6 0 0 1 36 185 L 36 120 Q 38 85 36 50 A 3 3 0 0 0 30 50 L 30 110 A 6 6 0 0 1 18 110 L 18 44 A 6 6 0 0 1 24 38 L 36 38 C 40 38, 44 35, 44 32 Z" />
                 </clipPath>
             </defs>
             
             {/* 1. Water Fill Container (Clipped to Human Shape) */}
             <g clipPath="url(#human-clip)">
                 {/* Very light grey background for the hollow interior */}
                 <rect x="0" y="0" width="100" height="200" fill="#f8fafc" />
                 
                 {/* Rising Blue Water Fill */}
                 <rect 
                    x="0" 
                    y={200 - (fillPercentage / 100) * 200} 
                    width="100" 
                    height="200" 
                    fill="#3b82f6" 
                    className="transition-all duration-1000 ease-out"
                 />
                 
                 {/* Water surface highlight */}
                 <rect 
                    x="0" 
                    y={200 - (fillPercentage / 100) * 200} 
                    width="100" 
                    height="4" 
                    fill="#60a5fa" 
                    className="transition-all duration-1000 ease-out"
                 />
             </g>

             {/* 2. Thin Outer Stroke (Drawn over the water for clean edges) */}
             <path 
                d="M 44 32 A 14 14 0 1 1 56 32 C 56 35, 60 38, 64 38 L 76 38 A 6 6 0 0 1 82 44 L 82 110 A 6 6 0 0 1 70 110 L 70 50 A 3 3 0 0 0 64 50 Q 62 85 64 120 L 64 185 A 6 6 0 0 1 52 185 L 52 100 A 2 2 0 0 0 48 100 L 48 185 A 6 6 0 0 1 36 185 L 36 120 Q 38 85 36 50 A 3 3 0 0 0 30 50 L 30 110 A 6 6 0 0 1 18 110 L 18 44 A 6 6 0 0 1 24 38 L 36 38 C 40 38, 44 35, 44 32 Z" 
                fill="none" 
                stroke="#e2e8f0" 
                strokeWidth="1.5" 
                strokeLinejoin="round"
                strokeLinecap="round"
             />
          </svg>
      </div>

      <div className="mt-8 text-center">
         <p className="text-sm font-semibold text-on-surface-variant m-0">Currently at {displayPercentage}% of your daily intake</p>
      </div>
      
    </div>
  );
};

export default StaticWaterTracker;
