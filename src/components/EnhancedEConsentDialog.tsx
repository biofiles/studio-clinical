import { useState, useRef, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { FileText, PenTool, CheckCircle, Info, Clock, User } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import CredentialVerificationDialog from "./CredentialVerificationDialog";

interface EConsentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mode?: 'participant' | 'investigator-sign' | 'investigator-view';
  consentId?: string;
  participantId?: string;
  onSuccess?: () => void;
}

interface ConsentSignatureData {
  id: string;
  study_id: string;
  participant_signature_data: string | null;
  participant_full_name: string | null;
  participant_signed_at: string | null;
  investigator_signature_data: string | null;
  investigator_full_name: string | null;
  investigator_signed_at: string | null;
  status: string;
  consent_type: string;
  participant_name?: string;
}

export default function EnhancedEConsentDialog({ 
  open, 
  onOpenChange, 
  mode = 'participant',
  consentId,
  participantId,
  onSuccess 
}: EConsentDialogProps) {
  const [signature, setSignature] = useState("");
  const [fullName, setFullName] = useState("");
  const [isAgreed, setIsAgreed] = useState(false);
  const [meaningAcknowledged, setMeaningAcknowledged] = useState(false);
  const [isDrawing, setIsDrawing] = useState(false);
  const [showCredentialVerification, setShowCredentialVerification] = useState(false);
  const [consentData, setConsentData] = useState<ConsentSignatureData | null>(null);
  const [loading, setLoading] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { toast } = useToast();
  const { t } = useLanguage();
  const { user } = useAuth();

  useEffect(() => {
    if (open && (mode === 'investigator-sign' || mode === 'investigator-view') && consentId) {
      fetchConsentData();
    }
  }, [open, mode, consentId]);

  const fetchConsentData = async () => {
    if (!consentId) return;

    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('consent_signatures')
        .select(`
          *,
          participants!inner(first_name, last_name)
        `)
        .eq('id', consentId)
        .single();

      if (error) throw error;

      const participantName = data.participants 
        ? `${data.participants.first_name} ${data.participants.last_name}`
        : 'Unknown Participant';

      setConsentData({
        ...data,
        participant_name: participantName
      });
    } catch (error) {
      console.error('Error fetching consent data:', error);
      toast({
        title: t('common.error'),
        description: 'Error loading consent data',
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const consentTypes = [
    {
      id: "main-icf",
      title: t('consent.type.main.icf'),
      description: "Primary study consent covering all main procedures"
    },
    {
      id: "pharmacokinetics", 
      title: t('consent.type.pharmacokinetics'),
      description: "Optional blood sampling for drug level analysis"
    },
    {
      id: "biomarkers",
      title: t('consent.type.biomarkers'), 
      description: "Optional biomarker and genetic testing"
    },
    {
      id: "pregnant-partner",
      title: t('consent.type.pregnant.partner'),
      description: "For male participants with pregnant partners"
    }
  ];

  // Canvas drawing functions
  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    setIsDrawing(true);
    const canvas = canvasRef.current;
    if (canvas) {
      const rect = canvas.getBoundingClientRect();
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.beginPath();
        ctx.moveTo(e.clientX - rect.left, e.clientY - rect.top);
      }
    }
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (canvas) {
      const rect = canvas.getBoundingClientRect();
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.lineTo(e.clientX - rect.left, e.clientY - rect.top);
        ctx.stroke();
      }
    }
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const clearSignature = () => {
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      }
    }
    setSignature("");
  };

  const captureSignature = () => {
    const canvas = canvasRef.current;
    if (canvas) {
      const dataURL = canvas.toDataURL();
      setSignature(dataURL);
    }
  };

  const resetForm = () => {
    setSignature("");
    setFullName("");
    setIsAgreed(false);
    setMeaningAcknowledged(false);
    clearSignature();
  };

  const handleSubmit = () => {
    if (mode === 'participant') {
      handleParticipantSignature();
    } else if (mode === 'investigator-sign') {
      handleInvestigatorSignature();
    }
  };

  const handleParticipantSignature = () => {
    if (!signature || !fullName || !isAgreed || !meaningAcknowledged) {
      toast({
        title: t('common.error'),
        description: t('econsent.all.fields.required'),
        variant: "destructive",
      });
      return;
    }

    setShowCredentialVerification(true);
  };

  const handleInvestigatorSignature = () => {
    if (!signature || !fullName || !meaningAcknowledged) {
      toast({
        title: t('common.error'),
        description: t('econsent.all.fields.required'),
        variant: "destructive",
      });
      return;
    }

    setShowCredentialVerification(true);
  };

  const handleCredentialVerified = async () => {
    try {
      captureSignature();
      
      if (mode === 'participant') {
        await saveParticipantSignature();
      } else if (mode === 'investigator-sign') {
        await saveInvestigatorSignature();
      }

      toast({
        title: t('common.success'),
        description: t('signature.success'),
      });

      onOpenChange(false);
      resetForm();
      onSuccess?.();
    } catch (error) {
      console.error('Error saving signature:', error);
      toast({
        title: t('common.error'),
        description: 'Error saving signature',
        variant: "destructive",
      });
    }
  };

  const saveParticipantSignature = async () => {
    if (!participantId || !user?.id) throw new Error('Missing required data');

    const { error } = await supabase
      .from('consent_signatures')
      .insert({
        participant_id: participantId,
        study_id: consentData?.study_id,
        consent_type: 'main_icf',
        participant_signature_data: signature,
        participant_full_name: fullName,
        participant_signed_at: new Date().toISOString(),
        participant_auth_timestamp: new Date().toISOString(),
        participant_ip_address: '0.0.0.0', // Would be populated server-side
        signature_meaning_acknowledged: meaningAcknowledged,
        status: 'participant_signed'
      });

    if (error) throw error;
  };

  const saveInvestigatorSignature = async () => {
    if (!consentId || !user?.id) throw new Error('Missing required data');

    const { error } = await supabase
      .from('consent_signatures')
      .update({
        investigator_signature_data: signature,
        investigator_full_name: fullName,
        investigator_signed_at: new Date().toISOString(),
        investigator_user_id: user.id,
        investigator_auth_timestamp: new Date().toISOString(),
        investigator_ip_address: '0.0.0.0', // Would be populated server-side
        investigator_meaning_acknowledged: meaningAcknowledged,
        status: 'complete'
      })
      .eq('id', consentId);

    if (error) throw error;
  };

  const getDialogTitle = () => {
    if (mode === 'investigator-sign') {
      return t('investigator.signature.title');
    } else if (mode === 'investigator-view') {
      return t('consent.dashboard.view');
    }
    return t('econsent.title');
  };

  // Initialize canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.strokeStyle = '#000';
        ctx.lineWidth = 2;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
      }
    }
  }, []);

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-studio-surface border-studio-border">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-studio-text">
              <FileText className="h-5 w-5 text-studio-accent" />
              {getDialogTitle()}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-6">
            {/* Investigator Mode: Show Participant Signature */}
            {(mode === 'investigator-sign' || mode === 'investigator-view') && consentData && (
              <Card className="bg-studio-bg border-studio-border">
                <CardContent className="p-6 space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-studio-text">
                      {t('investigator.signature.participant.signed')}
                    </h3>
                    <Badge variant="secondary" className="bg-green-100 text-green-800">
                      <CheckCircle className="h-3 w-3 mr-1" />
                      {t('common.completed')}
                    </Badge>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <Label className="text-studio-text-muted">{t('signature.name.label')}</Label>
                      <p className="font-medium text-studio-text">{consentData.participant_full_name}</p>
                    </div>
                    <div>
                      <Label className="text-studio-text-muted">{t('consent.dashboard.signed.on')}</Label>
                      <p className="font-medium text-studio-text">
                        {consentData.participant_signed_at 
                          ? new Date(consentData.participant_signed_at).toLocaleString()
                          : 'N/A'
                        }
                      </p>
                    </div>
                  </div>

                  {consentData.participant_signature_data && (
                    <div>
                      <Label className="text-studio-text-muted">{t('signature.canvas.label')}</Label>
                      <div className="border border-studio-border rounded p-4 bg-white">
                        <img 
                          src={consentData.participant_signature_data} 
                          alt="Participant Signature"
                          className="max-w-full h-auto"
                        />
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Consent Document */}
            <Card className="bg-studio-bg border-studio-border">
              <CardContent className="p-6 space-y-4">
                <h3 className="text-lg font-semibold text-studio-text">{t('econsent.document.title')}</h3>
                
                <div className="space-y-4 text-sm text-studio-text leading-relaxed max-h-60 overflow-y-auto bg-studio-surface p-4 rounded border border-studio-border">
                  <p className="font-medium">{t('econsent.research.title')}</p>
                  <p>{t('econsent.research.description')}</p>
                  
                  <p className="font-medium">{t('econsent.purpose.title')}</p>
                  <p>{t('econsent.purpose.description')}</p>
                  
                  <p className="font-medium">{t('econsent.procedures.title')}</p>
                  <p>{t('econsent.procedures.description')}</p>
                  
                  <p className="font-medium">{t('econsent.risks.title')}</p>
                  <p>{t('econsent.risks.description')}</p>
                  
                  <p className="font-medium">{t('econsent.benefits.title')}</p>
                  <p>{t('econsent.benefits.description')}</p>
                  
                  <p className="font-medium">{t('econsent.confidentiality.title')}</p>
                  <p>{t('econsent.confidentiality.description')}</p>
                  
                  <p className="font-medium">{t('econsent.participation.title')}</p>
                  <p>{t('econsent.participation.description')}</p>
                  
                  <p className="font-medium">{t('econsent.contact.title')}</p>
                  <p>{t('econsent.contact.description')}</p>
                </div>
                
                {/* Consent Type Selection - Only for participant mode */}
                {mode === 'participant' && (
                  <div className="space-y-3">
                    <h4 className="font-medium text-studio-text">{t('econsent.consent.types')}</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {consentTypes.map((type) => (
                        <Card key={type.id} className="bg-studio-surface border-studio-border">
                          <CardContent className="p-4">
                            <div className="flex items-start space-x-3">
                              <Checkbox
                                id={type.id}
                                className="mt-1"
                              />
                              <div>
                                <Label 
                                  htmlFor={type.id} 
                                  className="text-sm font-medium text-studio-text cursor-pointer"
                                >
                                  {type.title}
                                </Label>
                                <p className="text-xs text-studio-text-muted mt-1">
                                  {type.description}
                                </p>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Signature Meaning */}
            <Card className="bg-studio-bg border-studio-border">
              <CardContent className="p-6 space-y-4">
                <div className="flex items-center gap-2">
                  <Info className="h-5 w-5 text-studio-accent" />
                  <h3 className="text-lg font-semibold text-studio-text">{t('signature.meaning.title')}</h3>
                </div>

                <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
                  <p className="text-sm text-studio-text mb-3">{t('signature.meaning.text')}</p>
                  <div className="space-y-2 text-sm text-studio-text">
                    <p>{t('signature.meaning.point1')}</p>
                    <p>{t('signature.meaning.point2')}</p>
                    <p>{t('signature.meaning.point3')}</p>
                    <p>{t('signature.meaning.point4')}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <Checkbox
                    id="meaning-acknowledged"
                    checked={meaningAcknowledged}
                    onCheckedChange={(checked) => setMeaningAcknowledged(checked as boolean)}
                  />
                  <Label htmlFor="meaning-acknowledged" className="text-sm text-studio-text cursor-pointer">
                    {t('signature.meaning.acknowledge')}
                  </Label>
                </div>
              </CardContent>
            </Card>

            {/* Agreement Checkbox - Only for participant mode */}
            {mode === 'participant' && (
              <Card className="bg-studio-bg border-studio-border">
                <CardContent className="p-4">
                  <div className="flex items-start space-x-3">
                    <Checkbox
                      id="agreement"
                      checked={isAgreed}
                      onCheckedChange={(checked) => setIsAgreed(checked as boolean)}
                    />
                    <Label htmlFor="agreement" className="text-sm text-studio-text cursor-pointer leading-relaxed">
                      {t('econsent.agreement.text')}
                    </Label>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Investigator Review Checkboxes */}
            {mode === 'investigator-sign' && (
              <Card className="bg-studio-bg border-studio-border">
                <CardContent className="p-4 space-y-3">
                  <div className="flex items-start space-x-3">
                    <Checkbox
                      id="review-complete"
                      checked={isAgreed}
                      onCheckedChange={(checked) => setIsAgreed(checked as boolean)}
                    />
                    <Label htmlFor="review-complete" className="text-sm text-studio-text cursor-pointer leading-relaxed">
                      {t('investigator.signature.review.complete')}
                    </Label>
                  </div>
                  <div className="flex items-start space-x-3">
                    <Checkbox
                      id="confirm-consent"
                      checked={isAgreed}
                      onCheckedChange={(checked) => setIsAgreed(checked as boolean)}
                    />
                    <Label htmlFor="confirm-consent" className="text-sm text-studio-text cursor-pointer leading-relaxed">
                      {t('investigator.signature.acknowledge')}
                    </Label>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Electronic Signature */}
            {mode !== 'investigator-view' && (
              <Card className="bg-studio-bg border-studio-border">
                <CardContent className="p-6 space-y-4">
                  <div className="flex items-center gap-2">
                    <PenTool className="h-5 w-5 text-studio-accent" />
                    <h3 className="text-lg font-semibold text-studio-text">{t('signature.required')}</h3>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="full-name" className="text-studio-text">
                        {t('signature.name.label')}
                      </Label>
                      <Input
                        id="full-name"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        placeholder={t('signature.name.placeholder')}
                        className="mt-1 bg-studio-surface border-studio-border text-studio-text"
                      />
                    </div>

                    <div>
                      <Label className="text-studio-text">{t('signature.canvas.label')}</Label>
                      <div className="border-2 border-dashed border-studio-border rounded-lg p-4 bg-white">
                        <canvas
                          ref={canvasRef}
                          width={500}
                          height={200}
                          className="w-full h-32 border border-studio-border rounded cursor-crosshair"
                          onMouseDown={startDrawing}
                          onMouseMove={draw}
                          onMouseUp={stopDrawing}
                          onMouseLeave={stopDrawing}
                        />
                        <div className="flex justify-end mt-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={clearSignature}
                            className="text-studio-text-muted border-studio-border"
                          >
                            {t('common.clear')}
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Actions */}
            {mode !== 'investigator-view' && (
              <div className="flex justify-end space-x-3 pt-4">
                <Button
                  variant="outline"
                  onClick={() => onOpenChange(false)}
                  className="border-studio-border text-studio-text hover:bg-studio-bg"
                >
                  {t('common.cancel')}
                </Button>
                <Button
                  onClick={handleSubmit}
                  disabled={
                    !signature || 
                    !fullName || 
                    !meaningAcknowledged || 
                    (mode === 'participant' && !isAgreed) ||
                    (mode === 'investigator-sign' && !isAgreed)
                  }
                  className="bg-studio-accent hover:bg-studio-accent/90 text-white"
                >
                  <PenTool className="h-4 w-4 mr-2" />
                  {mode === 'investigator-sign' 
                    ? t('investigator.signature.title')
                    : t('econsent.sign.document')
                  }
                </Button>
              </div>
            )}

            {/* View-only mode close button */}
            {mode === 'investigator-view' && (
              <div className="flex justify-end pt-4">
                <Button
                  variant="outline"
                  onClick={() => onOpenChange(false)}
                  className="border-studio-border text-studio-text hover:bg-studio-bg"
                >
                  {t('common.close')}
                </Button>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Credential Verification Dialog */}
      <CredentialVerificationDialog
        open={showCredentialVerification}
        onOpenChange={setShowCredentialVerification}
        onSuccess={handleCredentialVerified}
        title={mode === 'investigator-sign' 
          ? t('investigator.signature.title')
          : t('credential.verification.title')
        }
        description={mode === 'investigator-sign'
          ? t('investigator.signature.description')
          : t('credential.verification.description')
        }
      />
    </>
  );
}