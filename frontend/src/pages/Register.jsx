import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import Card from "../components/ui/Card";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";

function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [form, setForm] = useState({
    name: "", email: "", password: "",
    birthDate: "",
    gender: "", 
    heightCm: "", heightFt: "", heightIn: "", 
    weight: "", 
    activityLevel: "", dietType: "", allergies: [],
    goal: ""
  });

  const [heightUnit, setHeightUnit] = useState("ft");
  const [weightUnit, setWeightUnit] = useState("kg");

  const totalSteps = 7;
  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });
  const handleSelect = (name, value) => setForm({ ...form, [name]: value });

  const calculateAge = (dobString) => {
    if (!dobString) return 0;
    const today = new Date();
    const birthDate = new Date(dobString);
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
        age--;
    }
    return age;
  };

  const handleNext = () => {
    setError("");
    if (step === 1 && (!form.name || !form.email || !form.password)) return setError("Please fill all fields");
    if (step === 2 && !form.gender) return setError("Select a gender");
    if (step === 3 && !form.birthDate) return setError("Enter your date of birth");
    if (step === 3 && calculateAge(form.birthDate) < 13) return setError("You must be at least 13 years old.");
    if (step === 4) {
        if (heightUnit === "cm" && !form.heightCm) return setError("Enter height in cm");
        if (heightUnit === "ft" && (!form.heightFt || !form.heightIn)) return setError("Enter height in feet and inches");
        if (!form.weight) return setError("Enter weight");
    }
    if (step === 5 && !form.activityLevel) return setError("Select an activity level");
    if (step === 6 && !form.dietType) return setError("Select a dietary preference");
    if (step === 7 && !form.goal) return setError("Select a goal");
    
    setStep(prev => Math.min(prev + 1, totalSteps));
  };

  const handleBack = () => setStep(prev => Math.max(prev - 1, 1));

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    setLoading(true);
    try {
      const age = calculateAge(form.birthDate);
      let finalHeightCm = heightUnit === "cm" ? Number(form.heightCm) : Math.round((Number(form.heightFt) * 30.48) + (Number(form.heightIn) * 2.54));
      let finalWeightKg = weightUnit === "kg" ? Number(form.weight) : Math.round(Number(form.weight) * 0.453592);
      
      await register({ 
          ...form, 
          age, 
          height: finalHeightCm, 
          weight: finalWeightKg 
      });
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
      setLoading(false);
    }
  };

  const OptionCard = ({ selected, onClick, children, className = "" }) => (
    <div 
      onClick={onClick}
      className={`p-4 rounded-2xl cursor-pointer text-center font-sans font-semibold transition-all duration-300 border-2 shadow-sm hover:shadow-md hover:-translate-y-1 flex flex-col items-center justify-center gap-2 ${
        selected 
          ? 'border-primary bg-primary-container/30 text-primary shadow-[0_0_15px_rgba(20,184,166,0.2)]' 
          : 'border-surface-dim bg-surface text-on-surface hover:border-primary/40 hover:bg-surface-dim'
      } ${className}`}
    >
      {children}
    </div>
  );

  const renderDietIcon = (type) => {
    switch(type) {
      case "veg": return <div className="w-8 h-8 border-2 border-[#187a24] flex items-center justify-center bg-white"><div className="w-3.5 h-3.5 bg-[#187a24] rounded-full"></div></div>;
      case "non_veg": return <div className="w-8 h-8 border-2 border-[#8e3c1a] flex items-center justify-center bg-white"><div className="w-0 h-0 border-l-[6px] border-r-[6px] border-b-[10px] border-l-transparent border-r-transparent border-b-[#8e3c1a] mt-[1px]"></div></div>;
      case "eggetarian": return <div className="w-8 h-8 border-2 border-amber-500 flex items-center justify-center bg-white"><span className="material-symbols-outlined text-[20px] text-amber-500">egg</span></div>;
      case "vegan": return <div className="w-8 h-8 border-2 border-green-600 flex items-center justify-center bg-white"><span className="material-symbols-outlined text-[20px] text-green-600" style={{ fontVariationSettings: "'FILL' 1" }}>eco</span></div>;
      default: return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-surface-neutral via-surface to-primary-container/10 flex items-center justify-center p-4 selection:bg-primary/20 selection:text-primary">
      <div className="w-full max-w-lg flex flex-col justify-center min-h-[90vh]">
        
        {/* PROGRESS INDICATOR */}
        <div className="mb-8 px-4">
            <div className="flex gap-2 mb-3">
                {[...Array(totalSteps)].map((_, i) => (
                  <div 
                    key={i} 
                    className={`h-2 flex-1 rounded-full transition-all duration-500 ${
                      i < step ? 'bg-primary shadow-[0_0_8px_rgba(20,184,166,0.5)]' : 'bg-surface-variant/50'
                    }`}
                  />
                ))}
            </div>
            <div className="flex justify-between items-center text-xs font-bold uppercase tracking-wider text-on-surface-variant">
                <span>Step {step} of {totalSteps}</span>
                <span className="text-primary">{Math.round((step/totalSteps)*100)}% Completed</span>
            </div>
        </div>

        <Card className="p-8 sm:p-10 flex flex-col shadow-2xl border border-white/50 backdrop-blur-xl bg-surface/90 rounded-[2rem] relative overflow-hidden">
            
            {/* DECORATIVE BACKGROUND */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary-container/30 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/3 pointer-events-none"></div>

            <div className="text-center mb-8 relative z-10">
                <h2 className="font-display text-3xl font-bold text-on-background tracking-tight mb-2">
                    {step === 1 && "Create Account"}
                    {step === 2 && "Your Gender"}
                    {step === 3 && "Date of Birth"}
                    {step === 4 && "Body Metrics"}
                    {step === 5 && "Activity Level"}
                    {step === 6 && "Dietary Preference"}
                    {step === 7 && "Your Goal"}
                </h2>
                <p className="font-sans text-sm text-on-surface-variant">
                    {step === 1 && "Start your journey to vitality."}
                    {step === 2 && "Required for accurate metabolic calculations."}
                    {step === 3 && "Age influences your daily energy needs."}
                    {step === 4 && "We need this to build your personalized plan."}
                    {step === 5 && "Be honest! This changes your calorie budget."}
                    {step === 6 && "What type of food do you primarily eat?"}
                    {step === 7 && "What do you want to achieve?"}
                </p>
            </div>

            {error && (
              <div className="bg-error-container/50 border border-error/20 text-error px-4 py-3 rounded-xl text-sm mb-6 font-sans flex items-center gap-2 relative z-10 animate-shake">
                <span className="material-symbols-outlined text-[18px]">error</span>
                {error}
              </div>
            )}

            <div className="flex-1 mb-10 relative z-10">
                
                {/* STEP 1: ACCOUNT DETAILS */}
                {step === 1 && (
                    <div className="flex flex-col gap-5">
                        <Input label="Full Name" name="name" value={form.name} onChange={handleChange} placeholder="John Doe" autoComplete="off" />
                        <Input label="Email" type="email" name="email" value={form.email} onChange={handleChange} placeholder="name@example.com" autoComplete="off" />
                        <div className="flex flex-col gap-1.5">
                          <label className="text-xs font-semibold tracking-wider text-on-surface uppercase font-sans">Password</label>
                          <div className="relative">
                            <input 
                              type={showPassword ? "text" : "password"} 
                              name="password"
                              placeholder="••••••••" 
                              value={form.password} 
                              onChange={handleChange} 
                              autoComplete="new-password"
                              className="w-full px-4 py-3 rounded-lg font-sans text-on-surface bg-surface-neutral border border-transparent transition-all duration-200 focus:bg-surface focus:border-primary focus:outline-none focus:ring-0 placeholder:text-gray-400 pr-12"
                            />
                            <button 
                              type="button" 
                              onClick={() => setShowPassword(!showPassword)}
                              className="absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-primary transition-colors flex items-center justify-center p-1 rounded-full hover:bg-surface-dim"
                              title={showPassword ? "Hide Password" : "Show Password"}
                            >
                              <span className="material-symbols-outlined text-[20px]">
                                  {showPassword ? "visibility_off" : "visibility"}
                              </span>
                            </button>
                          </div>
                        </div>
                    </div>
                )}
                
                {/* STEP 2: GENDER */}
                {step === 2 && (
                  <div className="grid grid-cols-3 gap-4">
                    <OptionCard selected={form.gender === "male"} onClick={() => handleSelect("gender", "male")}>
                        <span className="material-symbols-outlined text-5xl text-blue-500 mb-1">male</span>
                        Male
                    </OptionCard>
                    <OptionCard selected={form.gender === "female"} onClick={() => handleSelect("gender", "female")}>
                        <span className="material-symbols-outlined text-5xl text-pink-500 mb-1">female</span>
                        Female
                    </OptionCard>
                    <OptionCard selected={form.gender === "other"} onClick={() => handleSelect("gender", "other")}>
                        <span className="material-symbols-outlined text-5xl text-purple-500 mb-1">transgender</span>
                        Other
                    </OptionCard>
                  </div>
                )}
                
                {/* STEP 3: DATE OF BIRTH */}
                {step === 3 && (
                  <div className="flex flex-col items-center justify-center py-6">
                    <div className="relative w-full max-w-xs">
                        <input 
                          type="date" 
                          name="birthDate" 
                          value={form.birthDate} 
                          onChange={handleChange} 
                          max={new Date().toISOString().split("T")[0]}
                          className="w-full bg-surface border-2 border-surface-dim rounded-2xl py-4 px-4 text-on-surface focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all font-sans font-bold text-lg" 
                        />
                    </div>
                  </div>
                )}
                
                {/* STEP 4: BODY METRICS */}
                {step === 4 && (
                  <div className="flex flex-col gap-8">
                    {/* HEIGHT */}
                    <div>
                        <div className="flex justify-between items-center mb-3">
                            <label className="text-sm font-bold text-on-surface-variant uppercase tracking-wider">Height</label>
                            <div className="flex bg-surface-dim p-1 rounded-lg">
                                <button onClick={() => setHeightUnit("ft")} className={`px-3 py-1 rounded-md text-xs font-bold transition-colors ${heightUnit === "ft" ? "bg-white shadow-sm text-primary" : "text-on-surface-variant hover:text-on-surface"}`}>FT / IN</button>
                                <button onClick={() => setHeightUnit("cm")} className={`px-3 py-1 rounded-md text-xs font-bold transition-colors ${heightUnit === "cm" ? "bg-white shadow-sm text-primary" : "text-on-surface-variant hover:text-on-surface"}`}>CM</button>
                            </div>
                        </div>
                        {heightUnit === "cm" ? (
                            <Input name="heightCm" type="number" value={form.heightCm} onChange={handleChange} placeholder="175" />
                        ) : (
                            <div className="flex gap-4">
                                <Input name="heightFt" type="number" value={form.heightFt} onChange={handleChange} placeholder="Feet (e.g. 5)" />
                                <Input name="heightIn" type="number" value={form.heightIn} onChange={handleChange} placeholder="Inches (e.g. 9)" />
                            </div>
                        )}
                    </div>

                    {/* WEIGHT */}
                    <div>
                        <div className="flex justify-between items-center mb-3">
                            <label className="text-sm font-bold text-on-surface-variant uppercase tracking-wider">Weight</label>
                            <div className="flex bg-surface-dim p-1 rounded-lg">
                                <button onClick={() => setWeightUnit("kg")} className={`px-3 py-1 rounded-md text-xs font-bold transition-colors ${weightUnit === "kg" ? "bg-white shadow-sm text-primary" : "text-on-surface-variant hover:text-on-surface"}`}>KG</button>
                                <button onClick={() => setWeightUnit("lbs")} className={`px-3 py-1 rounded-md text-xs font-bold transition-colors ${weightUnit === "lbs" ? "bg-white shadow-sm text-primary" : "text-on-surface-variant hover:text-on-surface"}`}>LBS</button>
                            </div>
                        </div>
                        <Input name="weight" type="number" value={form.weight} onChange={handleChange} placeholder={weightUnit === "kg" ? "70" : "154"} />
                    </div>
                  </div>
                )}
                
                {/* STEP 5: ACTIVITY LEVEL */}
                {step === 5 && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {[
                      { val: "sedentary", label: "Sedentary", icon: "chair", desc: "Desk job, little to no exercise." }, 
                      { val: "light", label: "Lightly Active", icon: "directions_walk", desc: "Light exercise 1-3 days/week." }, 
                      { val: "moderate", label: "Moderately Active", icon: "directions_run", desc: "Moderate sports 3-5 days/week." }, 
                      { val: "heavy", label: "Very Active", icon: "fitness_center", desc: "Hard exercise 6-7 days/week." }
                    ].map((opt) => (
                      <div 
                        key={opt.val} 
                        onClick={() => handleSelect("activityLevel", opt.val)} 
                        className={`p-4 rounded-2xl cursor-pointer transition-all duration-300 border-2 flex flex-col items-start gap-2 shadow-sm hover:shadow-md hover:-translate-y-1 ${
                          form.activityLevel === opt.val 
                            ? 'border-primary bg-primary-container/20 shadow-[0_0_15px_rgba(20,184,166,0.15)]' 
                            : 'border-surface-dim bg-surface hover:border-primary/40'
                        }`}
                      >
                        <div className="flex items-center gap-2 w-full">
                            <span className={`material-symbols-outlined text-[24px] ${form.activityLevel === opt.val ? "text-primary" : "text-on-surface-variant"}`}>{opt.icon}</span>
                            <span className={`font-bold ${form.activityLevel === opt.val ? "text-primary" : "text-on-surface"}`}>{opt.label}</span>
                        </div>
                        <p className="text-xs text-on-surface-variant font-medium leading-relaxed">{opt.desc}</p>
                      </div>
                    ))}
                  </div>
                )}
                
                {/* STEP 6: DIET TYPE */}
                {step === 6 && (
                  <div className="grid grid-cols-2 gap-4">
                    {[
                      { val: 'veg', label: 'Vegetarian' },
                      { val: 'eggetarian', label: 'Eggetarian' },
                      { val: 'non_veg', label: 'Non-Vegetarian' },
                      { val: 'vegan', label: 'Vegan' }
                    ].map(diet => (
                      <OptionCard 
                        key={diet.val} 
                        selected={form.dietType === diet.val} 
                        onClick={() => handleSelect("dietType", diet.val)}
                        className="py-6"
                      >
                        <div className="mb-2">{renderDietIcon(diet.val)}</div>
                        <span className="text-sm">{diet.label}</span>
                      </OptionCard>
                    ))}
                  </div>
                )}

                {/* STEP 7: GOALS */}
                {step === 7 && (
                  <div className="flex flex-col gap-4">
                    {[
                        { val: 'fat_loss', label: 'FAT LOSS', icon: 'local_fire_department', color: 'text-orange-500' }, 
                        { val: 'maintenance', label: 'MAINTENANCE', icon: 'self_improvement', color: 'text-teal-500' }, 
                        { val: 'muscle_gain', label: 'MUSCLE GAIN', icon: 'fitness_center', color: 'text-blue-500' }
                    ].map(g => (
                      <div 
                        key={g.val} 
                        onClick={() => handleSelect("goal", g.val)}
                        className={`p-5 rounded-2xl cursor-pointer transition-all duration-300 border-2 flex items-center gap-4 shadow-sm hover:shadow-md hover:scale-[1.02] ${
                          form.goal === g.val 
                            ? 'border-primary bg-primary-container/20 shadow-[0_0_20px_rgba(20,184,166,0.15)]' 
                            : 'border-surface-dim bg-surface hover:border-primary/40 hover:bg-surface-dim'
                        }`}
                      >
                        <div className={`w-12 h-12 rounded-full bg-white flex items-center justify-center shadow-sm ${g.color}`}>
                            <span className="material-symbols-outlined text-[28px]">{g.icon}</span>
                        </div>
                        <div className="flex-1">
                            <h3 className={`font-bold tracking-wide ${form.goal === g.val ? "text-primary" : "text-on-surface"}`}>{g.label}</h3>
                        </div>
                        {form.goal === g.val && (
                            <span className="material-symbols-outlined text-primary">check_circle</span>
                        )}
                      </div>
                    ))}
                  </div>
                )}
            </div>

            {/* NAVIGATION BUTTONS */}
            <div className="flex gap-4 mt-auto relative z-10">
                {step > 1 && (
                  <Button variant="outline" onClick={handleBack} className="flex-1 bg-surface hover:bg-surface-dim border-surface-dim text-on-surface transition-all duration-300 hover:translate-y-0.5 focus:outline-none">
                    Back
                  </Button>
                )}
                
                <Button 
                  onClick={(e) => { e.currentTarget.blur(); step === totalSteps ? handleSubmit(e) : handleNext(); }} 
                  disabled={loading} 
                  className="flex-[2] flex items-center justify-center gap-1 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-0.5 bg-gradient-to-r from-primary to-primary-fixed focus:outline-none focus:ring-0"
                >
                  <span>{loading ? "Processing..." : (step === totalSteps ? "Finish Setup" : "Next Step")}</span>
                  {!loading && step < totalSteps && <span className="material-symbols-outlined text-[18px]">arrow_forward</span>}
                </Button>
            </div>
            
            {step === 1 && (
              <p className="text-center text-sm text-on-surface-variant mt-6 font-sans relative z-10">
                Already have an account?{' '}
                <Link to="/login" className="text-primary font-bold hover:underline transition-all hover:text-primary-fixed">
                  Log in here
                </Link>
              </p>
            )}

        </Card>
      </div>
    </div>
  );
}

export default Register;