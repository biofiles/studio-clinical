import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Mail, BookOpen } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface PlsSignupDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: (emails: string[]) => void;
  userEmail?: string;
  participantId?: string;
  studyId?: string;
}

const PlsSignupDialog = ({ open, onOpenChange, onConfirm, userEmail = "", participantId, studyId }: PlsSignupDialogProps) => {
  const { t } = useLanguage();
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [emailError, setEmailError] = useState("");

  useEffect(() => {
    if (open) {
      setEmail(userEmail);
      setEmailError("");
    }
  }, [open, userEmail]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const trimmedEmail = email.trim().toLowerCase();
    if (!trimmedEmail) {
      setEmailError(t('pls.email.at.least.one'));
      return;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(trimmedEmail)) {
      setEmailError(t('pls.email.invalid.format'));
      return;
    }

    setIsSubmitting(true);
    
    try {
      // Save to database if we have the required data
      if (participantId && studyId) {
        // Check if signup already exists
        const { data: existingSignup } = await supabase
          .from('study_results_signups')
          .select('id')
          .eq('participant_id', participantId)
          .eq('email', trimmedEmail)
          .single();

        if (existingSignup) {
          toast.error("Already signed up", { description: "This email is already registered for study results." });
          setIsSubmitting(false);
          return;
        }

        const { error } = await supabase
          .from('study_results_signups')
          .insert({
            participant_id: participantId,
            study_id: studyId,
            email: trimmedEmail
          });

        if (error) throw error;

        toast.success(t('pls.success'));
      } else {
        // Fallback to localStorage for non-participant users (investigators, etc.)
        localStorage.setItem('pls-signed-up', 'true');
        localStorage.setItem('pls-signup-emails', JSON.stringify([trimmedEmail]));
        toast.success(t('pls.success'));
      }

      onConfirm([trimmedEmail]);
      onOpenChange(false);
    } catch (error) {
      console.error('Error saving PLS signup:', error);
      toast.error("Signup failed", { description: "Unable to save your signup. Please try again." });
    } finally {
      setIsSubmitting(false);
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
          
          <div className="space-y-2">
            <Label htmlFor="email" className="flex items-center space-x-2">
              <Mail className="h-4 w-4" />
              <span>{t('pls.email.address')}</span>
            </Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setEmailError("");
              }}
              placeholder={t('pls.email.placeholder')}
              className="w-full"
            />
            {emailError && (
              <p className="text-xs text-destructive">
                {emailError}
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
              disabled={isSubmitting || !email.trim()}
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