import React, { useState, useEffect } from "react";
import Layout from "../components/Layout";
import api from "../api/axios";
import Card from "../components/ui/Card";

// --- REBUILT, ROBUST SVG CHART COMPONENT ---
const LineChart = ({ data, dataKey, color, label, target, viewBoxWidth = 800, viewBoxHeight = 300, hideLabels = false, showValues = true }) => {
  if (!data || data.length === 0) {
      return (
        <div className="w-full h-full min-h-[200px] bg-surface rounded-2xl p-6 flex items-center justify-center text-on-surface-variant font-sans border border-surface-dim">
            No data available
        </div>
      );
  }

  // Padding inside the SVG coordinates
  const padTop = showValues ? 50 : 20; 
  const padBottom = hideLabels ? 20 : 40;
  const padLeft = 30;
  const padRight = 30;

  const innerWidth = viewBoxWidth - padLeft - padRight;
  const innerHeight = viewBoxHeight - padTop - padBottom;

  // Calculate Max Value to scale the graph
  let maxValue = Math.max(...data.map(d => d[dataKey] || 0));
  maxValue = maxValue === 0 ? 100 : maxValue * 1.25; 
  
  // Calculate Average for the top right corner
  const total = data.reduce((acc, curr) => acc + (curr[dataKey] || 0), 0);
  const avgValue = Math.round(total / (data.length || 1));
  
  // Calculate exact X/Y coordinates for each point
  const points = data.map((d, index) => {
    const val = d[dataKey] || 0;
    const x = padLeft + (index / (data.length - 1)) * innerWidth;
    const y = padTop + innerHeight - (val / maxValue) * innerHeight;
    return { x, y, val, day: d.day };
  });

  const polylinePoints = points.map(p => `${p.x},${p.y}`).join(" ");
  const polygonPoints = `${padLeft},${viewBoxHeight - padBottom} ${polylinePoints} ${padLeft + innerWidth},${viewBoxHeight - padBottom}`;

  // We are using Tailwind for layout, but keeping stroke/fill styling dynamic based on props or standard theme classes
  const strokeColorClass = "stroke-surface-dim"; // For grid lines

  return (
    <Card className="w-full h-full p-5 flex flex-col min-w-0">
        
        {/* --- HEADER --- */}
        <div className="flex justify-between items-start mb-5">
            <div>
                <div className="text-base font-bold text-on-surface font-display">{label}</div>
                {target && <div className="text-xs text-on-surface-variant font-semibold mt-1">Target: {target}</div>}
            </div>
            
            {/* Average Display */}
            <div className="text-2xl font-black font-display leading-none" style={{ color }}>
                {avgValue} <span className="text-xs text-on-surface-variant font-semibold ml-1">avg</span>
            </div>
        </div>

        {/* Scalable SVG Container */}
        <div className="w-full flex-1 min-h-0">
            <svg viewBox={`0 0 ${viewBoxWidth} ${viewBoxHeight}`} className="w-full h-full block overflow-visible">
                
                {/* Background Dashed Grid Lines */}
                <line x1={padLeft} y1={padTop} x2={padLeft+innerWidth} y2={padTop} className={strokeColorClass} strokeDasharray="4" />
                <line x1={padLeft} y1={padTop + innerHeight/2} x2={padLeft+innerWidth} y2={padTop + innerHeight/2} className={strokeColorClass} strokeDasharray="4" />
                <line x1={padLeft} y1={padTop + innerHeight} x2={padLeft+innerWidth} y2={padTop + innerHeight} className={strokeColorClass} strokeDasharray="4" />

                {/* Shaded Area & Line */}
                <polygon points={polygonPoints} fill={color} fillOpacity="0.1" />
                <polyline points={polylinePoints} fill="none" stroke={color} strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" className="drop-shadow-sm" />

                {/* Data Points, Values, and Dates */}
                {points.map((p, i) => {
                    const totalItems = points.length;
                    
                    const is30Days = totalItems > 14;
                    const showDot = !is30Days || i % 5 === 0 || i === totalItems - 1;
                    const showText = showValues && (!is30Days || i % 5 === 0 || i === totalItems - 1);
                    const showDate = !hideLabels && (!is30Days || i % Math.ceil(totalItems / 6) === 0 || i === totalItems - 1);

                    return (
                        <g key={i}>
                            {/* The Dot */}
                            {showDot && <circle cx={p.x} cy={p.y} r="5" className="fill-surface" stroke={color} strokeWidth="3" />}
                            
                            {/* The Value sitting ABOVE the dot */}
                            {showText && (
                                <text x={p.x} y={p.y - 15} fill={color} fontSize="14" fontWeight="800" textAnchor="middle" className="font-sans" style={{ filter: "drop-shadow(0px 1px 1px rgba(255,255,255,0.8))" }}>
                                    {p.val}
                                </text>
                            )}

                            {/* The Date sitting BELOW the chart */}
                            {showDate && (
                                <text x={p.x} y={viewBoxHeight - 10} className="fill-on-surface-variant font-sans" fontSize="13" fontWeight="600" textAnchor="middle">
                                    {p.day}
                                </text>
                            )}
                        </g>
                    );
                })}
            </svg>
        </div>
    </Card>
  );
};

const Progress = () => {
  const [timeframe, setTimeframe] = useState(7);
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchProgress = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/log/progress?days=${timeframe}`);
      const backendLogs = res.data || [];

      const formattedData = backendLogs.map((log, index) => {
          const dateObj = new Date(log.date);
          const isLastItem = index === backendLogs.length - 1;

          let displayDay = "";
          if (isLastItem) {
              displayDay = "Today";
          } else {
              const dayStr = dateObj.getDate();
              const monthStr = dateObj.toLocaleDateString('en-US', { month: 'short' });
              displayDay = timeframe === 7 
                  ? dateObj.toLocaleDateString('en-US', { weekday: 'short' }) 
                  : `${dayStr} ${monthStr}`;
          }

          return {
              day: displayDay,
              calories: Math.round(log.totalCalories || 0),
              protein: Math.round(log.totalProtein || 0),
              carbs: Math.round(log.totalCarbs || 0),
              fats: Math.round(log.totalFats || 0)
          };
      });
      
      setChartData(formattedData);
    } catch (error) {
      console.error("Failed to fetch progress:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProgress();
  }, [timeframe]);

  // Map to theme colors
  const primaryColor = "#0f5238";
  const secondaryColor = "#0e6c4a";
  const tertiaryColor = "#364d3c";
  const errorColor = "#ba1a1a";

  return (
    <Layout>
      <div className="max-w-7xl mx-auto py-4 lg:py-8">
        
        {/* PROGRESS SECTION */}
        <header className="mb-6">
            <h1 className="font-display text-3xl sm:text-4xl font-bold tracking-tight mb-2 text-on-surface">Progress</h1>
            <p className="text-on-surface-variant text-base sm:text-lg">Track your dietary progress over time.</p>
        </header>

        <div className="flex gap-2 mb-8 bg-surface p-1.5 rounded-xl w-fit border border-surface-dim shadow-sm">
            <button 
              className={`px-5 py-2.5 rounded-lg border-none font-bold text-sm cursor-pointer transition-all duration-200 ${timeframe === 7 ? "bg-primary text-on-primary shadow-sm" : "bg-transparent text-on-surface-variant hover:text-on-surface"}`} 
              onClick={() => setTimeframe(7)}
            >
              Last 7 Days
            </button>
            <button 
              className={`px-5 py-2.5 rounded-lg border-none font-bold text-sm cursor-pointer transition-all duration-200 ${timeframe === 30 ? "bg-primary text-on-primary shadow-sm" : "bg-transparent text-on-surface-variant hover:text-on-surface"}`} 
              onClick={() => setTimeframe(30)}
            >
              Last 30 Days
            </button>
        </div>

        {loading ? (
            <div className="text-center p-12 text-on-surface-variant">Loading your data...</div>
        ) : (
            <>
                <div className="mb-6">
                    <LineChart 
                        data={chartData} 
                        dataKey="calories" 
                        color={primaryColor} 
                        label="Calories Consumed" 
                        target="2000 kcal"
                        viewBoxWidth={1000} 
                        viewBoxHeight={300}
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <LineChart 
                        data={chartData} dataKey="protein" color={secondaryColor} label="Protein (g)" 
                        viewBoxWidth={400} viewBoxHeight={250} 
                        hideLabels={true} showValues={true} 
                    />
                    <LineChart 
                        data={chartData} dataKey="carbs" color={tertiaryColor} label="Carbs (g)" 
                        viewBoxWidth={400} viewBoxHeight={250} 
                        hideLabels={true} showValues={true} 
                    />
                    <LineChart 
                        data={chartData} dataKey="fats" color={errorColor} label="Fats (g)" 
                        viewBoxWidth={400} viewBoxHeight={250} 
                        hideLabels={true} showValues={true} 
                    />
                </div>
            </>
        )}

      </div>
    </Layout>
  );
};

export default Progress;
