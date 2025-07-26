import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useState } from "react";
import { FileText, CheckCircle, Clock, AlertCircle, Eye, Users, Filter } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { formatDate } from "@/lib/utils";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import QuestionnaireResponseDialog from "./QuestionnaireResponseDialog";

interface Questionnaire {
  id: number;
  title: string;
  status: string;
  dueDate: string;
  completedDate?: string;
  score?: number;
  progress?: number;
  responses?: Record<string, any>;
}

interface Participant {
  id: string;
  name: string;
  questionnaires: Questionnaire[];
}

interface InvestigatorQuestionnairesProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const InvestigatorQuestionnaires = ({ open, onOpenChange }: InvestigatorQuestionnairesProps) => {
  const { t, language } = useLanguage();
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedResponse, setSelectedResponse] = useState<{
    participant: Participant;
    questionnaire: Questionnaire;
  } | null>(null);

  const [participants] = useState<Participant[]>([
    {
      id: "P001",
      name: "John Smith", 
      questionnaires: [
        {
          id: 1,
          title: t('questionnaire.daily.symptom.diary'),
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
          status: "overdue",
          dueDate: "2024-12-10",
          progress: 0
        }
      ]
    },
    {
      id: "P002",
      name: "Maria Garcia",
      questionnaires: [
        {
          id: 1,
          title: t('questionnaire.daily.symptom.diary'),
          status: "in-progress",
          dueDate: "2024-12-08",
          progress: 60,
          responses: {
            "symptoms": ["Nausea"],
            "severity": 4
          }
        },
        {
          id: 2,
          title: t('questionnaire.weekly.qol.assessment'),
          status: "pending",
          dueDate: "2024-12-16",
          progress: 0
        },
        {
          id: 3,
          title: t('questionnaire.medication.adherence'),
          status: "completed",
          dueDate: "2024-12-05",
          completedDate: "2024-12-05",
          score: 98,
          responses: {
            "doses_missed": "0",
            "adherence_rate": "100%"
          }
        }
      ]
    },
    {
      id: "P003",
      name: "Robert Johnson",
      questionnaires: [
        {
          id: 1,
          title: t('questionnaire.daily.symptom.diary'),
          status: "pending",
          dueDate: "2024-12-08",
          progress: 0
        },
        {
          id: 2,
          title: t('questionnaire.monthly.health'),
          status: "completed",
          dueDate: "2024-12-01",
          completedDate: "2024-11-30",
          score: 76,
          responses: {
            "overall_health": 7,
            "energy_level": 6,
            "mood": 8
          }
        }
      ]
    }
  ]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-[hsl(var(--progress-success))]/10 text-[hsl(var(--progress-success))] border-[hsl(var(--progress-success))]/20';
      case 'in-progress': return 'bg-[hsl(var(--progress-warning))]/10 text-[hsl(var(--progress-warning))] border-[hsl(var(--progress-warning))]/20';
      case 'pending': return 'bg-[hsl(var(--progress-info))]/10 text-[hsl(var(--progress-info))] border-[hsl(var(--progress-info))]/20';
      case 'overdue': return 'bg-destructive/10 text-destructive border-destructive/20';
      default: return 'bg-muted text-muted-foreground border-border';
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

  const getStatusText = (status: string) => {
    switch (status) {
      case 'completed': return t('questionnaire.status.completed');
      case 'in-progress': return t('questionnaire.status.in.progress');
      case 'pending': return t('questionnaire.status.pending');
      case 'overdue': return t('questionnaire.status.overdue');
      default: return status;
    }
  };

  const handleViewResponses = (participant: Participant, questionnaire: Questionnaire) => {
    setSelectedResponse({ participant, questionnaire });
  };

  const filteredParticipants = participants.filter(participant => {
    const matchesSearch = participant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         participant.id.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (!matchesSearch) return false;
    
    if (filterStatus === "all") return true;
    
    return participant.questionnaires.some(q => q.status === filterStatus);
  });

  // Calculate totals
  const allQuestionnaires: Questionnaire[] = participants.flatMap(p => p.questionnaires);
  const completedCount = allQuestionnaires.filter(q => q.status === 'completed').length;
  const inProgressCount = allQuestionnaires.filter(q => q.status === 'in-progress').length;
  const pendingCount = allQuestionnaires.filter(q => q.status === 'pending').length;
  const overdueCount = allQuestionnaires.filter(q => q.status === 'overdue').length;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Users className="h-5 w-5" />
            <span>{t('participant.management')} - {t('questionnaire.list.title')}</span>
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
            <Card className="bg-[hsl(var(--progress-warning))]/5 border-[hsl(var(--progress-warning))]/20">
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-[hsl(var(--progress-warning))]">{inProgressCount}</div>
                <div className="text-sm text-[hsl(var(--progress-warning))]/80">{t('questionnaire.list.in.progress.count')}</div>
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

          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <Input
                placeholder={t('participant.search')}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full"
              />
            </div>
            <div className="flex items-center space-x-2">
              <Filter className="h-4 w-4 text-studio-text-muted" />
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="completed">{t('questionnaire.status.completed')}</SelectItem>
                  <SelectItem value="in-progress">{t('questionnaire.status.in.progress')}</SelectItem>
                  <SelectItem value="pending">{t('questionnaire.status.pending')}</SelectItem>
                  <SelectItem value="overdue">{t('questionnaire.status.overdue')}</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Participant List */}
          <div className="space-y-4">
            {filteredParticipants.map((participant) => (
              <Card key={participant.id} className="bg-studio-surface border-studio-border">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center space-x-2">
                    <Users className="h-5 w-5" />
                    <span>{participant.name} ({participant.id})</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {participant.questionnaires.map((questionnaire) => (
                      <div key={questionnaire.id} className="flex items-center justify-between p-3 bg-studio-bg rounded-lg border border-studio-border">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-2">
                            <h4 className="font-medium text-studio-text">{questionnaire.title}</h4>
                            <Badge className={`rounded-full ${getStatusColor(questionnaire.status)}`}>
                              <div className="flex items-center space-x-1">
                                {getStatusIcon(questionnaire.status)}
                                <span>{getStatusText(questionnaire.status)}</span>
                              </div>
                            </Badge>
                          </div>
                          
                          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm text-studio-text-muted">
                            <div>
                              <span className="font-medium">{t('questionnaire.list.due.date')}:</span> {formatDate(questionnaire.dueDate, language)}
                            </div>
                            {questionnaire.completedDate && (
                              <div>
                                <span className="font-medium">{t('questionnaire.list.completed.date')}:</span> {formatDate(questionnaire.completedDate, language)}
                              </div>
                            )}
                            {questionnaire.score && (
                              <div>
                                <span className="font-medium">{t('questionnaire.list.score')}:</span> {questionnaire.score}/100
                              </div>
                            )}
                          </div>
                          
                          {questionnaire.status === 'in-progress' && questionnaire.progress !== undefined && (
                            <div className="mt-3 max-w-xs">
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
                              onClick={() => handleViewResponses(participant, questionnaire)}
                            >
                              <Eye className="h-4 w-4 mr-1" />
                              {t('questionnaire.list.view.responses')}
                            </Button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredParticipants.length === 0 && (
            <Card className="p-8 text-center">
              <FileText className="h-12 w-12 text-studio-text-muted mx-auto mb-4" />
              <h3 className="text-lg font-medium text-studio-text mb-2">No participants found</h3>
              <p className="text-studio-text-muted">Try adjusting your search or filter criteria.</p>
            </Card>
          )}

          <div className="text-xs text-studio-text-muted bg-primary/5 p-3 rounded border border-primary/20">
            <strong>{t('questionnaire.list.data.privacy')}:</strong> {t('questionnaire.list.privacy.note')}
          </div>
        </div>

        <QuestionnaireResponseDialog
          open={!!selectedResponse}
          onOpenChange={(open) => !open && setSelectedResponse(null)}
          participantName={selectedResponse?.participant.name || ""}
          questionnaireTitle={selectedResponse?.questionnaire.title || ""}
          responses={selectedResponse?.questionnaire.responses || null}
        />
      </DialogContent>
    </Dialog>
  );
};

export default InvestigatorQuestionnaires;
