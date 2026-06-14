import React, { useState, useEffect } from "react";
import Layout from "../components/Layout";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";
import Card from "../components/ui/Card";
import Input from "../components/ui/Input";
import Button from "../components/ui/Button";

const Profile = () => {
  const { user, logout } = useAuth();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    name: "",
    age: "",
    gender: "male",
    height: "",
    weight: "",
    activityLevel: "moderate",
    goal: "fat_loss"
  });

  useEffect(() => {
    if (user) {
      setForm({
        name: user.name || "",
        age: user.age || "",
        gender: user.gender || "male",
        height: user.height || "",
        weight: user.weight || "",
        activityLevel: user.activityLevel || "moderate",
        goal: user.goal || "fat_loss"
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
      await api.put("/auth/update", {
        ...form,
        age: Number(form.age),
        height: Number(form.height),
        weight: Number(form.weight)
      });
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
            <h1 className="font-display text-3xl font-bold tracking-tight mb-2">My Profile</h1>
            <p className="text-on-surface-variant">Update your metrics to recalculate goals.</p>
        </header>

        <Card className="p-6 sm:p-8">
            {status && (
              <div className={`p-4 rounded-xl mb-6 font-semibold text-sm ${
                isSuccess ? "bg-primary-fixed text-primary border border-primary/20" : "bg-error-container text-error border border-error/20"
              }`}>
                {status}
              </div>
            )}

            <form onSubmit={handleSave} className="flex flex-col gap-8">
                
                {/* Basic Info */}
                <div>
                  <h3 className="font-display font-bold text-lg text-primary border-b border-surface-dim pb-2 mb-4">Basic Info</h3>
                  <Input label="Full Name" name="name" value={form.name} onChange={handleChange} />
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

                {/* Goals */}
                <div>
                  <h3 className="font-display font-bold text-lg text-primary border-b border-surface-dim pb-2 mb-4">Preferences</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                  </div>
                </div>

                <Button type="submit" className="mt-4">
                  Save Changes
                </Button>

            </form>
        </Card>

      </div>
    </Layout>
  );
};

export default Profile;