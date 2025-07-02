import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { User, Calendar, FileText, Activity, AlertTriangle, Signature, Clock } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

interface ParticipantDetailViewProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  participantId: string | null;
}

const ParticipantDetailView = ({ open, onOpenChange, participantId }: ParticipantDetailViewProps) => {
  const { t } = useLanguage();

  if (!participantId) return null;

  // Mock participant data with different demographics for each participant
  const participantData = {
    P001: {
      patientId: "P001",
      token: "PTK-9283-WZ1",
      enrollmentDate: "2024-10-15",
      lastVisit: "2024-12-01",
      nextVisit: "2024-12-15",
      questionnairesCompleted: 8,
      questionnairesTotal: 10,
      visitStatus: 'scheduled' as const,
      complianceRate: 96,
      demographics: {
        age: 45,
        gender: "Female",
        ethnicity: "Hispanic/Latino"
      },
      icfDetails: {
        version: "v2.1",
        signedDate: "2024-10-15",
        status: "Signed"
      }
    },
    P002: {
      patientId: "P002",
      token: "PTK-4751-QR3",
      enrollmentDate: "2024-10-20",
      lastVisit: "2024-12-05",
      nextVisit: "2024-12-16",
      questionnairesCompleted: 9,
      questionnairesTotal: 10,
      visitStatus: 'scheduled' as const,
      complianceRate: 98,
      demographics: {
        age: 32,
        gender: "Male",
        ethnicity: "Caucasian"
      },
      icfDetails: {
        version: "v2.1",
        signedDate: "2024-10-20",
        status: "Signed"
      }
    },
    P003: {
      patientId: "P003",
      token: "PTK-8239-MN7",
      enrollmentDate: "2024-10-18",
      lastVisit: "2024-11-28",
      nextVisit: "2024-12-12",
      questionnairesCompleted: 7,
      questionnairesTotal: 10,
      visitStatus: 'overdue' as const,
      complianceRate: 89,
      demographics: {
        age: 58,
        gender: "Female",
        ethnicity: "African American"
      },
      icfDetails: {
        version: "v2.0",
        signedDate: "2024-10-18",
        status: "Re-consent Required"
      }
    },
    P004: {
      patientId: "P004",
      token: "PTK-5642-LP9",
      enrollmentDate: "2024-11-01",
      lastVisit: "2024-12-08",
      nextVisit: "2024-12-20",
      questionnairesCompleted: 6,
      questionnairesTotal: 8,
      visitStatus: 'completed' as const,
      complianceRate: 94,
      demographics: {
        age: 67,
        gender: "Male",
        ethnicity: "Asian"
      },
      icfDetails: {
        version: "v2.1",
        signedDate: "2024-11-01",
        status: "Signed"
      }
    },
    P005: {
      patientId: "P005",
      token: "PTK-7194-KX2",
      enrollmentDate: "2024-11-05",
      lastVisit: "2024-12-02",
      nextVisit: "2024-12-18",
      questionnairesCompleted: 5,
      questionnairesTotal: 8,
      visitStatus: 'scheduled' as const,
      complianceRate: 92,
      demographics: {
        age: 29,
        gender: "Female",
        ethnicity: "Native American"
      },
      icfDetails: {
        version: "v2.1",
        signedDate: "2024-11-05",
        status: "Signed"
      }
    }
  };

  const participant = participantData[participantId as keyof typeof participantData];
  if (!participant) return null;

  const participantDetails = {
    ...participant,
    status: "Active",
    contact: {
      phone: "(555) 123-4567",
      email: "participant@example.com",
      preferredContact: "Email"
    },
    studyProgress: {
      visitsCompleted: participant.visitStatus === 'completed' ? 8 : 7,
      visitsTotal: 12,
      questionnairesCompleted: participant.questionnairesCompleted,
      questionnairesTotal: participant.questionnairesTotal,
      complianceRate: participant.complianceRate
    },
    recentActivity: [
      { date: participant.lastVisit, activity: "Site Visit - Blood Draw", type: "visit" },
      { date: "2024-12-02", activity: "Medication Adherence Survey", type: "questionnaire" },
      { date: "2024-11-28", activity: "Follow-up Call", type: "call" },
      { date: "2024-11-25", activity: "Weekly Survey", type: "questionnaire" }
    ],
    upcomingEvents: [
      { date: participant.nextVisit, activity: "Site Visit", time: "2:00 PM" },
      { date: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], activity: "Weekly Survey Due", time: "End of day" }
    ],
    alerts: participant.visitStatus === 'overdue' 
      ? [
          { type: "warning", message: t('details.visit.overdue') },
          { type: "info", message: t('details.monthly.assessment') }
        ]
      : participant.complianceRate < 95
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
                  <span>{new Date(participantDetails.enrollmentDate).toLocaleDateString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-studio-text-muted">{t('participant.visit.status')}:</span>
                  <Badge className={getStatusColor(participantDetails.visitStatus)}>
                    {t(`status.${participantDetails.visitStatus}`)}
                  </Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-studio-text-muted">Last Visit:</span>
                  <span>{new Date(participantDetails.lastVisit).toLocaleDateString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-studio-text-muted">{t('participant.next.visit')}:</span>
                  <span>{new Date(participantDetails.nextVisit).toLocaleDateString()}</span>
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
                  <span>{participantDetails.demographics.gender}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-studio-text-muted">{t('details.ethnicity')}:</span>
                  <span>{participantDetails.demographics.ethnicity}</span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* ICF Information */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm flex items-center space-x-2">
                <Signature className="h-4 w-4" />
                <span>Informed Consent (ICF)</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-studio-text-muted">ICF Version:</span>
                <code className="font-mono text-sm bg-gray-100 px-2 py-1 rounded">{participantDetails.icfDetails.version}</code>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-studio-text-muted">Signed Date:</span>
                <span>{new Date(participantDetails.icfDetails.signedDate).toLocaleDateString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-studio-text-muted">Status:</span>
                <Badge className={getICFStatusColor(participantDetails.icfDetails.status)}>
                  {participantDetails.icfDetails.status}
                </Badge>
              </div>
              {participantDetails.icfDetails.status === "Re-consent Required" && (
                <div className="bg-orange-50 border border-orange-200 rounded p-2 text-xs text-orange-800">
                  <strong>Action Required:</strong> ICF has been updated to v2.1. Please schedule re-consent visit.
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
                  <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full" 
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
                  <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                    <div 
                      className="bg-green-600 h-2 rounded-full" 
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
                  <div className="text-sm text-studio-text-muted">{t('participant.compliance')} Rate</div>
                  <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                    <div 
                      className="bg-purple-600 h-2 rounded-full" 
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
                      <div className="font-medium text-sm">{activity.activity}</div>
                      <div className="text-xs text-studio-text-muted">
                        {new Date(activity.date).toLocaleDateString()}
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
                      <div className="font-medium text-sm">{event.activity}</div>
                      <div className="text-xs text-studio-text-muted">
                        {new Date(event.date).toLocaleDateString()} at {event.time}
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
