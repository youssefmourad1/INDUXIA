import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useState } from "react";
import { UserRole } from "@/types";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Demo login - determine role based on email
    let role: UserRole = 'plant_director';
    if (email.includes('maintenance')) {
      role = 'maintenance_manager';
    } else if (email.includes('production')) {
      role = 'production_supervisor';
    }
    
    login(role);
    navigate('/dashboard');
  };

  const handleDemoLogin = (role: UserRole) => {
    login(role);
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-primary relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary to-primary/80"></div>
        <div className="relative z-10 flex flex-col justify-center px-12 text-primary-foreground">
          <div className="space-y-6">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-primary-foreground rounded-lg flex items-center justify-center">
                <span className="text-primary font-bold text-xl">I</span>
              </div>
              <span className="font-bold text-3xl">INDUXIA</span>
            </div>
            <h1 className="text-4xl font-bold leading-tight">
              Welcome back to the future of industrial operations
            </h1>
            <p className="text-xl opacity-90">
              Monitor, optimize, and transform your manufacturing processes with AI-powered insights.
            </p>
            <div className="grid grid-cols-2 gap-4 pt-8">
              <div className="text-center p-4 bg-primary-foreground/10 rounded-lg">
                <div className="text-2xl font-bold">99.5%</div>
                <div className="text-sm opacity-80">Uptime</div>
              </div>
              <div className="text-center p-4 bg-primary-foreground/10 rounded-lg">
                <div className="text-2xl font-bold">50+</div>
                <div className="text-sm opacity-80">Plants</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="flex-1 flex items-center justify-center p-8 bg-background">
        <div className="w-full max-w-md space-y-6">
          {/* Mobile Branding */}
          <div className="lg:hidden text-center space-y-2">
            <div className="flex items-center justify-center space-x-2">
              <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                <span className="text-primary-foreground font-bold">I</span>
              </div>
              <span className="font-bold text-2xl">INDUXIA</span>
            </div>
            <p className="text-muted-foreground">Industrial AI Operations</p>
          </div>

          <Card>
            <CardHeader className="text-center space-y-2">
              <CardTitle className="text-2xl">Sign in to your account</CardTitle>
              <CardDescription>
                Enter your credentials to access the platform
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="name@company.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
                <div className="flex items-center justify-between text-sm">
                  <Link to="/forgot-password" className="text-primary hover:underline">
                    Forgot password?
                  </Link>
                </div>
                <Button type="submit" className="w-full" size="lg">
                  Sign In
                </Button>
              </form>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <Separator className="w-full" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-background px-2 text-muted-foreground">
                    Or continue with demo
                  </span>
                </div>
              </div>

              <div className="space-y-2">
                <Button 
                  variant="outline" 
                  className="w-full" 
                  onClick={() => handleDemoLogin('plant_director')}
                >
                  Demo as Plant Director
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full" 
                  onClick={() => handleDemoLogin('maintenance_manager')}
                >
                  Demo as Maintenance Manager
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full" 
                  onClick={() => handleDemoLogin('production_supervisor')}
                >
                  Demo as Production Supervisor
                </Button>
              </div>

              <div className="text-center text-sm text-muted-foreground">
                Don't have an account?{" "}
                <Link to="/signup" className="text-primary hover:underline font-medium">
                  Sign up for free
                </Link>
              </div>
            </CardContent>
          </Card>

          <div className="text-center text-xs text-muted-foreground">
            <p>
              By signing in, you agree to our{" "}
              <Link to="/terms" className="hover:underline">Terms of Service</Link>
              {" "}and{" "}
              <Link to="/privacy" className="hover:underline">Privacy Policy</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;