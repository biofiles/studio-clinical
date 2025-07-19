
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useState } from "react";
import { FileText, CheckCircle, Clock, AlertCircle, Eye } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

interface ParticipantQuestionnairesProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  participantId: string | null;
}

const ParticipantQuestionnaires = ({ open, onOpenChange, participantId }: ParticipantQuestionnairesProps) => {
  const { t } = useLanguage();
  const [questionnaires] = useState([
    {
      id: 2,
      title: t('questionnaire.weekly.qol.assessment'),
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
      title: t('questionnaire.medication.adherence'),
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
      title: t('questionnaire.monthly.health'),
      status: "pending",
      dueDate: "2024-12-20",
      progress: 0
    },
    {
      id: 5,
      title: t('questionnaire.side.effects'),
      status: "overdue",
      dueDate: "2024-12-10",
      progress: 0
    }
  ]);

  if (!participantId) return null;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-[hsl(var(--progress-success))]/10 text-[hsl(var(--progress-success))] border-[hsl(var(--progress-success))]/20';
      case 'in-progress': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'pending': return 'bg-[hsl(var(--progress-info))]/10 text-[hsl(var(--progress-info))] border-[hsl(var(--progress-info))]/20';
      case 'overdue': return 'bg-destructive/10 text-destructive border-destructive/20';
      default: return 'bg-muted text-muted-foreground border-border';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'completed': return t('questionnaire.status.completed');
      case 'in-progress': return t('questionnaire.status.in.progress');
      case 'pending': return t('questionnaire.status.pending');
      case 'overdue': return t('questionnaire.status.overdue');
      default: return status;
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
      
      alert(`${t('questionnaire.list.responses.for')} "${questionnaire.title}":\n\n${responseText}`);
    } else {
      alert(t('questionnaire.list.no.responses'));
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
            <span>{t('questionnaire.list.title')} - {participantId}</span>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Summary Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card className="bg-[hsl(var(--progress-success))]/5 border-[hsl(var(--progress-success))]/20">
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-[hsl(var(--progress-success))]">{completedCount}</div>
                <div className="text-sm text-[hsl(var(--progress-success))]/80">{t('questionnaire.list.completed.count')}</div>
              </CardContent>
            </Card>
            <Card className="bg-yellow-50 border-yellow-200">
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-yellow-800">{inProgressCount}</div>
                <div className="text-sm text-yellow-700">{t('questionnaire.list.in.progress.count')}</div>
              </CardContent>
            </Card>
            <Card className="bg-[hsl(var(--progress-info))]/5 border-[hsl(var(--progress-info))]/20">
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-[hsl(var(--progress-info))]">{pendingCount}</div>
                <div className="text-sm text-[hsl(var(--progress-info))]/80">{t('questionnaire.list.pending.count')}</div>
              </CardContent>
            </Card>
            <Card className="bg-destructive/5 border-destructive/20">
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-destructive">{overdueCount}</div>
                <div className="text-sm text-destructive/80">{t('questionnaire.list.overdue.count')}</div>
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
                        <span className={`px-2 py-1 text-xs rounded border ${getStatusColor(questionnaire.status)}`}>
                          <div className="flex items-center space-x-1">
                            {getStatusIcon(questionnaire.status)}
                            <span className="capitalize">{getStatusText(questionnaire.status)}</span>
                          </div>
                        </span>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4 text-sm text-studio-text-muted mb-3">
                        <div>
                          <span className="font-medium">{t('questionnaire.list.due.date')}:</span> {new Date(questionnaire.dueDate).toLocaleDateString()}
                        </div>
                        {questionnaire.completedDate && (
                          <div>
                            <span className="font-medium">{t('questionnaire.list.completed.date')}:</span> {new Date(questionnaire.completedDate).toLocaleDateString()}
                          </div>
                        )}
                        {questionnaire.score && (
                          <div>
                            <span className="font-medium">{t('questionnaire.list.score')}:</span> {questionnaire.score}/100
                          </div>
                        )}
                      </div>
                      
                      {questionnaire.status === 'in-progress' && questionnaire.progress !== undefined && (
                        <div className="mb-3">
                          <div className="flex justify-between text-xs mb-1">
                            <span>{t('questionnaire.list.progress')}</span>
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
                          {t('questionnaire.list.view.responses')}
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-xs text-studio-text-muted bg-blue-50 p-3 rounded">
            <strong>{t('questionnaire.list.data.privacy')}:</strong> {t('questionnaire.list.privacy.note')}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ParticipantQuestionnaires;
