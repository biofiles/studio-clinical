import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Eye, EyeOff, Lock, User, Copy, LogOut, Sun, Moon } from 'lucide-react';
import { useTheme } from 'next-themes';

const Auth = () => {
  const {
    user,
    loading: authLoading,
    signIn,
    signOut,
    getUserRole
  } = useAuth();
  const { toast } = useToast();
  const { theme, setTheme } = useTheme();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const forceLogin = searchParams.get('force') === 'true';
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [redirecting, setRedirecting] = useState(false);
  const [userRole, setUserRole] = useState<string | null>(null);

  // Get user role and handle redirect for logged in users
  useEffect(() => {
    if (user && !forceLogin && !redirecting) {
      setRedirecting(true);
      
      const handleUserRole = async () => {
        try {
          const role = await getUserRole();
          setUserRole(role);
          
          if (role === 'participant') {
            navigate('/participant', { replace: true });
          } else if (role === 'investigator') {
            navigate('/investigator', { replace: true });
          } else if (role === 'cro_sponsor') {
            navigate('/cro-sponsor', { replace: true });
          } else {
            toast({
              title: 'Error',
              description: 'No se encontró un rol asignado para este usuario.',
              variant: 'destructive'
            });
            setRedirecting(false);
          }
        } catch (error) {
          console.error('Error getting user role:', error);
          toast({
            title: 'Error',
            description: 'Error al obtener el rol del usuario',
            variant: 'destructive'
          });
          setRedirecting(false);
        }
      };
      
      handleUserRole();
    }
  }, [user, forceLogin, redirecting, navigate, getUserRole, toast]);
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    
    try {
      const { error } = await signIn(email, password);
      
      if (error) {
        toast({
          title: 'Error de autenticación',
          description: error.message,
          variant: 'destructive'
        });
        setSubmitting(false);
        return;
      }
      
      // Set a flag to handle redirect after auth state updates
      setSubmitting(false);
      // The useEffect will handle the redirect once user is available
      
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Ocurrió un error inesperado',
        variant: 'destructive'
      });
      setSubmitting(false);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut();
      setUserRole(null);
      toast({
        title: 'Sesión cerrada',
        description: 'Has cerrado sesión correctamente'
      });
    } catch (error) {
      console.error('Error during logout:', error);
      toast({
        title: 'Error',
        description: 'Error al cerrar sesión',
        variant: 'destructive'
      });
    }
  };

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
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

  // Show loading spinner while checking auth or redirecting
  if (authLoading || redirecting) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="text-foreground text-4xl font-light tracking-widest mb-4">STUDIO</div>
          <div className="text-muted-foreground">Cargando...</div>
        </div>
      </div>
    );
  }

  // If user is logged in and not forced to show login, show dashboard option
  if (user && userRole && !forceLogin) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center">
            <h1 className="text-4xl font-light tracking-widest text-foreground mb-2">
              STUDIO
            </h1>
          </div>

          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <User className="h-5 w-5" />
                  <span>Ya tienes sesión iniciada</span>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={toggleTheme}
                  className="h-8 w-8 p-0"
                >
                  {theme === 'dark' ? (
                    <Sun className="h-4 w-4" />
                  ) : (
                    <Moon className="h-4 w-4" />
                  )}
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center space-y-4">
                <p className="text-muted-foreground">
                  Rol: <span className="capitalize">{userRole.replace('_', ' ')}</span>
                </p>
                
                <div className="flex flex-col space-y-2">
                  <Button
                    onClick={() => {
                      if (userRole === 'participant') {
                        navigate('/participant');
                      } else if (userRole === 'investigator') {
                        navigate('/investigator');
                      } else if (userRole === 'cro_sponsor') {
                        navigate('/cro-sponsor');
                      }
                    }}
                    className="w-full"
                  >
                    Ir al Dashboard
                  </Button>
                  
                  <Button
                    variant="outline"
                    onClick={handleLogout}
                    className="w-full flex items-center space-x-2"
                  >
                    <LogOut className="h-4 w-4" />
                    <span>Cerrar Sesión</span>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h1 className="text-4xl font-light tracking-widest text-foreground mb-2">
            STUDIO
          </h1>
        </div>

        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <User className="h-5 w-5" />
                <span>Iniciar Sesión</span>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleTheme}
                className="h-8 w-8 p-0"
              >
                {theme === 'dark' ? (
                  <Sun className="h-4 w-4" />
                ) : (
                  <Moon className="h-4 w-4" />
                )}
              </Button>
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
                  onChange={e => setEmail(e.target.value)} 
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
                    onChange={e => setPassword(e.target.value)} 
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
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
              </div>

              <Button type="submit" className="w-full" disabled={submitting || !email || !password}>
                <Lock className="h-4 w-4 mr-2" />
                {submitting ? 'Cargando...' : 'Iniciar Sesión'}
              </Button>
            </form>
          </CardContent>
        </Card>
        
        <div className="text-center text-xs text-muted-foreground space-y-3">
          <p className="font-medium">Cuentas de prueba:</p>
          
          <div className="space-y-2">
            <div className="flex items-center justify-between gap-2">
              <span>Participante: participant@studioclinical.com</span>
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-6 w-6 p-0" 
                onClick={() => copyToClipboard('participant@studioclinical.com', 'Email de participante')}
              >
                <Copy className="h-3 w-3" />
              </Button>
            </div>
            
            <div className="flex items-center justify-between gap-2">
              <span>Investigador: site@studioclinical.com</span>
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-6 w-6 p-0" 
                onClick={() => copyToClipboard('site@studioclinical.com', 'Email de investigador')}
              >
                <Copy className="h-3 w-3" />
              </Button>
            </div>
            
            <div className="flex items-center justify-between gap-2">
              <span>CRO/Patrocinador: sponsor-cro@studioclinical.com</span>
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-6 w-6 p-0" 
                onClick={() => copyToClipboard('sponsor-cro@studioclinical.com', 'Email de CRO/Patrocinador')}
              >
                <Copy className="h-3 w-3" />
              </Button>
            </div>
          </div>
          
          <div className="pt-2 border-t border-border/20">
            <div className="flex items-center justify-center gap-2">
              <span>Contraseña: studio</span>
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-6 w-6 p-0" 
                onClick={() => copyToClipboard('studio', 'Contraseña')}
              >
                <Copy className="h-3 w-3" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Auth;