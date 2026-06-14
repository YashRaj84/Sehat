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
    <div className="min-h-screen bg-surface-neutral flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="font-display text-4xl font-bold text-primary mb-2 tracking-tight">SEHAT</h1>
          <p className="font-sans text-on-surface-variant text-sm">Vitality through Clarity</p>
        </div>

        <Card className="p-8">
          <h2 className="font-display text-2xl font-semibold text-on-surface mb-2">Welcome Back</h2>
          <p className="font-sans text-on-surface-variant text-sm mb-6">Enter your details to access your dashboard.</p>
          
          {error && (
            <div className="bg-error-container text-error px-4 py-3 rounded-lg text-sm mb-6 font-sans">
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
            
            <div className="relative">
              <Input 
                label="Password" 
                type={showPassword ? "text" : "password"} 
                placeholder="••••••••" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                required 
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

            <Button type="submit" fullWidth disabled={loading} className="mt-2">
              {loading ? "Signing In..." : "Log In"}
            </Button>
          </form>
          
          <div className="mt-6 text-center font-sans text-sm text-on-surface-variant">
            Don't have an account?{' '}
            <button 
              onClick={() => navigate("/register")}
              className="text-primary font-semibold hover:underline"
            >
              Sign up free
            </button>
          </div>
        </Card>
      </div>
    </div>
  );
}

export default Login;