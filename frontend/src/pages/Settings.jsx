import React, { useState, useEffect } from "react";
import Layout from "../components/Layout";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";
import Card from "../components/ui/Card";
import Input from "../components/ui/Input";
import Button from "../components/ui/Button";

const Settings = () => {
  const { user, setUser, logout } = useAuth();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    age: "",
    gender: "male",
    height: "",
    weight: "",
    activityLevel: "moderate",
    goal: "fat_loss",
    dietType: "veg"
  });

  useEffect(() => {
    if (user) {
      setForm({
        age: user.age || "",
        gender: user.gender || "male",
        height: user.height || "",
        weight: user.weight || "",
        activityLevel: user.activityLevel || "moderate",
        goal: user.goal || "fat_loss",
        dietType: user.dietType || "veg"
      });
    }
  }, [user]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccess("");
    setError("");

    try {
      const res = await api.put("/auth/profile", {
        ...form,
        age: Number(form.age),
        height: Number(form.height),
        weight: Number(form.weight)
      });
      
      const updatedUser = res.data.user;
      localStorage.setItem("user", JSON.stringify(updatedUser));
      setUser(updatedUser);
      
      setSuccess("Profile updated successfully!");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  if (!user) return <div className="p-8 text-center text-on-surface">Please log in to view profile.</div>;

  return (
    <Layout>
      <div className="max-w-3xl mx-auto py-4 lg:py-8">
        
        <header className="mb-8">
            <h1 className="font-display text-3xl font-bold tracking-tight mb-2">Settings</h1>
            <p className="text-on-surface-variant">Manage your account details and body metrics.</p>
        </header>

        <Card className="p-6 sm:p-8">
            {(success || error) && (
              <div className={`p-4 rounded-xl mb-6 font-semibold text-sm ${
                success ? "bg-primary-fixed text-primary border border-primary/20" : "bg-error-container text-error border border-error/20"
              }`}>
                {success || error}
              </div>
            )}

            <form onSubmit={handleUpdate} className="flex flex-col gap-8">
                
                {/* Basic Info & Account Details */}
                <div>
                  <h3 className="font-display font-bold text-lg text-primary border-b border-surface-dim pb-2 mb-4">Account Details</h3>
                  
                  {/* Read-Only Demographics */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6 p-4 bg-surface-neutral/50 rounded-xl border border-surface-dim/50">
                      <div>
                          <div className="text-xs font-semibold text-on-surface-variant uppercase tracking-wider mb-1">Email Address</div>
                          <div className="text-on-surface font-medium">{user.email || "Not provided"}</div>
                      </div>
                      <div>
                          <div className="text-xs font-semibold text-on-surface-variant uppercase tracking-wider mb-1">Full Name</div>
                          <div className="text-on-surface font-medium capitalize">{user.name || "Not provided"}</div>
                      </div>
                  </div>
                </div>
                
                {/* Metrics */}
                <div>
                  <h3 className="font-display font-bold text-lg text-primary border-b border-surface-dim pb-2 mb-4">Body Metrics</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <Input label="Age" name="age" type="number" value={form.age} onChange={handleChange} />
                      <Input label="Height (cm)" name="height" type="number" value={form.height} onChange={handleChange} />
                      <Input label="Weight (kg)" name="weight" type="number" value={form.weight} onChange={handleChange} />
                  </div>
                </div>

                {/* Goals & Preferences */}
                <div>
                  <h3 className="font-display font-bold text-lg text-primary border-b border-surface-dim pb-2 mb-4">Preferences</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div className="flex flex-col gap-1.5">
                          <label className="text-xs font-semibold tracking-wider text-on-surface uppercase font-sans">Goal</label>
                          <select name="goal" value={form.goal} onChange={handleChange} className="w-full px-4 py-3 rounded-lg font-sans text-on-surface bg-surface-neutral border border-transparent transition-all duration-200 focus:bg-surface focus:border-primary focus:outline-none placeholder:text-gray-400">
                              <option value="fat_loss">Fat Loss</option>
                              <option value="maintenance">Maintenance</option>
                              <option value="muscle_gain">Muscle Gain</option>
                          </select>
                      </div>
                      <div className="flex flex-col gap-1.5">
                          <label className="text-xs font-semibold tracking-wider text-on-surface uppercase font-sans">Activity Level</label>
                          <select name="activityLevel" value={form.activityLevel} onChange={handleChange} className="w-full px-4 py-3 rounded-lg font-sans text-on-surface bg-surface-neutral border border-transparent transition-all duration-200 focus:bg-surface focus:border-primary focus:outline-none placeholder:text-gray-400">
                              <option value="sedentary">Sedentary</option>
                              <option value="light">Lightly Active</option>
                              <option value="moderate">Moderately Active</option>
                              <option value="heavy">Very Active</option>
                          </select>
                      </div>
                      <div className="flex flex-col gap-1.5">
                          <label className="text-xs font-semibold tracking-wider text-on-surface uppercase font-sans">Diet Type</label>
                          <select name="dietType" value={form.dietType} onChange={handleChange} className="w-full px-4 py-3 rounded-lg font-sans text-on-surface bg-surface-neutral border border-transparent transition-all duration-200 focus:bg-surface focus:border-primary focus:outline-none placeholder:text-gray-400">
                              <option value="veg">Vegetarian</option>
                              <option value="eggetarian">Eggetarian</option>
                              <option value="non_veg">Non-Vegetarian</option>
                              <option value="vegan">Vegan</option>
                          </select>
                      </div>
                  </div>
                </div>

                <Button type="submit" className="mt-4">
                  Save Changes
                </Button>

            </form>
        </Card>

        {/* LOGOUT */}
        <div className="mt-8 flex justify-center">
            <button 
                onClick={logout}
                className="px-6 py-3 rounded-xl border border-error/30 text-error font-bold text-sm bg-error-container/20 transition-all duration-300 flex items-center gap-2 hover:bg-error hover:text-white hover:border-error hover:shadow-[0_4px_12px_rgba(186,26,26,0.3)] hover:-translate-y-0.5"
            >
                <span className="material-symbols-outlined text-[18px]">logout</span>
                Logout
            </button>
        </div>

      </div>
    </Layout>
  );
};

export default Settings;