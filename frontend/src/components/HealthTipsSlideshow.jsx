import React, { useState, useEffect } from "react";

const tips = [
  "Tip: Drink at least 8 glasses of water a day.",
  "Tip: Include protein in every meal to stay full longer.",
  "Tip: Get at least 7-8 hours of sleep for better metabolism.",
  "Tip: Eat a rainbow of vegetables to get diverse nutrients.",
  "Tip: Take a 10-minute walk after lunch to aid digestion."
];

const HealthTipsSlideshow = () => {
  const [currentTip, setCurrentTip] = useState(0);
  const [fade, setFade] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setFade(false); // trigger fade out
      setTimeout(() => {
        setCurrentTip((prev) => (prev + 1) % tips.length);
        setFade(true); // trigger fade in
      }, 500); // Wait for fade out to complete before changing tip
    }, 5000); // Change tip every 5 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex items-center text-sm font-medium text-on-surface-variant overflow-hidden h-full whitespace-nowrap px-4 py-1 bg-surface-neutral/50 rounded-full border border-surface-dim shadow-inner max-w-md w-full justify-center">
        <span className="material-symbols-outlined text-primary mr-2 text-[18px]">lightbulb</span>
        <span className={`transition-opacity duration-500 ease-in-out truncate ${fade ? 'opacity-100' : 'opacity-0'}`}>
            {tips[currentTip]}
        </span>
    </div>
  );
};

export default HealthTipsSlideshow;
