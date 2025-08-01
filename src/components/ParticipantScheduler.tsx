
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import { useState } from "react";
import { Calendar as CalendarIcon, Clock, Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { useLanguage } from "@/contexts/LanguageContext";

interface ParticipantSchedulerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  participantId: string | null;
}

const ParticipantScheduler = ({ open, onOpenChange, participantId }: ParticipantSchedulerProps) => {
  const { t, language } = useLanguage();
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [eventType, setEventType] = useState("");
  const [eventTime, setEventTime] = useState("");
  const [eventTitle, setEventTitle] = useState("");
  const [eventNotes, setEventNotes] = useState("");
  const [upcomingEvents, setUpcomingEvents] = useState([
    { id: 1, date: "2025-08-05", time: "2:00 PM", title: t('scheduler.default.events.site.visit.blood.draw'), type: "visit" },
    { id: 2, date: "2025-08-12", time: "End of day", title: t('scheduler.default.events.weekly.survey.due'), type: "questionnaire" },
    { id: 3, date: "2025-08-20", time: "10:00 AM", title: t('scheduler.default.events.follow.up.call'), type: "call" }
  ]);

  if (!participantId) return null;

  const handleScheduleEvent = () => {
    if (!selectedDate || !eventType || !eventTitle) return;

    const newEvent = {
      id: Date.now(),
      date: format(selectedDate, 'yyyy-MM-dd'),
      time: eventTime || "TBD",
      title: eventTitle,
      type: eventType
    };

    setUpcomingEvents(prev => [...prev, newEvent]);
    
    // Reset form
    setEventType("");
    setEventTime("");
    setEventTitle("");
    setEventNotes("");
    
    alert(`${t('scheduler.event.scheduled.alert').replace('{eventTitle}', eventTitle).replace('{participantId}', participantId).replace('{date}', format(selectedDate, 'PPP'))}`);
  };

  const handleRemoveEvent = (eventId: number) => {
    setUpcomingEvents(prev => prev.filter(event => event.id !== eventId));
  };

  const getEventTypeColor = (type: string) => {
    switch (type) {
      case 'visit': return 'bg-destructive/10 text-destructive border-destructive/20';
      case 'questionnaire': return 'bg-[hsl(var(--progress-info))]/10 text-[hsl(var(--progress-info))] border-[hsl(var(--progress-info))]/20 rounded-full';
      case 'call': return 'bg-[hsl(var(--progress-accent))]/10 text-[hsl(var(--progress-accent))] border-[hsl(var(--progress-accent))]/20 rounded-full';
      case 'lab': return 'bg-[hsl(var(--progress-success))]/10 text-[hsl(var(--progress-success))] border-[hsl(var(--progress-success))]/20';
      default: return 'bg-muted text-muted-foreground border-border';
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <CalendarIcon className="h-5 w-5" />
            <span>{t('scheduler.title')} - {participantId}</span>
          </DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Schedule New Event */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm flex items-center space-x-2">
                <Plus className="h-4 w-4" />
                <span>{t('scheduler.schedule.new.event')}</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="event-date" className="text-sm font-medium">{t('scheduler.select.date')}</Label>
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={setSelectedDate}
                  className="rounded-md border mt-2 pointer-events-auto"
                  disabled={(date) => date < new Date()}
                  locale={language === 'spanish' ? es : undefined}
                />
              </div>

              <div className="space-y-3">
                <div>
                  <Label htmlFor="event-type" className="text-sm font-medium">{t('scheduler.event.type')}</Label>
                  <Select value={eventType} onValueChange={setEventType}>
                    <SelectTrigger className="w-full mt-1">
                      <SelectValue placeholder={t('scheduler.select.event.type')} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="visit">{t('scheduler.event.types.site.visit')}</SelectItem>
                      <SelectItem value="lab">{t('scheduler.event.types.lab.work')}</SelectItem>
                      <SelectItem value="call">{t('scheduler.event.types.follow.up.call')}</SelectItem>
                      <SelectItem value="questionnaire">{t('scheduler.event.types.questionnaire.due')}</SelectItem>
                      <SelectItem value="assessment">{t('scheduler.event.types.assessment')}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="event-title" className="text-sm font-medium">{t('scheduler.event.title')}</Label>
                  <Input
                    id="event-title"
                    value={eventTitle}
                    onChange={(e) => setEventTitle(e.target.value)}
                    placeholder={t('scheduler.enter.event.title')}
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="event-time" className="text-sm font-medium">{t('scheduler.time.optional')}</Label>
                  <Input
                    id="event-time"
                    type="time"
                    value={eventTime}
                    onChange={(e) => setEventTime(e.target.value)}
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="event-notes" className="text-sm font-medium">{t('scheduler.notes.optional')}</Label>
                  <Textarea
                    id="event-notes"
                    value={eventNotes}
                    onChange={(e) => setEventNotes(e.target.value)}
                    placeholder={t('scheduler.additional.notes')}
                    className="mt-1"
                    rows={3}
                  />
                </div>

                <Button 
                  onClick={handleScheduleEvent}
                  className="w-full"
                  disabled={!selectedDate || !eventType || !eventTitle}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  {t('scheduler.schedule.event')}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Upcoming Events */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm flex items-center space-x-2">
                <Clock className="h-4 w-4" />
                <span>{t('scheduler.upcoming.events')}</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 max-h-96 overflow-y-auto">
              {upcomingEvents.map((event) => (
                <div key={event.id} className="flex items-start justify-between p-3 bg-studio-bg rounded border">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <h4 className="font-medium text-sm">{event.title}</h4>
                      <span className={`px-2 py-1 text-xs rounded border ${getEventTypeColor(event.type)}`}>
                        {t(`activity.${event.type}`)}
                      </span>
                    </div>
                    <div className="text-xs text-studio-text-muted">
                      {new Date(event.date).toLocaleDateString(language === 'spanish' ? 'es-ES' : 'en-US', { 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric' 
                      })} {t('common.at')} {event.time}
                    </div>
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleRemoveEvent(event.id)}
                    className="text-red-600 hover:text-red-700"
                  >
                    {t('scheduler.remove')}
                  </Button>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        <div className="text-xs text-studio-text-muted bg-blue-50 p-3 rounded">
          <strong>{t('scheduler.note.title')}</strong> {t('scheduler.note.description')}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ParticipantScheduler;
