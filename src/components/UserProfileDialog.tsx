
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { User, Shield, Copy } from "lucide-react";

interface UserProfileDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const UserProfileDialog = ({ open, onOpenChange }: UserProfileDialogProps) => {
  const participantToken = "PTK-9283-WZ1";

  const handleCopyToken = () => {
    navigator.clipboard.writeText(participantToken);
    alert("Token copied to clipboard");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <User className="h-5 w-5" />
            <span>Participant Profile</span>
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <Card className="bg-studio-surface border-studio-border">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm text-studio-text-muted">Study Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-studio-text-muted">Study ID:</span>
                <span className="text-sm font-medium text-studio-text">PROTO-2024-001</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-studio-text-muted">Phase:</span>
                <span className="text-sm font-medium text-studio-text">Phase II</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-studio-text-muted">Enrollment Date:</span>
                <span className="text-sm font-medium text-studio-text">Oct 15, 2024</span>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-blue-50 border-blue-200">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm text-blue-800 flex items-center space-x-2">
                <Shield className="h-4 w-4" />
                <span>Your Secure Token</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-xs text-blue-700">
                This unique token protects your identity and ensures data privacy compliance.
              </p>
              <div className="flex items-center justify-between p-3 bg-white rounded border">
                <code className="font-mono text-lg font-bold text-studio-text">
                  {participantToken}
                </code>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleCopyToken}
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
              <p className="text-xs text-blue-600">
                • Keep this token confidential<br/>
                • Used for secure data linking<br/>
                • HIPAA compliant anonymization
              </p>
            </CardContent>
          </Card>

          <div className="pt-2">
            <Button 
              onClick={() => onOpenChange(false)}
              className="w-full"
              variant="studio"
            >
              Close
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default UserProfileDialog;
