
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useState } from "react";
import { FileText, Clock, CheckCircle, AlertCircle, RotateCcw } from "lucide-react";
import QuestionnaireForm from "./QuestionnaireForm";

interface QuestionnairesViewProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const QuestionnairesView = ({ open, onOpenChange }: QuestionnairesViewProps) => {
  const [questionnaires, setQuestionnaires] = useState([
    {
      id: 1,
      title: "Daily Symptom Diary",
      description: "Record your daily symptoms and side effects",
      status: "pending",
      dueDate: "Today",
      estimatedTime: "5 min",
      progress: 0,
      questions: [
        {
          id: "symptoms",
          type: "checkbox" as const,
          question: "Which symptoms did you experience today?",
          options: ["Headache", "Nausea", "Fatigue", "Dizziness", "Loss of appetite", "None"],
          required: true
        },
        {
          id: "severity",
          type: "scale" as const,
          question: "On a scale of 1-10, how would you rate your overall symptom severity today?",
          required: true
        },
        {
          id: "medication_taken",
          type: "multiple-choice" as const,
          question: "Did you take your study medication today?",
          options: ["Yes, as prescribed", "Yes, but missed a dose", "No, forgot", "No, side effects"],
          required: true
        }
      ]
    },
    {
      id: 2,
      title: "Weekly Quality of Life Assessment",
      description: "Assess your overall well-being and quality of life",
      status: "pending",
      dueDate: "Tomorrow",
      estimatedTime: "15 min",
      progress: 0,
      questions: [
        {
          id: "physical_health",
          type: "scale" as const,
          question: "How would you rate your physical health this week?",
          required: true
        },
        {
          id: "emotional_wellbeing",
          type: "scale" as const,
          question: "How would you rate your emotional well-being this week?",
          required: true
        },
        {
          id: "daily_activities",
          type: "multiple-choice" as const,
          question: "How much did health problems limit your daily activities?",
          options: ["Not at all", "A little bit", "Moderately", "Quite a bit", "Extremely"],
          required: true
        },
        {
          id: "sleep_quality",
          type: "scale" as const,
          question: "How would you rate your sleep quality this week?",
          required: true
        }
      ]
    },
    {
      id: 3,
      title: "Medication Adherence Survey",
      description: "Report on your medication compliance",
      status: "in-progress",
      dueDate: "Dec 16",
      estimatedTime: "10 min",
      progress: 60,
      questions: [
        {
          id: "doses_missed",
          type: "text" as const,
          question: "How many doses did you miss this week?",
          required: true
        },
        {
          id: "reasons_missed",
          type: "checkbox" as const,
          question: "If you missed doses, what were the reasons?",
          options: ["Forgot", "Side effects", "Felt better", "Too busy", "Cost", "Other"],
          required: false
        }
      ]
    },
    {
      id: 4,
      title: "Monthly Health Survey",
      description: "Comprehensive health and wellness questionnaire",
      status: "completed",
      dueDate: "Completed Nov 20",
      estimatedTime: "20 min",
      progress: 100,
      questions: [
        {
          id: "overall_health",
          type: "scale" as const,
          question: "How would you rate your overall health?",
          required: true
        }
      ]
    }
  ]);

  const [selectedQuestionnaire, setSelectedQuestionnaire] = useState<any>(null);
  const [showForm, setShowForm] = useState(false);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-red-100 text-red-800';
      case 'in-progress': return 'bg-yellow-100 text-yellow-800';
      case 'completed': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return <AlertCircle className="h-4 w-4" />;
      case 'in-progress': return <Clock className="h-4 w-4" />;
      case 'completed': return <CheckCircle className="h-4 w-4" />;
      default: return <FileText className="h-4 w-4" />;
    }
  };

  const handleStartQuestionnaire = (questionnaire: any) => {
    setSelectedQuestionnaire(questionnaire);
    setShowForm(true);
  };

  const handleCompleteQuestionnaire = (questionnaireId: number, responses: any) => {
    setQuestionnaires(prev => prev.map(q => 
      q.id === questionnaireId 
        ? { ...q, status: 'completed', progress: 100 }
        : q
    ));
    setShowForm(false);
    setSelectedQuestionnaire(null);
  };

  const handleRetakeQuestionnaire = (questionnaire: any) => {
    // Reset questionnaire status
    setQuestionnaires(prev => prev.map(q => 
      q.id === questionnaire.id 
        ? { ...q, status: 'pending', progress: 0 }
        : q
    ));
    // Start the questionnaire
    handleStartQuestionnaire({ ...questionnaire, status: 'pending', progress: 0 });
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-2">
              <FileText className="h-5 w-5" />
              <span>Your Questionnaires</span>
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            {/* Summary Stats */}
            <div className="grid grid-cols-3 gap-4">
              <Card className="bg-red-50 border-red-200">
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-red-600">
                    {questionnaires.filter(q => q.status === 'pending').length}
                  </div>
                  <div className="text-sm text-red-700">Pending</div>
                </CardContent>
              </Card>
              <Card className="bg-yellow-50 border-yellow-200">
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-yellow-600">
                    {questionnaires.filter(q => q.status === 'in-progress').length}
                  </div>
                  <div className="text-sm text-yellow-700">In Progress</div>
                </CardContent>
              </Card>
              <Card className="bg-green-50 border-green-200">
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-green-600">
                    {questionnaires.filter(q => q.status === 'completed').length}
                  </div>
                  <div className="text-sm text-green-700">Completed</div>
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
                        
                        <p className="text-sm text-studio-text-muted mb-3">
                          {questionnaire.description}
                        </p>
                        
                        <div className="flex items-center space-x-4 text-xs text-studio-text-muted">
                          <span>Due: {questionnaire.dueDate}</span>
                          <span>Est. time: {questionnaire.estimatedTime}</span>
                        </div>
                        
                        {questionnaire.status === 'in-progress' && (
                          <div className="mt-3">
                            <div className="flex justify-between text-xs mb-1">
                              <span>Progress</span>
                              <span>{questionnaire.progress}%</span>
                            </div>
                            <Progress value={questionnaire.progress} className="h-2" />
                          </div>
                        )}
                      </div>
                      
                      <div className="ml-4 flex space-x-2">
                        {questionnaire.status !== 'completed' && (
                          <Button
                            variant="default"
                            size="sm"
                            onClick={() => handleStartQuestionnaire(questionnaire)}
                          >
                            {questionnaire.status === 'pending' ? 'Start' : 'Continue'}
                          </Button>
                        )}
                        {questionnaire.status === 'completed' && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleRetakeQuestionnaire(questionnaire)}
                          >
                            <RotateCcw className="h-4 w-4 mr-1" />
                            Retake
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="text-xs text-studio-text-muted bg-blue-50 p-3 rounded">
              <strong>Privacy Notice:</strong> All questionnaire responses are encrypted and de-identified. 
              Your data is processed in compliance with HIPAA, 21 CFR Part 11, and ICH-GCP standards.
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <QuestionnaireForm
        open={showForm}
        onOpenChange={setShowForm}
        questionnaire={selectedQuestionnaire}
        onComplete={handleCompleteQuestionnaire}
      />
    </>
  );
};

export default QuestionnairesView;
