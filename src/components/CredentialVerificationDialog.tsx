import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
}

export default function CredentialVerificationDialog({
  open,
  onOpenChange,
  onSuccess,
  title,
  description
}: CredentialVerificationDialogProps) {
  const [password, setPassword] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [error, setError] = useState("");
  const { user, signIn } = useAuth();
  const { t } = useLanguage();

  const handleVerification = async () => {
    if (!user?.email || !password) {
      setError(t('credential.verification.password.required'));
      return;
    }

    setIsVerifying(true);
    setError("");

    try {
      const { error } = await signIn(user.email, password);
      
      if (error) {
        setError(t('credential.verification.invalid.password'));
      } else {
        onSuccess();
        onOpenChange(false);
        setPassword("");
      }
    } catch (err) {
      setError(t('credential.verification.error'));
    } finally {
      setIsVerifying(false);
    }
  };

  const handleClose = () => {
    setPassword("");
    setError("");
    onOpenChange(false);
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
              disabled={isVerifying || !password}
              className="bg-studio-accent hover:bg-studio-accent/90 text-white"
            >
              {isVerifying ? t('credential.verification.verifying') : t('credential.verification.verify')}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}