import React, { useState } from "react";
import api from "../api/axios";

const FoodTimeline = ({ items, onRefresh }) => {
  const [deletingId, setDeletingId] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [editAmount, setEditAmount] = useState("");

  const handleDelete = async (itemId) => {
    if (!window.confirm("Remove this item?")) return;
    
    try {
      setDeletingId(itemId);
      await api.post("/log/remove-item", { itemId }); 
      if (onRefresh) onRefresh(); 
    } catch (err) {
      console.error(err);
      alert("Failed to delete");
    } finally {
      setDeletingId(null);
    }
  };

  const handleEditInit = (item) => {
    setEditingId(item._id);
    setEditAmount(item.quantity.toString());
  };

  const handleEditSave = async (item) => {
    try {
      const newQuantity = Number(editAmount);
      if (isNaN(newQuantity) || newQuantity <= 0) {
          alert("Please enter a valid amount");
          return;
      }
      
      const newCalories = (item.calories / item.quantity) * newQuantity;
      const newProtein = (item.protein / item.quantity) * newQuantity;
      const newCarbs = (item.carbs / item.quantity) * newQuantity;
      const newFats = (item.fats / item.quantity) * newQuantity;

      await api.patch(`/log/item/${item._id}`, { 
          quantity: newQuantity,
          calories: newCalories,
          protein: newProtein,
          carbs: newCarbs,
          fats: newFats
      });
      setEditingId(null);
      if (onRefresh) onRefresh();
    } catch (err) {
      console.error(err);
      alert("Failed to update");
    }
  };

  const handleEditCancel = () => {
    setEditingId(null);
    setEditAmount("");
  };

  const formatTime = (dateString) => {
    if (!dateString) return "--:--";
    const date = new Date(dateString);
    return date.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: true });
  };

  // Sort items by loggedAt descending
  const timelineItems = [...(items || [])].sort((a, b) => new Date(b.loggedAt) - new Date(a.loggedAt));

  return (
    <div className="w-full flex flex-col font-sans">
        
        {/* Header */}
        <div className="mb-6 flex justify-between items-center pb-2">
            <h3 className="m-0 text-xl font-display font-bold text-on-surface tracking-tight">Today's Diet</h3>
        </div>

        {/* Empty State */}
        {timelineItems.length === 0 ? (
            <div className="py-10 px-5 text-center bg-surface-neutral rounded-2xl border border-dashed border-surface-dim">
                <div className="text-4xl mb-3">🍽️</div>
                <h4 className="text-on-surface font-display font-bold mb-2">No meals logged yet</h4>
                <p className="text-on-surface-variant text-sm m-0">Click Add Food to start tracking your day.</p>
            </div>
        ) : (
            <div className="flex flex-col gap-4">
                {timelineItems.map((item) => {
                    const isDeleting = deletingId === item._id;
                    const isEditing = editingId === item._id;

                    return (
                        <div key={item._id} className={`flex items-center justify-between bg-surface rounded-2xl p-4 border border-surface-dim shadow-sm hover:shadow-md transition-all ${isDeleting ? 'opacity-50' : ''}`}>
                            
                            {/* Left Side: Icon, Name, Time, and Macros */}
                            <div className="flex items-start gap-4">
                                <div className="w-12 h-12 rounded-full bg-primary-container text-primary flex items-center justify-center text-xl shadow-inner border border-primary/10 flex-shrink-0">
                                    <span className="material-symbols-outlined text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>restaurant</span>
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-base font-bold text-on-surface capitalize font-display">
                                        {item.ingredient?.name || item.name || "Unknown Food"}
                                    </span>
                                    <span className="text-sm text-on-surface-variant font-medium flex items-center gap-1.5 mt-0.5">
                                        {formatTime(item.loggedAt)}
                                        <span className="w-1 h-1 rounded-full bg-surface-dim"></span>
                                        <span className="font-bold text-on-background">
                                            {Math.round(item.calories || 0)} kcal
                                        </span>
                                    </span>
                                    {/* Macro Badges */}
                                    <div className="flex gap-2 flex-wrap mt-2">
                                        <span className="flex items-center gap-1 bg-secondary-container/30 text-secondary px-2 py-0.5 rounded text-[10px] font-bold">
                                            <span className="w-1 h-1 rounded-full bg-secondary"></span>
                                            {Math.round(item.protein || 0)}g P
                                        </span>
                                        <span className="flex items-center gap-1 bg-tertiary-container/30 text-tertiary px-2 py-0.5 rounded text-[10px] font-bold">
                                            <span className="w-1 h-1 rounded-full bg-tertiary"></span>
                                            {Math.round(item.carbs || 0)}g C
                                        </span>
                                        <span className="flex items-center gap-1 bg-on-surface/10 text-on-surface px-2 py-0.5 rounded text-[10px] font-bold">
                                            <span className="w-1 h-1 rounded-full bg-on-surface"></span>
                                            {Math.round(item.fats || 0)}g F
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Right Side: Quantity Edit & Delete */}
                            <div className="flex items-center gap-2">
                                {isEditing ? (
                                    <div className="flex items-center bg-surface-neutral rounded-lg border border-primary p-1 shadow-sm">
                                        <input 
                                            type="number" 
                                            value={editAmount}
                                            onChange={(e) => setEditAmount(e.target.value)}
                                            className="w-16 text-center bg-transparent border-none text-on-surface font-bold text-sm focus:outline-none p-1"
                                            autoFocus
                                        />
                                        <span className="text-xs text-on-surface-variant font-bold pr-2">{item.unit}</span>
                                        <div className="flex border-l border-surface-dim">
                                            <button onClick={() => handleEditSave(item)} className="p-1.5 text-primary hover:bg-primary/10 rounded-r-none transition-colors" title="Save">
                                                <span className="material-symbols-outlined text-[18px]">check</span>
                                            </button>
                                            <button onClick={handleEditCancel} className="p-1.5 text-error hover:bg-error/10 rounded-r-lg transition-colors" title="Cancel">
                                                <span className="material-symbols-outlined text-[18px]">close</span>
                                            </button>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="flex items-center bg-surface-neutral rounded-lg px-3 py-1.5 border border-surface-dim group hover:border-primary/30 transition-colors">
                                        <span className="text-sm font-bold text-on-surface mr-2">
                                            {item.quantity} {item.unit}
                                        </span>
                                        <button 
                                            onClick={() => handleEditInit(item)}
                                            className="text-on-surface-variant hover:text-primary transition-colors flex items-center justify-center"
                                            title="Edit Quantity"
                                        >
                                            <span className="material-symbols-outlined text-[18px]">edit</span>
                                        </button>
                                    </div>
                                )}

                                <button 
                                    onClick={() => handleDelete(item._id)}
                                    disabled={isDeleting || isEditing}
                                    className="w-10 h-10 rounded-lg flex items-center justify-center text-on-surface-variant hover:text-error hover:bg-error-container/30 transition-all disabled:opacity-50"
                                    title="Delete Item"
                                >
                                    <span className="material-symbols-outlined text-[20px]">delete</span>
                                </button>
                            </div>
                            
                        </div>
                    );
                })}
            </div>
        )}
    </div>
  );
};

export default FoodTimeline;