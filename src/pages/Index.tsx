import { Navigate, Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Stethoscope, ArrowRight, Users, BarChart3, Shield } from "lucide-react";

const Index = () => {
  const { user } = useAuth();

  // If user is logged in, redirect to auth page to handle role-based routing
  if (user) {
    return <Navigate to="/auth" replace />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-background">
      {/* Header */}
      <header className="border-b bg-background/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <Stethoscope className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
                STUDIO
              </span>
            </div>
            <nav className="flex items-center space-x-4">
              <Link to="/marketing">
                <Button variant="ghost" className="hover:bg-muted/50">
                  Learn More
                </Button>
              </Link>
              <Link to="/auth">
                <Button className="shadow-lg hover:shadow-xl transition-all duration-300">
                  Sign In
                </Button>
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto text-center max-w-4xl">
          <div className="animate-fade-in">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-foreground via-primary to-foreground bg-clip-text text-transparent leading-tight">
              Welcome to STUDIO
            </h1>
            <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
              The next-generation clinical trial management platform designed for pharmaceutical companies, 
              CROs, and research sites to conduct trials with unprecedented efficiency and compliance.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Link to="/auth">
                <Button size="lg" className="px-8 py-4 text-lg shadow-lg hover:shadow-xl transition-all duration-300 group">
                  Get Started
                  <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Link to="/marketing">
                <Button size="lg" variant="outline" className="px-8 py-4 text-lg hover:bg-muted/50 transition-colors">
                  Explore Features
                </Button>
              </Link>
            </div>

            {/* Quick Feature Preview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16">
              <Card className="group hover:shadow-lg transition-shadow duration-300">
                <CardContent className="p-6 text-center">
                  <Users className="w-12 h-12 text-primary mx-auto mb-4" />
                  <h3 className="font-semibold mb-2">Participant Management</h3>
                  <p className="text-sm text-muted-foreground">Streamlined enrollment and engagement</p>
                </CardContent>
              </Card>
              <Card className="group hover:shadow-lg transition-shadow duration-300">
                <CardContent className="p-6 text-center">
                  <BarChart3 className="w-12 h-12 text-primary mx-auto mb-4" />
                  <h3 className="font-semibold mb-2">Real-time Analytics</h3>
                  <p className="text-sm text-muted-foreground">Comprehensive trial insights</p>
                </CardContent>
              </Card>
              <Card className="group hover:shadow-lg transition-shadow duration-300">
                <CardContent className="p-6 text-center">
                  <Shield className="w-12 h-12 text-primary mx-auto mb-4" />
                  <h3 className="font-semibold mb-2">Regulatory Compliance</h3>
                  <p className="text-sm text-muted-foreground">Built-in GCP and FDA compliance</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-8 px-4 mt-20">
        <div className="container mx-auto text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <div className="w-6 h-6 bg-primary rounded flex items-center justify-center">
              <Stethoscope className="w-4 h-4 text-primary-foreground" />
            </div>
            <span className="text-lg font-semibold">STUDIO Clinical</span>
          </div>
          <p className="text-sm text-muted-foreground">
            Empowering clinical research worldwide
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
