import { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Eye, EyeOff, Lock, User } from 'lucide-react';

const Auth = () => {
  const { user, signIn, getUserRole } = useAuth();
  const { toast } = useToast();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [redirecting, setRedirecting] = useState(false);

  // Redirect based on user's role when they log in
  useEffect(() => {
    if (user && !redirecting) {
      setRedirecting(true);
      
      const redirectUser = async () => {
        // Wait a moment for the trigger to assign the role
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        try {
          const role = await getUserRole();
          
          if (role === 'participant') {
            window.location.href = '/participant';
          } else if (role === 'investigator') {
            window.location.href = '/investigator';
          } else if (role === 'cro_sponsor') {
            window.location.href = '/cro-sponsor';
          } else {
            // If no role found, show an error and allow them to try again
            toast({
              title: 'Error',
              description: 'No se encontró un rol asignado para este usuario. Intente con una cuenta válida.',
              variant: 'destructive',
            });
            setRedirecting(false);
          }
        } catch (error) {
          console.error('Error during redirect:', error);
          toast({
            title: 'Error',
            description: 'Error al verificar el rol del usuario',
            variant: 'destructive',
          });
          setRedirecting(false);
        }
      };
      
      redirectUser();
    }
  }, [user, getUserRole, toast, redirecting]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    setLoading(true);

    try {
      const { error } = await signIn(email, password);

      if (error) {
        toast({
          title: 'Error de autenticación',
          description: error.message,
          variant: 'destructive',
        });
        setLoading(false);
      }
      // Don't set loading to false here - let the redirect effect handle it
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Ocurrió un error inesperado',
        variant: 'destructive',
      });
      setLoading(false);
    }
  };

  // Show loading spinner while redirecting
  if (redirecting) {
    return (
      <div className="min-h-screen bg-studio-bg flex items-center justify-center">
        <div className="text-studio-text">Cargando...</div>
      </div>
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
            Iniciar sesión en el sistema
          </p>
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

              <Button 
                type="submit" 
                className="w-full"
                disabled={loading || !email || !password}
              >
                <Lock className="h-4 w-4 mr-2" />
                {loading ? 'Cargando...' : 'Iniciar Sesión'}
              </Button>
            </form>
          </CardContent>
        </Card>
        
        <div className="text-center text-xs text-studio-text-muted">
          <p>Cuentas de prueba:</p>
          <p>Participante: participant@studioclinical.com</p>
          <p>Investigador: site@studioclinical.com</p>
          <p>CRO/Patrocinador: sponsor-cro@studioclinical.com</p>
        </div>
      </div>
    </div>
  );
};
export default Auth;