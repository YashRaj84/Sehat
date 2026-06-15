import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import Card from "../components/ui/Card";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";

function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await login(email, password);
      navigate("/dashboard");
    } catch (err) {
      setError("Invalid email or password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-surface-neutral via-surface to-primary-container/10 flex items-center justify-center p-4 selection:bg-primary/20 selection:text-primary">
      <div className="w-full max-w-lg flex flex-col justify-center min-h-[90vh]">
        <div className="text-center mb-6">
          <h1 className="font-display text-4xl font-bold text-primary mb-2 tracking-tight drop-shadow-sm">SEHAT</h1>
          <p className="font-sans text-on-surface-variant text-sm tracking-wide">Vitality through Clarity</p>
        </div>

        <div className="bg-white/80 backdrop-blur-xl shadow-2xl rounded-3xl overflow-hidden border border-white/50">
          <div className="p-8 md:p-10 flex flex-col">
            <div className="text-center mb-8">
              <h2 className="font-display text-3xl font-bold text-on-surface mb-2">Welcome Back</h2>
              <p className="font-sans text-on-surface-variant text-sm md:text-base">Enter your details to access your dashboard.</p>
            </div>
            
            {error && (
              <div className="bg-error-container text-error px-4 py-3 rounded-xl text-sm mb-6 font-sans font-medium flex items-center gap-2">
                <span className="material-symbols-outlined text-[20px]">error</span>
                {error}
              </div>
            )}
            
            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
              <Input 
                label="Email Address" 
                type="email" 
                placeholder="name@example.com" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
                required 
              />
              
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold tracking-wider text-on-surface uppercase font-sans">Password</label>
                <div className="relative">
                  <input 
                    type={showPassword ? "text" : "password"} 
                    name="password"
                    placeholder="••••••••" 
                    value={password} 
                    onChange={(e) => setPassword(e.target.value)} 
                    required 
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

              <Button type="submit" disabled={loading} className="mt-4 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-0.5 bg-gradient-to-r from-primary to-primary-fixed focus:outline-none focus:ring-0 py-3.5 rounded-xl text-lg font-bold">
                <span>{loading ? "Signing In..." : "Log In"}</span>
                {!loading && <span className="material-symbols-outlined text-[20px]">login</span>}
              </Button>
            </form>
            
            <div className="mt-8 text-center font-sans text-sm text-on-surface-variant">
              Don't have an account?{' '}
              <button 
                type="button"
                onClick={() => navigate("/register")}
                className="text-primary font-bold hover:underline transition-all"
              >
                Sign up free
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;