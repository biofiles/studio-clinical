import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { FileText, User } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

interface QuestionnaireResponseDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  participantName: string;
  questionnaireTitle: string;
  responses: Record<string, any> | null;
}

const QuestionnaireResponseDialog = ({ 
  open, 
  onOpenChange, 
  participantName, 
  questionnaireTitle, 
  responses 
}: QuestionnaireResponseDialogProps) => {
  const { t } = useLanguage();

  const getResponseKey = (key: string) => {
    const translationKey = `questionnaire.response.${key}`;
    const translated = t(translationKey);
    // If translation doesn't exist, format the key nicely
    return translated === translationKey 
      ? key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())
      : translated;
  };

  const formatResponseValue = (value: any) => {
    if (Array.isArray(value)) {
      return value.map(v => {
        // Try to translate each value if it's a known option
        const optionKey = `questionnaire.option.${v.toLowerCase().replace(/\s+/g, '.')}`;
        const translated = t(optionKey);
        return translated === optionKey ? v : translated;
      }).join(', ');
    }
    
    if (typeof value === 'string') {
      // Try to translate known string values
      const valueKey = `questionnaire.option.${value.toLowerCase().replace(/\s+/g, '.')}`;
      const translated = t(valueKey);
      return translated === valueKey ? value : translated;
    }
    
    return String(value);
  };

  if (!responses) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-2">
              <FileText className="h-5 w-5" />
              <span>{t('questionnaire.list.responses.for')}</span>
            </DialogTitle>
          </DialogHeader>
          <div className="text-center py-6">
            <FileText className="h-12 w-12 text-studio-text-muted mx-auto mb-4" />
            <p className="text-studio-text-muted">{t('questionnaire.list.no.responses')}</p>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <FileText className="h-5 w-5" />
            <span>{t('questionnaire.list.responses.for')}</span>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Participant and Questionnaire Info */}
          <Card className="bg-studio-surface border-studio-border">
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <User className="h-5 w-5 text-studio-text-muted" />
                <div>
                  <div className="font-medium text-studio-text">{participantName}</div>
                  <div className="text-sm text-studio-text-muted">{questionnaireTitle}</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Separator />

          {/* Responses */}
          <div className="space-y-3">
            <h3 className="font-medium text-studio-text mb-3">
              {t('questionnaire.list.view.responses')}
            </h3>
            
            {Object.entries(responses).map(([key, value], index) => (
              <Card key={key} className="bg-studio-bg border-studio-border">
                <CardContent className="p-4">
                  <div className="flex flex-col space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-studio-text">
                        {getResponseKey(key)}
                      </span>
                      {typeof value === 'number' && key === 'severity' && (
                        <Badge variant="outline" className="text-xs">
                          {value}/10
                        </Badge>
                      )}
                    </div>
                    <div className="text-studio-text-muted">
                      {formatResponseValue(value)}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Privacy Note */}
          <div className="text-xs text-studio-text-muted bg-primary/5 p-3 rounded border border-primary/20">
            <strong>{t('questionnaire.list.data.privacy')}:</strong> {t('questionnaire.list.privacy.note')}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default QuestionnaireResponseDialog;