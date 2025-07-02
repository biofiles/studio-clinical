
import { Button } from "@/components/ui/button";
import { Settings } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface HeaderProps {
  role?: string;
  onLogout?: () => void;
}

const Header = ({ role, onLogout }: HeaderProps) => {
  const navigate = useNavigate();

  const handleSettings = () => {
    navigate('/settings');
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
              <span className="text-sm text-studio-text-muted capitalize ml-1 mt-0.5">
                {role === 'cro-sponsor' ? 'CRO/Sponsor' : role.replace('-', '/')}
              </span>
            </div>
          )}
        </div>

        <div className="flex items-center space-x-3">
          <Button
            variant="outline"
            size="sm"
            onClick={handleSettings}
          >
            <Settings className="h-4 w-4 mr-2" />
            Settings
          </Button>
          {onLogout && (
            <Button
              variant="outline"
              size="sm"
              onClick={onLogout}
            >
              Logout
            </Button>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
