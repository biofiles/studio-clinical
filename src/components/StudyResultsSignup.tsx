import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Mail, Plus, X, Send } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useStudy } from "@/contexts/StudyContext";
import { useLanguage } from "@/contexts/LanguageContext";

interface StudyResultsSignupProps {
  variant?: "participant" | "investigator";
  trigger?: React.ReactNode;
}

const StudyResultsSignup = ({ variant = "participant", trigger }: StudyResultsSignupProps) => {
  const [open, setOpen] = useState(false);
  const [emails, setEmails] = useState<string[]>([""]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const { selectedStudy } = useStudy();
  const { t } = useLanguage();

  const addEmailField = () => {
    setEmails([...emails, ""]);
  };

  const removeEmailField = (index: number) => {
    if (emails.length > 1) {
      setEmails(emails.filter((_, i) => i !== index));
    }
  };

  const updateEmail = (index: number, value: string) => {
    const newEmails = [...emails];
    newEmails[index] = value;
    setEmails(newEmails);
  };

  const validateEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedStudy) {
      toast({
        title: "Error",
        description: t('signup.results.error.no.study'),
        variant: "destructive",
      });
      return;
    }

    const validEmails = emails.filter(email => email.trim() && validateEmail(email.trim()));
    
    if (validEmails.length === 0) {
      toast({
        title: "Error",
        description: t('signup.results.error.valid.email'),
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Insert all valid emails
      const signupPromises = validEmails.map(email => 
        supabase
          .from('study_results_signups')
          .insert({
            email: email.trim(),
            study_id: selectedStudy.id,
          })
      );

      await Promise.all(signupPromises);

      toast({
        title: t('signup.results.success.title'),
        description: `${validEmails.length} ${t('signup.results.success.description')}`,
      });

      setEmails([""]);
      setOpen(false);
    } catch (error: any) {
      console.error("Error registering emails:", error);
      toast({
        title: "Error",
        description: t('signup.results.error.generic'),
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const defaultTrigger = (
    <Button variant="studio" size="sm" className="w-full justify-start">
      <Mail className="h-4 w-4 mr-2" />
      {variant === "participant" ? t('signup.results.participant') : t('signup.results.investigator')}
    </Button>
  );

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || defaultTrigger}
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Mail className="h-5 w-5" />
            <span>{t('signup.results.title')}</span>
          </DialogTitle>
        </DialogHeader>
        
        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="p-4">
            <p className="text-sm text-blue-800">
              <strong>{t('signup.results.what.receive')}</strong><br/>
              {t('signup.results.description')}
            </p>
          </CardContent>
        </Card>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-3">
            <Label>{t('signup.results.email.label')}</Label>
            {emails.map((email, index) => (
              <div key={index} className="flex space-x-2">
                <Input
                  type="email"
                  placeholder={t('signup.results.email.placeholder')}
                  value={email}
                  onChange={(e) => updateEmail(index, e.target.value)}
                  className="flex-1"
                />
                {emails.length > 1 && (
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={() => removeEmailField(index)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>
            ))}
          </div>

          <Button
            type="button"
            variant="outline"
            onClick={addEmailField}
            className="w-full"
          >
            <Plus className="h-4 w-4 mr-2" />
            {t('signup.results.add.email')}
          </Button>

          <div className="flex space-x-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              className="flex-1"
            >
              {t('common.cancel')}
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="flex-1"
            >
              {isSubmitting ? (
                <>{t('signup.results.registering')}</>
              ) : (
                <>
                  <Send className="h-4 w-4 mr-2" />
                  {t('signup.results.register')}
                </>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default StudyResultsSignup;