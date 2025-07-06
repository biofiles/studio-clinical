import { useState } from 'react';
import { Navigate, useSearchParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Eye, EyeOff, Lock, User, ArrowLeft } from 'lucide-react';

const Auth = () => {
  const [searchParams] = useSearchParams();
  const role = searchParams.get('role');
  const { user, signIn, signUp } = useAuth();
  const { toast } = useToast();
  
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  if (user) {
    // Redirect based on role
    if (role === 'participant') {
      return <Navigate to="/participant" replace />;
    } else if (role === 'investigator') {
      return <Navigate to="/investigator" replace />;
    } else if (role === 'cro-sponsor') {
      return <Navigate to="/cro-sponsor" replace />;
    }
    return <Navigate to="/" replace />;
  }

  const getRoleDisplayName = (role: string | null) => {
    switch (role) {
      case 'participant':
        return 'Participante';
      case 'investigator':
        return 'Investigador del Sitio';
      case 'cro-sponsor':
        return 'CRO/Patrocinador';
      default:
        return 'Usuario';
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isSignUp && password !== confirmPassword) {
      toast({
        title: 'Error',
        description: 'Las contraseñas no coinciden',
        variant: 'destructive',
      });
      return;
    }

    setLoading(true);

    try {
      const { error } = isSignUp 
        ? await signUp(email, password)
        : await signIn(email, password);

      if (error) {
        toast({
          title: 'Error',
          description: error.message,
          variant: 'destructive',
        });
      } else if (isSignUp) {
        toast({
          title: 'Cuenta creada',
          description: 'Revisa tu email para confirmar tu cuenta',
        });
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Ocurrió un error inesperado',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
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
            {isSignUp ? 'Crear cuenta' : 'Iniciar sesión'}
          </p>
        </div>

        <Card className="bg-studio-surface border-studio-border">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <User className="h-5 w-5" />
                <span>{isSignUp ? 'Crear Cuenta' : 'Iniciar Sesión'}</span>
              </div>
              <div className="text-sm text-studio-text-muted">
                {getRoleDisplayName(role)}
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
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

              {isSignUp && (
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirmar Contraseña</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                  />
                </div>
              )}

              <Button 
                type="submit" 
                className="w-full"
                disabled={loading || !email || !password || (isSignUp && !confirmPassword)}
              >
                <Lock className="h-4 w-4 mr-2" />
                {loading ? 'Cargando...' : (isSignUp ? 'Crear Cuenta' : 'Iniciar Sesión')}
              </Button>
            </form>

            <Separator />

            <Button
              variant="outline"
              onClick={() => setIsSignUp(!isSignUp)}
              className="w-full"
            >
              {isSignUp ? '¿Ya tienes cuenta? Iniciar Sesión' : '¿No tienes cuenta? Crear Cuenta'}
            </Button>

            <Button
              variant="outline"
              onClick={() => window.history.back()}
              className="w-full"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Volver
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Auth;