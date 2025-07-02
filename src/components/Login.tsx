import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

interface LoginProps {
  onRoleSelect: (role: 'participant' | 'investigator' | 'cro-sponsor') => void;
}

const Login = ({ onRoleSelect }: LoginProps) => {
  const roles = [
    {
      id: 'participant' as const,
      title: 'Participant',
      description: 'Access your study participation portal'
    },
    {
      id: 'investigator' as const,
      title: 'Investigator',
      description: 'Manage and monitor clinical studies'
    },
    {
      id: 'cro-sponsor' as const,
      title: 'CRO/Sponsor',
      description: 'Oversee and administer research programs'
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
            Select your role to continue
          </p>
        </div>

        <div className="space-y-4">
          {roles.map((role) => (
            <Card 
              key={role.id} 
              className="bg-studio-surface border-studio-border hover:shadow-md transition-all duration-200 cursor-pointer"
              onClick={() => onRoleSelect(role.id)}
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
            Don't have access? Contact your administrator
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;