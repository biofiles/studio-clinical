
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import Header from "@/components/Header";
import UserProfileDialog from "@/components/UserProfileDialog";
import CalendarView from "@/components/CalendarView";
import QuestionnairesView from "@/components/QuestionnairesView";
import AIChatbot from "@/components/AIChatbot";
import { Calendar, FileText, Bell, Activity, Download, MessageCircle, User, Shield, Clock, CheckCircle, MapPin, Stethoscope, Barcode } from "lucide-react";

interface ParticipantDashboardProps {
  onLogout: () => void;
}

const ParticipantDashboard = ({ onLogout }: ParticipantDashboardProps) => {
  const [showCalendar, setShowCalendar] = useState(false);
  const [showQuestionnaires, setShowQuestionnaires] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [showChatbot, setShowChatbot] = useState(false);
  const [surveyCompleted, setSurveyCompleted] = useState(false);

  const studyProgress = 65;
  const daysLeft = 30;
  const participantToken = "PTK-9283-WZ1";

  const upcomingActivities = [
    { 
      date: "Tomorrow", 
      activity: "Weekly Survey", 
      time: "10:00 AM", 
      type: "questionnaire",
      details: "Quick 5-minute survey about your daily symptoms and medication adherence",
      location: "Online - Complete from home"
    },
    { 
      date: "Dec 15", 
      activity: "Site Visit - Blood Draw", 
      time: "2:00 PM", 
      type: "visit",
      details: "Routine blood work for safety monitoring and efficacy assessment",
      location: "Metro General Hospital - Lab Building, 2nd Floor",
      notes: "Please fast for 12 hours before the visit. Bring your medication diary and any questions you may have."
    },
    { 
      date: "Dec 20", 
      activity: "Daily Diary Entry", 
      time: "Any time", 
      type: "diary",
      details: "Record your daily symptoms, medication taken, and any side effects",
      location: "Online - Mobile app or web portal"
    }
  ];

  const handleCompleteSurvey = () => {
    setSurveyCompleted(true);
    alert("Survey completed successfully! Thank you for your participation.");
  };

  const handleExportPDF = () => {
    alert("PDF export initiated - questionnaire responses would be downloaded as a secure, de-identified document.");
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'visit': return <Stethoscope className="h-5 w-5" />;
      case 'questionnaire': return <FileText className="h-5 w-5" />;
      case 'diary': return <FileText className="h-5 w-5" />;
      default: return <Activity className="h-5 w-5" />;
    }
  };

  return (
    <div className="min-h-screen bg-studio-bg">
      <Header
        role="participant"
        onLogout={onLogout}
      />

      {/* User Context Bar - Mobile optimized */}
      <div className="bg-studio-surface border-b border-studio-border px-4 py-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between">
          <div className="flex items-center space-x-2 mb-2 sm:mb-0">
            <User className="h-4 w-4 text-studio-text-muted" />
            <span className="text-sm font-medium text-studio-text">
              Viewing Participant Dashboard - Study PROTO-2024-001
            </span>
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Barcode className="h-4 w-4 text-studio-text-muted" />
              <code className="text-xs font-mono bg-gray-100 px-2 py-1 rounded">
                {participantToken}
              </code>
            </div>
            <div className="flex items-center space-x-2 text-xs text-studio-text-muted">
              <Clock className="h-3 w-3" />
              <span>Last activity: {new Date().toLocaleString()}</span>
            </div>
          </div>
        </div>
      </div>

      <main className="p-4 sm:p-6 max-w-6xl mx-auto">
        {/* Welcome Section - Mobile first */}
        <div className="space-y-2 mb-6">
          <h2 className="text-xl sm:text-2xl font-medium text-studio-text">
            Welcome back!
          </h2>
          <p className="text-studio-text-muted text-sm sm:text-base">
            Phase II Clinical Trial | {daysLeft} days remaining
          </p>
        </div>

        {/* Progress Overview - Mobile optimized */}
        <Card className="bg-studio-surface border-studio-border mb-6">
          <CardContent className="p-4 sm:p-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between space-y-4 sm:space-y-0">
              <div className="flex-1">
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-studio-text-muted">Study Progress</span>
                  <span className="text-studio-text font-medium">{studyProgress}%</span>
                </div>
                <Progress value={studyProgress} className="h-3 mb-2" />
                <p className="text-xs text-studio-text-muted">
                  Great progress! Keep up the excellent work.
                </p>
              </div>
              <div className="text-center sm:text-right sm:ml-6">
                <p className="text-2xl sm:text-3xl font-bold text-studio-text">{daysLeft}</p>
                <p className="text-xs text-studio-text-muted">DAYS LEFT</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Main Sections - Mobile-first tabs */}
        <Tabs defaultValue="schedule" className="space-y-4">
          <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4 h-auto">
            <TabsTrigger value="schedule" className="flex flex-col items-center space-y-1 h-16 sm:h-10 sm:flex-row sm:space-y-0 sm:space-x-2">
              <Calendar className="h-5 w-5 sm:h-4 sm:w-4" />
              <span className="text-xs sm:text-sm">Schedule</span>
            </TabsTrigger>
            <TabsTrigger value="questionnaires" className="flex flex-col items-center space-y-1 h-16 sm:h-10 sm:flex-row sm:space-y-0 sm:space-x-2">
              <FileText className="h-5 w-5 sm:h-4 sm:w-4" />
              <span className="text-xs sm:text-sm">Surveys</span>
            </TabsTrigger>
            <TabsTrigger value="visits" className="flex flex-col items-center space-y-1 h-16 sm:h-10 sm:flex-row sm:space-y-0 sm:space-x-2">
              <Activity className="h-5 w-5 sm:h-4 sm:w-4" />
              <span className="text-xs sm:text-sm">Visits</span>
            </TabsTrigger>
            <TabsTrigger value="profile" className="flex flex-col items-center space-y-1 h-16 sm:h-10 sm:flex-row sm:space-y-0 sm:space-x-2">
              <User className="h-5 w-5 sm:h-4 sm:w-4" />
              <span className="text-xs sm:text-sm">Profile</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="schedule" className="space-y-4">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-2 sm:space-y-0">
              <h3 className="text-lg font-medium text-studio-text">Your Schedule</h3>
              <Button 
                variant="studio" 
                size="sm"
                onClick={() => setShowCalendar(true)}
                className="w-full sm:w-auto"
              >
                <Calendar className="h-4 w-4 mr-2" />
                View Full Calendar
              </Button>
            </div>
            
            <div className="space-y-4">
              {upcomingActivities.map((item, index) => (
                <Card key={index} className="bg-studio-surface border-studio-border">
                  <CardContent className="p-4">
                    <div className="space-y-3">
                      <div className="flex items-start space-x-3">
                        <div className="flex-shrink-0 mt-1">
                          {getActivityIcon(item.type)}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-1">
                            <p className="font-medium text-studio-text">{item.activity}</p>
                            <Badge variant="outline">
                              {item.type}
                            </Badge>
                          </div>
                          <p className="text-sm text-studio-text-muted mb-2">{item.date} at {item.time}</p>
                          <p className="text-sm text-studio-text mb-2">{item.details}</p>
                          <div className="flex items-center space-x-1 text-xs text-studio-text-muted mb-2">
                            <MapPin className="h-3 w-3" />
                            <span>{item.location}</span>
                          </div>
                          {item.notes && (
                            <div className="bg-blue-50 border border-blue-200 rounded p-2 text-xs text-blue-800">
                              <strong>Important Notes:</strong> {item.notes}
                            </div>
                          )}
                        </div>
                      </div>
                      <Button variant="studio" size="sm" className="w-full sm:w-auto">
                        View Details
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="questionnaires" className="space-y-4">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-2 sm:space-y-0">
              <h3 className="text-lg font-medium text-studio-text">Your Surveys</h3>
              <Button 
                variant="studio" 
                size="sm"
                onClick={() => setShowQuestionnaires(true)}
                className="w-full sm:w-auto"
              >
                <FileText className="h-4 w-4 mr-2" />
                View All Surveys
              </Button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              <Card className="bg-red-50 border-red-200">
                <CardContent className="p-4 text-center">
                  <div className="text-xl sm:text-2xl font-bold text-red-600">3</div>
                  <div className="text-xs sm:text-sm text-red-700">Pending</div>
                </CardContent>
              </Card>
              <Card className="bg-green-50 border-green-200">
                <CardContent className="p-4 text-center">
                  <div className="text-xl sm:text-2xl font-bold text-green-600">12</div>
                  <div className="text-xs sm:text-sm text-green-700">Completed</div>
                </CardContent>
              </Card>
              <Card className="bg-blue-50 border-blue-200 col-span-2 sm:col-span-1">
                <CardContent className="p-4 text-center">
                  <div className="text-xl sm:text-2xl font-bold text-blue-600">80%</div>
                  <div className="text-xs sm:text-sm text-blue-700">Completion Rate</div>
                </CardContent>
              </Card>
            </div>

            <div className="space-y-3">
              <div className={`p-4 border rounded ${surveyCompleted ? 'bg-green-50 border-green-200' : 'bg-yellow-50 border-yellow-200'}`}>
                <div className="flex items-center space-x-2 mb-2">
                  {surveyCompleted ? (
                    <CheckCircle className="h-4 w-4 text-green-600" />
                  ) : (
                    <Bell className="h-4 w-4 text-yellow-600" />
                  )}
                  <span className={`font-medium ${surveyCompleted ? 'text-green-800' : 'text-yellow-800'}`}>
                    Daily Symptom Diary - {surveyCompleted ? 'Completed' : 'Due Today'}
                  </span>
                </div>
                <p className={`text-sm mb-3 ${surveyCompleted ? 'text-green-700' : 'text-yellow-700'}`}>
                  {surveyCompleted ? 'Thank you for completing today\'s survey!' : 'Quick 5-minute survey about your daily symptoms'}
                </p>
                {!surveyCompleted && (
                  <Button size="sm" className="w-full sm:w-auto" onClick={handleCompleteSurvey}>
                    Complete Now
                  </Button>
                )}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="visits" className="space-y-4">
            <h3 className="text-lg font-medium text-studio-text">Site Visits</h3>
            
            <div className="space-y-3">
              <Card className="bg-studio-surface border-studio-border">
                <CardContent className="p-4">
                  <div className="flex items-start space-x-3">
                    <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                    <div className="flex-1">
                      <p className="font-medium text-studio-text">Baseline Visit - Completed</p>
                      <p className="text-sm text-studio-text-muted">Nov 15, 2024 at 2:00 PM</p>
                      <p className="text-xs text-studio-text-muted mt-1">Blood draw, vitals, questionnaires completed</p>
                      <div className="bg-gray-50 border border-gray-200 rounded p-2 text-xs text-gray-700 mt-2">
                        <strong>Visit Notes:</strong> All procedures completed successfully. Blood pressure slightly elevated, will monitor at next visit. Patient reported no adverse events.
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-blue-50 border-blue-200">
                <CardContent className="p-4">
                  <div className="flex items-start space-x-3">
                    <Clock className="h-5 w-5 text-blue-600 mt-0.5" />
                    <div className="flex-1">
                      <p className="font-medium text-blue-800">Week 4 Visit - Scheduled</p>
                      <p className="text-sm text-blue-700">Dec 15, 2024 at 2:00 PM</p>
                      <p className="text-xs text-blue-700 mt-1">Blood draw, safety assessment, questionnaires</p>
                      <div className="bg-blue-100 border border-blue-300 rounded p-2 text-xs text-blue-800 mt-2">
                        <strong>Preparation Notes:</strong> Please fast for 12 hours before the visit. Bring your medication diary and any questions you may have.
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="profile" className="space-y-4">
            <h3 className="text-lg font-medium text-studio-text">Your Profile</h3>
            
            <div className="space-y-4">
              <Card className="bg-studio-surface border-studio-border">
                <CardContent className="p-4">
                  <div className="flex items-center space-x-3">
                    <Barcode className="h-8 w-8 text-studio-text-muted" />
                    <div>
                      <p className="font-medium text-studio-text">Participant Token</p>
                      <code className="text-lg font-mono bg-gray-100 px-3 py-1 rounded">
                        {participantToken}
                      </code>
                      <p className="text-xs text-studio-text-muted mt-1">
                        This unique token identifies you in the study while protecting your privacy
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Button 
                variant="studio" 
                className="w-full justify-start"
                onClick={() => setShowProfile(true)}
              >
                <User className="h-4 w-4 mr-2" />
                View Profile & Settings
              </Button>
              
              <Button 
                variant="studio" 
                className="w-full justify-start"
                onClick={handleExportPDF}
              >
                <Download className="h-4 w-4 mr-2" />
                Export My Responses (PDF)
              </Button>

              <Card className="bg-blue-50 border-blue-200">
                <CardContent className="p-4">
                  <div className="flex items-start space-x-3">
                    <Shield className="h-5 w-5 text-blue-600 mt-0.5" />
                    <div>
                      <p className="font-medium text-blue-800">Privacy & Security</p>
                      <p className="text-xs text-blue-700 mt-1">
                        Your data is encrypted and protected according to HIPAA standards. 
                        All responses are de-identified for analysis.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </main>

      <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6">
        <Button
          onClick={() => setShowChatbot(true)}
          className="h-12 w-12 sm:h-14 sm:w-14 rounded-full bg-blue-600 hover:bg-blue-700 shadow-lg"
          size="icon"
        >
          <MessageCircle className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
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
