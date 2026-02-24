import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import api from "../api/axios";
import { calculateItemMacros } from "../utils/unitConversion";
import CreateFoodModal from "./CreateFoodModal"; // 🔥 IMPORT CUSTOM FOOD MODAL

const CreateRecipeModal = ({ onClose, onSuccess }) => {
  const [recipeName, setRecipeName] = useState("");
  const [ingredients, setIngredients] = useState([]);
  
  // Search State
  const [search, setSearch] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);

  // 🔥 Nested Modal State
  const [showCustomFoodModal, setShowCustomFoodModal] = useState(false);

  // Live Totals
  const [totals, setTotals] = useState({ calories: 0, protein: 0, carbs: 0, fats: 0 });

  useEffect(() => {
    const newTotals = ingredients.reduce((acc, curr) => {
        const macros = calculateItemMacros(curr.item, curr.qty, curr.unit);
        return {
            calories: acc.calories + macros.calories,
            protein: acc.protein + macros.protein,
            carbs: acc.carbs + macros.carbs,
            fats: acc.fats + macros.fats,
        };
    }, { calories: 0, protein: 0, carbs: 0, fats: 0 });
    setTotals(newTotals);
  }, [ingredients]);

  useEffect(() => {
    const timer = setTimeout(async () => {
        if (!search.trim()) {
            setSearchResults([]);
            return;
        }
        setIsSearching(true);
        try {
            const res = await api.get("/food/ingredients", { params: { search } });
            setSearchResults(res.data.items || []);
        } catch (err) {
            console.error(err);
        } finally {
            setIsSearching(false);
        }
    }, 400);
    return () => clearTimeout(timer);
  }, [search]);

  const addIngredientToRecipe = (item) => {
      const defaultUnit = item.unitType === "piece" ? "piece" : (item.baseUnit || "g");
      const defaultQty = item.unitType === "piece" ? 1 : 100;

      setIngredients(prev => [
          ...prev, 
          { item, qty: defaultQty, unit: defaultUnit, id: Date.now() } 
      ]);
      setSearch(""); 
      setSearchResults([]);
  };

  const updateIngredient = (id, field, value) => {
      setIngredients(prev => prev.map(ing => 
          ing.id === id ? { ...ing, [field]: value } : ing
      ));
  };

  const removeIngredient = (id) => {
      setIngredients(prev => prev.filter(ing => ing.id !== id));
  };

  // 🔥 THE MAGIC WORKFLOW BRIDGE
  // This catches the saved food, adds it to the recipe, and closes the nested modal smoothly
  const handleCustomFoodCreated = (newItem) => {
      addIngredientToRecipe(newItem);
      setShowCustomFoodModal(false);
  };

  const handleSave = async () => {
    if (!recipeName) return alert("Please name your recipe");
    if (ingredients.length === 0) return alert("Add at least one ingredient");

    try {
        const res = await api.post("/food/ingredients", {
            name: recipeName,
            caloriesPer100g: totals.calories, 
            protein: totals.protein,
            carbs: totals.carbs,
            fats: totals.fats,
            category: "processed", 
            unitType: "piece", 
            baseUnit: "g"
        });
        onSuccess(res.data);
    } catch (err) {
        alert("Failed to save recipe");
        console.error(err);
    }
  };

  return createPortal(
    <div style={{
      position: "fixed", top: 0, left: 0, width: "100vw", height: "100vh",
      background: "rgba(0,0,0,0.6)", display: "flex", justifyContent: "center", alignItems: "center", 
      zIndex: 99999 
    }}>
      <div style={{ 
          background: "white", width: "95%", maxWidth: "500px", borderRadius: "16px", 
          display: "flex", flexDirection: "column", maxHeight: "90vh", 
          boxShadow: "0 20px 50px rgba(0,0,0,0.3)" 
      }}>
        
        {/* HEADER */}
        <div style={{ padding: "20px", borderBottom: "1px solid #eee" }}>
            <h3 style={{ margin: "0 0 10px 0", color: "#1e293b" }}>🧑‍🍳 Create New Recipe</h3>
            <input 
                placeholder="Recipe Name (e.g. Morning Power Smoothie)" 
                value={recipeName}
                onChange={e => setRecipeName(e.target.value)}
                style={{ width: "100%", padding: "12px", fontSize: "16px", borderRadius: "8px", border: "1px solid #cbd5e1", outline: "none", boxSizing: "border-box" }}
            />
        </div>

        {/* BODY */}
        <div style={{ flex: 1, overflowY: "auto", padding: "20px" }}>
            
            {/* Search Input */}
            <div style={{ marginBottom: "20px", position: "relative" }}>
                <label style={{ fontSize: "11px", fontWeight: "bold", color: "#64748b", marginBottom: "6px", display: "block", letterSpacing: "0.5px" }}>ADD INGREDIENTS</label>
                <input 
                    placeholder="Search ingredient (e.g. Oats, Banana)..." 
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid #e2e8f0", background: "#f8fafc", boxSizing: "border-box" }}
                />
                
                {search && (
                    <div style={{ position: "absolute", top: "100%", left: 0, right: 0, background: "white", border: "1px solid #e2e8f0", borderRadius: "8px", maxHeight: "250px", overflowY: "auto", boxShadow: "0 4px 12px rgba(0,0,0,0.1)", zIndex: 10, display: "flex", flexDirection: "column" }}>
                        {isSearching ? <div style={{padding:"10px", color:"#999"}}>Loading...</div> : (
                            <>
                                {/* Search Results */}
                                {searchResults.map(item => (
                                    <div 
                                        key={item._id || Math.random()} 
                                        onClick={() => addIngredientToRecipe(item)}
                                        style={{ padding: "10px", borderBottom: "1px solid #f1f5f9", cursor: "pointer", display: "flex", justifyContent: "space-between" }}
                                    >
                                        <span style={{fontWeight:"500"}}>{item.name}</span>
                                        <span style={{fontSize:"12px", color:"#64748b"}}>{item.caloriesPer100g} kcal</span>
                                    </div>
                                ))}

                                {/* 🔥 NEW: Sticky "Create Custom Food" Button inside dropdown */}
                                <div 
                                    onClick={() => setShowCustomFoodModal(true)}
                                    style={{ padding: "12px", background: "#eff6ff", color: "#2563eb", fontWeight: "600", textAlign: "center", cursor: "pointer", borderTop: "1px solid #bfdbfe", position: "sticky", bottom: 0 }}
                                >
                                    ➕ Create "{search}" as custom food
                                </div>
                            </>
                        )}
                    </div>
                )}
            </div>

            {/* List */}
            {ingredients.length === 0 ? (
                <div style={{ textAlign: "center", padding: "30px", color: "#94a3b8", border: "2px dashed #e2e8f0", borderRadius: "12px", background: "#f8fafc" }}>
                    No ingredients yet.<br/>Search above to build your meal!
                </div>
            ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                    {ingredients.map((line) => (
                        <div key={line.id} style={{ display: "flex", alignItems: "center", gap: "8px", background: "#fff", padding: "10px", borderRadius: "8px", border: "1px solid #e2e8f0", boxShadow: "0 1px 2px rgba(0,0,0,0.03)" }}>
                            <div style={{ flex: 1, fontWeight: "600", fontSize: "14px", color: "#334155" }}>{line.item.name}</div>
                            
                            <input 
                                type="number" 
                                value={line.qty} 
                                onChange={e => updateIngredient(line.id, "qty", Number(e.target.value))}
                                style={{ width: "60px", padding: "6px", borderRadius: "6px", border: "1px solid #cbd5e1" }}
                            />
                            
                            <select 
                                value={line.unit} 
                                onChange={e => updateIngredient(line.id, "unit", e.target.value)}
                                style={{ width: "70px", padding: "6px", borderRadius: "6px", border: "1px solid #cbd5e1", background: "#f8fafc" }}
                            >
                                <option value="g">g</option>
                                <option value="ml">ml</option>
                                <option value="cup">cup</option>
                                <option value="tbsp">tbsp</option>
                                <option value="piece">pc</option>
                            </select>

                            <button onClick={() => removeIngredient(line.id)} style={{ border: "none", background: "#fee2e2", borderRadius: "6px", width: "24px", height: "24px", cursor: "pointer", color: "#ef4444", display:"flex", alignItems:"center", justifyContent:"center" }}>✕</button>
                        </div>
                    ))}
                </div>
            )}
        </div>

        {/* FOOTER */}
        <div style={{ padding: "20px", background: "#f8fafc", borderTop: "1px solid #e2e8f0", borderBottomLeftRadius: "16px", borderBottomRightRadius: "16px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "15px", alignItems: "center" }}>
                <span style={{ fontSize: "14px", fontWeight: "600", color: "#475569" }}>Total Recipe Energy:</span>
                <span style={{ color: "#2563eb", fontSize: "18px", fontWeight: "bold" }}>{Math.round(totals.calories)} kcal</span>
            </div>
            <div style={{ display: "flex", gap: "12px", fontSize: "13px", color: "#64748b", marginBottom: "20px", background: "white", padding: "10px", borderRadius: "8px", border: "1px solid #e2e8f0" }}>
                <span><strong>P:</strong> {Math.round(totals.protein)}g</span> 
                <span style={{color:"#cbd5e1"}}>|</span>
                <span><strong>C:</strong> {Math.round(totals.carbs)}g</span> 
                <span style={{color:"#cbd5e1"}}>|</span>
                <span><strong>F:</strong> {Math.round(totals.fats)}g</span>
            </div>

            <div style={{ display: "flex", gap: "10px" }}>
                <button onClick={onClose} style={{ flex: 1, padding: "12px", border: "1px solid #cbd5e1", borderRadius: "8px", background: "white", cursor: "pointer", color: "#475569", fontWeight: "600" }}>Cancel</button>
                <button onClick={handleSave} style={{ flex: 1, padding: "12px", border: "none", borderRadius: "8px", background: "#10b981", color: "white", fontWeight: "bold", cursor: "pointer", boxShadow: "0 2px 4px rgba(16, 185, 129, 0.3)" }}>
                    Save Recipe
                </button>
            </div>
        </div>

        {/* 🔥 NESTED MODAL RENDER */}
        {showCustomFoodModal && (
            <CreateFoodModal 
                initialName={search} 
                onClose={() => setShowCustomFoodModal(false)} 
                onSuccess={handleCustomFoodCreated} 
            />
        )}

      </div>
    </div>,
    document.body 
  );
};

export default CreateRecipeModal;