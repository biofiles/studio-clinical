import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Header from "@/components/Header";
import StudyResultsSignup from "@/components/StudyResultsSignup";
import UserProfileDialog from "@/components/UserProfileDialog";
import { ArrowLeft, Download, Shield, Barcode, Globe, LogOut, Play } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/contexts/AuthContext";
import { useOnboarding } from "@/contexts/OnboardingContext";
const Profile = () => {
  const navigate = useNavigate();
  const {
    language,
    setLanguage,
    t
  } = useLanguage();
  const {
    signOut,
    user
  } = useAuth();
  const {
    startOnboarding
  } = useOnboarding();
  const [showProfile, setShowProfile] = useState(false);
  const participantToken = "PTK-9283-WZ1";
  const handleBack = () => {
    navigate('/participant');
  };
  const handleExportPDF = () => {
    alert(t('profile.export.pdf'));
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
    startOnboarding(user?.role);
    navigate(-1);
  };
  return <div className="min-h-screen bg-studio-bg">
      <Header />

      <main className="p-6 max-w-2xl mx-auto">
        <div className="flex items-center space-x-4 mb-6">
          <Button variant="outline" size="sm" onClick={handleBack} className="flex items-center space-x-2">
            <ArrowLeft className="h-4 w-4" />
            <span>{t('settings.back')}</span>
          </Button>
          <div>
            <h2 className="text-xl font-medium text-studio-text">{t('participant.profile')}</h2>
            <p className="text-studio-text-muted">{t('profile.subtitle')}</p>
          </div>
        </div>

        <div className="space-y-4">
          {/* Patient ID Card */}
          <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <h4 className="text-lg font-bold">STUDIO Clinical Trial</h4>
                  <p className="text-sm opacity-90">Patient ID Card</p>
                  <div className="space-y-1">
                    <p className="text-xs opacity-75">Protocolo: NVS-4578-301</p>
                    <p className="text-xs opacity-75">Site: Metro General Hospital</p>
                  </div>
                </div>
                <div className="text-right space-y-1">
                  <div onClick={() => setShowProfile(true)} className="bg-white text-gray-800 px-3 py-2 rounded cursor-pointer hover:bg-gray-100 transition-colors">
                    <div className="text-xs font-mono leading-tight">
                      ||||||||||||||||<br />
                      {participantToken}<br />
                      ||||||||||||||||
                    </div>
                  </div>
                  <p className="text-xs opacity-75">{t('contact.tap.for.details')}</p>
                </div>
              </div>
              <div className="mt-4 pt-3 border-t border-white/20">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-xs opacity-75">{t('contact.unblinding.emergency')}</p>
                    <p className="text-sm font-semibold">24/7: +54 11 987-654-321</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs opacity-75">{t('contact.issued')}</p>
                    <p className="text-xs">15 Oct 2024</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Participant Token Section */}
          <Card className="bg-studio-surface border-studio-border">
            <CardContent className="p-4">
              <div className="flex-1">
                <p className="font-medium text-studio-text">{t('participant.token')}</p>
                <button onClick={() => setShowProfile(true)} className="text-lg font-mono bg-gray-100 px-3 py-1 rounded hover:bg-gray-200 transition-colors cursor-pointer border-2 border-dashed border-gray-300 hover:border-gray-400">
                  {participantToken}
                </button>
                <p className="text-xs text-studio-text-muted mt-1">
                  {t('contact.token.description')}
                </p>
              </div>
            </CardContent>
          </Card>

          <StudyResultsSignup variant="participant" />
          
          <Button variant="studio" className="w-full justify-start" onClick={handleExportPDF}>
            <Download className="h-4 w-4 mr-2" />
            {t('profile.export.pdf')}
          </Button>

          

          {/* Settings Section */}
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

      <UserProfileDialog open={showProfile} onOpenChange={setShowProfile} />
    </div>;
};
export default Profile;