import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  FileCheck, 
  Search, 
  Clock, 
  CheckCircle, 
  AlertTriangle,
  Eye,
  PenTool
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useStudy } from "@/contexts/StudyContext";
import { useLanguage } from "@/contexts/LanguageContext";
import EConsentDialog from "./EConsentDialog";
import CredentialVerificationDialog from "./CredentialVerificationDialog";

interface ConsentSignature {
  consent_id: string;
  participant_id: string;
  participant_name: string;
  subject_id: string;
  consent_type: string;
  participant_signed_at: string;
  days_pending: number;
}

interface InvestigatorConsentDashboardProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function InvestigatorConsentDashboard({
  open,
  onOpenChange
}: InvestigatorConsentDashboardProps) {
  const [pendingSignatures, setPendingSignatures] = useState<ConsentSignature[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const [selectedConsent, setSelectedConsent] = useState<ConsentSignature | null>(null);
  const [showConsentDialog, setShowConsentDialog] = useState(false);
  const [showCredentialDialog, setShowCredentialDialog] = useState(false);
  const [consentToSign, setConsentToSign] = useState<ConsentSignature | null>(null);
  const { user } = useAuth();
  const { selectedStudy } = useStudy();
  const { t } = useLanguage();

  useEffect(() => {
    if (open && user?.id) {
      fetchMockPendingSignatures();
    }
  }, [open, user?.id, selectedStudy?.id]);

  const fetchMockPendingSignatures = () => {
    setLoading(true);
    
    // Simulate API delay
    setTimeout(() => {
      const mockSignatures: ConsentSignature[] = [
        {
          consent_id: "mock-1",
          participant_id: "p-001",
          participant_name: "Sarah Johnson",
          subject_id: "S001",
          consent_type: "main_icf",
          participant_signed_at: "2025-07-05T10:30:00Z",
          days_pending: 8
        },
        {
          consent_id: "mock-2",
          participant_id: "p-002",
          participant_name: "Michael Chen",
          subject_id: "S007",
          consent_type: "pharmacokinetics",
          participant_signed_at: "2025-07-08T14:15:00Z",
          days_pending: 5
        },
        {
          consent_id: "mock-3",
          participant_id: "p-003",
          participant_name: "Maria Rodriguez",
          subject_id: "S012",
          consent_type: "biomarkers",
          participant_signed_at: "2025-07-10T09:45:00Z",
          days_pending: 3
        },
        {
          consent_id: "mock-4",
          participant_id: "p-004",
          participant_name: "David Thompson",
          subject_id: "S004",
          consent_type: "main_icf",
          participant_signed_at: "2025-07-03T16:20:00Z",
          days_pending: 10
        },
        {
          consent_id: "mock-5",
          participant_id: "p-005",
          participant_name: "Emma Wilson",
          subject_id: "S018",
          consent_type: "biomarkers",
          participant_signed_at: "2025-07-11T11:30:00Z",
          days_pending: 2
        }
      ];
      
      setPendingSignatures(mockSignatures);
      setLoading(false);
    }, 800);
  };

  const filteredSignatures = pendingSignatures.filter(signature =>
    signature.participant_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    signature.subject_id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getConsentTypeLabel = (type: string) => {
    const labels = {
      'main_icf': t('consent.type.main.icf'),
      'pharmacokinetics': t('consent.type.pharmacokinetics'),
      'biomarkers': t('consent.type.biomarkers'),
      'pregnant_partner': t('consent.type.pregnant.partner')
    };
    return labels[type as keyof typeof labels] || type;
  };

  const getPriorityBadge = (daysPending: number) => {
    if (daysPending >= 7) {
      return <Badge variant="destructive" className="flex items-center gap-1">
        <AlertTriangle className="h-3 w-3" />
        {t('consent.dashboard.urgent')}
      </Badge>;
    } else if (daysPending >= 3) {
      return <Badge variant="outline" className="border-orange-500 text-orange-500">
        {t('consent.dashboard.high.priority')}
      </Badge>;
    }
    return <Badge variant="secondary">{t('consent.dashboard.normal')}</Badge>;
  };

  const handleViewConsent = (consent: ConsentSignature) => {
    setSelectedConsent(consent);
    setShowConsentDialog(true);
  };

  const handleSignConsent = (consent: ConsentSignature) => {
    setConsentToSign(consent);
    setShowCredentialDialog(true);
  };

  const handleCredentialSuccess = () => {
    if (consentToSign) {
      // Remove the signed consent from pending list (simulate signature)
      setPendingSignatures(prev => 
        prev.filter(sig => sig.consent_id !== consentToSign.consent_id)
      );
      
      // Show success message
      setTimeout(() => {
        alert(`✅ Consent signed successfully for ${consentToSign.participant_name}!`);
      }, 300);
      
      setConsentToSign(null);
    }
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-5xl w-[95vw] max-h-[85vh] overflow-hidden bg-studio-surface border-studio-border">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-studio-text">
              <FileCheck className="h-5 w-5 text-studio-accent" />
              {t('consent.dashboard.title')}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-6">
            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card className="bg-studio-bg border-studio-border">
                <CardContent className="p-4">
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-orange-500" />
                    <div>
                      <p className="text-sm text-studio-text-muted">{t('consent.dashboard.pending')}</p>
                      <p className="text-xl font-semibold text-studio-text">
                        {pendingSignatures.length}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-studio-bg border-studio-border">
                <CardContent className="p-4">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4 text-red-500" />
                    <div>
                      <p className="text-sm text-studio-text-muted">{t('consent.dashboard.urgent')}</p>
                      <p className="text-xl font-semibold text-studio-text">
                        {pendingSignatures.filter(s => s.days_pending >= 7).length}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-studio-bg border-studio-border">
                <CardContent className="p-4">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <div>
                      <p className="text-sm text-studio-text-muted">{t('consent.dashboard.avg.days')}</p>
                      <p className="text-xl font-semibold text-studio-text">
                        {pendingSignatures.length > 0 
                          ? Math.round(pendingSignatures.reduce((sum, s) => sum + s.days_pending, 0) / pendingSignatures.length)
                          : 0
                        }
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-studio-text-muted" />
              <Input
                placeholder={t('consent.dashboard.search.placeholder')}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-studio-bg border-studio-border text-studio-text"
              />
            </div>

            {/* Signatures List */}
            <div className="space-y-3 max-h-64 overflow-y-auto">
              {loading ? (
                <div className="text-center py-8 text-studio-text-muted">
                  {t('common.loading')}
                </div>
              ) : filteredSignatures.length === 0 ? (
                <div className="text-center py-8">
                  <FileCheck className="h-12 w-12 text-studio-text-muted mx-auto mb-4" />
                  <p className="text-studio-text-muted">
                    {searchTerm ? t('consent.dashboard.no.results') : t('consent.dashboard.no.pending')}
                  </p>
                </div>
              ) : (
                filteredSignatures.map((signature) => (
                  <Card key={signature.consent_id} className="bg-studio-bg border-studio-border">
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start">
                        <div className="space-y-2">
                          <div className="flex items-center gap-3">
                            <h3 className="font-medium text-studio-text">
                              {signature.participant_name}
                            </h3>
                            <Badge variant="outline" className="text-xs">
                              {signature.subject_id}
                            </Badge>
                            {getPriorityBadge(signature.days_pending)}
                          </div>

                          <div className="flex items-center gap-4 text-sm text-studio-text-muted">
                            <span>{getConsentTypeLabel(signature.consent_type)}</span>
                            <span>•</span>
                            <span>
                              {t('consent.dashboard.signed.on')} {' '}
                              {new Date(signature.participant_signed_at).toLocaleDateString()}
                            </span>
                            <span>•</span>
                            <span>
                              {signature.days_pending} {t('consent.dashboard.days.pending')}
                            </span>
                          </div>
                        </div>

                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleViewConsent(signature)}
                            className="border-studio-border text-studio-text hover:bg-studio-surface"
                          >
                            <Eye className="h-4 w-4 mr-1" />
                            {t('consent.dashboard.view')}
                          </Button>
                          <Button
                            size="sm"
                            onClick={() => handleSignConsent(signature)}
                            className="bg-studio-accent hover:bg-studio-accent/90 text-white"
                          >
                            <PenTool className="h-4 w-4 mr-1" />
                            {t('consent.dashboard.sign')}
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Consent Signature Dialog */}
      {selectedConsent && (
        <EConsentDialog
          open={showConsentDialog}
          onOpenChange={setShowConsentDialog}
          mode="view"
        />
      )}

      {/* Credential Verification Dialog */}
      <CredentialVerificationDialog
        open={showCredentialDialog}
        onOpenChange={setShowCredentialDialog}
        onSuccess={handleCredentialSuccess}
        title={t('consent.dashboard.reauth.title')}
        description={t('consent.dashboard.reauth.description')}
      />
    </>
  );
}