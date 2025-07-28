import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, BarChart3, Shield, Zap, Users, Target, TrendingUp, CheckCircle, Star, Play } from "lucide-react";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import heroImage from "@/assets/hero-industrial.jpg";
import induxiaLogo from "@/assets/induxia-logo.jpg";

const LandingPage = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [activeFeature, setActiveFeature] = useState(0);

  useEffect(() => {
    setIsVisible(true);
    const interval = setInterval(() => {
      setActiveFeature((prev) => (prev + 1) % 6);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const features = [
    {
      icon: BarChart3,
      title: "Real-Time Analytics",
      description: "Monitor your plant operations with advanced AI-powered analytics and predictive insights.",
      metric: "99.9% accuracy"
    },
    {
      icon: Shield,
      title: "Enhanced Security",
      description: "Enterprise-grade security with role-based access control and audit trails.",
      metric: "ISO 27001 certified"
    },
    {
      icon: Zap,
      title: "Smart Automation",
      description: "Automate maintenance schedules and optimize production workflows with AI.",
      metric: "40% faster operations"
    },
    {
      icon: Users,
      title: "Team Collaboration",
      description: "Seamless collaboration tools for maintenance teams and production supervisors.",
      metric: "500+ teams connected"
    },
    {
      icon: Target,
      title: "Quality Control",
      description: "Advanced quality management systems with incident tracking and reporting.",
      metric: "Zero defect tolerance"
    },
    {
      icon: TrendingUp,
      title: "Performance Optimization",
      description: "Maximize OEE and reduce downtime with intelligent performance monitoring.",
      metric: "25% efficiency boost"
    }
  ];

  const stats = [
    { value: "99.5%", label: "Uptime Guaranteed", trend: "+2.3%" },
    { value: "500+", label: "Enterprise Clients", trend: "+15%" },
    { value: "25%", label: "Average Cost Reduction", trend: "+8%" },
    { value: "24/7", label: "Support Available", trend: "Always" }
  ];

  const testimonials = [
    {
      name: "Sarah Chen",
      role: "Plant Director, TechCorp Manufacturing",
      content: "INDUXIA transformed our operations completely. We've seen 30% reduction in downtime.",
      rating: 5
    },
    {
      name: "Marcus Rodriguez", 
      role: "Operations Manager, GlobalSteel",
      content: "The AI predictions are incredibly accurate. We prevent issues before they happen.",
      rating: 5
    },
    {
      name: "Emily Watson",
      role: "Quality Director, AutoParts Inc",
      content: "Best investment we've made. The ROI was visible within the first quarter.",
      rating: 5
    }
  ];

  return (
    <div className="min-h-screen bg-background overflow-hidden">
      {/* Animated Background */}
      <div className="fixed inset-0 opacity-30">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-secondary/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 w-48 h-48 bg-accent/20 rounded-full blur-3xl animate-pulse delay-2000"></div>
      </div>

      {/* Navigation */}
      <nav className="relative z-50 border-b bg-background/80 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className={`flex items-center space-x-2 transition-all duration-700 ${isVisible ? 'translate-x-0 opacity-100' : '-translate-x-10 opacity-0'}`}>
            <img src={induxiaLogo} alt="INDUXIA Logo" className="h-8 w-auto" />
          </div>
          <div className={`flex items-center space-x-4 transition-all duration-700 delay-200 ${isVisible ? 'translate-x-0 opacity-100' : 'translate-x-10 opacity-0'}`}>
            <Link to="/auth">
              <Button variant="ghost" className="hover:scale-105 transition-transform">Sign In</Button>
            </Link>
            <Link to="/auth">
              <Button className="hover:scale-105 transition-transform shadow-lg">Get Started</Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className={`space-y-8 transition-all duration-1000 ${isVisible ? 'translate-x-0 opacity-100' : '-translate-x-20 opacity-0'}`}>
              <div className="space-y-6">
                <Badge variant="secondary" className="w-fit animate-fade-in bg-gradient-to-r from-primary/10 to-secondary/10 border-primary/20">
                  <Zap className="w-4 h-4 mr-2 text-primary" />
                  Next-Gen Industrial AI Platform
                </Badge>
                <h1 className="text-5xl lg:text-6xl font-bold leading-tight">
                  Transform Your
                  <span className="text-transparent bg-gradient-to-r from-primary via-primary/80 to-secondary bg-clip-text animate-pulse"> Industrial Operations</span>
                </h1>
                <p className="text-xl text-muted-foreground leading-relaxed">
                  Harness the power of AI to optimize production, reduce downtime, and maximize efficiency. 
                  Join industry leaders who trust INDUXIA for their digital transformation.
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/auth">
                  <Button size="lg" className="w-full sm:w-auto group bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary shadow-2xl hover:shadow-primary/25 transition-all duration-300 transform hover:scale-105">
                    Start Free Trial
                    <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
                <Button variant="outline" size="lg" className="w-full sm:w-auto group border-2 hover:bg-primary/5 transition-all duration-300">
                  <Play className="mr-2 h-4 w-4 group-hover:scale-110 transition-transform" />
                  Watch Demo
                </Button>
              </div>

              {/* Animated Stats */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 pt-8">
                {stats.map((stat, index) => (
                  <div key={index} className={`text-center transition-all duration-700 delay-${index * 100} ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
                    <div className="text-2xl font-bold text-primary animate-pulse">{stat.value}</div>
                    <div className="text-sm text-muted-foreground">{stat.label}</div>
                    <div className="text-xs text-green-500 flex items-center justify-center mt-1">
                      <TrendingUp className="w-3 h-3 mr-1" />
                      {stat.trend}
                    </div>
                  </div>
                ))}
              </div>

              {/* Trust Indicators */}
              <div className="flex items-center space-x-6 pt-6">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <span className="text-sm text-muted-foreground">SOC 2 Compliant</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Shield className="w-5 h-5 text-blue-500" />
                  <span className="text-sm text-muted-foreground">Enterprise Ready</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Star className="w-5 h-5 text-yellow-500" />
                  <span className="text-sm text-muted-foreground">4.9/5 Rating</span>
                </div>
              </div>
            </div>
            
            <div className={`relative transition-all duration-1000 delay-300 ${isVisible ? 'translate-x-0 opacity-100' : 'translate-x-20 opacity-0'}`}>
              <div className="relative group">
                <img 
                  src={heroImage} 
                  alt="Industrial Operations" 
                  className="rounded-2xl shadow-2xl transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background/40 via-transparent to-transparent rounded-2xl"></div>
                
                {/* Floating Elements */}
                <div className="absolute -top-4 -right-4 bg-green-500 text-white px-4 py-2 rounded-full text-sm font-semibold shadow-lg animate-bounce">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                    <span>Live Monitoring</span>
                  </div>
                </div>
                
                <div className="absolute -bottom-4 -left-4 bg-primary text-primary-foreground px-4 py-2 rounded-full text-sm font-semibold shadow-lg animate-pulse">
                  +25% Efficiency
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gradient-to-br from-muted/30 via-background to-muted/20 relative">
        <div className="container mx-auto px-4">
          <div className={`text-center space-y-4 mb-16 transition-all duration-1000 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
            <Badge variant="secondary" className="w-fit mx-auto">
              <Target className="w-4 h-4 mr-2" />
              Features
            </Badge>
            <h2 className="text-4xl lg:text-5xl font-bold">Everything You Need to Excel</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Comprehensive tools designed for modern industrial operations
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card 
                key={index} 
                className={`p-6 hover:shadow-xl transition-all duration-500 hover:-translate-y-2 group border-2 hover:border-primary/20 ${
                  activeFeature === index ? 'ring-2 ring-primary/20 shadow-lg scale-105' : ''
                } ${isVisible ? 'animate-fade-in' : 'opacity-0'}`}
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <CardContent className="p-0 space-y-4">
                  <div className={`w-12 h-12 bg-gradient-to-br from-primary/20 to-primary/10 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300 ${
                    activeFeature === index ? 'bg-primary text-primary-foreground' : ''
                  }`}>
                    <feature.icon className="h-6 w-6 text-primary group-hover:text-primary transition-colors" />
                  </div>
                  <h3 className="text-xl font-semibold group-hover:text-primary transition-colors">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                  <div className="flex items-center justify-between pt-2">
                    <Badge variant="outline" className="text-xs bg-primary/5 text-primary border-primary/20">
                      {feature.metric}
                    </Badge>
                    <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all duration-300" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center space-y-4 mb-16">
            <Badge variant="secondary" className="w-fit mx-auto">
              <Users className="w-4 h-4 mr-2" />
              Testimonials
            </Badge>
            <h2 className="text-4xl font-bold">Trusted by Industry Leaders</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              See what our customers say about transforming their operations
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="p-6 hover:shadow-xl transition-all duration-500 hover:-translate-y-1 border-2 hover:border-primary/20">
                <CardContent className="p-0 space-y-4">
                  <div className="flex items-center space-x-1">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <p className="text-muted-foreground italic">"{testimonial.content}"</p>
                  <div className="border-t pt-4">
                    <p className="font-semibold">{testimonial.name}</p>
                    <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary via-primary/95 to-secondary"></div>
        <div className="container mx-auto px-4 relative z-10">
          <Card className="p-12 text-center bg-transparent border-0 text-primary-foreground">
            <div className="space-y-8">
              <h2 className="text-4xl lg:text-5xl font-bold animate-fade-in">Ready to Transform Your Operations?</h2>
              <p className="text-xl opacity-90 max-w-2xl mx-auto">
                Join thousands of industrial leaders who have revolutionized their operations with INDUXIA
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/auth">
                  <Button size="lg" variant="secondary" className="w-full sm:w-auto group bg-background text-foreground hover:bg-background/90 shadow-2xl transition-all duration-300 transform hover:scale-105">
                    Start Your Free Trial
                    <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
                <Button size="lg" variant="outline" className="w-full sm:w-auto bg-transparent border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary transition-all duration-300 transform hover:scale-105">
                  Contact Sales
                </Button>
              </div>
              
              <div className="flex justify-center items-center space-x-8 pt-6 text-sm opacity-80">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4" />
                  <span>No credit card required</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4" />
                  <span>14-day free trial</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4" />
                  <span>Cancel anytime</span>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-12 bg-gradient-to-br from-muted/50 to-background relative">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="space-y-4">
              <img src={induxiaLogo} alt="INDUXIA Logo" className="h-8 w-auto" />
              <p className="text-muted-foreground">
                The leading AI-powered industrial operations platform
              </p>
              <div className="flex space-x-4">
                <Badge variant="outline" className="text-xs">SOC 2</Badge>
                <Badge variant="outline" className="text-xs">ISO 27001</Badge>
                <Badge variant="outline" className="text-xs">GDPR</Badge>
              </div>
            </div>
            <div>
              <h4 className="font-semibold mb-4 text-primary">Product</h4>
              <ul className="space-y-2 text-muted-foreground">
                <li className="hover:text-primary transition-colors cursor-pointer">Analytics</li>
                <li className="hover:text-primary transition-colors cursor-pointer">Automation</li>
                <li className="hover:text-primary transition-colors cursor-pointer">Quality Control</li>
                <li className="hover:text-primary transition-colors cursor-pointer">Maintenance</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4 text-primary">Company</h4>
              <ul className="space-y-2 text-muted-foreground">
                <li className="hover:text-primary transition-colors cursor-pointer">About</li>
                <li className="hover:text-primary transition-colors cursor-pointer">Careers</li>
                <li className="hover:text-primary transition-colors cursor-pointer">Contact</li>
                <li className="hover:text-primary transition-colors cursor-pointer">Blog</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4 text-primary">Support</h4>
              <ul className="space-y-2 text-muted-foreground">
                <li className="hover:text-primary transition-colors cursor-pointer">Documentation</li>
                <li className="hover:text-primary transition-colors cursor-pointer">Help Center</li>
                <li className="hover:text-primary transition-colors cursor-pointer">Community</li>
                <li className="hover:text-primary transition-colors cursor-pointer">Status</li>
              </ul>
            </div>
          </div>
          <div className="border-t mt-8 pt-8 text-center text-muted-foreground">
            <p>&copy; 2024 INDUXIA. All rights reserved. | Built with ❤️ for the future of manufacturing</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;