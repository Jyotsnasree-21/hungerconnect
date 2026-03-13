import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Mail, Lock } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import logoIcon from "@/assets/logo-icon.png";

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      toast.success("Welcome back!");
      navigate("/dashboard");
    } catch (err: any) {
      toast.error(err.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center px-4">
      <Link to="/" className="flex items-center gap-2 mb-8">
        <img src={logoIcon} alt="HungerConnect" className="h-10 w-10" />
        <span className="font-heading text-2xl font-bold text-primary">HungerConnect</span>
      </Link>

      <div className="w-full max-w-md bg-card rounded-2xl shadow-elevated p-8">
        <div className="h-1.5 bg-muted rounded-full mb-6 -mx-8 -mt-8 rounded-b-none overflow-hidden">
          <div className="h-full w-full gradient-primary" />
        </div>

        <h2 className="font-heading text-2xl font-bold text-primary mb-1">Welcome Back</h2>
        <p className="text-muted-foreground text-sm mb-8">Log in to continue making an impact</p>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <Label className="text-primary font-semibold text-sm">Email Address</Label>
            <div className="relative mt-1">
              <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <Input type="email" placeholder="john@example.com" className="pl-10" value={email}
                onChange={e => setEmail(e.target.value)} />
            </div>
          </div>
          <div>
            <Label className="text-primary font-semibold text-sm">Password</Label>
            <div className="relative mt-1">
              <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <Input type="password" placeholder="Enter your password" className="pl-10" value={password}
                onChange={e => setPassword(e.target.value)} />
            </div>
          </div>
          <div className="flex justify-end">
            <button type="button" className="text-primary text-sm font-medium hover:underline">Forgot Password?</button>
          </div>
          <Button variant="hero" size="lg" className="w-full" type="submit" disabled={loading}>
            {loading ? "Logging in..." : "Log In"}
          </Button>
        </form>
      </div>

      <p className="text-muted-foreground text-sm mt-6">
        Don't have an account? <Link to="/register" className="text-primary font-semibold hover:underline">Join Now</Link>
      </p>
    </div>
  );
};

export default Login;
