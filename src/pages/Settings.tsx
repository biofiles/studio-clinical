
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import Header from "@/components/Header";
import { Globe, LogOut, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Settings = () => {
  const [language, setLanguage] = useState("english");
  const navigate = useNavigate();

  const handleLogout = () => {
    window.location.href = '/';
  };

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
            <span>Back</span>
          </Button>
          <div>
            <h2 className="text-xl font-medium text-studio-text">Settings</h2>
            <p className="text-studio-text-muted">Manage your preferences and account</p>
          </div>
        </div>

        <div className="space-y-6">
          <Card className="bg-studio-surface border-studio-border">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-studio-text">
                <Globe className="h-5 w-5" />
                <span>Language Preferences</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-studio-text">
                  Display Language
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
                  Changes will be applied after refreshing the page
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-studio-surface border-studio-border">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-studio-text">
                <LogOut className="h-5 w-5" />
                <span>Account Actions</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <div>
                  <h4 className="text-sm font-medium text-studio-text mb-2">
                    Sign Out
                  </h4>
                  <p className="text-xs text-studio-text-muted mb-3">
                    You will be redirected to the login page
                  </p>
                  <Button
                    variant="outline"
                    onClick={handleLogout}
                    className="flex items-center space-x-2 text-red-600 border-red-200 hover:bg-red-50"
                  >
                    <LogOut className="h-4 w-4" />
                    <span>Sign Out</span>
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
