import React, { useState, useEffect } from "react";
import Layout from "../components/Layout";
import api from "../api/axios";
import AddMeal from "../components/AddMeal";
import WaterTracker from "../components/WaterTracker";

const MealLogger = () => {
  const [todayLog, setTodayLog] = useState(null);
  
  const user = JSON.parse(localStorage.getItem("user")) || {};

  const fetchTodayLog = async () => {
    try {
      const res = await api.get("/log/today");
      setTodayLog(res.data);
    } catch (err) {
      console.error("Error fetching today log:", err);
    }
  };

  useEffect(() => {
    fetchTodayLog();
  }, []);

  const handleUpdate = () => {
      fetchTodayLog();
  };

  return (
    <Layout>
      <div className="max-w-7xl mx-auto py-4 lg:py-8">
        
        {/* MEAL LOGGER SECTION */}
        <header className="mb-6">
            <h1 className="font-display text-3xl sm:text-4xl font-bold tracking-tight mb-2 text-on-surface">
                Hi, {user.name ? user.name.split(' ')[0] : 'there'} 👋
            </h1>
            <p className="text-on-surface-variant text-base sm:text-lg">Let's log your meals and stay hydrated today!</p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 lg:gap-6 mb-12">
            {/* Log Meal Component (Spans 8 cols) */}
            <section className="md:col-span-8 bg-surface rounded-2xl shadow-sm p-6 lg:p-8 border border-surface-dim">
                <div className="flex items-center gap-2 mb-4">
                     <span className="material-symbols-outlined text-primary text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>restaurant</span>
                     <h3 className="font-display text-xl font-bold text-on-background">Add Food</h3>
                </div>
                <AddMeal onAdded={handleUpdate} />
            </section>

            {/* Water Intake (Spans 4 cols) */}
            <section className="md:col-span-4 bg-surface rounded-2xl shadow-sm p-6 lg:p-8 flex flex-col justify-center border border-surface-dim min-h-[300px]">
                <WaterTracker log={todayLog} userGoal={user.waterGoal || 2500} onUpdate={handleUpdate} />
            </section>
        </div>

      </div>
    </Layout>
  );
};

export default MealLogger;