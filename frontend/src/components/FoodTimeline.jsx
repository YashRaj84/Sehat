import React, { useState } from "react";
import api from "../api/axios";

// Strictly using your original props: 'items' and 'onRefresh'
const FoodTimeline = ({ items, onRefresh }) => {
  const [deletingId, setDeletingId] = useState(null);

  // Your original, working delete logic + a loading state so the user knows it's working
  const handleDelete = async (itemId) => {
    if (!window.confirm("Remove this item?")) return;
    
    try {
      setDeletingId(itemId);
      // Your original working API call
      await api.post("/log/remove-item", { itemId }); 
      
      // Your original refresh trigger
      if (onRefresh) onRefresh(); 
    } catch (err) {
      console.error(err);
      alert("Failed to delete");
    } finally {
      setDeletingId(null);
    }
  };

  const formatTime = (dateString) => {
    if (!dateString) return "--:--";
    const date = new Date(dateString);
    return date.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: true });
  };

  // Safe fallback if items are missing
  const timelineItems = items || [];

  return (
    <div style={{ width: "100%", display: "flex", flexDirection: "column" }}>
        
        {/* Header */}
        <div style={{ marginBottom: "20px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <h3 style={{ margin: 0, fontSize: "20px", fontWeight: "bold", color: "#f8fafc" }}>Today's Timeline</h3>
            <span style={{ fontSize: "12px", color: "#94a3b8", fontWeight: "600", backgroundColor: "#1e293b", padding: "4px 10px", borderRadius: "12px" }}>
                {timelineItems.length} {timelineItems.length === 1 ? "Item" : "Items"}
            </span>
        </div>

        {/* Empty State */}
        {timelineItems.length === 0 ? (
            <div style={{ padding: "40px 20px", textAlign: "center", backgroundColor: "#1e293b", borderRadius: "16px", border: "1px dashed #334155" }}>
                <div style={{ fontSize: "40px", marginBottom: "10px" }}>🍽️</div>
                <h4 style={{ color: "#e2e8f0", margin: "0 0 8px 0" }}>No meals logged yet</h4>
                <p style={{ color: "#64748b", margin: 0, fontSize: "14px" }}>Search and add food above to start tracking your day.</p>
            </div>
        ) : (
            /* Timeline Container */
            <div style={{ position: "relative", paddingLeft: "16px" }}>
                
                {/* The vertical timeline line */}
                <div style={{ position: "absolute", left: "22px", top: "10px", bottom: "20px", width: "2px", backgroundColor: "#334155", borderRadius: "2px", zIndex: 0 }}></div>

                {timelineItems.map((item, index) => {
                    const isLast = index === timelineItems.length - 1;
                    const isDeleting = deletingId === item._id;

                    return (
                        <div key={item._id || index} className="timeline-item" style={{ position: "relative", marginBottom: isLast ? "0" : "20px", display: "flex", alignItems: "flex-start", gap: "20px", zIndex: 1, opacity: isDeleting ? 0.5 : 1 }}>
                            
                            {/* Glowing Orange Dot */}
                            <div style={{ position: "relative", marginTop: "24px" }}>
                                <div style={{ width: "14px", height: "14px", borderRadius: "50%", backgroundColor: "#111827", border: "3px solid #ff7e35", zIndex: 2, position: "relative", boxShadow: "0 0 10px rgba(255, 126, 53, 0.4)" }}></div>
                            </div>

                            {/* Modern Dark Card */}
                            <div className="meal-card" style={{ flex: 1, backgroundColor: "#1e293b", borderRadius: "16px", padding: "16px", border: "1px solid #334155", display: "flex", flexDirection: "column", gap: "12px", transition: "all 0.2s ease" }}>
                                
                                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                                    <div>
                                        <div style={{ display: "flex", alignItems: "baseline", gap: "8px" }}>
                                            <span style={{ fontSize: "16px", fontWeight: "700", color: "#f8fafc", textTransform: "capitalize" }}>
                                                {item.ingredient?.name || item.name || "Unknown Food"}
                                            </span>
                                            <span style={{ fontSize: "12px", color: "#94a3b8", fontWeight: "500" }}>
                                                {item.quantity} {item.unit}
                                            </span>
                                        </div>
                                        <div style={{ fontSize: "11px", color: "#64748b", marginTop: "4px", fontWeight: "600" }}>
                                            🕒 {formatTime(item.loggedAt)}
                                        </div>
                                    </div>

                                    <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: "8px" }}>
                                        <span style={{ fontSize: "16px", fontWeight: "800", color: "#ff7e35" }}>
                                            {Math.round(item.calories || 0)} <span style={{ fontSize: "12px", fontWeight: "600", color: "#94a3b8" }}>kcal</span>
                                        </span>
                                        
                                        {/* Delete Button wired to your logic */}
                                        <button 
                                            onClick={() => handleDelete(item._id)}
                                            disabled={isDeleting}
                                            className="delete-btn"
                                            title="Remove Item"
                                        >
                                            {isDeleting ? "Removing..." : "✕ Remove"}
                                        </button>
                                    </div>
                                </div>

                                {/* Macro Badges (Fats using Yellow Ochre #eab308) */}
                                <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", marginTop: "4px" }}>
                                    <span style={{ display: "flex", alignItems: "center", gap: "4px", backgroundColor: "rgba(168, 85, 247, 0.15)", color: "#a855f7", padding: "4px 8px", borderRadius: "6px", fontSize: "11px", fontWeight: "700" }}>
                                        <span style={{ width: "6px", height: "6px", borderRadius: "50%", backgroundColor: "#a855f7" }}></span>
                                        {Math.round(item.protein || 0)}g Protein
                                    </span>
                                    
                                    <span style={{ display: "flex", alignItems: "center", gap: "4px", backgroundColor: "rgba(59, 130, 246, 0.15)", color: "#3b82f6", padding: "4px 8px", borderRadius: "6px", fontSize: "11px", fontWeight: "700" }}>
                                        <span style={{ width: "6px", height: "6px", borderRadius: "50%", backgroundColor: "#3b82f6" }}></span>
                                        {Math.round(item.carbs || 0)}g Carbs
                                    </span>
                                    
                                    <span style={{ display: "flex", alignItems: "center", gap: "4px", backgroundColor: "rgba(234, 179, 8, 0.15)", color: "#eab308", padding: "4px 8px", borderRadius: "6px", fontSize: "11px", fontWeight: "700" }}>
                                        <span style={{ width: "6px", height: "6px", borderRadius: "50%", backgroundColor: "#eab308" }}></span>
                                        {Math.round(item.fats || 0)}g Fats
                                    </span>
                                </div>

                            </div>
                        </div>
                    );
                })}
            </div>
        )}

        <style>{`
            .meal-card:hover {
                transform: translateX(4px);
                border-color: #475569 !important;
                box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
            }
            
            .delete-btn {
                background: transparent;
                border: none;
                color: #64748b;
                font-size: 11px;
                font-weight: 600;
                cursor: pointer;
                padding: 4px 8px;
                border-radius: 6px;
                transition: all 0.2s ease;
            }

            .meal-card:hover .delete-btn:not(:disabled) {
                color: #ef4444;
                background: rgba(239, 68, 68, 0.1);
            }

            .delete-btn:hover:not(:disabled) {
                background: rgba(239, 68, 68, 0.2) !important;
                transform: scale(1.05);
            }
            
            .delete-btn:disabled {
                cursor: not-allowed;
                opacity: 0.7;
            }
        `}</style>
    </div>
  );
};

export default FoodTimeline;