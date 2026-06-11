import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Shield, Eye, EyeOff, UserPlus, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/hooks/useAuth";

export default function Signup() {
  const { signup } = useAuth();
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    setLoading(true);
    const result = await signup(name, email, password);
    setLoading(false);

    if (result.success) {
      navigate("/");
    } else {
      setError(result.error || "Signup failed.");
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center relative overflow-hidden px-4">
      {/* Animated background effects */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-accent/5 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-1/3 left-1/4 w-80 h-80 bg-primary/5 rounded-full blur-[100px] animate-pulse delay-1000" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] border border-accent/5 rounded-full" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] border border-primary/5 rounded-full" />
      </div>

      <div className="relative w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 group mb-4">
            <Shield className="w-8 h-8 text-primary transition-all group-hover:drop-shadow-[0_0_12px_hsl(155_100%_45%/0.6)]" />
            <span className="text-2xl font-bold tracking-tight">
              Secure<span className="text-primary">Flow</span>
            </span>
          </Link>
          <p className="text-muted-foreground text-sm mt-2">
            Create your secure account
          </p>
        </div>

        {/* Card */}
        <div className="glassmorphism rounded-2xl p-8 glow-border">
          <div className="mb-6">
            <h2 className="text-xl font-semibold gradient-text">Create Account</h2>
            <p className="text-muted-foreground text-xs mt-1">
              Join SecureFlow to protect your code
            </p>
          </div>

          {error && (
            <div className="mb-4 px-4 py-3 rounded-lg bg-destructive/10 border border-destructive/30 text-destructive text-sm flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-destructive animate-pulse shrink-0" />
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-foreground/80">Full Name</Label>
              <Input
                id="name"
                type="text"
                placeholder="Agent Smith"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="bg-background/50 border-border/60 focus:border-primary/50 transition-colors h-11"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="text-foreground/80">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="agent@secureflow.dev"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-background/50 border-border/60 focus:border-primary/50 transition-colors h-11"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-foreground/80">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="bg-background/50 border-border/60 focus:border-primary/50 transition-colors h-11 pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-primary transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirm-password" className="text-foreground/80">Confirm Password</Label>
              <Input
                id="confirm-password"
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="bg-background/50 border-border/60 focus:border-primary/50 transition-colors h-11"
              />
            </div>

            <Button
              type="submit"
              variant="hero"
              disabled={loading}
              className="w-full h-11 text-sm font-semibold mt-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Creating Account...
                </>
              ) : (
                <>
                  <UserPlus className="w-4 h-4" />
                  Create Account
                </>
              )}
            </Button>
          </form>

          <div className="mt-6 pt-6 border-t border-border/40 text-center">
            <p className="text-sm text-muted-foreground">
              Already have an account?{" "}
              <Link
                to="/login"
                className="text-primary hover:text-primary/80 font-medium transition-colors hover:underline"
              >
                Sign In
              </Link>
            </p>
          </div>
        </div>

        {/* Terminal-style footer */}
        <div className="mt-6 text-center">
          <p className="text-xs text-muted-foreground/50 font-mono">
            <span className="text-accent/40">$</span> init_agent --clearance=top-secret
          </p>
        </div>
      </div>
    </div>
  );
}
