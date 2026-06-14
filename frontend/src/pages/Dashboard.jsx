import React, { useEffect, useState } from "react";
import api from "../api/axios";
import Layout from "../components/Layout";
import StaticWaterTracker from "../components/StaticWaterTracker";
import CalorieDonut from "../components/CalorieDonut";
import FoodTimeline from "../components/FoodTimeline";

function Dashboard() {
  const [log, setLog] = useState(null);
  const [loading, setLoading] = useState(true);
  const user = JSON.parse(localStorage.getItem("user")) || {};

  const fetchLog = async () => {
    try {
      const res = await api.get("/log/today");
      setLog(res.data);
    } catch (err) {
      console.error("Error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchLog(); }, []);

  if (loading) return <Layout><div className="min-h-full flex items-center justify-center text-on-surface-variant font-sans">Loading...</div></Layout>;
  if (!log) return <Layout><div className="min-h-full flex items-center justify-center text-error font-sans">Failed to load data.</div></Layout>;

  const calorieGoal = user.dailyCalorieLimit || 2000;
  const macroGoals = {
      protein: Math.round((calorieGoal * 0.25) / 4), 
      carbs: Math.round((calorieGoal * 0.50) / 4),   
      fats: Math.round((calorieGoal * 0.25) / 9)     
  };

  // Safe checks for data
  const consumed = log?.totalCalories || 0;
  const remaining = Math.max(0, calorieGoal - consumed);
  
  const pConsumed = log?.totalProtein || 0;
  const cConsumed = log?.totalCarbs || 0;
  const fConsumed = log?.totalFats || 0;

  const pPct = Math.min(100, (pConsumed / macroGoals.protein) * 100);
  const cPct = Math.min(100, (cConsumed / macroGoals.carbs) * 100);
  const fPct = Math.min(100, (fConsumed / macroGoals.fats) * 100);

  return (
    <Layout>
      <div className="max-w-6xl mx-auto">
        
        {/* Page Header */}
        <div className="mb-6 lg:mb-8">
            <h2 className="font-display text-2xl md:text-3xl font-bold text-on-background tracking-tight">Daily Overview</h2>
            <p className="font-sans text-sm md:text-base text-on-surface-variant mt-1">Stay on track. You're doing great today.</p>
        </div>

        {/* Bento Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 lg:gap-6 auto-rows-min">
            
            {/* Main Calorie Tracker (Spans 8 cols on desktop) */}
            <section className="md:col-span-8 bg-surface rounded-2xl shadow-sm hover:shadow-md py-12 px-6 lg:px-8 flex flex-col items-center justify-center transition-shadow duration-300 relative overflow-hidden border border-surface-dim">
                <div className="absolute -top-20 -right-20 w-64 h-64 bg-primary-container opacity-10 rounded-full blur-3xl pointer-events-none"></div>
                
                <div className="absolute top-4 right-4 sm:top-6 sm:right-6 z-10">
                    <span className="inline-block text-xs font-bold bg-primary-container text-on-primary-container px-3 py-1.5 rounded-full border border-primary/10 shadow-sm transition-all duration-300 hover:scale-105 hover:shadow-md hover:bg-primary/20 cursor-default">
                        {Math.round(consumed)} / {calorieGoal} kcal
                    </span>
                </div>

                <CalorieDonut log={log} goal={calorieGoal} macroGoals={macroGoals} />
            </section>

            {/* Water Intake (Spans 4 cols) - To be StaticHumanWaterTracker */}
            <section className="md:col-span-4 bg-surface rounded-2xl shadow-sm p-6 lg:p-8 flex flex-col justify-center border border-surface-dim">
                 <StaticWaterTracker log={log} userGoal={user.waterGoal || 2500} />
            </section>

            {/* Today's Meals List (Spans 12 cols, sits below the rest) */}
            <section className="md:col-span-12 bg-surface rounded-2xl shadow-sm p-6 lg:p-8 border border-surface-dim">
                <FoodTimeline items={log.foodItems} onRefresh={fetchLog} />
            </section>
        </div>

      </div>
    </Layout>
  );
}

export default Dashboard;