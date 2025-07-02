import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useLanguage } from "@/contexts/LanguageContext";
import { Eye, EyeOff, Lock, User } from "lucide-react";

interface LoginFormProps {
  onLogin: (credentials: { email: string; password: string; role: string }) => void;
  onBackToRoleSelection: () => void;
}

const LoginForm = ({ onLogin, onBackToRoleSelection }: LoginFormProps) => {
  const { t } = useLanguage();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [selectedRole, setSelectedRole] = useState("");

  const roles = [
    { id: 'participant', title: t('login.roles.participant'), description: t('login.roles.participant.description') },
    { id: 'investigator', title: t('login.roles.investigator'), description: t('login.roles.investigator.description') },
    { id: 'cro-sponsor', title: t('login.roles.cro-sponsor'), description: t('login.roles.cro-sponsor.description') }
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email && password && selectedRole) {
      onLogin({ email, password, role: selectedRole });
    }
  };

  return (
    <div className="min-h-screen bg-studio-bg flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h1 className="text-4xl font-light tracking-widest text-studio-text mb-2">
            STUDIO
          </h1>
          <p className="text-studio-text-muted text-sm">
            {t('login.subtitle')}
          </p>
        </div>

        <Card className="bg-studio-surface border-studio-border">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <User className="h-5 w-5" />
              <span>{t('login.title')}</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">{t('login.email')}</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={t('login.email.placeholder')}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">{t('login.password')}</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder={t('login.password.placeholder')}
                    required
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <Label>{t('login.role.select')}</Label>
                <div className="space-y-2">
                  {roles.map((role) => (
                    <div
                      key={role.id}
                      className={`p-3 border rounded cursor-pointer transition-all ${
                        selectedRole === role.id
                          ? 'border-studio-accent bg-studio-accent/10'
                          : 'border-studio-border hover:border-studio-accent/50'
                      }`}
                      onClick={() => setSelectedRole(role.id)}
                    >
                      <div className="text-sm font-medium">{role.title}</div>
                      <div className="text-xs text-studio-text-muted">{role.description}</div>
                    </div>
                  ))}
                </div>
              </div>

              <Button 
                type="submit" 
                className="w-full"
                disabled={!email || !password || !selectedRole}
              >
                <Lock className="h-4 w-4 mr-2" />
                {t('login.button')}
              </Button>
            </form>

            <Separator />

            <Button
              variant="outline"
              onClick={onBackToRoleSelection}
              className="w-full"
            >
              {t('login.back')}
            </Button>
          </CardContent>
        </Card>

        <div className="text-center">
          <p className="text-xs text-studio-text-muted">
            {t('login.help')}
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;