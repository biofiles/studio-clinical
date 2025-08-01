import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { User, Calendar, FileText, Activity, AlertTriangle, Signature, Clock } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useStudy } from "@/contexts/StudyContext";
import { formatDate } from "@/lib/utils";

interface ParticipantDetailViewProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  participantId: string | null;
}

const ParticipantDetailView = ({ open, onOpenChange, participantId }: ParticipantDetailViewProps) => {
  const { t, language } = useLanguage();
  const { selectedStudy } = useStudy();

  if (!participantId || !selectedStudy) return null;

  // Generate dynamic participant data based on study and participant ID
  const generateParticipantData = (patientId: string, studyId: string) => {
    const studyConfigs = {
      '1': { // PARADIGM-CV
        prefix: 'S',
        tokenPrefix: 'NVS',
        baseCompliance: 95,
        totalQuestionnaires: 14,
        totalVisits: 12,
        studyName: 'PARADIGM-CV'
      },
      '2': { // ATLAS-DM2
        prefix: 'P',
        tokenPrefix: 'PF',
        baseCompliance: 90,
        totalQuestionnaires: 9,
        totalVisits: 10,
        studyName: 'ATLAS-DM2'
      },
      '3': { // HORIZON-Onc
        prefix: 'H',
        tokenPrefix: 'RO',
        baseCompliance: 88,
        totalQuestionnaires: 7,
        totalVisits: 8,
        studyName: 'HORIZON-Onc'
      },
      '4': { // GUARDIAN-Ped
        prefix: 'G',
        tokenPrefix: 'JNJ',
        baseCompliance: 96,
        totalQuestionnaires: 12,
        totalVisits: 14,
        studyName: 'GUARDIAN-Ped'
      }
    };

    const config = studyConfigs[studyId as keyof typeof studyConfigs];
    if (!config) return null;

    // Generate consistent data based on participant ID
    const idNum = parseInt(patientId.replace(/\D/g, '')) || 1;
    const seed = idNum * 1000 + parseInt(studyId);
    
    // Generate deterministic random values
    const random = (min: number, max: number) => {
      const x = Math.sin(seed * (min + max)) * 10000;
      return Math.floor((x - Math.floor(x)) * (max - min + 1)) + min;
    };

    const ages = [24, 29, 32, 45, 52, 58, 61, 67, 72];
    const genders = ['Male', 'Female'];
    const ethnicities = ['Caucasian', 'Hispanic/Latino', 'African American', 'Asian', 'Native American'];
    
    const baseDate = new Date('2025-05-01');
    const enrollmentOffset = random(0, 60) * 24 * 60 * 60 * 1000;
    const enrollmentDate = new Date(baseDate.getTime() + enrollmentOffset);
    
    const lastVisitOffset = random(1, 30) * 24 * 60 * 60 * 1000;
    const lastVisit = new Date(Date.now() - lastVisitOffset);
    
    const nextVisitOffset = random(3, 14) * 24 * 60 * 60 * 1000;
    const nextVisit = new Date(Date.now() + nextVisitOffset);

    const compliance = Math.max(75, config.baseCompliance + random(-10, 8));
    const questionnairesCompleted = Math.floor((config.totalQuestionnaires * compliance) / 100);
    const visitsCompleted = Math.floor((config.totalVisits * (compliance + 5)) / 100);
    
    const visitStatuses: Array<'completed' | 'scheduled' | 'overdue'> = ['completed', 'scheduled', 'overdue'];
    const visitStatus = compliance < 85 ? 'overdue' : visitStatuses[random(0, 1)];
    
    const icfVersions = ['v2.0', 'v2.1', 'v2.2'];
    const icfVersion = icfVersions[random(0, icfVersions.length - 1)];
    const icfStatus = compliance < 85 && random(0, 1) === 0 ? 'Re-consent Required' : 'Signed';

    return {
      patientId,
      token: `${config.tokenPrefix}-${random(1000, 9999)}-${String.fromCharCode(65 + random(0, 25))}${String.fromCharCode(65 + random(0, 25))}${random(0, 9)}`,
      enrollmentDate: enrollmentDate.toISOString().split('T')[0],
      lastVisit: lastVisit.toISOString().split('T')[0],
      nextVisit: nextVisit.toISOString().split('T')[0],
      questionnairesCompleted,
      questionnairesTotal: config.totalQuestionnaires,
      visitStatus,
      complianceRate: compliance,
      demographics: {
        age: ages[random(0, ages.length - 1)],
        gender: genders[random(0, genders.length - 1)],
        ethnicity: ethnicities[random(0, ethnicities.length - 1)]
      },
      icfDetails: {
        version: icfVersion,
        signedDate: enrollmentDate.toISOString().split('T')[0],
        status: icfStatus
      },
      studyProgress: {
        visitsCompleted,
        visitsTotal: config.totalVisits,
        questionnairesCompleted,
        questionnairesTotal: config.totalQuestionnaires,
        complianceRate: compliance
      }
    };
  };

  const participant = generateParticipantData(participantId, selectedStudy.id);
  if (!participant) return null;

  const participantDetails = {
    ...participant,
    status: "Active",
    contact: {
      phone: "(555) 123-4567",
      email: "participant@example.com",
      preferredContact: "Email"
    },
    studyProgress: participant.studyProgress,
    recentActivity: [
      { date: "2025-08-15", activityKey: "activity.site.visit.blood.draw", type: "visit" },
      { date: "2025-08-20", activityKey: "activity.weekly.survey", type: "questionnaire" },
      { date: "2025-08-25", activityKey: "activity.follow.up.call", type: "call" },
      { date: "2025-08-28", activityKey: "activity.safety.assessment", type: "questionnaire" }
    ],
    upcomingEvents: [
      { date: "2025-09-05", activityKey: "activity.site.visit", time: "2:00 PM" },
      { date: "2025-09-12", activityKey: "activity.weekly.survey.due", time: "End of day" }
    ],
    alerts: participant.visitStatus === 'overdue' 
      ? [
          { type: "warning", message: t('details.visit.overdue') },
          { type: "info", message: t('details.monthly.assessment') }
        ]
      : participant.complianceRate < 90
      ? [
          { type: "info", message: t('details.monthly.assessment') }
        ]
      : participant.icfDetails.status === "Re-consent Required"
      ? [
          { type: "warning", message: "ICF re-consent required - version update available" }
        ]
      : []
  };

  const getActivityTypeColor = (type: string) => {
    switch (type) {
      case 'visit': return 'bg-red-100 text-red-800';
      case 'questionnaire': return 'bg-blue-100 text-blue-800';
      case 'call': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'scheduled': return 'bg-blue-100 text-blue-800';
      case 'overdue': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getICFStatusColor = (status: string) => {
    switch (status) {
      case 'Signed': return 'bg-green-100 text-green-800';
      case 'Re-consent Required': return 'bg-orange-100 text-orange-800';
      case 'Pending': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <User className="h-5 w-5" />
            <span>{t('details.title')} - {participantId}</span>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Alert Section */}
          {participantDetails.alerts.length > 0 && (
            <Card className="border-orange-200 bg-orange-50">
              <CardHeader>
                <CardTitle className="text-sm flex items-center space-x-2">
                  <AlertTriangle className="h-4 w-4 text-orange-600" />
                  <span>{t('details.alerts')}</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {participantDetails.alerts.map((alert, index) => (
                  <div key={index} className="text-sm text-orange-800">
                    • {alert.message}
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">{t('details.basic.info')}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-studio-text-muted">{t('participant.patient.id')}:</span>
                  <span className="font-semibold">{participantDetails.patientId}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-studio-text-muted">Token:</span>
                  <code className="font-mono text-sm">{participantDetails.token}</code>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-studio-text-muted">{t('participant.enrollment')} Date:</span>
                  <span>{formatDate(participantDetails.enrollmentDate, language)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-studio-text-muted">{t('participant.visit.status')}:</span>
                  <Badge className={getStatusColor(participantDetails.visitStatus)}>
                    {t(`status.${participantDetails.visitStatus}`)}
                  </Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-studio-text-muted">{t('participant.last.visit')}:</span>
                  <span>{formatDate(participantDetails.lastVisit, language)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-studio-text-muted">{t('participant.next.visit')}:</span>
                  <span>{formatDate(participantDetails.nextVisit, language)}</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-sm">{t('details.demographics')}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-studio-text-muted">{t('details.age')}:</span>
                  <span>{participantDetails.demographics.age}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-studio-text-muted">{t('details.gender')}:</span>
                  <span>{t(`demographics.${participantDetails.demographics.gender.toLowerCase()}`)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-studio-text-muted">{t('details.ethnicity')}:</span>
                  <span>{(() => {
                    const ethnicity = participantDetails.demographics.ethnicity;
                    const mapping: Record<string, string> = {
                      'Caucasian': 'caucasian',
                      'Hispanic/Latino': 'hispanic',
                      'African American': 'african.american',
                      'Asian': 'asian',
                      'Native American': 'native.american'
                    };
                    return t(`demographics.${mapping[ethnicity] || ethnicity.toLowerCase()}`);
                  })()}</span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* ICF Information */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm flex items-center space-x-2">
                <Signature className="h-4 w-4" />
                <span>{t('details.icf.title')}</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-studio-text-muted">{t('details.icf.version')}:</span>
                <code className="font-mono text-sm bg-gray-100 px-2 py-1 rounded">{participantDetails.icfDetails.version}</code>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-studio-text-muted">{t('details.icf.signed.date')}:</span>
                <span>{formatDate(participantDetails.icfDetails.signedDate, language)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-studio-text-muted">{t('details.icf.status')}:</span>
                <Badge className={getICFStatusColor(participantDetails.icfDetails.status)}>
                  {(() => {
                    const status = participantDetails.icfDetails.status;
                    const mapping: Record<string, string> = {
                      'Signed': 'icf.status.signed',
                      'Re-consent Required': 'icf.status.re-consent-required',
                      'Pending': 'icf.status.pending'
                    };
                    return t(mapping[status] || status);
                  })()}
                </Badge>
              </div>
              {participantDetails.icfDetails.status === "Re-consent Required" && (
                <div className="bg-orange-50 border border-orange-200 rounded p-2 text-xs text-orange-800">
                  <strong>{t('details.icf.action.required')}:</strong> {t('details.icf.updated.schedule')}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Study Progress */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm flex items-center space-x-2">
                <Activity className="h-4 w-4" />
                <span>{t('details.study.progress')}</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                 <div className="text-center">
                   <div className="text-2xl font-bold text-blue-600">
                     {participantDetails.studyProgress.visitsCompleted}/{participantDetails.studyProgress.visitsTotal}
                   </div>
                   <div className="text-sm text-studio-text-muted">{t('dashboard.site.visits')}</div>
                   <div className="w-full bg-muted rounded-full h-2 mt-2">
                     <div 
                       className="bg-progress-info h-2 rounded-full" 
                       style={{ 
                         width: `${(participantDetails.studyProgress.visitsCompleted / participantDetails.studyProgress.visitsTotal) * 100}%` 
                       }}
                     ></div>
                   </div>
                 </div>
                 <div className="text-center">
                   <div className="text-2xl font-bold text-green-600">
                     {participantDetails.studyProgress.questionnairesCompleted}/{participantDetails.studyProgress.questionnairesTotal}
                   </div>
                   <div className="text-sm text-studio-text-muted">{t('dashboard.questionnaires')}</div>
                   <div className="w-full bg-muted rounded-full h-2 mt-2">
                     <div 
                       className="bg-progress-success h-2 rounded-full" 
                       style={{ 
                         width: `${(participantDetails.studyProgress.questionnairesCompleted / participantDetails.studyProgress.questionnairesTotal) * 100}%` 
                       }}
                     ></div>
                   </div>
                 </div>
                 <div className="text-center">
                   <div className="text-2xl font-bold text-purple-600">
                     {participantDetails.studyProgress.complianceRate}%
                   </div>
                   <div className="text-sm text-studio-text-muted">{t('participant.compliance')}</div>
                   <div className="w-full bg-muted rounded-full h-2 mt-2">
                     <div 
                       className="bg-progress-accent h-2 rounded-full" 
                       style={{ 
                         width: `${participantDetails.studyProgress.complianceRate}%` 
                       }}
                     ></div>
                   </div>
                 </div>
              </div>
            </CardContent>
          </Card>

          {/* Recent Activity & Upcoming Events */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-sm flex items-center space-x-2">
                  <FileText className="h-4 w-4" />
                  <span>{t('details.recent.activity')}</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {participantDetails.recentActivity.map((activity, index) => (
                  <div key={index} className="flex items-center justify-between p-2 bg-studio-bg rounded">
                    <div>
                      <div className="font-medium text-sm">{t(activity.activityKey)}</div>
                      <div className="text-xs text-studio-text-muted">
                        {formatDate(activity.date, language)}
                      </div>
                    </div>
                    <Badge className={getActivityTypeColor(activity.type)}>
                      {t(`activity.${activity.type}`)}
                    </Badge>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-sm flex items-center space-x-2">
                  <Calendar className="h-4 w-4" />
                  <span>{t('details.upcoming.events')}</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {participantDetails.upcomingEvents.map((event, index) => (
                  <div key={index} className="flex items-center justify-between p-2 bg-studio-bg rounded">
                    <div>
                      <div className="font-medium text-sm">{t(event.activityKey)}</div>
                      <div className="text-xs text-studio-text-muted">
                        {formatDate(event.date, language)} at {event.time}
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ParticipantDetailView;
