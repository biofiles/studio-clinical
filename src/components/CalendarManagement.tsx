
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";
import { Calendar as CalendarIcon, Clock, Users, FileText, Activity } from "lucide-react";
import { format } from "date-fns";
import { useLanguage } from "@/contexts/LanguageContext";

interface CalendarManagementProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const CalendarManagement = ({ open, onOpenChange }: CalendarManagementProps) => {
  const { t } = useLanguage();
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());

  const studyEvents = [
    { id: 1, date: "2024-12-15", time: "2:00 PM", title: "P001 - Site Visit", type: "visit", participant: "P001" },
    { id: 2, date: "2024-12-16", time: "10:00 AM", title: "P002 - Blood Draw", type: "lab", participant: "P002" },
    { id: 3, date: "2024-12-18", time: "3:00 PM", title: "Monthly Team Meeting", type: "meeting", participant: null },
    { id: 4, date: "2024-12-20", time: "11:00 AM", title: "P003 - Follow-up Call", type: "call", participant: "P003" },
    { id: 5, date: "2024-12-22", time: "9:00 AM", title: "P004 - Assessment", type: "assessment", participant: "P004" }
  ];

  const getEventTypeColor = (type: string) => {
    switch (type) {
      case 'visit': return 'bg-red-100 text-red-800';
      case 'lab': return 'bg-green-100 text-green-800';
      case 'call': return 'bg-purple-100 text-purple-800';
      case 'meeting': return 'bg-blue-100 text-blue-800';
      case 'assessment': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getEventIcon = (type: string) => {
    switch (type) {
      case 'visit': return <Users className="h-4 w-4" />;
      case 'lab': return <Activity className="h-4 w-4" />;
      case 'call': return <Clock className="h-4 w-4" />;
      case 'meeting': return <Users className="h-4 w-4" />;
      case 'assessment': return <FileText className="h-4 w-4" />;
      default: return <CalendarIcon className="h-4 w-4" />;
    }
  };

  const eventDates = studyEvents.map(event => new Date(event.date));

  const isDayWithEvent = (date: Date) => {
    return eventDates.some(eventDate => 
      eventDate.toDateString() === date.toDateString()
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <CalendarIcon className="h-5 w-5" />
            <span>{t('calendar.management.title')}</span>
          </DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">{t('calendar.study.calendar')}</CardTitle>
            </CardHeader>
            <CardContent>
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={setSelectedDate}
                className="rounded-md border"
                modifiers={{
                  hasEvent: isDayWithEvent
                }}
                modifiersStyles={{
                  hasEvent: {
                    backgroundColor: '#3b82f6',
                    color: 'white',
                    fontWeight: 'bold'
                  }
                }}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm">{t('calendar.upcoming.events')}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 max-h-96 overflow-y-auto">
              {studyEvents.map((event) => (
                <div key={event.id} className="flex items-start space-x-3 p-3 bg-studio-bg rounded border">
                  <div className="flex-shrink-0 mt-1">
                    {getEventIcon(event.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2 mb-1">
                      <h4 className="font-medium text-sm">{event.title}</h4>
                      <Badge className={getEventTypeColor(event.type)}>
                        {t(`activity.${event.type}`)}
                      </Badge>
                    </div>
                    <div className="text-xs text-studio-text-muted">
                      {new Date(event.date).toLocaleDateString()} at {event.time}
                    </div>
                    {event.participant && (
                      <div className="text-xs text-blue-600 mt-1">
                        {t('calendar.participant')} {event.participant}
                      </div>
                    )}
                  </div>
                  <Button size="sm" variant="outline">
                    {t('calendar.edit')}
                  </Button>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        <div className="text-xs text-studio-text-muted bg-blue-50 p-3 rounded">
          <strong>{t('calendar.note.title')}</strong> {t('calendar.note.description')}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CalendarManagement;
