import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Mail, BookOpen, X, Plus } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

interface PlsSignupDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: (emails: string[]) => void;
  userEmail?: string;
}

const PlsSignupDialog = ({ open, onOpenChange, onConfirm, userEmail = "" }: PlsSignupDialogProps) => {
  const { t } = useLanguage();
  const [newEmail, setNewEmail] = useState("");
  const [registeredEmails, setRegisteredEmails] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [duplicateWarning, setDuplicateWarning] = useState("");

  useEffect(() => {
    if (open) {
      // Load existing registered emails from localStorage
      const savedEmails = localStorage.getItem('pls-signup-emails');
      const emails = savedEmails ? JSON.parse(savedEmails) : [];
      setRegisteredEmails(emails);
      setNewEmail(userEmail);
      setDuplicateWarning("");
    }
  }, [open, userEmail]);

  const handleAddEmail = () => {
    const email = newEmail.trim().toLowerCase();
    if (!email) return;

    // Check if email is already registered
    if (registeredEmails.includes(email)) {
      setDuplicateWarning(t('pls.email.already.registered'));
      return;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setDuplicateWarning(t('pls.email.invalid.format'));
      return;
    }

    setRegisteredEmails([...registeredEmails, email]);
    setNewEmail("");
    setDuplicateWarning("");
  };

  const handleRemoveEmail = (emailToRemove: string) => {
    setRegisteredEmails(registeredEmails.filter(email => email !== emailToRemove));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (registeredEmails.length === 0) {
      setDuplicateWarning(t('pls.email.at.least.one'));
      return;
    }

    setIsSubmitting(true);
    
    try {
      onConfirm(registeredEmails);
      onOpenChange(false);
    } catch (error) {
      console.error('Error confirming PLS signup:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddEmail();
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <BookOpen className="h-5 w-5" />
            <span>{t('pls.email.confirmation.title')}</span>
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">
              {t('pls.email.confirmation.description')}
            </p>
          </div>

          {/* Registered Emails List */}
          {registeredEmails.length > 0 && (
            <div className="space-y-2">
              <Label className="text-sm font-medium">{t('pls.registered.emails')}</Label>
              <div className="flex flex-wrap gap-2">
                {registeredEmails.map((email, index) => (
                  <Badge key={index} variant="secondary" className="flex items-center space-x-1">
                    <Mail className="h-3 w-3" />
                    <span className="text-xs">{email}</span>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="h-4 w-4 p-0 hover:bg-destructive hover:text-destructive-foreground"
                      onClick={() => handleRemoveEmail(email)}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </Badge>
                ))}
              </div>
            </div>
          )}
          
          <div className="space-y-2">
            <Label htmlFor="email" className="flex items-center space-x-2">
              <Plus className="h-4 w-4" />
              <span>{t('pls.add.email.address')}</span>
            </Label>
            <div className="flex space-x-2">
              <Input
                id="email"
                type="email"
                value={newEmail}
                onChange={(e) => {
                  setNewEmail(e.target.value);
                  setDuplicateWarning("");
                }}
                onKeyPress={handleKeyPress}
                placeholder={t('pls.email.placeholder')}
                className="flex-1"
              />
              <Button
                type="button"
                variant="outline"
                onClick={handleAddEmail}
                disabled={!newEmail.trim()}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            {duplicateWarning && (
              <p className="text-xs text-destructive">
                {duplicateWarning}
              </p>
            )}
            <p className="text-xs text-muted-foreground">
              {t('pls.email.note')}
            </p>
          </div>
          
          <div className="flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
            >
              {t('common.cancel')}
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting || registeredEmails.length === 0}
              className="mb-2 sm:mb-0"
            >
              {isSubmitting ? t('common.loading') : t('pls.confirm.signup')}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default PlsSignupDialog;