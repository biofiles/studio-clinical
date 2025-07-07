import { Button } from "@/components/ui/button";
import { User, LogOut, Shield } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import { useStudy } from "@/contexts/StudyContext";
import { useAuth } from "@/contexts/AuthContext";
import StudyDropdown from "@/components/StudyDropdown";

interface HeaderProps {
  role?: string;
  onLogout?: () => void;
}

const Header = ({
  role,
  onLogout
}: HeaderProps) => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const { selectedStudy } = useStudy();
  const { signOut } = useAuth();

  const handleSettings = () => {
    navigate('/profile');
  };

  const handleLogout = async () => {
    try {
      await signOut();
      navigate('/');
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };

  const getRoleDisplay = (role: string) => {
    switch (role) {
      case 'investigator':
        return 'Site';
      case 'cro-sponsor':
        return 'Sponsor/CRO';
      default:
        return role?.replace('-', '/');
    }
  };

  return (
    <header className="bg-studio-surface border-b border-studio-border">
      <div className="px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <h1 className="text-2xl font-light tracking-widest text-studio-text">
              STUDIO
            </h1>
          </div>

            <div className="flex items-center space-x-3">
              <Button variant="outline" size="sm" onClick={handleSettings}>
                <User className="h-4 w-4 mr-2" />
                {t('header.profile')}
              </Button>
              {(role === 'cro_sponsor' || role === 'admin') && (
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => navigate('/audit-trail')}
                >
                  <Shield className="h-4 w-4 mr-2" />
                  Audit Trail
                </Button>
              )}
            </div>
        </div>
      </div>
      
      {(role === 'investigator' || role === 'cro-sponsor') && (
        <div className="px-6 py-2 border-t border-studio-border bg-white">
          <StudyDropdown />
        </div>
      )}
    </header>
  );
};
export default Header;