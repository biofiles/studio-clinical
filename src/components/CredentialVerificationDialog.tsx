import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Lock, AlertCircle } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";

interface CredentialVerificationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
  title?: string;
  description?: string;
  userRole?: 'participant' | 'investigator' | 'admin';
}

export default function CredentialVerificationDialog({
  open,
  onOpenChange,
  onSuccess,
  title,
  description,
  userRole = 'investigator'
}: CredentialVerificationDialogProps) {
  const [password, setPassword] = useState("");
  const [electronicSignature, setElectronicSignature] = useState("");
  const [signatureReason, setSignatureReason] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [error, setError] = useState("");
  const { user, signIn } = useAuth();
  const { t } = useLanguage();

  const handleVerification = async () => {
    if (!password) {
      setError('Please enter your password');
      return;
    }
    
    if (!electronicSignature) {
      setError('Please provide your electronic signature');
      return;
    }
    
    if (!signatureReason) {
      setError('Please select a reason for signature');
      return;
    }

    setIsVerifying(true);
    setError("");

    // Simulate authentication delay for demo
    setTimeout(() => {
      if (password === "demo123" || password.length >= 6) {
        onSuccess();
        onOpenChange(false);
        setPassword("");
        setElectronicSignature("");
        setSignatureReason("");
      } else {
        setError('Invalid password. Try "demo123" or any password with 6+ characters');
      }
      setIsVerifying(false);
    }, 1000);
  };

  const handleClose = () => {
    setPassword("");
    setElectronicSignature("");
    setSignatureReason("");
    setError("");
    onOpenChange(false);
  };

  // Get filtered signature reasons based on user role
  const getSignatureReasons = () => {
    if (userRole === 'participant') {
      return [
        { value: 'study-participation', label: t('signature.reason.study.participation') }
      ];
    }
    
    // For investigators and other roles, show all options
    return [
      { value: 'conducted-process', label: t('signature.reason.conducted.process') },
      { value: 'witness', label: t('signature.reason.witness') },
      { value: 'supervisor-approval', label: t('signature.reason.supervisor.approval') },
      { value: 'quality-review', label: t('signature.reason.quality.review') }
    ];
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md bg-studio-surface border-studio-border">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-studio-text">
            <Lock className="h-5 w-5 text-studio-accent" />
            {title || t('credential.verification.title')}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="bg-studio-bg/50 p-4 rounded-lg border border-studio-border">
            <p className="text-sm text-studio-text-muted">
              {description || t('credential.verification.description')}
            </p>
          </div>

          <div className="space-y-3">
            <div>
              <Label htmlFor="verification-password" className="text-studio-text">
                {t('credential.verification.password.label')}
              </Label>
              <Input
                id="verification-password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder={t('credential.verification.password.placeholder')}
                className="bg-studio-bg border-studio-border text-studio-text"
                onKeyDown={(e) => e.key === 'Enter' && handleVerification()}
                disabled={isVerifying}
              />
            </div>

            <div>
              <Label htmlFor="electronic-signature" className="text-studio-text">
                {t('electronic.signature.label')}
              </Label>
              <Input
                id="electronic-signature"
                type="text"
                value={electronicSignature}
                onChange={(e) => setElectronicSignature(e.target.value)}
                placeholder={t('electronic.signature.placeholder')}
                className="bg-studio-bg border-studio-border text-studio-text"
                disabled={isVerifying}
              />
            </div>

            <div>
              <Label htmlFor="signature-reason" className="text-studio-text">
                {t('signature.reason.label')}
              </Label>
              <Select 
                value={signatureReason} 
                onValueChange={setSignatureReason}
                disabled={isVerifying}
              >
                <SelectTrigger className="bg-studio-bg border-studio-border text-studio-text">
                  <SelectValue placeholder={t('signature.reason.placeholder')} />
                </SelectTrigger>
                <SelectContent className="bg-studio-surface border-studio-border">
                  {getSignatureReasons().map((reason) => (
                    <SelectItem key={reason.value} value={reason.value} className="text-studio-text">
                      {reason.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {error && (
              <Alert className="border-red-500/20 bg-red-500/10">
                <AlertCircle className="h-4 w-4 text-red-500" />
                <AlertDescription className="text-red-500">
                  {error}
                </AlertDescription>
              </Alert>
            )}
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button
              variant="outline"
              onClick={handleClose}
              disabled={isVerifying}
              className="border-studio-border text-studio-text hover:bg-studio-bg"
            >
              {t('common.cancel')}
            </Button>
            <Button
              onClick={handleVerification}
              disabled={isVerifying || !password || !electronicSignature || !signatureReason}
              className="bg-primary hover:bg-primary/90 text-primary-foreground border border-primary"
            >
              {isVerifying ? t('credential.verification.verifying') : t('credential.verification.verify')}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}