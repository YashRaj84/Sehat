import { useState, useEffect } from "react";
import api from "../api/axios";
import CreateFoodModal from "./CreateFoodModal";
import CreateRecipeModal from "./CreateRecipeModal";

const UNIT_LABELS = { g: "grams", ml: "ml", piece: "pc", tbsp: "tbsp", cup: "cup" };
const CATEGORIES = [
  { label: "🕒 Recent", value: "recent" }, 
  { label: "All", value: "" },
  { label: "🌾 Grains", value: "grains" },
  { label: "🥦 Veg", value: "vegetables" },
  { label: "🍎 Fruit", value: "fruits" },
  { label: "🥛 Dairy", value: "dairy" },
  { label: "🥚 Protein", value: "meat" }, 
];

function AddMeal({ onAdded }) {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("recent");
  const [results, setResults] = useState([]);
  const [recents, setRecents] = useState([]); 
  const [loading, setLoading] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [quantity, setQuantity] = useState("");
  const [unit, setUnit] = useState("g");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showRecipeModal, setShowRecipeModal] = useState(false);

  useEffect(() => {
    api.get("/food/recents").then(res => setRecents(res.data || [])).catch(console.error);
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search.trim()), 400);
    return () => clearTimeout(timer);
  }, [search]);

  useEffect(() => {
    if (category === "recent") return;
    if (!debouncedSearch) { setResults([]); return; }
    setLoading(true);
    const controller = new AbortController();
    api.get("/food/ingredients", { params: { search: debouncedSearch, category }, signal: controller.signal })
    .then(res => {
        const map = new Map();
        (res.data.items || []).forEach(item => { 
          if (!map.has(item.name) || item.createdBy) {
            map.set(item.name, item); 
          }
        });
        setResults(Array.from(map.values()));
    })
    .catch(err => { if (err.name !== "CanceledError") console.error(err); })
    .finally(() => setLoading(false));
    return () => controller.abort();
  }, [debouncedSearch, category]);

  const handleAdd = async () => {
    if (!selectedItem || !quantity) return alert("Enter quantity");
    try {
        let ingId = selectedItem._id;
        if (!ingId) {
             const createRes = await api.post("/food/ingredients", { ...selectedItem, category: selectedItem.category || "processed" });
             ingId = createRes.data._id;
        }
        await api.post("/log/add-item", { ingredientId: ingId, quantity: Number(quantity), time: new Date().toISOString(), unit });
        onAdded();
        setQuantity(""); setSearch(""); setSelectedItem(null);
        api.get("/food/recents").then(res => setRecents(res.data || []));
    } catch (err) { alert("Failed to add item"); }
  };

  const handleCustomFoodCreated = (newItem) => {
    setSelectedItem(newItem);
    setUnit(newItem.unitType === "piece" ? "piece" : newItem.baseUnit || "g");
    setQuantity(newItem.unitType === "piece" ? "1" : "100");
    setShowCreateModal(false); setShowRecipeModal(false);
  };

  let displayItems = category === "recent" ? (search ? recents.filter(i => i.name.toLowerCase().includes(search.toLowerCase())) : recents) : (debouncedSearch ? results : []);

  const styles = {
      actionBtn: { flex: 1, padding: "10px", borderRadius: "10px", border: "1px dashed #475569", background: "#1e293b", color: "#94a3b8", fontSize: "13px", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: "6px" },
      catBtn: (active) => ({ padding: "6px 12px", borderRadius: "20px", border: "none", fontSize: "12px", fontWeight: "600", cursor: "pointer", whiteSpace: "nowrap", background: active ? "#ff7e35" : "#374151", color: active ? "white" : "#94a3b8" }),
      itemRow: (selected) => ({ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px", borderRadius: "10px", marginBottom: "4px", cursor: "pointer", background: selected ? "rgba(255, 126, 53, 0.15)" : "transparent", border: selected ? "1px solid #ff7e35" : "1px solid transparent" })
  };

  return (
    <div style={{ width: "100%" }}>
      {/* 1. Buttons */}
      <div style={{ display: "flex", gap: "10px", marginBottom: "15px" }}>
        <button onClick={() => setShowCreateModal(true)} style={styles.actionBtn}>✏️ Custom Food</button>
        <button onClick={() => setShowRecipeModal(true)} style={styles.actionBtn}>👨‍🍳 Create Recipe</button>
      </div>

      {/* 2. SEARCH BAR */}
      <div style={{ display: "flex", alignItems: "center", background: "#111827", border: "1px solid #334155", borderRadius: "12px", padding: "0 14px", marginBottom: "12px", width: "100%", boxSizing: "border-box" }}>
        <span style={{ fontSize: "16px", color: "#94a3b8", marginRight: "10px" }}>🔍</span>
        <input 
            type="text" 
            placeholder="Search food..." 
            value={search} 
            onChange={e => setSearch(e.target.value)} 
            style={{ flex: 1, minWidth: 0, background: "transparent", border: "none", color: "white", fontSize: "16px", padding: "14px 0", outline: "none" }} 
        />
      </div>

      {/* 3. Categories */}
      <div className="custom-scrollbar" style={{ display: "flex", gap: "8px", overflowX: "auto", paddingBottom: "10px" }}>
        {CATEGORIES.map(cat => (
            <button key={cat.value} onClick={() => { setCategory(cat.value); setSelectedItem(null); }} style={styles.catBtn(category === cat.value)}>
                {cat.label}
            </button>
        ))}
      </div>

      {/* 4. Results */}
      <div className="custom-scrollbar" style={{ maxHeight: "250px", overflowY: "auto", minHeight: "100px", paddingRight: "4px" }}>
        {loading && <div style={{ textAlign: "center", padding: "20px", color: "#64748b" }}>Searching...</div>}
        {!loading && displayItems.length === 0 && <div style={{ textAlign: "center", padding: "20px", color: "#64748b", fontStyle: "italic" }}>No items found.</div>}
        
        {displayItems.map((item, idx) => {
            
            // 🔥 FIXED LOGIC: Stricter checking to prevent undefined === undefined
            const isSelected = selectedItem && (
                (selectedItem._id && item._id && selectedItem._id === item._id) || 
                (selectedItem === item) 
            );

            return (
                <div 
                    key={item._id || idx} 
                    onClick={() => { setSelectedItem(item); setUnit(item.baseUnit || "g"); }} 
                    style={styles.itemRow(isSelected)}
                >
                    <div>
                        <div style={{ fontWeight: "600", color: "#e2e8f0", fontSize: "14px" }}>{item.name}</div>
                        <div style={{ fontSize: "11px", color: "#94a3b8" }}>{item.caloriesPer100g} kcal • {item.protein}p {item.carbs}c {item.fats}f</div>
                    </div>
                    {isSelected && <span style={{ color: "#ff7e35", fontWeight: "bold" }}>✓</span>}
                </div>
            );
        })}
      </div>

      {/* 5. Add Panel */}
      {selectedItem && (
          <div style={{ marginTop: "15px", paddingTop: "15px", borderTop: "1px solid #334155", display: "flex", gap: "10px", alignItems: "flex-end" }}>
              <div style={{ flex: 1 }}>
                  <label style={{ fontSize: "11px", color: "#94a3b8", display: "block", marginBottom: "4px" }}>QUANTITY</label>
                  <div style={{ display: "flex", gap: "5px" }}>
                    <input 
                        type="number" value={quantity} onChange={e => setQuantity(e.target.value)} autoFocus placeholder="0" 
                        style={{ flex: 1, minWidth: 0, padding: "10px 12px", background: "#111827", color: "white", border: "1px solid #334155", borderRadius: "10px", outline: "none", boxSizing: "border-box" }} 
                    />
                    <select 
                        value={unit} onChange={e => setUnit(e.target.value)} 
                        style={{ padding: "10px", borderRadius: "10px", background: "#111827", color: "#e2e8f0", border: "1px solid #334155", outline: "none", boxSizing: "border-box" }}
                    >
                        {Object.keys(UNIT_LABELS).map(k => <option key={k} value={k}>{UNIT_LABELS[k]}</option>)}
                    </select>
                  </div>
              </div>
              <button onClick={handleAdd} style={{ height: "40px", padding: "0 20px", background: "#ff7e35", color: "white", border: "none", borderRadius: "10px", fontWeight: "bold", cursor: "pointer" }}>ADD</button>
          </div>
      )}

      {showCreateModal && <CreateFoodModal initialName={search} onClose={() => setShowCreateModal(false)} onSuccess={handleCustomFoodCreated} />}
      {showRecipeModal && <CreateRecipeModal onClose={() => setShowRecipeModal(false)} onSuccess={handleCustomFoodCreated} />}

      {/* Global CSS for Dark Scrollbars */}
      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 6px; height: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: #1e293b; border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #475569; border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #64748b; }
      `}</style>
    </div>
  );
}

export default AddMeal;