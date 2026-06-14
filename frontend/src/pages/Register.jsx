import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
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
    age: "", gender: "male", height: "", weight: "",
    activityLevel: "moderate", dietType: "veg", allergies: [],
    goal: "fat_loss"
  });

  const totalSteps = 7;
  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });
  const handleSelect = (name, value) => setForm({ ...form, [name]: value });

  const handleNext = () => {
    setError("");
    if (step === 1 && (!form.name || !form.email || !form.password)) return setError("Please fill all fields");
    if (step === 2 && !form.gender) return setError("Select a gender");
    if (step === 3 && !form.age) return setError("Enter your age");
    if (step === 4 && (!form.height || !form.weight)) return setError("Enter height and weight");
    setStep(prev => Math.min(prev + 1, totalSteps));
  };

  const handleBack = () => setStep(prev => Math.max(prev - 1, 1));

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    setLoading(true);
    try {
      await register({ ...form, age: Number(form.age), height: Number(form.height), weight: Number(form.weight) });
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
      setLoading(false);
    }
  };

  const OptionCard = ({ selected, onClick, children }) => (
    <div 
      onClick={onClick}
      className={`p-4 rounded-xl cursor-pointer text-center font-sans font-semibold transition-all duration-200 border-2 ${
        selected 
          ? 'border-primary bg-primary-fixed/20 text-primary' 
          : 'border-transparent bg-surface-neutral text-on-surface-variant hover:bg-surface-dim'
      }`}
    >
      {children}
    </div>
  );

  return (
    <div className="min-h-screen bg-surface-neutral flex items-center justify-center p-4">
      <div className="w-full max-w-md flex flex-col justify-center min-h-[90vh]">
        <Card className="p-6 sm:p-8 flex flex-col max-h-[90vh] overflow-y-auto">
            <div className="text-center mb-6">
                <div className="font-display text-2xl font-bold text-primary mb-6 tracking-tight">SEHAT</div>
                <div className="flex gap-2 mb-2">
                    {[...Array(totalSteps)].map((_, i) => (
                      <div 
                        key={i} 
                        className={`h-1.5 flex-1 rounded-full transition-colors duration-300 ${
                          i < step ? 'bg-secondary' : 'bg-surface-variant'
                        }`}
                      />
                    ))}
                </div>
                <div className="text-secondary text-xs font-bold uppercase tracking-wider">Step {step} of {totalSteps}</div>
            </div>

            <h2 className="font-display text-2xl font-semibold text-on-surface mb-2 text-center">
                {step === 1 && "Account Details"}
                {step === 2 && "Select Gender"}
                {step === 3 && "How old are you?"}
                {step === 4 && "Body Metrics"}
                {step === 5 && "Activity Level"}
                {step === 6 && "Diet Preferences"}
                {step === 7 && "Your Goal"}
            </h2>
            
            <p className="font-sans text-sm text-on-surface-variant text-center mb-6">
                {step === 1 && "Start your journey by creating a secure account."}
                {step === 2 && "This helps us calculate your metabolic rate."}
                {step === 3 && "Age influences your daily energy needs."}
                {step === 4 && "We need this to build your personalized plan."}
                {step === 5 && "Be honest! This changes your calorie budget."}
                {step === 6 && "What is your primary diet type?"}
                {step === 7 && "What do you want to achieve?"}
            </p>

            {error && (
              <div className="bg-error-container text-error px-4 py-3 rounded-lg text-sm mb-6 font-sans">
                {error}
              </div>
            )}

            <div className="flex-1 mb-6">
                {step === 1 && (
                    <div className="flex flex-col gap-4">
                        <Input label="Full Name" name="name" value={form.name} onChange={handleChange} placeholder="John Doe" autoComplete="off" />
                        <Input label="Email" type="email" name="email" value={form.email} onChange={handleChange} placeholder="name@example.com" autoComplete="off" />
                        <div className="relative">
                          <Input 
                            label="Password" 
                            type={showPassword ? "text" : "password"} 
                            name="password"
                            placeholder="••••••••" 
                            value={form.password} 
                            onChange={handleChange} 
                            autoComplete="new-password"
                            className="pr-16"
                          />
                          <button 
                            type="button" 
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-4 top-[34px] text-xs font-semibold text-on-surface-variant hover:text-primary transition-colors uppercase tracking-wider"
                          >
                            {showPassword ? "Hide" : "Show"}
                          </button>
                        </div>
                    </div>
                )}
                
                {step === 2 && (
                  <div className="grid grid-cols-2 gap-4">
                    <OptionCard selected={form.gender === "male"} onClick={() => handleSelect("gender", "male")}>👨 Male</OptionCard>
                    <OptionCard selected={form.gender === "female"} onClick={() => handleSelect("gender", "female")}>👩 Female</OptionCard>
                  </div>
                )}
                
                {step === 3 && (
                  <div className="flex flex-col items-center justify-center py-6">
                    <div className="text-6xl mb-6">🎂</div>
                    <input 
                      type="number" 
                      name="age" 
                      value={form.age} 
                      onChange={handleChange} 
                      className="text-5xl w-32 bg-transparent border-b-2 border-primary text-on-surface text-center focus:outline-none focus:border-secondary font-display pb-2" 
                      placeholder="25" 
                    />
                  </div>
                )}
                
                {step === 4 && (
                  <div className="flex flex-col gap-4">
                    <Input label="Height (cm)" name="height" type="number" value={form.height} onChange={handleChange} placeholder="175" />
                    <Input label="Weight (kg)" name="weight" type="number" value={form.weight} onChange={handleChange} placeholder="70" />
                  </div>
                )}
                
                {step === 5 && (
                  <div className="flex flex-col gap-3">
                    {[
                      { val: "sedentary", label: "Sedentary" }, 
                      { val: "light", label: "Lightly Active" }, 
                      { val: "moderate", label: "Moderately Active" }, 
                      { val: "heavy", label: "Very Active" }
                    ].map((opt) => (
                      <div 
                        key={opt.val} 
                        onClick={() => handleSelect("activityLevel", opt.val)} 
                        className={`p-4 rounded-xl cursor-pointer font-sans font-semibold transition-all duration-200 flex justify-between items-center border-2 ${
                          form.activityLevel === opt.val 
                            ? 'border-primary bg-primary-fixed/20 text-primary' 
                            : 'border-transparent bg-surface-neutral text-on-surface-variant hover:bg-surface-dim'
                        }`}
                      >
                        <span>{opt.label}</span>
                        {form.activityLevel === opt.val && <span>✓</span>}
                      </div>
                    ))}
                  </div>
                )}
                
                {step === 6 && (
                  <div className="flex flex-col gap-3">
                    {[
                      { val: 'veg', label: 'Vegetarian' },
                      { val: 'eggetarian', label: 'Eggetarian' },
                      { val: 'non_veg', label: 'Non-Vegetarian' },
                      { val: 'vegan', label: 'Vegan' },
                      { val: 'jain', label: 'Jain' }
                    ].map(diet => (
                      <OptionCard 
                        key={diet.val} 
                        selected={form.dietType === diet.val} 
                        onClick={() => handleSelect("dietType", diet.val)}
                      >
                        {diet.label}
                      </OptionCard>
                    ))}
                  </div>
                )}

                {step === 7 && (
                  <div className="flex flex-col gap-3">
                    {['fat_loss', 'maintenance', 'muscle_gain'].map(g => (
                      <OptionCard 
                        key={g} 
                        selected={form.goal === g} 
                        onClick={() => handleSelect("goal", g)}
                      >
                        {g.replace("_", " ")}
                      </OptionCard>
                    ))}
                  </div>
                )}
            </div>

            <div className="flex flex-col gap-3 mt-auto">
                <Button 
                  onClick={step === totalSteps ? handleSubmit : handleNext} 
                  disabled={loading} 
                  fullWidth
                >
                  {loading ? "Processing..." : (step === totalSteps ? "Finish" : "Next")}
                </Button>
                
                {step > 1 && (
                  <Button variant="ghost" onClick={handleBack} fullWidth>
                    Back
                  </Button>
                )}
                
                {step === 1 && (
                  <p className="text-center text-sm text-on-surface-variant mt-2 font-sans">
                    Already have an account?{' '}
                    <button onClick={() => navigate("/login")} className="text-primary font-semibold hover:underline">
                      Log in
                    </button>
                  </p>
                )}
            </div>
        </Card>
      </div>
    </div>
  );
}

export default Register;