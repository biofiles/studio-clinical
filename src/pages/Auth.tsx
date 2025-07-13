import { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Skeleton } from '@/components/ui/skeleton';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { Eye, EyeOff, Lock, User, Copy } from 'lucide-react';
const Auth = () => {
  const {
    user,
    signIn,
    userRole,
    roleLoading
  } = useAuth();
  const {
    toast
  } = useToast();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [redirecting, setRedirecting] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState('Verificando permisos...');

  // Redirect based on user's role when they log in
  useEffect(() => {
    if (user && userRole && !redirecting && !roleLoading) {
      setRedirecting(true);
      setLoadingMessage('Preparando dashboard...');
      
      // Add a small delay to show the loading message
      setTimeout(() => {
        setLoadingMessage('Casi listo...');
        
        setTimeout(() => {
          if (userRole === 'participant') {
            window.location.href = '/participant';
          } else if (userRole === 'investigator') {
            window.location.href = '/investigator';
          } else if (userRole === 'cro_sponsor') {
            window.location.href = '/cro-sponsor';
          } else {
            // If no role found, show an error and allow them to try again
            toast({
              title: 'Error',
              description: 'No se encontró un rol asignado para este usuario. Intente con una cuenta válida.',
              variant: 'destructive'
            });
            setRedirecting(false);
          }
        }, 500);
      }, 800);
    }
  }, [user, userRole, roleLoading, toast, redirecting]);
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const {
        error
      } = await signIn(email, password);
      if (error) {
        toast({
          title: 'Error de autenticación',
          description: error.message,
          variant: 'destructive'
        });
        setLoading(false);
      }
      // Don't set loading to false here - let the redirect effect handle it
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Ocurrió un error inesperado',
        variant: 'destructive'
      });
      setLoading(false);
    }
  };
  const copyToClipboard = async (text: string, label: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast({
        title: 'Copiado',
        description: `${label} copiado al portapapeles`
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'No se pudo copiar al portapapeles',
        variant: 'destructive'
      });
    }
  };

  // Show loading spinner while redirecting
  if (redirecting) {
    return (
      <div className="min-h-screen bg-studio-bg flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="text-4xl font-light tracking-widest text-studio-text mb-8">
            STUDIO
          </div>
          <LoadingSpinner size="lg" message={loadingMessage} className="text-studio-text justify-center" />
        </div>
      </div>
    );
  }

  // Show skeleton loading while role is being fetched
  if (user && roleLoading) {
    return (
      <div className="min-h-screen bg-studio-bg flex items-center justify-center p-4">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center">
            <h1 className="text-4xl font-light tracking-widest text-studio-text mb-2">
              STUDIO
            </h1>
          </div>
          <Card className="bg-studio-surface border-studio-border">
            <CardHeader>
              <Skeleton className="h-6 w-40" />
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <Skeleton className="h-16 w-full" />
                <Skeleton className="h-16 w-full" />
                <Skeleton className="h-10 w-full" />
              </div>
              <div className="text-center">
                <LoadingSpinner size="md" message="Verificando permisos..." className="text-studio-text justify-center" />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }
  return <div className="min-h-screen bg-studio-bg flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h1 className="text-4xl font-light tracking-widest text-studio-text mb-2">
            STUDIO
          </h1>
          
        </div>

        <Card className="bg-studio-surface border-studio-border">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <User className="h-5 w-5" />
              <span>Iniciar Sesión</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="ejemplo@correo.com" required />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Contraseña</Label>
                <div className="relative">
                  <Input id="password" type={showPassword ? "text" : "password"} value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" required />
                  <Button type="button" variant="ghost" size="sm" className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent" onClick={() => setShowPassword(!showPassword)}>
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
              </div>

              <Button type="submit" className="w-full" disabled={loading || !email || !password}>
                {loading ? (
                  <LoadingSpinner size="sm" message="Iniciando sesión..." />
                ) : (
                  <>
                    <Lock className="h-4 w-4 mr-2" />
                    Iniciar Sesión
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
        
        <div className="text-center text-xs text-studio-text-muted space-y-3">
          <p className="font-medium">Cuentas de prueba:</p>
          
          <div className="space-y-2">
            <div className="flex items-center justify-between gap-2">
              <span>Participante: participant@studioclinical.com</span>
              <Button variant="ghost" size="sm" className="h-6 w-6 p-0" onClick={() => copyToClipboard('participant@studioclinical.com', 'Email de participante')}>
                <Copy className="h-3 w-3" />
              </Button>
            </div>
            
            <div className="flex items-center justify-between gap-2">
              <span>Investigador: site@studioclinical.com</span>
              <Button variant="ghost" size="sm" className="h-6 w-6 p-0" onClick={() => copyToClipboard('site@studioclinical.com', 'Email de investigador')}>
                <Copy className="h-3 w-3" />
              </Button>
            </div>
            
            <div className="flex items-center justify-between gap-2">
              <span>CRO/Patrocinador: sponsor-cro@studioclinical.com</span>
              <Button variant="ghost" size="sm" className="h-6 w-6 p-0" onClick={() => copyToClipboard('sponsor-cro@studioclinical.com', 'Email de CRO/Patrocinador')}>
                <Copy className="h-3 w-3" />
              </Button>
            </div>
          </div>
          
          <div className="pt-2 border-t border-studio-border/20">
            <div className="flex items-center justify-center gap-2">
              <span>Contraseña: studio</span>
              <Button variant="ghost" size="sm" className="h-6 w-6 p-0" onClick={() => copyToClipboard('studio', 'Contraseña')}>
                <Copy className="h-3 w-3" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>;
};
export default Auth;