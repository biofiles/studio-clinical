
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
import { useLanguage } from "@/contexts/LanguageContext";

interface ParticipantSchedulerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  participantId: string | null;
}

const ParticipantScheduler = ({ open, onOpenChange, participantId }: ParticipantSchedulerProps) => {
  const { t } = useLanguage();
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [eventType, setEventType] = useState("");
  const [eventTime, setEventTime] = useState("");
  const [eventTitle, setEventTitle] = useState("");
  const [eventNotes, setEventNotes] = useState("");
  const [upcomingEvents, setUpcomingEvents] = useState([
    { id: 1, date: "2024-12-15", time: "2:00 PM", title: "Site Visit - Blood Draw", type: "visit" },
    { id: 2, date: "2024-12-18", time: "End of day", title: "Weekly Survey Due", type: "questionnaire" },
    { id: 3, date: "2024-12-20", time: "10:00 AM", title: "Follow-up Call", type: "call" }
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
    
    alert(`Scheduled "${eventTitle}" for ${participantId} on ${format(selectedDate, 'PPP')}`);
  };

  const handleRemoveEvent = (eventId: number) => {
    setUpcomingEvents(prev => prev.filter(event => event.id !== eventId));
  };

  const getEventTypeColor = (type: string) => {
    switch (type) {
      case 'visit': return 'bg-red-100 text-red-800';
      case 'questionnaire': return 'bg-blue-100 text-blue-800';
      case 'call': return 'bg-purple-100 text-purple-800';
      case 'lab': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <CalendarIcon className="h-5 w-5" />
            <span>Schedule Management - {participantId}</span>
          </DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Schedule New Event */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm flex items-center space-x-2">
                <Plus className="h-4 w-4" />
                <span>Schedule New Event</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="event-date" className="text-sm font-medium">Select Date</Label>
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={setSelectedDate}
                  className="rounded-md border mt-2"
                  disabled={(date) => date < new Date()}
                />
              </div>

              <div className="space-y-3">
                <div>
                  <Label htmlFor="event-type" className="text-sm font-medium">Event Type</Label>
                  <Select value={eventType} onValueChange={setEventType}>
                    <SelectTrigger className="w-full mt-1">
                      <SelectValue placeholder="Select event type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="visit">Site Visit</SelectItem>
                      <SelectItem value="lab">Lab Work</SelectItem>
                      <SelectItem value="call">Follow-up Call</SelectItem>
                      <SelectItem value="questionnaire">Questionnaire Due</SelectItem>
                      <SelectItem value="assessment">Assessment</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="event-title" className="text-sm font-medium">Event Title</Label>
                  <Input
                    id="event-title"
                    value={eventTitle}
                    onChange={(e) => setEventTitle(e.target.value)}
                    placeholder="Enter event title"
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="event-time" className="text-sm font-medium">Time (Optional)</Label>
                  <Input
                    id="event-time"
                    type="time"
                    value={eventTime}
                    onChange={(e) => setEventTime(e.target.value)}
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="event-notes" className="text-sm font-medium">Notes (Optional)</Label>
                  <Textarea
                    id="event-notes"
                    value={eventNotes}
                    onChange={(e) => setEventNotes(e.target.value)}
                    placeholder="Additional notes or instructions"
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
                  Schedule Event
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Upcoming Events */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm flex items-center space-x-2">
                <Clock className="h-4 w-4" />
                <span>Upcoming Events</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 max-h-96 overflow-y-auto">
              {upcomingEvents.map((event) => (
                <div key={event.id} className="flex items-start justify-between p-3 bg-studio-bg rounded border">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <h4 className="font-medium text-sm">{event.title}</h4>
                      <span className={`px-2 py-1 text-xs rounded ${getEventTypeColor(event.type)}`}>
                        {t(`activity.${event.type}`)}
                      </span>
                    </div>
                    <div className="text-xs text-studio-text-muted">
                      {new Date(event.date).toLocaleDateString()} at {event.time}
                    </div>
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleRemoveEvent(event.id)}
                    className="text-red-600 hover:text-red-700"
                  >
                    Remove
                  </Button>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        <div className="text-xs text-studio-text-muted bg-blue-50 p-3 rounded">
          <strong>Note:</strong> All scheduled events will be automatically synced to the participant's calendar. 
          Participants will receive notifications based on their communication preferences.
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ParticipantScheduler;
