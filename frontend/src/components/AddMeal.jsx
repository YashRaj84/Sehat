import { useState, useEffect } from "react";
import api from "../api/axios";
import CreateFoodModal from "./CreateFoodModal";
import CreateRecipeModal from "./CreateRecipeModal";
import Button from "./ui/Button";

const UNIT_LABELS = { g: "grams", ml: "ml", piece: "pc", tbsp: "tbsp", cup: "cup" };
const CATEGORIES = [
  { label: <span className="material-symbols-outlined text-[18px] block">history</span>, value: "recent" }, 
  { label: "All", value: "" },
  { label: "🌾 Grains", value: "grains" },
  { label: "🥛 Dairy", value: "dairy" },
  { label: "🥜 Legumes", value: "legumes" },
  { label: "🥦 Vegetables", value: "vegetables" },
  { label: "🍎 Fruits", value: "fruits" },
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

  return (
    <div className="w-full font-sans">
      {/* 1. Buttons */}
      <div className="flex gap-3 mb-4">
        <button onClick={() => setShowCreateModal(true)} className="flex-1 py-2 px-3 rounded-lg border border-dashed border-primary text-primary hover:bg-primary-fixed/50 font-semibold text-sm transition-colors flex items-center justify-center gap-1.5">
            ✏️ Custom Food
        </button>
        <button onClick={() => setShowRecipeModal(true)} className="flex-1 py-2 px-3 rounded-lg border border-dashed border-primary text-primary hover:bg-primary-fixed/50 font-semibold text-sm transition-colors flex items-center justify-center gap-1.5">
            👨‍🍳 Create Recipe
        </button>
      </div>

      {/* 2. SEARCH BAR */}
      <div className="flex items-center bg-surface-neutral border border-surface-dim rounded-xl px-4 mb-4 w-full transition-colors focus-within:border-primary focus-within:bg-surface">
        <span className="text-on-surface-variant mr-2">🔍</span>
        <input 
            type="text" 
            placeholder="Search food..." 
            value={search} 
            onChange={e => {
                const val = e.target.value;
                setSearch(val);
                if (category === "recent" && val.length > 0) {
                    setCategory(""); // Auto-switch to "All" when typing
                }
            }} 
            className="flex-1 min-w-0 bg-transparent border-none text-on-surface text-base py-3 outline-none placeholder:text-gray-400" 
        />
      </div>

      {/* 3. Categories */}
      <div className="custom-scrollbar flex gap-2 overflow-x-auto pb-3 mb-2">
        {CATEGORIES.map(cat => {
            const isActive = category === cat.value;
            // For the icon-only "recent" filter, adjust padding to make it perfectly round
            const isIcon = cat.value === "recent";
            return (
                <button 
                    key={cat.value} 
                    onClick={() => { setCategory(cat.value); setSelectedItem(null); }} 
                    className={`rounded-full border-none text-xs font-semibold cursor-pointer whitespace-nowrap transition-colors flex items-center justify-center shrink-0 ${
                        isIcon ? "w-8 h-8 p-0" : "px-4 py-1.5"
                    } ${
                        isActive ? "bg-primary text-on-primary" : "bg-surface-neutral text-on-surface-variant hover:bg-surface-dim hover:text-on-surface"
                    }`}
                    title={isIcon ? "Recent Foods" : ""}
                >
                    {cat.label}
                </button>
            );
        })}
      </div>

      {/* 4. Results */}
      <div className="custom-scrollbar max-h-[250px] overflow-y-auto min-h-[100px] pr-1">
        {loading && <div className="text-center p-5 text-on-surface-variant">Searching...</div>}
        {!loading && displayItems.length === 0 && <div className="text-center p-5 text-on-surface-variant italic">No items found.</div>}
        
        {displayItems.map((item, idx) => {
            const isSelected = selectedItem && (
                (selectedItem._id && item._id && selectedItem._id === item._id) || 
                (selectedItem === item) 
            );

            return (
                <div 
                    key={item._id || idx} 
                    onClick={() => { setSelectedItem(item); setUnit(item.baseUnit || "g"); }} 
                    className={`flex justify-between items-center p-3 rounded-xl mb-1 cursor-pointer transition-all border ${
                        isSelected ? "bg-primary-fixed border-primary shadow-sm" : "bg-transparent border-transparent hover:bg-surface-neutral"
                    }`}
                >
                    <div>
                        <div className={`font-bold text-sm ${isSelected ? 'text-primary' : 'text-on-surface'}`}>{item.name}</div>
                        <div className="text-xs text-on-surface-variant font-medium mt-0.5">{item.caloriesPer100g} kcal • {item.protein}p {item.carbs}c {item.fats}f</div>
                    </div>
                    {isSelected && <span className="text-primary font-bold">✓</span>}
                </div>
            );
        })}
      </div>

      {/* 5. Add Panel */}
      {selectedItem && (
          <div className="mt-4 pt-4 border-t border-surface-dim flex gap-3 items-end bg-surface-neutral p-4 rounded-xl">
              <div className="flex-1">
                  <label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider block mb-1">QUANTITY</label>
                  <div className="flex gap-2">
                    <input 
                        type="number" value={quantity} onChange={e => setQuantity(e.target.value)} autoFocus placeholder="0" 
                        className="flex-1 min-w-0 px-3 py-2 bg-surface text-on-surface border border-surface-dim rounded-lg outline-none focus:border-primary transition-colors" 
                    />
                    <select 
                        value={unit} onChange={e => setUnit(e.target.value)} 
                        className="px-3 py-2 rounded-lg bg-surface text-on-surface border border-surface-dim outline-none focus:border-primary transition-colors"
                    >
                        {Object.keys(UNIT_LABELS).map(k => <option key={k} value={k}>{UNIT_LABELS[k]}</option>)}
                    </select>
                  </div>
              </div>
              <Button onClick={handleAdd}>ADD</Button>
          </div>
      )}

      {showCreateModal && <CreateFoodModal initialName={search} onClose={() => setShowCreateModal(false)} onSuccess={handleCustomFoodCreated} />}
      {showRecipeModal && <CreateRecipeModal onClose={() => setShowRecipeModal(false)} onSuccess={handleCustomFoodCreated} />}

      {/* Global CSS for Scrollbars */}
      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 6px; height: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #94a3b8; }
      `}</style>
    </div>
  );
}

export default AddMeal;