import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { useLanguage } from "@/contexts/LanguageContext";
import LoginForm from "./LoginForm";

interface LoginProps {
  onRoleSelect: (role: 'participant' | 'investigator' | 'cro-sponsor') => void;
}

const Login = ({ onRoleSelect }: LoginProps) => {
  const { t } = useLanguage();
  const [showLoginForm, setShowLoginForm] = useState(false);

  const roles = [
    {
      id: 'participant' as const,
      title: t('login.roles.participant'),
      description: t('login.roles.participant.description')
    },
    {
      id: 'investigator' as const,
      title: t('login.roles.investigator'),
      description: t('login.roles.investigator.description')
    },
    {
      id: 'cro-sponsor' as const,
      title: t('login.roles.cro-sponsor'),
      description: t('login.roles.cro-sponsor.description')
    }
  ];

  const handleLogin = (credentials: { email: string; password: string; role: string }) => {
    // In a real app, you would validate credentials here
    onRoleSelect(credentials.role as 'participant' | 'investigator' | 'cro-sponsor');
  };

  if (showLoginForm) {
    return (
      <LoginForm 
        onLogin={handleLogin}
        onBackToRoleSelection={() => setShowLoginForm(false)}
      />
    );
  }

  return (
    <div className="min-h-screen bg-studio-bg flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h1 className="text-4xl font-light tracking-widest text-studio-text mb-2">
            STUDIO
          </h1>
          <p className="text-studio-text-muted text-sm">
            {t('login.role.selection.subtitle')}
          </p>
        </div>

        <div className="space-y-4">
          {roles.map((role) => (
            <Card 
              key={role.id} 
              className="bg-studio-surface border-studio-border hover:shadow-md transition-all duration-200 cursor-pointer"
              onClick={() => setShowLoginForm(true)}
            >
              <CardHeader className="pb-3">
                <h3 className="text-lg font-medium text-studio-text">
                  {role.title}
                </h3>
              </CardHeader>
              <CardContent className="pt-0">
                <p className="text-sm text-studio-text-muted">
                  {role.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center">
          <p className="text-xs text-studio-text-muted">
            {t('login.help')}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;