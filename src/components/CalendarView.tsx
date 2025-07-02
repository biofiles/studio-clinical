
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";
import { Calendar as CalendarIcon, Clock } from "lucide-react";

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
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());

  // Mock upcoming visits for calendar display
  const upcomingVisits = [
    { date: new Date(2024, 11, 14), title: "Weekly Survey", time: "10:00 AM", type: "questionnaire" },
    { date: new Date(2024, 11, 15), title: "Site Visit - Blood Draw", time: "2:00 PM", type: "visit" },
    { date: new Date(2024, 11, 20), title: "Daily Diary Entry", time: "Any time", type: "diary" },
    { date: new Date(2024, 11, 22), title: "Follow-up Call", time: "3:00 PM", type: "call" },
    { date: new Date(2024, 11, 28), title: "Monthly Assessment", time: "9:00 AM", type: "assessment" }
  ];

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

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <CalendarIcon className="h-5 w-5" />
            <span>Study Calendar - Read Only</span>
          </DialogTitle>
        </DialogHeader>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div>
            <Card className="bg-studio-surface border-studio-border">
              <CardHeader>
                <CardTitle className="text-studio-text text-sm">Select Date</CardTitle>
              </CardHeader>
              <CardContent>
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={setSelectedDate}
                  className="rounded-md border"
                />
              </CardContent>
            </Card>
          </div>

          <div>
            <Card className="bg-studio-surface border-studio-border">
              <CardHeader>
                <CardTitle className="text-studio-text text-sm">Upcoming Activities</CardTitle>
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
                          {visit.date.toLocaleDateString('en-US', { month: 'short' })}
                        </div>
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2 mb-1">
                        <h4 className="font-medium text-studio-text">{visit.title}</h4>
                        <Badge className={getActivityTypeColor(visit.type)}>
                          {visit.type}
                        </Badge>
                      </div>
                      <div className="flex items-center space-x-1 text-sm text-studio-text-muted">
                        <Clock className="h-3 w-3" />
                        <span>{visit.time}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="text-xs text-studio-text-muted bg-blue-50 p-3 rounded">
          <strong>Note:</strong> This calendar is read-only. Contact your study coordinator to reschedule appointments.
          All dates and times are displayed in your local timezone.
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CalendarView;
