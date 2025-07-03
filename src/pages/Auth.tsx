import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/hooks/useAuth";
import { useLanguage } from "@/contexts/LanguageContext";
import { ArrowLeft, User, UserPlus, AlertCircle, UserCheck, Building } from "lucide-react";
import { Link } from "react-router-dom";
import { Alert, AlertDescription } from "@/components/ui/alert";

const Auth = () => {
  const { t } = useLanguage();
  const { signIn, signUp } = useAuth();
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      if (isSignUp) {
        const { error } = await signUp(email, password, fullName);
        if (error) {
          setError(error.message);
        } else {
          setError("");
          alert("Check your email for the confirmation link!");
        }
      } else {
        const { error } = await signIn(email, password);
        if (error) {
          setError(error.message);
        }
      }
    } catch (err: any) {
      setError(err.message);
    }
    
    setLoading(false);
  };

  const toggleMode = () => {
    setIsSignUp(!isSignUp);
    setError("");
    setEmail("");
    setPassword("");
    setFullName("");
  };

  return (
    <div className="min-h-screen bg-studio-bg flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h1 className="text-4xl font-light tracking-widest text-studio-text mb-2">
            STUDIO
          </h1>
          <p className="text-studio-text-muted text-sm">
            {isSignUp ? "Crear nueva cuenta" : t('login.subtitle')}
          </p>
        </div>

        <Card className="bg-studio-surface border-studio-border">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              {isSignUp ? (
                <UserPlus className="h-5 w-5 text-studio-accent" />
              ) : (
                <User className="h-5 w-5 text-studio-accent" />
              )}
              <span className="text-lg font-medium text-studio-text">
                {isSignUp ? "Registrarse" : t('login.title')}
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              {isSignUp && (
                <div className="space-y-2">
                  <Label htmlFor="fullName">Nombre Completo</Label>
                  <Input
                    id="fullName"
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Ingresa tu nombre completo"
                    required
                  />
                </div>
              )}

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
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder={t('login.password.placeholder')}
                  required
                />
              </div>

              <Button 
                type="submit" 
                className="w-full"
                disabled={loading}
              >
                {loading ? t('common.loading') : (isSignUp ? "Registrarse" : t('login.button'))}
              </Button>
            </form>

            <div className="mt-4 text-center">
              <Button
                variant="ghost"
                onClick={toggleMode}
                className="text-sm text-studio-text-muted"
              >
                {isSignUp ? "¿Ya tienes una cuenta? Inicia sesión" : "¿No tienes una cuenta? Regístrate"}
              </Button>
            </div>

            <div className="mt-6 space-y-3">
              <div className="text-center">
                <p className="text-xs text-studio-text-muted mb-3">
                  Acceso directo por rol:
                </p>
              </div>
              
              <div className="grid grid-cols-1 gap-2">
                <Link to="/participant">
                  <Button variant="outline" className="w-full flex items-center space-x-2 text-sm">
                    <User className="h-4 w-4" />
                    <span>Participante</span>
                  </Button>
                </Link>
                
                <Link to="/investigator">
                  <Button variant="outline" className="w-full flex items-center space-x-2 text-sm">
                    <UserCheck className="h-4 w-4" />
                    <span>Investigador</span>
                  </Button>
                </Link>
                
                <Link to="/cro-sponsor">
                  <Button variant="outline" className="w-full flex items-center space-x-2 text-sm">
                    <Building className="h-4 w-4" />
                    <span>CRO/Patrocinador</span>
                  </Button>
                </Link>
              </div>
            </div>

            <div className="mt-4 text-center">
              <p className="text-xs text-studio-text-muted">
                {t('login.help')}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Auth;