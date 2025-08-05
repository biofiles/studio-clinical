import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useState } from "react";
import { FileText, Clock, CheckCircle, AlertCircle, RotateCcw } from "lucide-react";
import QuestionnaireForm from "./QuestionnaireForm";
import { useLanguage } from "@/contexts/LanguageContext";
import { formatDate } from "@/lib/utils";
interface QuestionnairesViewProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}
const QuestionnairesView = ({
  open,
  onOpenChange
}: QuestionnairesViewProps) => {
  const {
    t,
    language
  } = useLanguage();
  const [questionnaires, setQuestionnaires] = useState([{
    id: 1,
    title: t('questionnaire.daily.symptom.diary'),
    description: "Record your daily symptoms and side effects",
    status: "pending",
    dueDate: "Today",
    estimatedTime: "5 min",
    progress: 0,
    questions: [{
      id: "symptoms",
      type: "checkbox" as const,
      question: t('questionnaire.question.symptoms.today'),
      options: [t('questionnaire.option.headache'), t('questionnaire.option.nausea'), t('questionnaire.option.fatigue'), t('questionnaire.option.dizziness'), t('questionnaire.option.loss.appetite'), t('questionnaire.option.none')],
      required: true
    }, {
      id: "severity",
      type: "scale" as const,
      question: t('questionnaire.question.symptom.severity'),
      required: true
    }, {
      id: "medication_taken",
      type: "multiple-choice" as const,
      question: t('questionnaire.question.medication.taken'),
      options: [t('questionnaire.option.yes.prescribed'), t('questionnaire.option.yes.missed.dose'), t('questionnaire.option.no.forgot'), t('questionnaire.option.no.side.effects')],
      required: true
    }]
  }, {
    id: 2,
    title: t('questionnaire.weekly.qol.assessment'),
    description: "Assess your overall well-being and quality of life",
    status: "pending",
    dueDate: "Tomorrow",
    estimatedTime: "15 min",
    progress: 0,
    questions: [{
      id: "physical_health",
      type: "scale" as const,
      question: t('questionnaire.question.physical.health'),
      required: true
    }, {
      id: "emotional_wellbeing",
      type: "scale" as const,
      question: t('questionnaire.question.emotional.wellbeing'),
      required: true
    }, {
      id: "daily_activities",
      type: "multiple-choice" as const,
      question: t('questionnaire.question.daily.activities'),
      options: [t('questionnaire.option.not.at.all'), t('questionnaire.option.little.bit'), t('questionnaire.option.moderately'), t('questionnaire.option.quite.bit'), t('questionnaire.option.extremely')],
      required: true
    }, {
      id: "sleep_quality",
      type: "scale" as const,
      question: t('questionnaire.question.sleep.quality'),
      required: true
    }]
  }, {
    id: 3,
    title: t('questionnaire.medication.adherence'),
    description: "Report on your medication compliance",
    status: "in-progress",
    dueDate: "Dec 16",
    estimatedTime: "10 min",
    progress: 60,
    questions: [{
      id: "doses_missed",
      type: "text" as const,
      question: t('questionnaire.question.doses.missed'),
      required: true
    }, {
      id: "reasons_missed",
      type: "checkbox" as const,
      question: t('questionnaire.question.reasons.missed'),
      options: [t('questionnaire.option.forgot'), t('questionnaire.option.side.effects'), t('questionnaire.option.felt.better'), t('questionnaire.option.too.busy'), t('questionnaire.option.cost'), t('questionnaire.option.other')],
      required: false
    }]
  }, {
    id: 4,
    title: t('questionnaire.monthly.health'),
    description: "Comprehensive health and wellness questionnaire",
    status: "completed",
    dueDate: "Completed Nov 20",
    estimatedTime: "20 min",
    progress: 100,
    questions: [{
      id: "overall_health",
      type: "scale" as const,
      question: t('questionnaire.question.overall.health'),
      required: true
    }]
  }]);
  const [selectedQuestionnaire, setSelectedQuestionnaire] = useState<any>(null);
  const [showForm, setShowForm] = useState(false);
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-[hsl(var(--progress-info))]/10 text-[hsl(var(--progress-info))] border-[hsl(var(--progress-info))]/20';
      case 'in-progress':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'completed':
        return 'bg-[hsl(var(--progress-success))]/10 text-[hsl(var(--progress-success))] border-[hsl(var(--progress-success))]/20';
      default:
        return 'bg-muted text-muted-foreground border-border';
    }
  };
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <AlertCircle className="h-4 w-4" />;
      case 'in-progress':
        return <Clock className="h-4 w-4" />;
      case 'completed':
        return <CheckCircle className="h-4 w-4" />;
      default:
        return <FileText className="h-4 w-4" />;
    }
  };
  const formatDueDate = (dueDate: string) => {
    if (dueDate === "Today") {
      return t("common.today");
    }
    if (dueDate === "Tomorrow") {
      return t("common.tomorrow");
    }
    if (dueDate.startsWith("Completed")) {
      // For completed dates like "Completed Nov 20", extract the date part
      const dateMatch = dueDate.match(/(\w+ \d+)/);
      if (dateMatch) {
        try {
          const dateStr = dateMatch[1] + ", 2024"; // Assuming current year
          const date = new Date(dateStr);
          return `${t("common.completed")} ${formatDate(date, language)}`;
        } catch {
          return dueDate; // Fallback to original if parsing fails
        }
      }
      return dueDate;
    }
    // For other date formats like "Dec 16"
    try {
      const dateStr = dueDate + ", 2024"; // Assuming current year
      const date = new Date(dateStr);
      return formatDate(date, language);
    } catch {
      return dueDate; // Fallback to original if parsing fails
    }
  };
  const handleStartQuestionnaire = (questionnaire: any) => {
    setSelectedQuestionnaire(questionnaire);
    setShowForm(true);
  };
  const handleCompleteQuestionnaire = (questionnaireId: number, responses: any) => {
    setQuestionnaires(prev => prev.map(q => q.id === questionnaireId ? {
      ...q,
      status: 'completed',
      progress: 100
    } : q));
    setShowForm(false);
    setSelectedQuestionnaire(null);
  };
  const handleRetakeQuestionnaire = (questionnaire: any) => {
    // Reset questionnaire status
    setQuestionnaires(prev => prev.map(q => q.id === questionnaire.id ? {
      ...q,
      status: 'pending',
      progress: 0
    } : q));
    // Start the questionnaire
    handleStartQuestionnaire({
      ...questionnaire,
      status: 'pending',
      progress: 0
    });
  };
  return <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-3xl sm:max-w-2xl md:max-w-3xl max-h-[80vh] overflow-y-auto mx-4 sm:mx-6">
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-2">
              <FileText className="h-5 w-5" />
              <span>{t('questionnaire.surveys')}</span>
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            {/* Summary Stats */}
            <div className="grid grid-cols-3 gap-4">
              <Card className="bg-[hsl(var(--progress-info))]/5 border-[hsl(var(--progress-info))]/20">
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-[hsl(var(--progress-info))]">
                    {questionnaires.filter(q => q.status === 'pending').length}
                  </div>
                  <div className="text-sm text-[hsl(var(--progress-info))]/80">{t('questionnaire.pending')}</div>
                </CardContent>
              </Card>
              <Card className="bg-yellow-50 border-yellow-200">
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-yellow-800">
                    {questionnaires.filter(q => q.status === 'in-progress').length}
                  </div>
                  <div className="text-sm text-yellow-700">{t('questionnaire.status.in.progress')}</div>
                </CardContent>
              </Card>
              <Card className="bg-[hsl(var(--progress-success))]/5 border-[hsl(var(--progress-success))]/20">
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-[hsl(var(--progress-success))]">
                    {questionnaires.filter(q => q.status === 'completed').length}
                  </div>
                  <div className="text-sm text-[hsl(var(--progress-success))]/80">{t('questionnaire.completed')}</div>
                </CardContent>
              </Card>
            </div>

            {/* Questionnaire List */}
            <div className="space-y-3">
              {questionnaires.map(questionnaire => <Card key={questionnaire.id} className="bg-studio-surface border-studio-border">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <h3 className="font-medium text-studio-text">{questionnaire.title}</h3>
                           <Badge className={`rounded-full ${getStatusColor(questionnaire.status)}`}>
                              <div className="flex items-center space-x-1">
                                {getStatusIcon(questionnaire.status)}
                                <span className="capitalize">{t(`questionnaire.status.${questionnaire.status.replace('-', '.')}`)}</span>
                              </div>
                            </Badge>
                        </div>
                        
                        
                        
                        <div className="flex items-center space-x-4 text-xs text-studio-text-muted">
                          <span>{t('questionnaire.due')}: {formatDueDate(questionnaire.dueDate)}</span>
                          <span>{t('questionnaire.est.time')}: {questionnaire.estimatedTime}</span>
                        </div>
                        
                         {questionnaire.status === 'in-progress' && <div className="mt-3">
                             <div className="flex justify-between text-xs mb-1">
                               <span>{t('questionnaire.list.progress')}</span>
                               <span>{questionnaire.progress}%</span>
                             </div>
                            <Progress value={questionnaire.progress} className="h-2" />
                          </div>}
                      </div>
                      
                      <div className="ml-4 flex space-x-2">
                        {questionnaire.status !== 'completed' && <Button variant="default" size="sm" onClick={() => handleStartQuestionnaire(questionnaire)}>
                             {questionnaire.status === 'pending' ? t('questionnaire.complete.now') : t('questionnaire.form.next')}
                           </Button>}
                        {questionnaire.status === 'completed' && <Button variant="outline" size="sm" onClick={() => handleRetakeQuestionnaire(questionnaire)}>
                             <RotateCcw className="h-4 w-4 mr-1" />
                             {t('questionnaire.form.complete')}
                           </Button>}
                      </div>
                    </div>
                  </CardContent>
                </Card>)}
            </div>

            <div className="text-xs text-studio-text-muted bg-blue-50 p-3 rounded">
              <strong>{t('questionnaire.list.data.privacy')}:</strong> {t('questionnaire.list.privacy.note')}
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <QuestionnaireForm open={showForm} onOpenChange={setShowForm} questionnaire={selectedQuestionnaire} onComplete={handleCompleteQuestionnaire} />
    </>;
};
export default QuestionnairesView;