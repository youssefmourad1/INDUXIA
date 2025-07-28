import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { UserRole } from '@/types';
import { Loader2, User, Crown, Wrench, Settings } from 'lucide-react';

const demoAccounts = [
  {
    email: 'director@induxia.demo',
    password: 'demo123',
    role: 'plant_director' as UserRole,
    name: 'Sarah Chen',
    icon: Crown,
    description: 'Full access to all features'
  },
  {
    email: 'maintenance@induxia.demo', 
    password: 'demo123',
    role: 'maintenance_manager' as UserRole,
    name: 'Marcus Rodriguez',
    icon: Wrench,
    description: 'Asset health & maintenance focus'
  },
  {
    email: 'supervisor@induxia.demo',
    password: 'demo123', 
    role: 'production_supervisor' as UserRole,
    name: 'Emily Johnson',
    icon: Settings,
    description: 'Production line oversight'
  },
  {
    email: 'operator@induxia.demo',
    password: 'demo123',
    role: 'operator' as UserRole, 
    name: 'Alex Thompson',
    icon: User,
    description: 'Day-to-day operations'
  }
];

export default function AuthPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState<UserRole>('operator');
  const [loading, setLoading] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);

  const { user, signIn, signUp } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || '/dashboard';

  useEffect(() => {
    if (user) {
      navigate(from, { replace: true });
    }
  }, [user, navigate, from]);

  const handleDemoLogin = async (demoAccount: typeof demoAccounts[0]) => {
    setEmail(demoAccount.email);
    setPassword(demoAccount.password);
    setLoading(true);
    
    // First try to sign in
    const { error: signInError } = await signIn(demoAccount.email, demoAccount.password);
    
    if (signInError) {
      console.log('Sign in failed, attempting to create demo account:', signInError.message);
      
      // If sign in fails, try to create the account
      const { error: signUpError } = await signUp(
        demoAccount.email, 
        demoAccount.password, 
        demoAccount.name, 
        demoAccount.role
      );
      
      if (signUpError) {
        toast({
          title: "Demo Account Creation Failed",
          description: `Could not create demo account: ${signUpError.message}`,
          variant: "destructive",
        });
      } else {
        toast({
          title: `Demo Account Created!`,
          description: `Created and signed in as ${demoAccount.name}`,
        });
      }
    } else {
      toast({
        title: `Welcome ${demoAccount.name}!`,
        description: `Logged in as ${demoAccount.role.replace('_', ' ')}`,
      });
    }
    setLoading(false);
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    const { error } = await signIn(email, password);
    
    if (error) {
      toast({
        title: "Sign In Error",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Welcome back!",
        description: "You have successfully signed in.",
      });
    }
    setLoading(false);
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password || !name) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    const { error } = await signUp(email, password, name, role);
    
    if (error) {
      toast({
        title: "Sign Up Error",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Welcome to INDUXIA!",
        description: "Your account has been created successfully. Please check your email to verify your account.",
      });
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 to-secondary/5 p-4">
      <div className="w-full max-w-4xl grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Demo Accounts Panel */}
        <Card className="order-2 lg:order-1">
          <CardHeader>
            <CardTitle className="text-xl">Try Demo Accounts</CardTitle>
            <CardDescription>
              Experience different user roles without creating an account
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {demoAccounts.map((account) => {
              const IconComponent = account.icon;
              return (
                <Button
                  key={account.email}
                  variant="outline"
                  className="w-full justify-start h-auto p-4 hover:bg-primary/5"
                  onClick={() => handleDemoLogin(account)}
                  disabled={loading}
                >
                  <div className="flex items-center gap-3 w-full">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <IconComponent className="w-4 h-4 text-primary" />
                    </div>
                    <div className="flex-1 text-left">
                      <div className="font-medium">{account.name}</div>
                      <div className="text-sm text-muted-foreground capitalize">
                        {account.role.replace('_', ' ')}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {account.description}
                      </div>
                    </div>
                    <Badge variant="secondary" className="text-xs">
                      Demo
                    </Badge>
                  </div>
                </Button>
              );
            })}
            <div className="pt-2 border-t">
              <p className="text-xs text-muted-foreground text-center">
                Click any demo account above to auto-login (accounts will be created if needed)
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Auth Forms Panel */}
        <Card className="order-1 lg:order-2">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold text-center">INDUXIA Portal</CardTitle>
            <CardDescription className="text-center">
              Industrial Operations Management Platform
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs value={isSignUp ? "signup" : "signin"} onValueChange={(value) => setIsSignUp(value === "signup")}>
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="signin">Sign In</TabsTrigger>
                <TabsTrigger value="signup">Sign Up</TabsTrigger>
              </TabsList>
              
              <TabsContent value="signin" className="space-y-4">
                <form onSubmit={handleSignIn} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="Enter your email"
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
                  <Button type="submit" className="w-full" disabled={loading}>
                    {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Sign In
                  </Button>
                </form>
              </TabsContent>
              
              <TabsContent value="signup" className="space-y-4">
                <form onSubmit={handleSignUp} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input
                      id="name"
                      type="text"
                      placeholder="Enter your full name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="Enter your email"
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
                      placeholder="Create a password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="role">Role</Label>
                    <Select value={role} onValueChange={(value: UserRole) => setRole(value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select your role" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="operator">Operator</SelectItem>
                        <SelectItem value="production_supervisor">Production Supervisor</SelectItem>
                        <SelectItem value="maintenance_manager">Maintenance Manager</SelectItem>
                        <SelectItem value="plant_director">Plant Director</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <Button type="submit" className="w-full" disabled={loading}>
                    {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Create Account
                  </Button>
                </form>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}