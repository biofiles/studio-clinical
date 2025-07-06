import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { 
  Calendar,
  FileText, 
  Smartphone,
  Users,
  ArrowRight,
  Check,
  ChevronRight,
  Activity
} from 'lucide-react';
import { Link } from 'react-router-dom';

const Marketing = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const coreFeatures = [
    {
      icon: FileText,
      title: "Digital Diaries",
      description: "Replace paper-based data collection with intelligent digital forms that participants can complete anywhere, anytime.",
      image: "/api/placeholder/400/300"
    },
    {
      icon: Check,
      title: "eConsent",
      description: "Streamline the consent process with digital signatures, version control, and automated compliance tracking.",
      image: "/api/placeholder/400/300"
    },
    {
      icon: Calendar,
      title: "Smart Scheduling",
      description: "Automated visit scheduling with intelligent reminders and conflict resolution across multiple sites.",
      image: "/api/placeholder/400/300"
    },
    {
      icon: Smartphone,
      title: "Patient Portal",
      description: "Give participants direct access to their study information, schedules, and questionnaires through a dedicated mobile interface.",
      image: "/api/placeholder/400/300"
    }
  ];

  const integrations = [
    "Participant Management",
    "Data Collection", 
    "Compliance Monitoring",
    "Site Coordination",
    "Analytics & Reporting",
    "Regulatory Documentation"
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-background sticky top-0 z-50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <Activity className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className="text-xl font-semibold text-foreground">
                STUDIO
              </span>
            </div>
            <nav className="flex items-center space-x-6">
              <Link to="/auth">
                <Button size="sm" className="font-medium">
                  Sign In
                </Button>
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-24 px-4">
        <div className="container mx-auto max-w-4xl">
          <div className={`text-center transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
            <h1 className="text-5xl md:text-6xl font-light mb-6 text-foreground tracking-tight">
              Clinical trials.
              <br />
              <span className="font-medium">Simplified.</span>
            </h1>
            <p className="text-xl text-muted-foreground mb-12 leading-relaxed max-w-2xl mx-auto">
              Everything you need to manage clinical trials in one integrated platform. 
              Digital diaries, eConsent, scheduling, and patient engagement — all seamlessly connected.
            </p>
            
            <Link to="/auth">
              <Button size="lg" className="px-8 py-3 text-base font-medium rounded-xl shadow-sm hover:shadow-md transition-all duration-200">
                Try STUDIO
                <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Screenshot Preview */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className={`transition-all duration-1000 delay-300 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent z-10 pointer-events-none" />
              <div className="bg-card border rounded-2xl p-8 shadow-xl">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="space-y-4">
                    <div className="bg-muted/30 rounded-lg p-6">
                      <Users className="w-8 h-8 text-primary mb-3" />
                      <h3 className="font-medium mb-2">CRO Dashboard</h3>
                      <div className="space-y-2">
                        <div className="h-2 bg-muted rounded" />
                        <div className="h-2 bg-muted rounded w-3/4" />
                      </div>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="bg-muted/30 rounded-lg p-6">
                      <Calendar className="w-8 h-8 text-primary mb-3" />
                      <h3 className="font-medium mb-2">Site Management</h3>
                      <div className="space-y-2">
                        <div className="h-2 bg-muted rounded w-5/6" />
                        <div className="h-2 bg-muted rounded" />
                      </div>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="bg-muted/30 rounded-lg p-6">
                      <Smartphone className="w-8 h-8 text-primary mb-3" />
                      <h3 className="font-medium mb-2">Patient Portal</h3>
                      <div className="space-y-2">
                        <div className="h-2 bg-muted rounded" />
                        <div className="h-2 bg-muted rounded w-2/3" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Core Features */}
      <section className="py-24 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-20">
            <h2 className="text-4xl font-light mb-6 text-foreground">
              Four core functions.
              <br />
              <span className="font-medium">One platform.</span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Replace multiple systems with a single, integrated solution that handles every aspect of clinical trial management.
            </p>
          </div>

          <div className="space-y-24">
            {coreFeatures.map((feature, index) => (
              <div key={index} className={`grid grid-cols-1 lg:grid-cols-2 gap-12 items-center ${index % 2 === 1 ? 'lg:grid-flow-col-dense' : ''}`}>
                <div className={`space-y-6 ${index % 2 === 1 ? 'lg:col-start-2' : ''}`}>
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
                      <feature.icon className="w-6 h-6 text-primary" />
                    </div>
                    <h3 className="text-2xl font-medium text-foreground">{feature.title}</h3>
                  </div>
                  <p className="text-lg text-muted-foreground leading-relaxed">
                    {feature.description}
                  </p>
                </div>
                <div className={`${index % 2 === 1 ? 'lg:col-start-1' : ''}`}>
                  <div className="bg-card border rounded-2xl p-8 shadow-lg">
                    <div className="aspect-video bg-muted/20 rounded-xl flex items-center justify-center">
                      <feature.icon className="w-16 h-16 text-muted-foreground/40" />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Integration Value */}
      <section className="py-24 px-4 bg-muted/20">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-4xl font-light mb-8 text-foreground">
            Everything connects.
          </h2>
          <p className="text-lg text-muted-foreground mb-12 max-w-2xl mx-auto">
            Stop managing multiple vendors and platforms. STUDIO integrates all essential clinical trial functions into one cohesive system.
          </p>
          
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 max-w-2xl mx-auto">
            {integrations.map((integration, index) => (
              <div key={index} className="bg-card border rounded-lg p-4 text-sm font-medium text-center">
                {integration}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Patient Portal Innovation */}
      <section className="py-24 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h2 className="text-4xl font-light text-foreground">
                Patient-first design.
              </h2>
              <p className="text-lg text-muted-foreground leading-relaxed">
                The first clinical trial platform built with participants in mind. Our dedicated patient portal 
                gives participants direct access to their study information, creating better engagement 
                and higher retention rates.
              </p>
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <Check className="w-5 h-5 text-primary" />
                  <span className="text-muted-foreground">Mobile-optimized interface</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Check className="w-5 h-5 text-primary" />
                  <span className="text-muted-foreground">Real-time study updates</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Check className="w-5 h-5 text-primary" />
                  <span className="text-muted-foreground">Simplified questionnaire completion</span>
                </div>
              </div>
            </div>
            <div className="bg-card border rounded-2xl p-8 shadow-lg">
              <div className="space-y-6">
                <div className="bg-muted/20 rounded-xl p-6">
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="w-8 h-8 bg-primary rounded-full" />
                    <div className="space-y-1">
                      <div className="h-3 bg-muted rounded w-24" />
                      <div className="h-2 bg-muted rounded w-16" />
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="h-2 bg-muted rounded" />
                    <div className="h-2 bg-muted rounded w-3/4" />
                    <div className="h-2 bg-muted rounded w-1/2" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Simple CTA */}
      <section className="py-24 px-4 bg-muted/20">
        <div className="container mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-light mb-6 text-foreground">
            Ready to simplify your trials?
          </h2>
          <p className="text-lg text-muted-foreground mb-8">
            Join research teams who have streamlined their clinical operations with STUDIO.
          </p>
          <Link to="/auth">
            <Button size="lg" className="px-8 py-3 text-base font-medium rounded-xl">
              Get Started
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-12 px-4">
        <div className="container mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <div className="w-6 h-6 bg-primary rounded flex items-center justify-center">
                <Activity className="w-4 h-4 text-primary-foreground" />
              </div>
              <span className="text-lg font-medium">STUDIO</span>
            </div>
            <div className="flex items-center space-x-6 text-sm text-muted-foreground">
              <a href="#" className="hover:text-foreground transition-colors">Privacy</a>
              <a href="#" className="hover:text-foreground transition-colors">Terms</a>
              <a href="#" className="hover:text-foreground transition-colors">Contact</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Marketing;