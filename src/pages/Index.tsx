import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useLanguage } from "@/contexts/LanguageContext";
import { Link } from "react-router-dom";
import { User, Building, UserCheck } from "lucide-react";

const Index = () => {
  const { t } = useLanguage();

  const roles = [
    {
      id: 'participant' as const,
      title: 'Participante',
      description: 'Unirse como participante del estudio',
      icon: User
    },
    {
      id: 'investigator' as const,
      title: 'Investigador del Sitio',
      description: 'Acceder a herramientas de gestión del sitio',
      icon: UserCheck
    },
    {
      id: 'cro-sponsor' as const,
      title: 'CRO/Patrocinador',
      description: 'Monitorear estudios y sitios',
      icon: Building
    }
  ];

  return (
    <div className="min-h-screen bg-studio-bg flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h1 className="text-4xl font-light tracking-widest text-studio-text mb-2">
            STUDIO
          </h1>
          <p className="text-studio-text-muted text-sm">
            Selecciona tu rol para continuar
          </p>
        </div>

        <div className="space-y-4">
          {roles.map((role) => {
            const IconComponent = role.icon;
            return (
              <Card 
                key={role.id} 
                className="bg-studio-surface border-studio-border hover:shadow-md transition-all duration-200 cursor-pointer hover:border-studio-accent"
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
                  <p className="text-sm text-studio-text-muted mb-4">
                    {role.description}
                  </p>
                  <Link to="/auth">
                    <Button className="w-full">
                      Continuar como {role.title}
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Index;
