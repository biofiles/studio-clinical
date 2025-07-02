import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useLanguage } from "@/contexts/LanguageContext";
import LoginForm from "./LoginForm";
import { User, UserCheck, Building } from "lucide-react";

interface LoginProps {
  onRoleSelect: (role: 'participant' | 'investigator' | 'cro-sponsor') => void;
}

const Login = ({ onRoleSelect }: LoginProps) => {
  const { t } = useLanguage();
  const [selectedRole, setSelectedRole] = useState<string>('');
  const [showLoginForm, setShowLoginForm] = useState(false);

  const roles = [
    {
      id: 'participant' as const,
      title: t('login.participant'),
      description: t('login.participant.description') || 'Join as a study participant',
      icon: User
    },
    {
      id: 'investigator' as const,
      title: t('login.investigator'),
      description: t('login.investigator.description') || 'Access site management tools',
      icon: UserCheck
    },
    {
      id: 'cro-sponsor' as const,
      title: t('login.cro.sponsor'),
      description: t('login.cro.sponsor.description') || 'Monitor studies and sites',
      icon: Building
    }
  ];

  const handleRoleSelect = (role: string) => {
    setSelectedRole(role);
    setShowLoginForm(true);
  };

  const handleLogin = (credentials: { email: string; password: string }) => {
    // In a real app, you would validate credentials here
    onRoleSelect(selectedRole as 'participant' | 'investigator' | 'cro-sponsor');
  };

  const handleBackToRoleSelection = () => {
    setShowLoginForm(false);
    setSelectedRole('');
  };

  if (showLoginForm && selectedRole) {
    return (
      <LoginForm 
        onLogin={handleLogin}
        onBackToRoleSelection={handleBackToRoleSelection}
        selectedRole={selectedRole}
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
            {t('login.select.role.title') || 'Select your role to continue'}
          </p>
        </div>

        <div className="space-y-4">
          {roles.map((role) => {
            const IconComponent = role.icon;
            return (
              <Card 
                key={role.id} 
                className="bg-studio-surface border-studio-border hover:shadow-md transition-all duration-200 cursor-pointer hover:border-studio-accent"
                onClick={() => handleRoleSelect(role.id)}
              >
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center space-x-3">
                    <IconComponent className="h-5 w-5 text-studio-accent" />
                    <span className="text-lg font-medium text-studio-text">
                      {role.title}
                    </span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <p className="text-sm text-studio-text-muted">
                    {role.description}
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="text-center">
          <p className="text-xs text-studio-text-muted">
            {t('login.help') || 'Need help? Contact support'}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;