
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { User, Calendar, FileText, Activity, AlertTriangle } from "lucide-react";

interface ParticipantDetailViewProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  participantId: string | null;
}

const ParticipantDetailView = ({ open, onOpenChange, participantId }: ParticipantDetailViewProps) => {
  if (!participantId) return null;

  // Mock detailed participant data
  const participantDetails = {
    patientId: participantId,
    token: "PTK-9283-WZ1",
    enrollmentDate: "2024-10-15",
    status: "Active",
    demographics: {
      age: 45,
      gender: "Female",
      ethnicity: "Hispanic/Latino"
    },
    contact: {
      phone: "(555) 123-4567",
      email: "participant@example.com",
      preferredContact: "Email"
    },
    studyProgress: {
      visitsCompleted: 8,
      visitsTotal: 12,
      questionnairesCompleted: 15,
      questionnairesTotal: 18,
      complianceRate: 94
    },
    recentActivity: [
      { date: "2024-12-08", activity: "Completed Weekly Survey", type: "questionnaire" },
      { date: "2024-12-05", activity: "Site Visit - Blood Draw", type: "visit" },
      { date: "2024-12-02", activity: "Medication Adherence Survey", type: "questionnaire" },
      { date: "2024-11-28", activity: "Follow-up Call", type: "call" }
    ],
    upcomingEvents: [
      { date: "2024-12-15", activity: "Site Visit", time: "2:00 PM" },
      { date: "2024-12-18", activity: "Weekly Survey Due", time: "End of day" }
    ],
    alerts: [
      { type: "warning", message: "Missed last diary entry" },
      { type: "info", message: "Due for monthly assessment" }
    ]
  };

  const getActivityTypeColor = (type: string) => {
    switch (type) {
      case 'visit': return 'bg-red-100 text-red-800';
      case 'questionnaire': return 'bg-blue-100 text-blue-800';
      case 'call': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <User className="h-5 w-5" />
            <span>Participant Details - {participantId}</span>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Alert Section */}
          {participantDetails.alerts.length > 0 && (
            <Card className="border-orange-200 bg-orange-50">
              <CardHeader>
                <CardTitle className="text-sm flex items-center space-x-2">
                  <AlertTriangle className="h-4 w-4 text-orange-600" />
                  <span>Alerts</span>
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
                <CardTitle className="text-sm">Basic Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-studio-text-muted">Patient ID:</span>
                  <span className="font-semibold">{participantDetails.patientId}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-studio-text-muted">Token:</span>
                  <code className="font-mono text-sm">{participantDetails.token}</code>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-studio-text-muted">Enrollment Date:</span>
                  <span>{new Date(participantDetails.enrollmentDate).toLocaleDateString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-studio-text-muted">Status:</span>
                  <Badge className="bg-green-100 text-green-800">{participantDetails.status}</Badge>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Demographics</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-studio-text-muted">Age:</span>
                  <span>{participantDetails.demographics.age}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-studio-text-muted">Gender:</span>
                  <span>{participantDetails.demographics.gender}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-studio-text-muted">Ethnicity:</span>
                  <span>{participantDetails.demographics.ethnicity}</span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Study Progress */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm flex items-center space-x-2">
                <Activity className="h-4 w-4" />
                <span>Study Progress</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">
                    {participantDetails.studyProgress.visitsCompleted}/{participantDetails.studyProgress.visitsTotal}
                  </div>
                  <div className="text-sm text-studio-text-muted">Site Visits</div>
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
                  <div className="text-sm text-studio-text-muted">Questionnaires</div>
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
                  <div className="text-sm text-studio-text-muted">Compliance Rate</div>
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
                  <span>Recent Activity</span>
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
                      {activity.type}
                    </Badge>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-sm flex items-center space-x-2">
                  <Calendar className="h-4 w-4" />
                  <span>Upcoming Events</span>
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
