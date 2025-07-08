
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Progress } from "@/components/ui/progress";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { CheckCircle, ArrowLeft, ArrowRight } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

interface Question {
  id: string;
  type: 'text' | 'multiple-choice' | 'checkbox' | 'scale';
  question: string;
  options?: string[];
  required: boolean;
}

interface Questionnaire {
  id: number;
  title: string;
  questions: Question[];
}

interface QuestionnaireFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  questionnaire: Questionnaire | null;
  onComplete: (questionnaireId: number, responses: any) => void;
}

const QuestionnaireForm = ({ open, onOpenChange, questionnaire, onComplete }: QuestionnaireFormProps) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [responses, setResponses] = useState<Record<string, any>>({});
  const [isCompleted, setIsCompleted] = useState(false);
  const { t } = useLanguage();

  const form = useForm();

  if (!questionnaire) return null;

  const currentQuestion = questionnaire.questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / questionnaire.questions.length) * 100;

  const handleNext = () => {
    if (currentQuestionIndex < questionnaire.questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      // Complete questionnaire
      setIsCompleted(true);
      onComplete(questionnaire.id, responses);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const handleResponseChange = (questionId: string, value: any) => {
    setResponses(prev => ({
      ...prev,
      [questionId]: value
    }));
  };

  const handleClose = () => {
    setCurrentQuestionIndex(0);
    setResponses({});
    setIsCompleted(false);
    onOpenChange(false);
  };

  if (isCompleted) {
    return (
      <Dialog open={open} onOpenChange={handleClose}>
        <DialogContent className="max-w-md">
          <div className="text-center py-6">
            <CheckCircle className="h-16 w-16 text-green-600 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-studio-text mb-2">
              {t('questionnaire.form.completed')}
            </h3>
            <p className="text-sm text-studio-text-muted mb-4">
              {t('questionnaire.form.thank.you')} "{questionnaire.title}". {t('questionnaire.form.responses.saved')}
            </p>
            <Button onClick={handleClose} className="w-full">
              {t('questionnaire.form.close')}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  const renderQuestion = () => {
    switch (currentQuestion.type) {
      case 'text':
        return (
          <Input
            value={responses[currentQuestion.id] || ''}
            onChange={(e) => handleResponseChange(currentQuestion.id, e.target.value)}
            placeholder={t('questionnaire.form.enter.response')}
            className="w-full"
          />
        );
      
      case 'multiple-choice':
        return (
          <div className="space-y-2">
            {currentQuestion.options?.map((option, index) => (
              <label key={index} className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="radio"
                  name={currentQuestion.id}
                  value={option}
                  checked={responses[currentQuestion.id] === option}
                  onChange={(e) => handleResponseChange(currentQuestion.id, e.target.value)}
                  className="w-4 h-4"
                />
                <span className="text-sm">{option}</span>
              </label>
            ))}
          </div>
        );

      case 'checkbox':
        return (
          <div className="space-y-2">
            {currentQuestion.options?.map((option, index) => (
              <label key={index} className="flex items-center space-x-2 cursor-pointer">
                <Checkbox
                  checked={(responses[currentQuestion.id] || []).includes(option)}
                  onCheckedChange={(checked) => {
                    const currentValues = responses[currentQuestion.id] || [];
                    if (checked) {
                      handleResponseChange(currentQuestion.id, [...currentValues, option]);
                    } else {
                      handleResponseChange(currentQuestion.id, currentValues.filter((v: string) => v !== option));
                    }
                  }}
                />
                <span className="text-sm">{option}</span>
              </label>
            ))}
          </div>
        );

      case 'scale':
        return (
          <div className="space-y-3">
            <div className="flex justify-between text-xs text-studio-text-muted">
              <span>{t('questionnaire.form.not.at.all')}</span>
              <span>{t('questionnaire.form.extremely')}</span>
            </div>
            {/* Mobile-first responsive grid */}
            <div className="grid grid-cols-5 sm:grid-cols-10 gap-2">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((value) => (
                <button
                  key={value}
                  onClick={() => handleResponseChange(currentQuestion.id, value)}
                  className={`aspect-square rounded-lg text-sm font-medium transition-all ${
                    responses[currentQuestion.id] === value
                      ? 'bg-blue-600 text-white shadow-md scale-105'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300 hover:scale-105'
                  }`}
                >
                  {value}
                </button>
              ))}
            </div>
            {/* Selected value indicator for better UX */}
            {responses[currentQuestion.id] && (
              <div className="text-center">
                <span className="text-sm text-studio-text-muted">
                  {t('questionnaire.form.selected')}: <span className="font-medium text-blue-600">{responses[currentQuestion.id]}</span>
                </span>
              </div>
            )}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{questionnaire.title}</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          <div>
            <div className="flex justify-between text-sm mb-2">
              <span>{t('questionnaire.form.question')} {currentQuestionIndex + 1} {t('questionnaire.form.of')} {questionnaire.questions.length}</span>
              <span>{Math.round(progress)}% {t('questionnaire.form.complete')}</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>

          <Card>
            <CardContent className="p-6">
              <h3 className="text-lg font-medium mb-4">{currentQuestion.question}</h3>
              {renderQuestion()}
            </CardContent>
          </Card>

          <div className="flex justify-between">
            <Button
              variant="outline"
              onClick={handlePrevious}
              disabled={currentQuestionIndex === 0}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              {t('questionnaire.form.previous')}
            </Button>
            
            <Button
              onClick={handleNext}
              disabled={currentQuestion.required && !responses[currentQuestion.id]}
            >
              {currentQuestionIndex === questionnaire.questions.length - 1 ? t('questionnaire.form.complete') : t('questionnaire.form.next')}
              {currentQuestionIndex < questionnaire.questions.length - 1 && (
                <ArrowRight className="h-4 w-4 ml-2" />
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default QuestionnaireForm;
