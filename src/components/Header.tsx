import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Settings, Building } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import { useStudy } from "@/contexts/StudyContext";
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
  const {
    t
  } = useLanguage();
  const {
    selectedStudy
  } = useStudy();
  const handleSettings = () => {
    navigate('/settings');
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
  return <header className="bg-studio-surface border-b border-studio-border px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <h1 className="text-2xl font-light tracking-widest text-studio-text">
            STUDIO
          </h1>
          {role && role !== 'participant'}
        </div>

        <div className="flex items-center space-x-3">
          <Button variant="outline" size="sm" onClick={handleSettings}>
            <Settings className="h-4 w-4 mr-2" />
            {t('header.settings')}
          </Button>
        </div>
      </div>
    </header>;
};
export default Header;