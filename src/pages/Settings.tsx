
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Header from "@/components/Header";
import { Globe, ArrowLeft, Moon, Sun, Wifi, WifiOff } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import { useTheme } from "next-themes";

const Settings = () => {
  const navigate = useNavigate();
  const { language, setLanguage, t } = useLanguage();
  const { theme, setTheme } = useTheme();
  const [offlineMode, setOfflineMode] = useState(false);

  const handleBack = () => {
    navigate(-1);
  };

  return (
    <div className="min-h-screen bg-studio-bg">
      <Header />

      <main className="p-6 max-w-2xl mx-auto">
        <div className="flex items-center space-x-4 mb-6">
          <Button
            variant="outline"
            size="sm"
            onClick={handleBack}
            className="flex items-center space-x-2"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>{t('settings.back')}</span>
          </Button>
          <div>
            <h2 className="text-xl font-medium text-studio-text">{t('settings.title')}</h2>
            <p className="text-studio-text-muted">{t('settings.subtitle')}</p>
          </div>
        </div>

        <div className="space-y-6">
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
                {theme === 'dark' ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
                <span>Display Preferences</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <label className="text-sm font-medium text-studio-text">
                    Dark Mode
                  </label>
                  <p className="text-xs text-studio-text-muted">
                    Toggle between light and dark theme
                  </p>
                </div>
                <Switch
                  checked={theme === 'dark'}
                  onCheckedChange={(checked) => setTheme(checked ? 'dark' : 'light')}
                />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-studio-surface border-studio-border">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-studio-text">
                {offlineMode ? <WifiOff className="h-5 w-5" /> : <Wifi className="h-5 w-5" />}
                <span>Connection Settings</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <label className="text-sm font-medium text-studio-text">
                    Offline Mode
                  </label>
                  <p className="text-xs text-studio-text-muted">
                    Work offline with cached data (Demo feature)
                  </p>
                </div>
                <Switch
                  checked={offlineMode}
                  onCheckedChange={setOfflineMode}
                />
              </div>
            </CardContent>
          </Card>

        </div>
      </main>
    </div>
  );
};

export default Settings;
