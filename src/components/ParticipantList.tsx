
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useState } from "react";
import { Search, Eye, FileText, Calendar, Barcode, AlertTriangle } from "lucide-react";
import ParticipantDetailView from "./ParticipantDetailView";
import ParticipantScheduler from "./ParticipantScheduler";
import ParticipantQuestionnaires from "./ParticipantQuestionnaires";
import { useLanguage } from "@/contexts/LanguageContext";
import { formatDate } from "@/lib/utils";
import { useStudy } from "@/contexts/StudyContext";

interface ParticipantListProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface Participant {
  patientId: string;
  token: string;
  enrollmentDate: string;
  lastVisit: string;
  nextVisit: string;
  questionnairesCompleted: number;
  questionnairesTotal: number;
  visitStatus: 'completed' | 'scheduled' | 'overdue';
  complianceRate: number;
  hasAlerts: boolean;
}

const ParticipantList = ({ open, onOpenChange }: ParticipantListProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedParticipant, setSelectedParticipant] = useState<string | null>(null);
  const [showDetailView, setShowDetailView] = useState(false);
  const [showScheduler, setShowScheduler] = useState(false);
  const [showQuestionnaires, setShowQuestionnaires] = useState(false);
  const { t, language } = useLanguage();
  const { selectedStudy } = useStudy();

  // Dynamic participant data based on selected study
  const getParticipantsForStudy = (studyId: string | undefined) => {
    if (!studyId) return [];
    
    switch (studyId) {
      case '1': // PARADIGM-CV
        return [
          {
            patientId: "S001",
            token: "NVS-7293-XK4",
            enrollmentDate: "2025-04-12",
            lastVisit: "2025-07-08",
            nextVisit: "2025-07-22",
            questionnairesCompleted: 11,
            questionnairesTotal: 14,
            visitStatus: 'scheduled' as const,
            complianceRate: 97,
            hasAlerts: false
          },
          {
            patientId: "S002",
            token: "NVS-8451-QR7",
            enrollmentDate: "2025-04-18",
            lastVisit: "2025-07-10",
            nextVisit: "2025-08-02",
            questionnairesCompleted: 12,
            questionnairesTotal: 14,
            visitStatus: 'completed' as const,
            complianceRate: 99,
            hasAlerts: false
          },
          {
            patientId: "S003",
            token: "NVS-2839-MN2",
            enrollmentDate: "2025-04-25",
            lastVisit: "2025-06-28",
            nextVisit: "2025-07-15",
            questionnairesCompleted: 9,
            questionnairesTotal: 13,
            visitStatus: 'overdue' as const,
            complianceRate: 86,
            hasAlerts: true
          },
          {
            patientId: "S004",
            token: "NVS-5642-LP3",
            enrollmentDate: "2025-05-03",
            lastVisit: "2025-07-12",
            nextVisit: "2025-07-18",
            questionnairesCompleted: 8,
            questionnairesTotal: 12,
            visitStatus: 'scheduled' as const,
            complianceRate: 93,
            hasAlerts: false
          }
        ];
      case '2': // ATLAS-DM2
        return [
          {
            patientId: "P001",
            token: "PF-4821-DM7",
            enrollmentDate: "2025-05-08",
            lastVisit: "2025-07-11",
            nextVisit: "2025-07-19",
            questionnairesCompleted: 6,
            questionnairesTotal: 9,
            visitStatus: 'scheduled' as const,
            complianceRate: 91,
            hasAlerts: false
          },
          {
            patientId: "P002",
            token: "PF-7394-DM2",
            enrollmentDate: "2025-05-15",
            lastVisit: "2025-07-09",
            nextVisit: "2025-07-24",
            questionnairesCompleted: 7,
            questionnairesTotal: 9,
            visitStatus: 'completed' as const,
            complianceRate: 95,
            hasAlerts: false
          },
          {
            patientId: "P003",
            token: "PF-9157-DM8",
            enrollmentDate: "2025-05-22",
            lastVisit: "2025-07-05",
            nextVisit: "2025-07-28",
            questionnairesCompleted: 5,
            questionnairesTotal: 8,
            visitStatus: 'scheduled' as const,
            complianceRate: 88,
            hasAlerts: true
          }
        ];
      case '3': // HORIZON-Onc
        return [
          {
            patientId: "H001",
            token: "RO-2847-ONC1",
            enrollmentDate: "2025-06-01",
            lastVisit: "2025-07-10",
            nextVisit: "2025-07-20",
            questionnairesCompleted: 4,
            questionnairesTotal: 7,
            visitStatus: 'scheduled' as const,
            complianceRate: 89,
            hasAlerts: false
          },
          {
            patientId: "H002",
            token: "RO-5639-ONC3",
            enrollmentDate: "2025-06-08",
            lastVisit: "2025-07-08",
            nextVisit: "2025-07-23",
            questionnairesCompleted: 3,
            questionnairesTotal: 6,
            visitStatus: 'completed' as const,
            complianceRate: 92,
            hasAlerts: true
          }
        ];
      case '4': // GUARDIAN-Ped
        return [
          {
            patientId: "G001",
            token: "JNJ-7429-PED5",
            enrollmentDate: "2025-05-10",
            lastVisit: "2025-07-12",
            nextVisit: "2025-07-21",
            questionnairesCompleted: 8,
            questionnairesTotal: 10,
            visitStatus: 'scheduled' as const,
            complianceRate: 96,
            hasAlerts: false
          },
          {
            patientId: "G002",
            token: "JNJ-8351-PED2",
            enrollmentDate: "2025-05-17",
            lastVisit: "2025-07-14",
            nextVisit: "2025-07-24",
            questionnairesCompleted: 9,
            questionnairesTotal: 10,
            visitStatus: 'completed' as const,
            complianceRate: 98,
            hasAlerts: false
          },
          {
            patientId: "G003",
            token: "JNJ-6273-PED8",
            enrollmentDate: "2025-05-24",
            lastVisit: "2025-07-06",
            nextVisit: "2025-07-27",
            questionnairesCompleted: 6,
            questionnairesTotal: 9,
            visitStatus: 'scheduled' as const,
            complianceRate: 93,
            hasAlerts: true
          }
        ];
      default:
        return [];
    }
  };

  const participants: Participant[] = getParticipantsForStudy(selectedStudy?.id);

  const filteredParticipants = participants.filter(p =>
    p.patientId.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.token.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'scheduled': return 'bg-blue-100 text-blue-800';
      case 'overdue': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleViewParticipant = (patientId: string) => {
    setSelectedParticipant(patientId);
    setShowDetailView(true);
  };

  const handleViewQuestionnaires = (patientId: string) => {
    setSelectedParticipant(patientId);
    setShowQuestionnaires(true);
  };

  const handleScheduleVisit = (patientId: string) => {
    setSelectedParticipant(patientId);
    setShowScheduler(true);
  };

  const handleBarcodeClick = (token: string) => {
    // Generate a barcode image URL (using a barcode generation service)
    const barcodeUrl = `https://barcode.tec-it.com/barcode.ashx?data=${encodeURIComponent(token)}&code=Code128&dpi=300&dataseparator=`;
    window.open(barcodeUrl, '_blank', 'width=800,height=400');
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-2">
              <Search className="h-5 w-5" />
              <span>{t('participant.management')}</span>
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="flex items-center space-x-4">
              <div className="flex-1">
                <Input
                  placeholder={t('participant.search')}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full"
                />
              </div>
              <div className="text-sm text-studio-text-muted">
                {filteredParticipants.length} {t('participant.of')} {participants.length} {t('participant.participants')}
              </div>
            </div>

            <Card className="bg-studio-surface border-studio-border">
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>{t('participant.patient.id')}</TableHead>
                      <TableHead>Token</TableHead>
                      <TableHead>{t('participant.enrollment')}</TableHead>
                      <TableHead>{t('participant.visit.status')}</TableHead>
                      <TableHead>{t('dashboard.questionnaires')}</TableHead>
                      <TableHead>{t('participant.compliance')}</TableHead>
                      <TableHead>{t('participant.next.visit')}</TableHead>
                      <TableHead>{t('participant.actions')}</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredParticipants.map((participant) => (
                      <TableRow key={participant.patientId}>
                        <TableCell className="font-semibold">
                          {participant.patientId}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() => handleBarcodeClick(participant.token)}
                              className="flex items-center space-x-2 hover:bg-gray-100 p-1 rounded transition-colors cursor-pointer"
                              title={t('participant.barcode.click')}
                            >
                              <Barcode className="h-4 w-4 text-studio-text-muted hover:text-blue-600" />
                              <code className="font-mono text-sm hover:text-blue-600">
                                {participant.token}
                              </code>
                            </button>
                          </div>
                        </TableCell>
                        <TableCell>
                          {formatDate(participant.enrollmentDate, language)}
                        </TableCell>
                        <TableCell>
                          <Badge className={getStatusColor(participant.visitStatus)}>
                            {t(`status.${participant.visitStatus}`)}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {participant.questionnairesCompleted}/{participant.questionnairesTotal}
                          <div className="w-16 bg-gray-200 rounded-full h-1 mt-1">
                            <div 
                              className="bg-blue-600 h-1 rounded-full" 
                              style={{ 
                                width: `${(participant.questionnairesCompleted / participant.questionnairesTotal) * 100}%` 
                              }}
                            ></div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <span className={participant.complianceRate >= 95 ? 'text-green-600' : 
                                         participant.complianceRate >= 85 ? 'text-yellow-600' : 'text-red-600'}>
                            {participant.complianceRate}%
                          </span>
                        </TableCell>
                        <TableCell>
                          {formatDate(participant.nextVisit, language)}
                        </TableCell>
                        <TableCell>
                          <div className="flex space-x-1 relative">
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => handleViewParticipant(participant.patientId)}
                              title={t('participant.view.details')}
                              className="relative"
                            >
                              {participant.hasAlerts && (
                                <div className="absolute -left-5 top-1/2 transform -translate-y-1/2">
                                  <AlertTriangle className="h-4 w-4 text-red-500" />
                                </div>
                              )}
                              <Eye className="h-3 w-3" />
                            </Button>
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => handleViewQuestionnaires(participant.patientId)}
                              title={t('participant.view.questionnaires')}
                            >
                              <FileText className="h-3 w-3" />
                            </Button>
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => handleScheduleVisit(participant.patientId)}
                              title={t('participant.schedule.visit')}
                            >
                              <Calendar className="h-3 w-3" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
        </DialogContent>
      </Dialog>

      {/* Detail View Dialog */}
      <ParticipantDetailView
        open={showDetailView}
        onOpenChange={setShowDetailView}
        participantId={selectedParticipant}
      />

      {/* Schedule Dialog */}
      <ParticipantScheduler
        open={showScheduler}
        onOpenChange={setShowScheduler}
        participantId={selectedParticipant}
      />

      {/* Questionnaires Dialog */}
      <ParticipantQuestionnaires
        open={showQuestionnaires}
        onOpenChange={setShowQuestionnaires}
        participantId={selectedParticipant}
      />
    </>
  );
};

export default ParticipantList;
