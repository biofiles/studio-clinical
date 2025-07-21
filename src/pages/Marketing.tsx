import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Check, Globe, Users, Shield, Zap, FileText } from "lucide-react";
import { Link } from "react-router-dom";

export default function Marketing() {
  const { language, setLanguage, t } = useLanguage();

  const marketingContent = {
    en: {
      hero: {
        title: "Studio Clinical",
        subtitle: "Transform Your Clinical Research Experience",
        description: "The most comprehensive platform for managing clinical trials, participant engagement, and research data. Built for researchers, by researchers.",
        cta: "Get Started Today",
        demo: "Request Demo"
      },
      features: {
        title: "Everything You Need for Clinical Research",
        subtitle: "Powerful tools designed to streamline your research workflow",
        items: [
          {
            icon: Users,
            title: "Participant Management",
            description: "Efficiently manage participant recruitment, scheduling, and engagement throughout your study."
          },
          {
            icon: FileText,
            title: "E-Consent & Forms",
            description: "Digital consent forms and questionnaires with secure electronic signatures and compliance tracking."
          },
          {
            icon: Shield,
            title: "FHIR & CDISC Compliance",
            description: "Built-in support for healthcare data standards ensuring regulatory compliance and interoperability."
          },
          {
            icon: Zap,
            title: "Real-time Analytics",
            description: "Track study progress with comprehensive dashboards and automated reporting capabilities."
          },
          {
            icon: Globe,
            title: "Multi-language Support",
            description: "Conduct global studies with full internationalization support for participants and investigators."
          },
          {
            icon: Check,
            title: "GCP Compliant",
            description: "Meets Good Clinical Practice guidelines with audit trails, data integrity, and security features."
          }
        ]
      },
      benefits: {
        title: "Why Choose Studio Clinical?",
        items: [
          "Reduce study setup time by 60%",
          "Improve participant retention rates",
          "Ensure regulatory compliance",
          "Streamline data collection and analysis",
          "Scale your research operations globally"
        ]
      },
      cta: {
        title: "Ready to Transform Your Clinical Research?",
        description: "Join leading research organizations using Studio Clinical to conduct better, faster clinical trials.",
        button: "Start Your Free Trial"
      }
    },
    es: {
      hero: {
        title: "Studio Clinical",
        subtitle: "Transforma Tu Experiencia en Investigación Clínica",
        description: "La plataforma más completa para gestionar ensayos clínicos, participación de pacientes y datos de investigación. Construida por investigadores, para investigadores.",
        cta: "Comenzar Hoy",
        demo: "Solicitar Demo"
      },
      features: {
        title: "Todo Lo Que Necesitas Para Investigación Clínica",
        subtitle: "Herramientas poderosas diseñadas para optimizar tu flujo de trabajo de investigación",
        items: [
          {
            icon: Users,
            title: "Gestión de Participantes",
            description: "Gestiona eficientemente el reclutamiento, programación y participación de pacientes durante tu estudio."
          },
          {
            icon: FileText,
            title: "Consentimiento Electrónico y Formularios",
            description: "Formularios de consentimiento digital y cuestionarios con firmas electrónicas seguras y seguimiento de cumplimiento."
          },
          {
            icon: Shield,
            title: "Cumplimiento FHIR y CDISC",
            description: "Soporte integrado para estándares de datos de salud asegurando cumplimiento regulatorio e interoperabilidad."
          },
          {
            icon: Zap,
            title: "Análisis en Tiempo Real",
            description: "Rastrea el progreso del estudio con paneles comprensivos y capacidades de reporte automatizado."
          },
          {
            icon: Globe,
            title: "Soporte Multi-idioma",
            description: "Conduce estudios globales con soporte completo de internacionalización para participantes e investigadores."
          },
          {
            icon: Check,
            title: "Cumple con BPC",
            description: "Cumple con las directrices de Buenas Prácticas Clínicas con pistas de auditoría, integridad de datos y características de seguridad."
          }
        ]
      },
      benefits: {
        title: "¿Por Qué Elegir Studio Clinical?",
        items: [
          "Reduce el tiempo de configuración del estudio en 60%",
          "Mejora las tasas de retención de participantes",
          "Asegura el cumplimiento regulatorio",
          "Optimiza la recolección y análisis de datos",
          "Escala tus operaciones de investigación globalmente"
        ]
      },
      cta: {
        title: "¿Listo Para Transformar Tu Investigación Clínica?",
        description: "Únete a las organizaciones de investigación líderes que usan Studio Clinical para conducir mejores y más rápidos ensayos clínicos.",
        button: "Iniciar Tu Prueba Gratuita"
      }
    }
  };

  const content = marketingContent[language];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <h1 className="text-2xl font-bold text-primary">Studio Clinical</h1>
          </div>
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setLanguage(language === 'en' ? 'es' : 'en')}
            >
              <Globe className="h-4 w-4 mr-2" />
              {language === 'en' ? 'Español' : 'English'}
            </Button>
            <Button asChild>
              <Link to="/auth">{content.hero.cta}</Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4 text-center bg-gradient-to-b from-primary/5 to-background">
        <div className="container mx-auto max-w-4xl">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
            {content.hero.title}
          </h1>
          <h2 className="text-2xl md:text-3xl font-semibold mb-6 text-foreground/90">
            {content.hero.subtitle}
          </h2>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            {content.hero.description}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" asChild className="text-lg px-8">
              <Link to="/auth">{content.hero.cta}</Link>
            </Button>
            <Button size="lg" variant="outline" className="text-lg px-8">
              {content.hero.demo}
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">{content.features.title}</h2>
            <p className="text-xl text-muted-foreground">{content.features.subtitle}</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {content.features.items.map((feature, index) => (
              <Card key={index} className="border-2 hover:border-primary/50 transition-colors">
                <CardContent className="p-6">
                  <feature.icon className="h-12 w-12 text-primary mb-4" />
                  <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 px-4 bg-muted/50">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-8">{content.benefits.title}</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {content.benefits.items.map((benefit, index) => (
              <div key={index} className="flex items-center space-x-3">
                <Check className="h-6 w-6 text-primary flex-shrink-0" />
                <span className="text-lg">{benefit}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-primary text-primary-foreground">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-4xl font-bold mb-6">{content.cta.title}</h2>
          <p className="text-xl mb-8 opacity-90">{content.cta.description}</p>
          <Button size="lg" variant="secondary" className="text-lg px-8" asChild>
            <Link to="/auth">{content.cta.button}</Link>
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 border-t">
        <div className="container mx-auto text-center">
          <p className="text-muted-foreground">
            © 2024 Studio Clinical. {language === 'en' ? 'All rights reserved.' : 'Todos los derechos reservados.'}
          </p>
        </div>
      </footer>
    </div>
  );
}