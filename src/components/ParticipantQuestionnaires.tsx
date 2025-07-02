
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useState } from "react";
import { FileText, CheckCircle, Clock, AlertCircle, Eye } from "lucide-react";

interface ParticipantQuestionnairesProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  participantId: string | null;
}

const ParticipantQuestionnaires = ({ open, onOpenChange, participantId }: ParticipantQuestionnairesProps) => {
  const [questionnaires] = useState([
    {
      id: 1,
      title: "Daily Symptom Diary",
      status: "completed",
      dueDate: "2024-12-08",
      completedDate: "2024-12-08",
      score: 85,
      responses: {
        "symptoms": ["Headache", "Fatigue"],
        "severity": 6,
        "medication_taken": "Yes, as prescribed"
      }
    },
    {
      id: 2,
      title: "Weekly Quality of Life Assessment",
      status: "completed",
      dueDate: "2024-12-07",
      completedDate: "2024-12-06",
      score: 92,
      responses: {
        "physical_health": 8,
        "emotional_wellbeing": 7,
        "daily_activities": "A little bit",
        "sleep_quality": 9
      }
    },
    {
      id: 3,
      title: "Medication Adherence Survey",
      status: "in-progress",
      dueDate: "2024-12-16",
      progress: 60,
      responses: {
        "doses_missed": "1",
        "reasons_missed": ["Forgot"]
      }
    },
    {
      id: 4,
      title: "Monthly Health Survey",
      status: "pending",
      dueDate: "2024-12-20",
      progress: 0
    },
    {
      id: 5,
      title: "Side Effects Assessment",
      status: "overdue",
      dueDate: "2024-12-10",
      progress: 0
    }
  ]);

  if (!participantId) return null;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'in-progress': return 'bg-yellow-100 text-yellow-800';
      case 'pending': return 'bg-blue-100 text-blue-800';
      case 'overdue': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle className="h-4 w-4" />;
      case 'in-progress': return <Clock className="h-4 w-4" />;
      case 'pending': return <FileText className="h-4 w-4" />;
      case 'overdue': return <AlertCircle className="h-4 w-4" />;
      default: return <FileText className="h-4 w-4" />;
    }
  };

  const handleViewResponses = (questionnaire: any) => {
    if (questionnaire.responses) {
      const responseText = Object.entries(questionnaire.responses)
        .map(([key, value]) => `${key}: ${Array.isArray(value) ? value.join(', ') : value}`)
        .join('\n');
      
      alert(`Responses for "${questionnaire.title}":\n\n${responseText}`);
    } else {
      alert('No responses recorded yet.');
    }
  };

  const completedCount = questionnaires.filter(q => q.status === 'completed').length;
  const inProgressCount = questionnaires.filter(q => q.status === 'in-progress').length;
  const pendingCount = questionnaires.filter(q => q.status === 'pending').length;
  const overdueCount = questionnaires.filter(q => q.status === 'overdue').length;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <FileText className="h-5 w-5" />
            <span>Questionnaires - {participantId}</span>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Summary Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card className="bg-green-50 border-green-200">
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-green-600">{completedCount}</div>
                <div className="text-sm text-green-700">Completed</div>
              </CardContent>
            </Card>
            <Card className="bg-yellow-50 border-yellow-200">
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-yellow-600">{inProgressCount}</div>
                <div className="text-sm text-yellow-700">In Progress</div>
              </CardContent>
            </Card>
            <Card className="bg-blue-50 border-blue-200">
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-blue-600">{pendingCount}</div>
                <div className="text-sm text-blue-700">Pending</div>
              </CardContent>
            </Card>
            <Card className="bg-red-50 border-red-200">
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-red-600">{overdueCount}</div>
                <div className="text-sm text-red-700">Overdue</div>
              </CardContent>
            </Card>
          </div>

          {/* Questionnaire List */}
          <div className="space-y-3">
            {questionnaires.map((questionnaire) => (
              <Card key={questionnaire.id} className="bg-studio-surface border-studio-border">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <h3 className="font-medium text-studio-text">{questionnaire.title}</h3>
                        <Badge className={getStatusColor(questionnaire.status)}>
                          <div className="flex items-center space-x-1">
                            {getStatusIcon(questionnaire.status)}
                            <span className="capitalize">{questionnaire.status.replace('-', ' ')}</span>
                          </div>
                        </Badge>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4 text-sm text-studio-text-muted mb-3">
                        <div>
                          <span className="font-medium">Due Date:</span> {new Date(questionnaire.dueDate).toLocaleDateString()}
                        </div>
                        {questionnaire.completedDate && (
                          <div>
                            <span className="font-medium">Completed:</span> {new Date(questionnaire.completedDate).toLocaleDateString()}
                          </div>
                        )}
                        {questionnaire.score && (
                          <div>
                            <span className="font-medium">Score:</span> {questionnaire.score}/100
                          </div>
                        )}
                      </div>
                      
                      {questionnaire.status === 'in-progress' && questionnaire.progress !== undefined && (
                        <div className="mb-3">
                          <div className="flex justify-between text-xs mb-1">
                            <span>Progress</span>
                            <span>{questionnaire.progress}%</span>
                          </div>
                          <Progress value={questionnaire.progress} className="h-2" />
                        </div>
                      )}
                    </div>
                    
                    <div className="ml-4">
                      {questionnaire.responses && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleViewResponses(questionnaire)}
                        >
                          <Eye className="h-4 w-4 mr-1" />
                          View Responses
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-xs text-studio-text-muted bg-blue-50 p-3 rounded">
            <strong>Data Privacy:</strong> All questionnaire responses are encrypted and stored securely. 
            Access is limited to authorized study personnel and complies with HIPAA regulations.
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ParticipantQuestionnaires;
