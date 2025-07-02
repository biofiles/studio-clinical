
import { Button } from "@/components/ui/button";
import { Settings } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";

interface HeaderProps {
  role?: string;
  onLogout?: () => void;
  hideSettings?: boolean;
}

const Header = ({ role, onLogout, hideSettings }: HeaderProps) => {
  const navigate = useNavigate();
  const { t } = useLanguage();

  const handleSettings = () => {
    navigate('/settings');
  };

  const getRoleDisplay = (role: string) => {
    switch (role) {
      case 'investigator':
        return 'Site';
      case 'cro-sponsor':
        return 'CRO/Sponsor';
      default:
        return role?.replace('-', '/');
    }
  };

  return (
    <header className="bg-studio-surface border-b border-studio-border px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <h1 className="text-2xl font-light tracking-widest text-studio-text">
            STUDIO
          </h1>
          {role && (
            <div className="flex items-center space-x-2">
              <span className="text-studio-text-muted">•</span>
              <span className="text-sm text-studio-text-muted capitalize ml-2 mt-1 mr-1">
                {getRoleDisplay(role)}
              </span>
            </div>
          )}
        </div>

        <div className="flex items-center space-x-3">
          {!hideSettings && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleSettings}
            >
              <Settings className="h-4 w-4 mr-2" />
              {t('header.settings')}
            </Button>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
