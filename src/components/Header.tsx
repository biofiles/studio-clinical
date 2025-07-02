import { Button } from "@/components/ui/button";

interface HeaderProps {
  role?: string;
  onDemoToggle?: () => void;
  isDemoMode?: boolean;
  onLogout?: () => void;
}

const Header = ({ role, onDemoToggle, isDemoMode, onLogout }: HeaderProps) => {
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
              <span className="text-sm text-studio-text-muted capitalize">
                {role.replace('-', '/')}
              </span>
              {isDemoMode && (
                <span className="bg-accent text-accent-foreground px-2 py-1 rounded text-xs">
                  DEMO
                </span>
              )}
            </div>
          )}
        </div>

        <div className="flex items-center space-x-3">
          {onDemoToggle && (
            <Button
              variant="studio"
              size="sm"
              onClick={onDemoToggle}
            >
              {isDemoMode ? 'Exit Demo' : 'Demo Mode'}
            </Button>
          )}
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