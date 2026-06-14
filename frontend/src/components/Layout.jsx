import React from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import HealthTipsSlideshow from "./HealthTipsSlideshow";

const Layout = ({ children }) => {
  const location = useLocation();
  const { user } = useAuth();
  const currentPath = location.pathname;

  const navItems = [
    { name: "Dashboard", path: "/dashboard", icon: "dashboard", activeIcon: "dashboard", fill: true },
    { name: "Meal Logger", path: "/meal-logger", icon: "restaurant", activeIcon: "restaurant", fill: false },
    { name: "Progress", path: "/progress", icon: "insights", activeIcon: "insights", fill: false }, // Placeholder route
    { name: "Profile", path: "/profile", icon: "person", activeIcon: "person", fill: false }, // Profile settings
  ];

  return (
    <div className="bg-surface-neutral text-on-surface font-sans antialiased h-screen overflow-hidden flex selection:bg-primary-container selection:text-on-primary-container">
      
      {/* --- DESKTOP SIDEBAR --- */}
      <nav className="bg-surface text-primary text-xs font-semibold h-screen w-64 hidden lg:flex flex-col shadow-md fixed left-0 top-0 bottom-0 z-40 p-4 justify-between border-r border-surface-dim">
        <div>
          {/* Header */}
          <div className="mb-8 flex flex-col items-center pt-4">
            <div className="w-12 h-12 rounded-full bg-primary-container flex items-center justify-center mb-2">
              <span className="material-symbols-outlined text-on-primary-container text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>eco</span>
            </div>
            <h1 className="font-display text-2xl font-bold text-primary">SEHAT</h1>
            <p className="font-sans text-sm text-on-surface-variant font-normal">Vitality through Clarity</p>
          </div>

          {/* Navigation Links */}
          <ul className="space-y-2">
            {navItems.map((item) => {
              const isActive = currentPath === item.path;
              return (
                <li key={item.name}>
                  <Link
                    to={item.path}
                    className={`flex items-center gap-2 px-4 py-3 rounded-lg font-bold transition-all scale-95 active:scale-90 ${
                      isActive 
                        ? "bg-secondary-container text-on-secondary-container" 
                        : "text-on-surface-variant hover:bg-surface-dim"
                    }`}
                  >
                    <span 
                      className="material-symbols-outlined" 
                      style={{ fontVariationSettings: isActive && item.fill ? "'FILL' 1" : "'FILL' 0" }}
                    >
                      {item.icon}
                    </span>
                    <span>{item.name}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>

        {/* CTA */}
        <div className="mt-auto">
          <Link to="/meal-logger" className="w-full bg-primary text-on-primary text-xs font-bold py-3 rounded-lg flex items-center justify-center gap-2 hover:opacity-90 transition-opacity">
            <span className="material-symbols-outlined text-lg">add</span>
            Log New Meal
          </Link>
        </div>
      </nav>

      {/* --- MAIN CONTENT AREA --- */}
      <div className="flex-1 flex flex-col lg:ml-64 h-screen w-full relative">
        
        {/* --- TOP APP BAR --- */}
        <header className="bg-surface text-primary font-display text-xl w-full h-16 shadow-sm flex justify-between items-center px-4 lg:px-8 sticky top-0 z-30">
          {/* Left Area */}
          <div className="flex items-center gap-4">
            <span className="lg:hidden font-display text-2xl font-bold text-primary">SEHAT</span>
          </div>

          {/* Center Area: Health Tips Slideshow */}
          <div className="flex-1 hidden md:flex justify-center px-8">
            <HealthTipsSlideshow />
          </div>

          {/* Right Area (DietType Badge) */}
          <div className="flex items-center gap-2 sm:gap-4">
            {/* Diet Type Highlight Badge */}
            {user?.dietType && (
              <div className="hidden sm:flex items-center gap-1.5 px-3 py-1 bg-primary-container/20 border border-primary/20 text-primary rounded-full text-xs font-bold uppercase tracking-wide cursor-default transition-all duration-300 hover:scale-105 hover:bg-primary-container/40 hover:shadow-sm">
                <span className="material-symbols-outlined text-sm">restaurant</span>
                {user.dietType.replace("_", " ")}
              </div>
            )}
            
            {/* Mobile slideshow fallback */}
            <div className="md:hidden flex-1 overflow-hidden ml-4">
                <HealthTipsSlideshow />
            </div>
          </div>
        </header>

        {/* --- PAGE CONTENT (Dashboard Canvas) --- */}
        <main className="flex-1 overflow-y-auto p-4 lg:p-8 pb-24 lg:pb-8 bg-surface-neutral">
          {children}
        </main>
      </div>

      {/* --- MOBILE BOTTOM NAVBAR --- */}
      <nav className="bg-surface border-t border-surface-dim shadow-[0_-4px_20px_rgba(0,0,0,0.05)] fixed bottom-0 w-full z-40 flex justify-around items-center px-4 py-2 lg:hidden pb-safe">
        {navItems.map((item) => {
          const isActive = currentPath === item.path;
          return (
            <Link 
              key={item.name}
              to={item.path} 
              className={`flex flex-col items-center justify-center rounded-xl p-2 transition-all duration-200 ease-in-out w-16 ${
                isActive 
                  ? "bg-primary-container text-on-primary-container" 
                  : "text-on-surface-variant active:bg-surface-dim"
              }`}
            >
              <span 
                className="material-symbols-outlined mb-1" 
                style={{ fontVariationSettings: isActive && item.fill ? "'FILL' 1" : "'FILL' 0" }}
              >
                {item.icon}
              </span>
              <span className={`text-[10px] leading-none ${isActive ? "font-bold" : "font-medium"}`}>
                {item.name === "Meal Logger" ? "Log" : item.name}
              </span>
            </Link>
          );
        })}
      </nav>

    </div>
  );
};

export default Layout;
