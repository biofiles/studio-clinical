import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Header from "@/components/Header";
import { ArrowLeft, Globe, LogOut, Play } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/contexts/AuthContext";
import { useOnboarding } from "@/contexts/OnboardingContext";

const Settings = () => {
  const navigate = useNavigate();
  const { language, setLanguage, t } = useLanguage();
  const { signOut, user } = useAuth();
  const { startOnboarding } = useOnboarding();

  const handleBack = () => {
    navigate(-1);
  };

  const handleLogout = async () => {
    try {
      await signOut();
      navigate('/');
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };

  const handleStartTutorial = () => {
    // Navigate to the appropriate dashboard first, then start onboarding
    if (user?.role === 'investigator') {
      navigate('/investigator');
      setTimeout(() => startOnboarding('investigator'), 500);
    } else if (user?.role === 'cro_sponsor') {
      navigate('/cro-sponsor');
      setTimeout(() => startOnboarding('cro_sponsor'), 500);
    } else {
      navigate('/participant');
      setTimeout(() => startOnboarding('participant'), 500);
    }
  };

  return (
    <div className="min-h-screen bg-studio-bg">
      <Header />

      <main className="p-6 max-w-2xl mx-auto">
        <div className="flex items-center space-x-4 mb-6">
          <Button variant="outline" size="sm" onClick={handleBack} className="flex items-center space-x-2">
            <ArrowLeft className="h-4 w-4" />
            <span>{t('settings.back')}</span>
          </Button>
          <div>
            <h2 className="text-xl font-medium text-studio-text">Configuración</h2>
            <p className="text-studio-text-muted">Gestiona tus preferencias y configuración de cuenta</p>
          </div>
        </div>

        <div className="space-y-4">
          {/* Language Settings */}
          <Card className="bg-studio-surface border-studio-border">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-studio-text">
                <Globe className="h-5 w-5" />
                <span>{t('settings.language.preferences')}</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-studio-text">
                  {t('settings.display.language')}
                </label>
                <Select value={language} onValueChange={setLanguage}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select language" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="english">English</SelectItem>
                    <SelectItem value="spanish">Español (Spanish)</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-xs text-studio-text-muted">
                  {t('settings.language.note')}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Tutorial Section */}
          <Card className="bg-studio-surface border-studio-border">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-studio-text">
                <Play className="h-5 w-5" />
                <span>{t('settings.tutorial.section')}</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <div>
                  <h4 className="text-sm font-medium text-studio-text mb-2">
                    {t('settings.start.tutorial')}
                  </h4>
                  <p className="text-xs text-studio-text-muted mb-3">
                    {t('settings.tutorial.description')}
                  </p>
                  <Button variant="outline" onClick={handleStartTutorial} className="flex items-center space-x-2">
                    <Play className="h-4 w-4" />
                    <span>{t('settings.start.tutorial')}</span>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Account Actions */}
          <Card className="bg-studio-surface border-studio-border">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-studio-text">
                <LogOut className="h-5 w-5" />
                <span>{t('settings.account.actions')}</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <div>
                  <h4 className="text-sm font-medium text-studio-text mb-2">
                    {t('settings.sign.out')}
                  </h4>
                  <p className="text-xs text-studio-text-muted mb-3">
                    {t('settings.sign.out.note')}
                  </p>
                  <Button variant="outline" onClick={handleLogout} className="flex items-center space-x-2 text-red-600 border-red-200 hover:bg-red-50">
                    <LogOut className="h-4 w-4" />
                    <span>{t('settings.sign.out')}</span>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default Settings;