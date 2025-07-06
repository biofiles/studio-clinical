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
  Activity,
  Sun,
  Moon
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { useTheme } from 'next-themes';

const Marketing = () => {
  const [isVisible, setIsVisible] = useState(false);
  const { t, language, setLanguage } = useLanguage();
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

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
    <div className="min-h-screen bg-white dark:bg-background">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-xl sticky top-0 z-50 border-b border-gray-200/50 dark:bg-background/80 dark:border-border">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <span className="text-2xl font-light tracking-wider text-gray-600 dark:text-foreground">
                STUDIO
              </span>
            </div>
            <nav className="flex items-center space-x-8">
              <select 
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="bg-transparent text-sm font-medium text-gray-600 border-none outline-none cursor-pointer hover:text-gray-900 transition-colors dark:text-gray-400 dark:hover:text-gray-100"
              >
                <option value="spanish">Español</option>
                <option value="english">English</option>
              </select>
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleTheme}
                className="h-8 w-8 p-0 text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100"
              >
                {theme === 'dark' ? (
                  <Sun className="h-4 w-4" />
                ) : (
                  <Moon className="h-4 w-4" />
                )}
              </Button>
              <Link to="/auth?force=true">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50 dark:text-gray-400 dark:hover:text-gray-100 dark:hover:bg-gray-800"
                >
                  {t('marketing.signin')}
                </Button>
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-32 px-6">
        <div className="max-w-5xl mx-auto">
          <div className={`text-center transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
            <h1 className="text-6xl md:text-7xl font-light mb-8 text-gray-900 dark:text-foreground tracking-tight leading-tight">
              {t('marketing.hero.title')}
              <br />
              <span className="font-normal">{t('marketing.hero.subtitle')}</span>
            </h1>
            <p className="text-xl text-gray-600 dark:text-muted-foreground mb-16 leading-relaxed max-w-3xl mx-auto font-light">
              {t('marketing.hero.description')}
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link to="/auth?force=true">
                <Button 
                  size="lg" 
                  className="px-8 py-4 text-base font-medium rounded-full bg-black text-white hover:bg-gray-800 transition-all duration-300 shadow-sm hover:shadow-lg dark:bg-white dark:text-black dark:hover:bg-gray-200"
                >
                  {t('marketing.hero.cta')}
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Screenshot Preview */}
      <section className="py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <div className={`transition-all duration-1000 delay-300 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            <div className="relative">
              <div className="bg-white dark:bg-card border border-gray-200/50 dark:border-border rounded-3xl p-12 shadow-2xl shadow-gray-900/10 dark:shadow-none">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  <div className="space-y-6">
                    <div className="bg-gray-50/50 dark:bg-accent/50 rounded-2xl p-8">
                      <Users className="w-10 h-10 text-gray-600 dark:text-foreground mb-4" />
                      <h3 className="font-medium mb-3 text-gray-900 dark:text-foreground">CRO Dashboard</h3>
                      <div className="space-y-3">
                        <div className="h-2 bg-gray-200 dark:bg-muted rounded" />
                        <div className="h-2 bg-gray-200 dark:bg-muted rounded w-3/4" />
                      </div>
                    </div>
                  </div>
                  <div className="space-y-6">
                    <div className="bg-gray-50/50 dark:bg-accent/50 rounded-2xl p-8">
                      <Calendar className="w-10 h-10 text-gray-600 dark:text-foreground mb-4" />
                      <h3 className="font-medium mb-3 text-gray-900 dark:text-foreground">Site Management</h3>
                      <div className="space-y-3">
                        <div className="h-2 bg-gray-200 dark:bg-muted rounded w-5/6" />
                        <div className="h-2 bg-gray-200 dark:bg-muted rounded" />
                      </div>
                    </div>
                  </div>
                  <div className="space-y-6">
                    <div className="bg-gray-50/50 dark:bg-accent/50 rounded-2xl p-8">
                      <Smartphone className="w-10 h-10 text-gray-600 dark:text-foreground mb-4" />
                      <h3 className="font-medium mb-3 text-gray-900 dark:text-foreground">Patient Portal</h3>
                      <div className="space-y-3">
                        <div className="h-2 bg-gray-200 dark:bg-muted rounded" />
                        <div className="h-2 bg-gray-200 dark:bg-muted rounded w-2/3" />
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
      <section className="py-32 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-24">
            <h2 className="text-5xl md:text-6xl font-light mb-8 text-gray-900 dark:text-foreground tracking-tight">
              {t('marketing.features.title')}
              <br />
              <span className="font-normal">{t('marketing.features.subtitle')}</span>
            </h2>
            <p className="text-xl text-gray-600 dark:text-muted-foreground max-w-3xl mx-auto font-light">
              {t('marketing.features.description')}
            </p>
          </div>

          <div className="space-y-32">
            {coreFeatures.map((feature, index) => (
              <div key={index} className={`grid grid-cols-1 lg:grid-cols-2 gap-16 items-center ${index % 2 === 1 ? 'lg:grid-flow-col-dense' : ''}`}>
                <div className={`space-y-8 ${index % 2 === 1 ? 'lg:col-start-2' : ''}`}>
                  <div className="flex items-center space-x-6">
                    <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center">
                      <feature.icon className="w-8 h-8 text-gray-700" />
                    </div>
                    <h3 className="text-3xl font-light text-gray-900">{feature.title}</h3>
                  </div>
                  <p className="text-xl text-gray-600 leading-relaxed font-light">
                    {feature.description}
                  </p>
                </div>
                <div className={`${index % 2 === 1 ? 'lg:col-start-1' : ''}`}>
                  <div className="bg-white border border-gray-200/50 rounded-3xl p-12 shadow-2xl shadow-gray-900/10">
                    <div className="aspect-video bg-gray-50 rounded-2xl flex items-center justify-center">
                      <feature.icon className="w-20 h-20 text-gray-400" />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Integration Value */}
      <section className="py-32 px-6 bg-gray-50/50 dark:bg-muted/30">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="text-5xl font-light mb-12 text-gray-900 dark:text-foreground tracking-tight">
            {t('marketing.integration.title')}
          </h2>
          <p className="text-xl text-gray-600 dark:text-muted-foreground mb-16 max-w-3xl mx-auto font-light">
            {t('marketing.integration.description')}
          </p>
          
          <div className="grid grid-cols-2 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {integrations.map((integration, index) => (
              <div key={index} className="bg-white dark:bg-card border border-gray-200/50 dark:border-border rounded-2xl p-6 text-base font-medium text-center text-gray-700 dark:text-foreground shadow-sm hover:shadow-md transition-all duration-300">
                {integration}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Patient Portal Innovation */}
      <section className="py-32 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-8">
              <h2 className="text-5xl font-light text-gray-900 tracking-tight">
                {t('marketing.patient.title')}
              </h2>
              <p className="text-xl text-gray-600 leading-relaxed font-light">
                {t('marketing.patient.description')}
              </p>
              <div className="space-y-4">
                <div className="flex items-center space-x-4">
                  <Check className="w-6 h-6 text-gray-700" />
                  <span className="text-lg text-gray-600">{t('marketing.patient.mobile')}</span>
                </div>
                <div className="flex items-center space-x-4">
                  <Check className="w-6 h-6 text-gray-700" />
                  <span className="text-lg text-gray-600">{t('marketing.patient.updates')}</span>
                </div>
                <div className="flex items-center space-x-4">
                  <Check className="w-6 h-6 text-gray-700" />
                  <span className="text-lg text-gray-600">{t('marketing.patient.questionnaires')}</span>
                </div>
              </div>
            </div>
            <div className="bg-white border border-gray-200/50 rounded-3xl p-12 shadow-2xl shadow-gray-900/10">
              <div className="space-y-8">
                <div className="bg-gray-50 rounded-2xl p-8">
                  <div className="flex items-center space-x-4 mb-6">
                    <div className="w-10 h-10 bg-gray-300 rounded-full" />
                    <div className="space-y-2">
                      <div className="h-3 bg-gray-200 rounded w-24" />
                      <div className="h-2 bg-gray-200 rounded w-16" />
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="h-2 bg-gray-200 rounded" />
                    <div className="h-2 bg-gray-200 rounded w-3/4" />
                    <div className="h-2 bg-gray-200 rounded w-1/2" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Simple CTA */}
      <section className="py-32 px-6 bg-gray-50/50 dark:bg-muted/30">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-light mb-8 text-gray-900 dark:text-foreground tracking-tight">
            {t('marketing.cta.title')}
          </h2>
          <p className="text-xl text-gray-600 dark:text-muted-foreground mb-12 font-light">
            {t('marketing.cta.description')}
          </p>
          <Link to="/auth?force=true">
            <Button 
              size="lg" 
              className="px-8 py-4 text-base font-medium rounded-full bg-black text-white hover:bg-gray-800 transition-all duration-300 shadow-sm hover:shadow-lg dark:bg-white dark:text-black dark:hover:bg-gray-200"
            >
              {t('marketing.cta.button')}
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-200 dark:border-border py-16 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center mb-6 md:mb-0">
              <span className="text-xl font-light tracking-wider text-gray-600 dark:text-foreground">STUDIO</span>
            </div>
            <div className="flex items-center space-x-8 text-sm text-gray-500 dark:text-muted-foreground">
              <a href="#" className="hover:text-gray-700 dark:hover:text-foreground transition-colors">{t('marketing.privacy')}</a>
              <a href="#" className="hover:text-gray-700 dark:hover:text-foreground transition-colors">{t('marketing.terms')}</a>
              <a href="#" className="hover:text-gray-700 dark:hover:text-foreground transition-colors">{t('marketing.contact')}</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Marketing;