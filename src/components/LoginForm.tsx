import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useLanguage } from "@/contexts/LanguageContext";
import { supabase } from "@/integrations/supabase/client";
import { Eye, EyeOff, Lock, User, ArrowLeft, Shield } from "lucide-react";

interface LoginFormProps {
  onLogin: (credentials: { email: string; password: string }) => void;
  onBackToRoleSelection: () => void;
  selectedRole: string;
}

const LoginForm = ({ onLogin, onBackToRoleSelection, selectedRole }: LoginFormProps) => {
  const { t } = useLanguage();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [showMFAVerification, setShowMFAVerification] = useState(false);
  const [mfaCode, setMfaCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const getRoleDisplayName = (role: string) => {
    switch (role) {
      case 'participant':
        return 'Participante';
      case 'investigator':
        return 'Investigador del Sitio';
      case 'cro-sponsor':
        return 'CRO/Patrocinador';
      default:
        return role;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;

    setIsLoading(true);
    setError("");

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      // Check if user has MFA enabled
      const { data: factors } = await supabase.auth.mfa.listFactors();
      if (factors?.totp && factors.totp.length > 0) {
        // User has MFA enabled, show verification
        setShowMFAVerification(true);
      } else {
        // No MFA, proceed with login
        onLogin({ email, password });
      }
    } catch (error: any) {
      setError(error.message || 'Error al iniciar sesión');
    } finally {
      setIsLoading(false);
    }
  };

  const handleMFAVerification = async () => {
    if (mfaCode.length !== 6) return;

    setIsLoading(true);
    setError("");

    try {
      const { data: factors } = await supabase.auth.mfa.listFactors();
      const factor = factors?.totp?.[0];
      if (!factor) throw new Error('No MFA factor found');

      const { data: challenge, error: challengeError } = await supabase.auth.mfa.challenge({
        factorId: factor.id
      });
      if (challengeError) throw challengeError;

      const { error: verifyError } = await supabase.auth.mfa.verify({
        factorId: factor.id,
        challengeId: challenge.id,
        code: mfaCode
      });

      if (verifyError) throw verifyError;

      onLogin({ email, password });
    } catch (error: any) {
      setError(error.message || 'Código MFA inválido');
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      alert(`Se ha enviado un enlace de recuperación a: ${email}`);
      setShowForgotPassword(false);
    } else {
      alert('Por favor ingrese su email primero');
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
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <User className="h-5 w-5" />
                <span>{showForgotPassword ? 'Recuperar Contraseña' : 'Iniciar Sesión'}</span>
              </div>
              <div className="text-sm text-studio-text-muted">
                {getRoleDisplayName(selectedRole)}
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {showMFAVerification ? (
              <div className="space-y-4">
                <div className="text-center space-y-2">
                  <Shield className="h-8 w-8 text-studio-accent mx-auto" />
                  <p className="text-sm text-studio-text-muted">
                    Ingresa el código de 6 dígitos de tu aplicación autenticadora
                  </p>
                </div>
                
                <div className="space-y-2">
                  <InputOTP
                    maxLength={6}
                    value={mfaCode}
                    onChange={setMfaCode}
                  >
                    <InputOTPGroup>
                      <InputOTPSlot index={0} />
                      <InputOTPSlot index={1} />
                      <InputOTPSlot index={2} />
                      <InputOTPSlot index={3} />
                      <InputOTPSlot index={4} />
                      <InputOTPSlot index={5} />
                    </InputOTPGroup>
                  </InputOTP>
                </div>

                {error && (
                  <Alert variant="destructive">
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                <div className="flex gap-2">
                  <Button
                    onClick={handleMFAVerification}
                    disabled={mfaCode.length !== 6 || isLoading}
                    className="flex-1"
                  >
                    {isLoading ? "Verificando..." : "Verificar"}
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setShowMFAVerification(false)}
                    disabled={isLoading}
                  >
                    <ArrowLeft className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ) : showForgotPassword ? (
              <form onSubmit={handleForgotPassword} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Ingrese su email"
                    required
                  />
                </div>
                <Button 
                  type="submit" 
                  className="w-full"
                  disabled={!email}
                >
                  <Lock className="h-4 w-4 mr-2" />
                  Enviar Enlace de Recuperación
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowForgotPassword(false)}
                  className="w-full"
                >
                  Volver al Login
                </Button>
              </form>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="ejemplo@correo.com"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">Contraseña</Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
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

                <div className="flex justify-end">
                  <Button
                    type="button"
                    variant="link"
                    size="sm"
                    onClick={() => setShowForgotPassword(true)}
                    className="text-xs text-studio-text-muted hover:text-studio-accent p-0 h-auto"
                  >
                    ¿Olvidaste tu contraseña?
                  </Button>
                </div>

                <Button 
                  type="submit" 
                  className="w-full"
                  disabled={!email || !password || isLoading}
                >
                  <Lock className="h-4 w-4 mr-2" />
                  {isLoading ? "Iniciando sesión..." : "Iniciar Sesión"}
                </Button>
              </form>
            )}

            {error && !showMFAVerification && !showForgotPassword && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <Separator />

            <Button
              variant="outline"
              onClick={onBackToRoleSelection}
              className="w-full"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Cambiar Rol
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default LoginForm;