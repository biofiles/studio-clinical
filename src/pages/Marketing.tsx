import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Users, 
  Shield, 
  Zap, 
  Globe, 
  BarChart3, 
  CheckCircle, 
  ArrowRight,
  Star,
  Clock,
  Database,
  Smartphone,
  HeartHandshake,
  Award,
  Building2,
  Stethoscope
} from 'lucide-react';
import { Link } from 'react-router-dom';

const Marketing = () => {
  const features = [
    {
      icon: Users,
      title: "Participant Management",
      description: "Streamlined enrollment, consent management, and participant tracking with real-time compliance monitoring."
    },
    {
      icon: Database,
      title: "FHIR Integration",
      description: "Seamless interoperability with existing clinical systems through standardized data exchange protocols."
    },
    {
      icon: BarChart3,
      title: "Real-time Analytics",
      description: "Advanced dashboards with enrollment tracking, compliance metrics, and performance insights."
    },
    {
      icon: Shield,
      title: "Regulatory Compliance",
      description: "Built-in GCP, FDA 21 CFR Part 11, and GDPR compliance with comprehensive audit trails."
    },
    {
      icon: Globe,
      title: "Multi-language Support",
      description: "Global trial execution with localized interfaces supporting multiple languages and regions."
    },
    {
      icon: Smartphone,
      title: "Mobile-first Design",
      description: "Responsive design enabling participants and site staff to access the platform from any device."
    }
  ];

  const benefits = [
    {
      metric: "40%",
      label: "Faster Study Startup",
      description: "Reduce time-to-first-patient with streamlined site activation and digital workflows"
    },
    {
      metric: "25%",
      label: "Higher Retention",
      description: "Improve participant engagement through intuitive mobile interfaces and automated reminders"
    },
    {
      metric: "60%",
      label: "Reduced Monitoring",
      description: "Automated data validation and real-time quality checks minimize on-site monitoring needs"
    },
    {
      metric: "99.9%",
      label: "Data Integrity",
      description: "Enterprise-grade security and automated audit trails ensure complete data reliability"
    }
  ];

  const testimonials = [
    {
      quote: "STUDIO transformed our Phase III oncology trial. The platform's intuitive design and robust analytics helped us achieve our enrollment targets 30% faster than projected.",
      author: "Dr. Sarah Chen",
      title: "Principal Investigator",
      company: "Metropolitan Cancer Center"
    },
    {
      quote: "The regulatory compliance features and audit trails in STUDIO gave us complete confidence during our FDA inspection. Outstanding platform for global trials.",
      author: "Michael Rodriguez",
      title: "VP Clinical Operations",
      company: "BioPharma Solutions"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-background">
      {/* Header */}
      <header className="border-b bg-background/80 backdrop-blur-sm sticky top-0 z-50">
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
            <nav className="hidden md:flex items-center space-x-8">
              <a href="#features" className="text-muted-foreground hover:text-foreground transition-colors">Features</a>
              <a href="#benefits" className="text-muted-foreground hover:text-foreground transition-colors">Benefits</a>
              <a href="#testimonials" className="text-muted-foreground hover:text-foreground transition-colors">Testimonials</a>
              <Link to="/auth">
                <Button variant="default" className="shadow-lg hover:shadow-xl transition-all duration-300">
                  Request Demo
                </Button>
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto text-center">
          <div className="animate-fade-in">
            <Badge variant="secondary" className="mb-6 px-4 py-2 text-sm font-medium">
              🚀 Trusted by 200+ Clinical Sites Worldwide
            </Badge>
            <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-foreground via-primary to-foreground bg-clip-text text-transparent leading-tight">
              The Future of
              <br />
              Clinical Trial Management
            </h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto leading-relaxed">
              STUDIO empowers pharmaceutical companies and CROs to conduct clinical trials with unprecedented efficiency, 
              compliance, and participant engagement through our next-generation digital platform.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Link to="/auth">
                <Button size="lg" className="px-8 py-4 text-lg shadow-lg hover:shadow-xl transition-all duration-300 group">
                  Start Free Trial
                  <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Button size="lg" variant="outline" className="px-8 py-4 text-lg hover:bg-muted/50 transition-colors">
                Schedule Demo
              </Button>
            </div>
          </div>
          
          {/* Hero Image Placeholder */}
          <div className="relative animate-scale-in">
            <div className="bg-gradient-to-r from-primary/10 to-secondary/10 rounded-2xl p-8 shadow-2xl border">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="bg-background/50 backdrop-blur-sm border-primary/20">
                  <CardContent className="p-6 text-center">
                    <Building2 className="w-12 h-12 text-primary mx-auto mb-4" />
                    <h3 className="font-semibold mb-2">CRO Dashboard</h3>
                    <p className="text-sm text-muted-foreground">Comprehensive trial oversight</p>
                  </CardContent>
                </Card>
                <Card className="bg-background/50 backdrop-blur-sm border-primary/20">
                  <CardContent className="p-6 text-center">
                    <Users className="w-12 h-12 text-primary mx-auto mb-4" />
                    <h3 className="font-semibold mb-2">Site Management</h3>
                    <p className="text-sm text-muted-foreground">Streamlined operations</p>
                  </CardContent>
                </Card>
                <Card className="bg-background/50 backdrop-blur-sm border-primary/20">
                  <CardContent className="p-6 text-center">
                    <Smartphone className="w-12 h-12 text-primary mx-auto mb-4" />
                    <h3 className="font-semibold mb-2">Patient Portal</h3>
                    <p className="text-sm text-muted-foreground">Enhanced engagement</p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4 bg-muted/30">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Powerful Features for Modern Trials</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Every feature designed to accelerate your clinical trials while maintaining the highest standards of quality and compliance.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="group hover:shadow-xl transition-all duration-300 border-primary/10 hover:border-primary/30">
                <CardContent className="p-6">
                  <div className="flex items-center mb-4">
                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                      <feature.icon className="w-6 h-6 text-primary" />
                    </div>
                    <h3 className="text-xl font-semibold ml-4">{feature.title}</h3>
                  </div>
                  <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section id="benefits" className="py-20 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Proven Results That Matter</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Join leading pharmaceutical companies and CROs who have transformed their clinical operations with STUDIO.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {benefits.map((benefit, index) => (
              <Card key={index} className="text-center group hover:shadow-lg transition-shadow duration-300">
                <CardContent className="p-8">
                  <div className="text-4xl font-bold text-primary mb-2 group-hover:scale-110 transition-transform">
                    {benefit.metric}
                  </div>
                  <h3 className="text-xl font-semibold mb-3">{benefit.label}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">{benefit.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-20 px-4 bg-muted/30">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Trusted by Industry Leaders</h2>
            <p className="text-xl text-muted-foreground">
              See what clinical research professionals say about STUDIO
            </p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="group hover:shadow-xl transition-shadow duration-300">
                <CardContent className="p-8">
                  <div className="flex mb-4">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                    ))}
                  </div>
                  <blockquote className="text-lg mb-6 leading-relaxed italic">
                    "{testimonial.quote}"
                  </blockquote>
                  <div className="flex items-center">
                    <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mr-4">
                      <Award className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <div className="font-semibold">{testimonial.author}</div>
                      <div className="text-sm text-muted-foreground">{testimonial.title}</div>
                      <div className="text-sm text-muted-foreground">{testimonial.company}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-primary to-primary/80">
        <div className="container mx-auto text-center text-primary-foreground">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Transform Your Clinical Trials?
          </h2>
          <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
            Join hundreds of clinical sites worldwide who trust STUDIO to deliver exceptional trial experiences.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/auth">
              <Button size="lg" variant="secondary" className="px-8 py-4 text-lg shadow-lg hover:shadow-xl transition-all duration-300">
                Start Your Free Trial
              </Button>
            </Link>
            <Button size="lg" variant="outline" className="px-8 py-4 text-lg border-primary-foreground/20 text-primary-foreground hover:bg-primary-foreground/10">
              Contact Sales
            </Button>
          </div>
          <div className="flex items-center justify-center mt-8 text-sm opacity-75">
            <CheckCircle className="w-4 h-4 mr-2" />
            No credit card required • 14-day free trial • Enterprise support
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-background border-t py-12 px-4">
        <div className="container mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <Stethoscope className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className="text-2xl font-bold">STUDIO</span>
            </div>
            <div className="flex items-center space-x-6 text-sm text-muted-foreground">
              <a href="#" className="hover:text-foreground transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-foreground transition-colors">Terms of Service</a>
              <a href="#" className="hover:text-foreground transition-colors">Contact</a>
            </div>
          </div>
          <div className="border-t mt-8 pt-8 text-center text-sm text-muted-foreground">
            © 2024 STUDIO Clinical. All rights reserved. | Empowering clinical research worldwide.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Marketing;