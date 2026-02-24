import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import api from "../api/axios";

// --- REBUILT, ROBUST SVG CHART COMPONENT ---
const LineChart = ({ data, dataKey, color, label, target, viewBoxWidth = 800, viewBoxHeight = 300, hideLabels = false, showValues = true }) => {
  if (!data || data.length === 0) {
      return (
        <div style={{ width: "100%", height: "100%", minHeight: "200px", backgroundColor: "#1f293b", borderRadius: "16px", padding: "24px", display: "flex", alignItems: "center", justifyContent: "center", color: "#9ca3af" }}>
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

  return (
    <div style={{ width: "100%", height: "100%", backgroundColor: "#1e293b", borderRadius: "16px", padding: "20px", border: "1px solid #334155", display: "flex", flexDirection: "column", boxSizing: "border-box", minWidth: 0 }}>
        
        {/* --- HEADER --- */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "20px" }}>
            <div>
                <div style={{ fontSize: "16px", fontWeight: "bold", color: "#f8fafc" }}>{label}</div>
                {target && <div style={{ fontSize: "12px", color: "#94a3b8", marginTop: "4px" }}>Target: {target}</div>}
            </div>
            
            {/* Average Display */}
            <div style={{ fontSize: "24px", fontWeight: "900", color: color, lineHeight: "1" }}>
                {avgValue} <span style={{fontSize: "12px", color: "#94a3b8", fontWeight: "600"}}>avg</span>
            </div>
        </div>

        {/* Scalable SVG Container */}
        <div style={{ width: "100%", flex: 1, minHeight: 0 }}>
            <svg viewBox={`0 0 ${viewBoxWidth} ${viewBoxHeight}`} style={{ width: "100%", height: "100%", display: "block", overflow: "visible" }}>
                
                {/* Background Dashed Grid Lines */}
                <line x1={padLeft} y1={padTop} x2={padLeft+innerWidth} y2={padTop} stroke="#334155" strokeDasharray="4" />
                <line x1={padLeft} y1={padTop + innerHeight/2} x2={padLeft+innerWidth} y2={padTop + innerHeight/2} stroke="#334155" strokeDasharray="4" />
                <line x1={padLeft} y1={padTop + innerHeight} x2={padLeft+innerWidth} y2={padTop + innerHeight} stroke="#334155" strokeDasharray="4" />

                {/* Shaded Area & Line */}
                <polygon points={polygonPoints} fill={color} fillOpacity="0.1" />
                <polyline points={polylinePoints} fill="none" stroke={color} strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />

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
                            {showDot && <circle cx={p.x} cy={p.y} r="6" fill="#1e293b" stroke={color} strokeWidth="3" />}
                            
                            {/* The Value sitting ABOVE the dot */}
                            {showText && (
                                <text x={p.x} y={p.y - 15} fill="#f8fafc" fontSize="16" fontWeight="bold" textAnchor="middle">
                                    {p.val}
                                </text>
                            )}

                            {/* The Date sitting BELOW the chart */}
                            {showDate && (
                                <text x={p.x} y={viewBoxHeight - 10} fill="#94a3b8" fontSize="14" fontWeight="600" textAnchor="middle">
                                    {p.day}
                                </text>
                            )}
                        </g>
                    );
                })}
            </svg>
        </div>
    </div>
  );
};

const History = () => {
  const [timeframe, setTimeframe] = useState(7);
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      setLoading(true);
      try {
        const res = await api.get(`/log/history?days=${timeframe}`);
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
        console.error("Failed to fetch history:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, [timeframe]);

  return (
    <div style={styles.container}>
      <Navbar />
      <div style={styles.mainContent}>
        
        <div style={styles.header}>
            <h1 style={styles.pageTitle}>History & Trends</h1>
            <p style={styles.pageSubtitle}>Track your progress over time.</p>
        </div>

        <div style={styles.toggleContainer}>
            <button style={styles.toggleBtn(timeframe === 7)} onClick={() => setTimeframe(7)}>Last 7 Days</button>
            <button style={styles.toggleBtn(timeframe === 30)} onClick={() => setTimeframe(30)}>Last 30 Days</button>
        </div>

        {loading ? (
            <div style={{ textAlign: "center", padding: "50px", color: "#9ca3af" }}>Loading your data...</div>
        ) : (
            <>
                <div style={{ marginBottom: "24px" }}>
                    <LineChart 
                        data={chartData} 
                        dataKey="calories" 
                        color="#f97316" 
                        label="Calories Consumed" 
                        target="2000 kcal"
                        viewBoxWidth={1000} 
                        viewBoxHeight={300}
                    />
                </div>

                <div style={styles.nutrientGrid}>
                    <LineChart 
                        data={chartData} dataKey="protein" color="#a855f7" label="Protein (g)" 
                        viewBoxWidth={400} viewBoxHeight={250} 
                        hideLabels={true} showValues={true} 
                    />
                    <LineChart 
                        data={chartData} dataKey="carbs" color="#3b82f6" label="Carbs (g)" 
                        viewBoxWidth={400} viewBoxHeight={250} 
                        hideLabels={true} showValues={true} 
                    />
                    
                    {/* 🔥 NEW: Fats LineChart color changed to Yellow Ochre (#eab308) */}
                    <LineChart 
                        data={chartData} dataKey="fats" color="#eab308" label="Fats (g)" 
                        viewBoxWidth={400} viewBoxHeight={250} 
                        hideLabels={true} showValues={true} 
                    />
                </div>
            </>
        )}

      </div>
    </div>
  );
};

const styles = {
  container: { minHeight: "100vh", backgroundColor: "#0f172a", color: "#f8fafc", fontFamily: "'Inter', sans-serif" },
  mainContent: { maxWidth: "1200px", margin: "0 auto", padding: "30px 24px" },
  header: { marginBottom: "30px" },
  pageTitle: { fontSize: "32px", fontWeight: "800", margin: "0 0 8px 0" },
  pageSubtitle: { color: "#94a3b8", margin: 0, fontSize: "16px" },
  toggleContainer: { display: "flex", gap: "10px", marginBottom: "30px", background: "#1e293b", padding: "6px", borderRadius: "12px", width: "fit-content" },
  toggleBtn: (active) => ({ padding: "10px 20px", borderRadius: "8px", border: "none", fontWeight: "bold", cursor: "pointer", background: active ? "#f97316" : "transparent", color: active ? "#fff" : "#94a3b8", transition: "all 0.2s" }),
  
  nutrientGrid: { 
      display: "grid", 
      gridTemplateColumns: "repeat(3, minmax(0, 1fr))", 
      gap: "24px" 
  }
};

export default History;