import { useState } from "react";
import api from "../api/axios";

const CreateFoodModal = ({ onClose, onSuccess, initialName }) => {
    const [measureMode, setMeasureMode] = useState("solid");
    const [form, setForm] = useState({
    name: initialName || "",
    calories: "",
    protein: "",
    carbs: "",
    fats: "",
    category: "other",
    unit: "g" // Default to grams for simplicity
  });

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // 🔥 FIX: Determine the correct Unit Type based on your selection
      let finalUnitType = "gram";
      let finalBaseUnit = "g";

      if (measureMode === "liquid") {
          finalUnitType = "liquid";
          finalBaseUnit = "ml";
      } else if (measureMode === "piece") {
          finalUnitType = "piece";
          finalBaseUnit = "g"; // Technical requirement for DB, even for pieces
      }

      const res = await api.post("/food/ingredients", {
        name: form.name,
        caloriesPer100g: Number(form.calories),
        protein: Number(form.protein),
        carbs: Number(form.carbs),
        fats: Number(form.fats),
        category: form.category,
        
        // 🔥 Send the real values
        unitType: finalUnitType,
        baseUnit: finalBaseUnit
      });
      
      onSuccess(res.data); 
    } catch (err) {
      alert("Failed to create food");
    }
  };

  return (
    <div style={{
      position: "fixed", top: 0, left: 0, width: "100%", height: "100%",
      background: "rgba(0,0,0,0.5)", display: "flex", justifyContent: "center", alignItems: "center", zIndex: 1000
    }}>
      <div style={{ background: "white", padding: "24px", borderRadius: "16px", width: "90%", maxWidth: "400px" }}>
        <h3 style={{ marginTop: 0 }}>Create Custom Food</h3>
        
        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          
          <input name="name" placeholder="Food Name (e.g. My Protein Shake)" value={form.name} onChange={handleChange} required style={inputStyle} />
          
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
            <input type="number" name="calories" placeholder="Calories (kcal)" value={form.calories} onChange={handleChange} required style={inputStyle} />
            <select name="category" value={form.category} onChange={handleChange} style={inputStyle}>
                <option value="other">Other</option>
                <option value="processed">Packaged/Processed</option>
                <option value="grains">Grains/Bread</option>
                <option value="dairy">Dairy</option>
                <option value="meat">Meat</option>
            </select>
          </div>

          <p style={{ fontSize: "12px", color: "#666", margin: 0 }}>Nutritional values per 100g / 100ml:</p>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "10px" }}>
            <input type="number" name="protein" placeholder="Protein (g)" value={form.protein} onChange={handleChange} style={inputStyle} />
            <input type="number" name="carbs" placeholder="Carbs (g)" value={form.carbs} onChange={handleChange} style={inputStyle} />
            <input type="number" name="fats" placeholder="Fats (g)" value={form.fats} onChange={handleChange} style={inputStyle} />
          </div>

          <div style={{ display: "flex", gap: "10px", marginTop: "10px" }}>
            <button type="button" onClick={onClose} style={{ flex: 1, padding: "10px", background: "#f1f5f9", border: "none", borderRadius: "8px", cursor: "pointer" }}>Cancel</button>
            <button type="submit" style={{ flex: 1, padding: "10px", background: "#2563eb", color: "white", border: "none", borderRadius: "8px", cursor: "pointer" }}>Save & Add</button>
          </div>

        </form>
      </div>
    </div>
  );
};

const inputStyle = { padding: "10px", borderRadius: "8px", border: "1px solid #ddd", width: "100%", boxSizing: "border-box" };

export default CreateFoodModal;