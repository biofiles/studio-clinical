import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import Header from "@/components/Header";
import UserProfileDialog from "@/components/UserProfileDialog";
import CalendarView from "@/components/CalendarView";
import QuestionnairesView from "@/components/QuestionnairesView";
import AIChatbot from "@/components/AIChatbot";
import { Calendar, FileText, Bell, Activity, Download, MessageCircle, User, Shield } from "lucide-react";

interface ParticipantDashboardProps {
  onLogout: () => void;
}

const ParticipantDashboard = ({ onLogout }: ParticipantDashboardProps) => {
  const [showCalendar, setShowCalendar] = useState(false);
  const [showQuestionnaires, setShowQuestionnaires] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [showChatbot, setShowChatbot] = useState(false);

  const studyProgress = 65; // 65% complete
  const daysLeft = 30;

  const upcomingActivities = [
    { date: "Tomorrow", activity: "Weekly Survey", time: "10:00 AM", type: "questionnaire" },
    { date: "Dec 15", activity: "Site Visit - Blood Draw", time: "2:00 PM", type: "visit" },
    { date: "Dec 20", activity: "Daily Diary Entry", time: "Any time", type: "diary" }
  ];

  const handleExportPDF = () => {
    // Simulated PDF export
    alert("PDF export initiated - questionnaire responses would be downloaded as a secure, de-identified document.");
  };

  return (
    <div className="min-h-screen bg-studio-bg">
      <Header
        role="participant"
        onLogout={onLogout}
      />

      {/* Security & Compliance Banner */}
      {/* Main Content */}
      <main className="p-6 max-w-4xl mx-auto space-y-6">
        <div className="space-y-2">
          <h2 className="text-xl font-medium text-studio-text">
            Welcome back, Participant
          </h2>
          <p className="text-studio-text-muted">
            Study ID: PROTO-2024-001 | Phase II Clinical Trial
          </p>
        </div>

        {/* Study Progress */}
        <Card className="bg-studio-surface border-studio-border">
          <CardHeader>
            <CardTitle className="text-studio-text flex items-center space-x-2">
              <Activity className="h-5 w-5" />
              <span>Study Progress</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-studio-text-muted">Progress</span>
                <span className="text-studio-text font-medium">{studyProgress}% Complete</span>
              </div>
              <Progress value={studyProgress} className="h-3" />
            </div>
            <div className="flex justify-between items-center p-3 bg-studio-bg rounded">
              <div>
                <p className="font-medium text-studio-text">Next Milestone</p>
                <p className="text-sm text-studio-text-muted">{daysLeft} days remaining in study</p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-studio-text">{daysLeft}</p>
                <p className="text-xs text-studio-text-muted">DAYS LEFT</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Dashboard Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="bg-studio-surface border-studio-border">
            <CardContent className="p-6">
              <div className="flex items-center space-x-2">
                <Activity className="h-5 w-5 text-studio-text-muted" />
                <span className="text-2xl font-semibold text-studio-text">65</span>
              </div>
              <p className="text-studio-text-muted text-sm mt-1">
                Days completed
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
          {/* Upcoming Activities */}
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

          {/* Quick Actions */}
          <Card className="bg-studio-surface border-studio-border">
            <CardHeader>
              <CardTitle className="text-studio-text">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button 
                variant="studio" 
                className="w-full justify-start"
                onClick={() => setShowCalendar(true)}
              >
                <Calendar className="h-4 w-4 mr-2" />
                View Calendar
              </Button>
              <Button 
                variant="studio" 
                className="w-full justify-start"
                onClick={() => setShowQuestionnaires(true)}
              >
                <FileText className="h-4 w-4 mr-2" />
                Complete Questionnaires
              </Button>
              <Button 
                variant="studio" 
                className="w-full justify-start"
                onClick={handleExportPDF}
              >
                <Download className="h-4 w-4 mr-2" />
                Export Responses (PDF)
              </Button>
              <Button 
                variant="studio" 
                className="w-full justify-start"
                onClick={() => setShowProfile(true)}
              >
                <User className="h-4 w-4 mr-2" />
                View Profile & Token
              </Button>
            </CardContent>
          </Card>
        </div>
      </main>

      {/* AI Chatbot Button */}
      <div className="fixed bottom-6 right-6">
        <Button
          onClick={() => setShowChatbot(true)}
          className="h-14 w-14 rounded-full bg-blue-600 hover:bg-blue-700 shadow-lg"
          size="icon"
        >
          <MessageCircle className="h-6 w-6 text-white" />
        </Button>
      </div>

      {/* Dialogs */}
      <CalendarView 
        open={showCalendar} 
        onOpenChange={setShowCalendar}
        activities={upcomingActivities}
      />
      
      <QuestionnairesView 
        open={showQuestionnaires} 
        onOpenChange={setShowQuestionnaires}
      />

      <UserProfileDialog 
        open={showProfile} 
        onOpenChange={setShowProfile}
      />

      <AIChatbot 
        open={showChatbot} 
        onOpenChange={setShowChatbot}
      />
    </div>
  );
};

export default ParticipantDashboard;
