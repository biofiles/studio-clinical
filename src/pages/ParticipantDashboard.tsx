import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Header from "@/components/Header";
import { Calendar, FileText, Bell, Activity } from "lucide-react";

interface ParticipantDashboardProps {
  onLogout: () => void;
}

const ParticipantDashboard = ({ onLogout }: ParticipantDashboardProps) => {
  const [isDemoMode, setIsDemoMode] = useState(false);

  const upcomingActivities = [
    { date: "Tomorrow", activity: "Survey Completion", time: "10:00 AM" },
    { date: "Dec 15", activity: "Site Visit", time: "2:00 PM" },
    { date: "Dec 20", activity: "Daily Diary", time: "Any time" }
  ];

  return (
    <div className="min-h-screen bg-studio-bg">
      <Header
        role="participant"
        onDemoToggle={() => setIsDemoMode(!isDemoMode)}
        isDemoMode={isDemoMode}
        onLogout={onLogout}
      />

      <main className="p-6 max-w-4xl mx-auto space-y-6">
        <div className="space-y-2">
          <h2 className="text-xl font-medium text-studio-text">
            Welcome back
          </h2>
          <p className="text-studio-text-muted">
            Study ID: PROTO-2024-001 | Phase II Clinical Trial
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="bg-studio-surface border-studio-border">
            <CardContent className="p-6">
              <div className="flex items-center space-x-2">
                <Activity className="h-5 w-5 text-studio-text-muted" />
                <span className="text-2xl font-semibold text-studio-text">14</span>
              </div>
              <p className="text-studio-text-muted text-sm mt-1">
                Days in study
              </p>
            </CardContent>
          </Card>

          <Card className="bg-studio-surface border-studio-border">
            <CardContent className="p-6">
              <div className="flex items-center space-x-2">
                <FileText className="h-5 w-5 text-studio-text-muted" />
                <span className="text-2xl font-semibold text-studio-text">3</span>
              </div>
              <p className="text-studio-text-muted text-sm mt-1">
                Pending surveys
              </p>
            </CardContent>
          </Card>

          <Card className="bg-studio-surface border-studio-border">
            <CardContent className="p-6">
              <div className="flex items-center space-x-2">
                <Calendar className="h-5 w-5 text-studio-text-muted" />
                <span className="text-2xl font-semibold text-studio-text">1</span>
              </div>
              <p className="text-studio-text-muted text-sm mt-1">
                Next visit
              </p>
            </CardContent>
          </Card>

          <Card className="bg-studio-surface border-studio-border">
            <CardContent className="p-6">
              <div className="flex items-center space-x-2">
                <Bell className="h-5 w-5 text-studio-text-muted" />
                <span className="text-2xl font-semibold text-studio-text">2</span>
              </div>
              <p className="text-studio-text-muted text-sm mt-1">
                Notifications
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="bg-studio-surface border-studio-border">
            <CardHeader>
              <CardTitle className="text-studio-text">Upcoming Activities</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {upcomingActivities.map((item, index) => (
                <div key={index} className="flex justify-between items-center p-3 bg-studio-bg rounded">
                  <div>
                    <p className="font-medium text-studio-text">{item.activity}</p>
                    <p className="text-sm text-studio-text-muted">{item.date} at {item.time}</p>
                  </div>
                  <Button variant="studio" size="sm">
                    View
                  </Button>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card className="bg-studio-surface border-studio-border">
            <CardHeader>
              <CardTitle className="text-studio-text">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button variant="studio" className="w-full justify-start">
                <FileText className="h-4 w-4 mr-2" />
                Complete Daily Diary
              </Button>
              <Button variant="studio" className="w-full justify-start">
                <Calendar className="h-4 w-4 mr-2" />
                Schedule Appointment
              </Button>
              <Button variant="studio" className="w-full justify-start">
                <Bell className="h-4 w-4 mr-2" />
                Report Side Effect
              </Button>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default ParticipantDashboard;