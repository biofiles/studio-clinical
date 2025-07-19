
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";
import { Calendar as CalendarIcon, Clock } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

interface Activity {
  date: string;
  activity: string;
  time: string;
  type: string;
}

interface CalendarViewProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  activities: Activity[];
}

const CalendarView = ({ open, onOpenChange, activities }: CalendarViewProps) => {
  const { t, language } = useLanguage();
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());

  // Mock upcoming visits for calendar display
  const upcomingVisits = [
    { date: new Date(2025, 6, 14), titleKey: "calendar.activity.weekly.survey", time: "10:00 AM", type: "questionnaire" },
    { date: new Date(2025, 6, 22), titleKey: "calendar.activity.site.visit.blood.draw", time: "2:00 PM", type: "visit" },
    { date: new Date(2025, 7, 5), titleKey: "calendar.activity.daily.diary.entry", timeKey: "calendar.activity.any.time", type: "diary" },
    { date: new Date(2025, 8, 12), titleKey: "calendar.activity.followup.call", time: "3:00 PM", type: "call" },
    { date: new Date(2025, 9, 8), titleKey: "calendar.activity.monthly.assessment", time: "9:00 AM", type: "assessment" }
  ];

  // Get activity dates for highlighting
  const activityDates = upcomingVisits.map(visit => visit.date);

  const getActivityTypeColor = (type: string) => {
    switch (type) {
      case 'visit': return 'bg-red-100 text-red-800';
      case 'questionnaire': return 'bg-blue-100 text-blue-800';
      case 'diary': return 'bg-green-100 text-green-800';
      case 'call': return 'bg-purple-100 text-purple-800';
      case 'assessment': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getActivityDotColor = (type: string) => {
    switch (type) {
      case 'visit': return '#dc2626'; // red-600
      case 'questionnaire': return '#2563eb'; // blue-600
      case 'diary': return '#16a34a'; // green-600
      case 'call': return '#9333ea'; // purple-600
      case 'assessment': return '#ea580c'; // orange-600
      default: return '#6b7280'; // gray-500
    }
  };

  const isDayWithActivity = (date: Date) => {
    return activityDates.some(activityDate => 
      activityDate.toDateString() === date.toDateString()
    );
  };

  const getActivityForDate = (date: Date) => {
    return upcomingVisits.find(visit => 
      visit.date.toDateString() === date.toDateString()
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <CalendarIcon className="h-5 w-5" />
            <span>{t('calendar.study.calendar')}</span>
          </DialogTitle>
        </DialogHeader>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div>
            <Card className="bg-studio-surface border-studio-border">
              <CardHeader>
                <CardTitle className="text-studio-text text-sm">{t('calendar.select.date')}</CardTitle>
              </CardHeader>
              <CardContent>
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={setSelectedDate}
                  className="rounded-md border [&_.has-activity]:relative [&_.has-activity]:after:absolute [&_.has-activity]:after:top-1 [&_.has-activity]:after:right-1 [&_.has-activity]:after:w-2 [&_.has-activity]:after:h-2 [&_.has-activity]:after:rounded-full [&_.has-visit]:after:bg-red-600 [&_.has-questionnaire]:after:bg-blue-600 [&_.has-diary]:after:bg-green-600 [&_.has-call]:after:bg-purple-600 [&_.has-assessment]:after:bg-orange-600 [&_.has-activity]:after:content-['']"
                  modifiers={{
                    hasActivity: isDayWithActivity,
                    hasVisit: (date) => getActivityForDate(date)?.type === 'visit',
                    hasQuestionnaire: (date) => getActivityForDate(date)?.type === 'questionnaire',
                    hasDiary: (date) => getActivityForDate(date)?.type === 'diary',
                    hasCall: (date) => getActivityForDate(date)?.type === 'call',
                    hasAssessment: (date) => getActivityForDate(date)?.type === 'assessment'
                  }}
                  modifiersClassNames={{
                    hasActivity: "has-activity",
                    hasVisit: "has-visit",
                    hasQuestionnaire: "has-questionnaire", 
                    hasDiary: "has-diary",
                    hasCall: "has-call",
                    hasAssessment: "has-assessment"
                  }}
                />
              </CardContent>
            </Card>
          </div>

          <div>
            <Card className="bg-studio-surface border-studio-border">
              <CardHeader>
                <CardTitle className="text-studio-text text-sm">{t('calendar.upcoming.activities')}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 max-h-80 overflow-y-auto">
                {upcomingVisits.map((visit, index) => (
                  <div key={index} className="flex items-start space-x-3 p-3 bg-studio-bg rounded">
                    <div className="flex-shrink-0">
                      <div className="w-12 text-center">
                        <div className="text-lg font-bold text-studio-text">
                          {visit.date.getDate()}
                        </div>
                        <div className="text-xs text-studio-text-muted">
                          {visit.date.toLocaleDateString(language === 'spanish' ? 'es-ES' : 'en-US', { month: 'short' })}
                        </div>
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2 mb-1">
                        <h4 className="font-medium text-studio-text">{t(visit.titleKey)}</h4>
                        <Badge className={getActivityTypeColor(visit.type)}>
                          {t(`activity.${visit.type}`)}
                        </Badge>
                      </div>
                      <div className="flex items-center space-x-1 text-sm text-studio-text-muted">
                        <Clock className="h-3 w-3" />
                        <span>{visit.timeKey ? t(visit.timeKey) : visit.time}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="text-xs text-studio-text-muted bg-blue-50 p-3 rounded">
          <strong>{t('calendar.note.readonly')}</strong> {t('calendar.readonly.description')}
          {' '}{t('calendar.timezone.note')}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CalendarView;
