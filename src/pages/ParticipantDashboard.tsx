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
import EConsentDialog from "@/components/EConsentDialog";
import { useLanguage } from "@/contexts/LanguageContext";
import { Calendar, FileText, Bell, Activity, Download, MessageCircle, User, Shield, Clock, CheckCircle, MapPin, Stethoscope, Barcode, Signature } from "lucide-react";

interface ParticipantDashboardProps {
  onLogout: () => void;
}

const ParticipantDashboard = ({ onLogout }: ParticipantDashboardProps) => {
  const { t } = useLanguage();
  const [showCalendar, setShowCalendar] = useState(false);
  const [showQuestionnaires, setShowQuestionnaires] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [showChatbot, setShowChatbot] = useState(false);
  const [showEConsent, setShowEConsent] = useState(false);
  const [surveyCompleted, setSurveyCompleted] = useState(false);

  const studyProgress = 65;
  const daysLeft = 30;
  const participantToken = "PTK-9283-WZ1";

  const upcomingActivities = [
    { 
      date: t('common.next'), 
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


      <main className="p-3 sm:p-4 max-w-6xl mx-auto">{/* Reduced padding for mobile */}
        {/* Welcome Section - Mobile first */}
        <div className="space-y-1 mb-4">
          <h2 className="text-lg sm:text-xl font-medium text-studio-text">
            {t('common.welcome')}!
          </h2>
          <p className="text-studio-text-muted text-xs sm:text-sm">
            Phase II Clinical Trial | {daysLeft} {t('participant.days.remaining')}
          </p>
        </div>

        {/* Progress Overview - Mobile optimized */}
        <Card className="bg-studio-surface border-studio-border mb-4">{/* Reduced margin */}
          <CardContent className="p-3 sm:p-4">{/* Reduced padding */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between space-y-4 sm:space-y-0">
              <div className="flex-1">
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-studio-text-muted">{t('dashboard.study.progress')}</span>
                  <span className="text-studio-text font-medium">{studyProgress}%</span>
                </div>
                <Progress value={studyProgress} className="h-3 mb-2" />
              </div>
              <div className="text-center sm:text-right sm:ml-6">
                <p className="text-2xl sm:text-3xl font-bold text-studio-text">{daysLeft}</p>
                <p className="text-xs text-studio-text-muted">{t('participant.days.remaining')}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Main Sections - Mobile-first tabs */}
        <Tabs defaultValue="schedule" className="space-y-3">{/* Reduced spacing */}
          <TabsList className="grid w-full grid-cols-2 sm:grid-cols-5 h-auto gap-1">{/* Added gap for mobile */}
            <TabsTrigger value="schedule" className="flex flex-col items-center space-y-0.5 h-12 sm:h-10 sm:flex-row sm:space-y-0 sm:space-x-2 text-xs">
              <Calendar className="h-4 w-4 sm:h-4 sm:w-4" />
              <span className="text-xs sm:text-sm">{t('dashboard.manage.calendar')}</span>
            </TabsTrigger>
            <TabsTrigger value="questionnaires" className="flex flex-col items-center space-y-0.5 h-12 sm:h-10 sm:flex-row sm:space-y-0 sm:space-x-2 text-xs">
              <FileText className="h-4 w-4 sm:h-4 sm:w-4" />
              <span className="text-xs sm:text-sm">{t('dashboard.questionnaires')}</span>
            </TabsTrigger>
            <TabsTrigger value="econsent" className="flex flex-col items-center space-y-0.5 h-12 sm:h-10 sm:flex-row sm:space-y-0 sm:space-x-2 text-xs">
              <Signature className="h-4 w-4 sm:h-4 sm:w-4" />
              <span className="text-xs sm:text-sm">{t('econsent.title')}</span>
            </TabsTrigger>
            <TabsTrigger value="visits" className="flex flex-col items-center space-y-0.5 h-12 sm:h-10 sm:flex-row sm:space-y-0 sm:space-x-2 text-xs">
              <Activity className="h-4 w-4 sm:h-4 sm:w-4" />
              <span className="text-xs sm:text-sm">{t('dashboard.site.visits')}</span>
            </TabsTrigger>
            <TabsTrigger value="profile" className="flex flex-col items-center space-y-0.5 h-12 sm:h-10 sm:flex-row sm:space-y-0 sm:space-x-2 text-xs">
              <User className="h-4 w-4 sm:h-4 sm:w-4" />
              <span className="text-xs sm:text-sm">{t('participant.profile')}</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="schedule" className="space-y-3">{/* Reduced spacing */}
            <div className="flex flex-col space-y-2">{/* Mobile first layout */}
              <h3 className="text-base font-medium text-studio-text">{t('participant.your.schedule')}</h3>{/* Smaller title */}
              <Button 
                variant="studio" 
                size="sm"
                onClick={() => setShowCalendar(true)}
                className="w-full text-xs"
              >
                <Calendar className="h-3 w-3 mr-1" />
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

          <TabsContent value="econsent" className="space-y-4">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-2 sm:space-y-0">
              <h3 className="text-lg font-medium text-studio-text">{t('econsent.title')}</h3>
              <Button 
                variant="studio" 
                size="sm"
                onClick={() => setShowEConsent(true)}
                className="w-full sm:w-auto"
              >
                <Signature className="h-4 w-4 mr-2" />
                {t('econsent.view.signed')}
              </Button>
            </div>
            
            <Card className="bg-blue-50 border-blue-200">
              <CardContent className="p-4">
                <div className="flex items-start space-x-3">
                  <Signature className="h-6 w-6 text-blue-600 mt-1" />
                  <div className="flex-1">
                    <p className="font-medium text-blue-800">{t('econsent.document.title')}</p>
                    <p className="text-sm text-blue-700 mt-1">
                      {t('econsent.subtitle')}
                    </p>
                    <ul className="text-xs text-blue-600 mt-2 space-y-1">
                      <li>• {t('econsent.audio.play')} / {t('econsent.audio.pause')}</li>
                      <li>• {t('econsent.search.placeholder')}</li>
                      <li>• {t('econsent.signature.required')}</li>
                    </ul>
                    <Button
                      size="sm"
                      className="mt-3"
                      onClick={() => setShowEConsent(true)}
                    >
                      <FileText className="h-4 w-4 mr-2" />
                      {t('econsent.view.signed')}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="visits" className="space-y-4">
            <h3 className="text-lg font-medium text-studio-text">Site Visits</h3>
            
            <div className="space-y-3">
              <Card className="bg-gray-50 border-gray-200">
                <CardContent className="p-4">
                  <div className="flex items-start space-x-3">
                    <CheckCircle className="h-5 w-5 text-gray-600 mt-0.5" />
                    <div className="flex-1">
                      <p className="font-medium text-gray-800">Baseline Visit - Completed</p>
                      <p className="text-sm text-gray-600">Nov 15, 2024 at 2:00 PM</p>
                      <p className="text-xs text-gray-600 mt-1">Blood draw, vitals, questionnaires completed</p>
                      <div className="bg-gray-100 border border-gray-300 rounded p-2 text-xs text-gray-700 mt-2">
                        <strong>Visit Notes:</strong> All procedures completed successfully. Blood pressure slightly elevated, will monitor at next visit. Patient reported no adverse events.
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white border-gray-200">
                <CardContent className="p-4">
                  <div className="flex items-start space-x-3">
                    <Clock className="h-5 w-5 text-gray-600 mt-0.5" />
                    <div className="flex-1">
                      <p className="font-medium text-gray-800">Week 4 Visit - Scheduled</p>
                      <p className="text-sm text-gray-600">Dec 15, 2024 at 2:00 PM</p>
                      <p className="text-xs text-gray-600 mt-1">Blood draw, safety assessment, questionnaires</p>
                      <div className="bg-gray-50 border border-gray-200 rounded p-2 text-xs text-gray-700 mt-2">
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
                      <button 
                        onClick={() => setShowProfile(true)}
                        className="text-lg font-mono bg-gray-100 px-3 py-1 rounded hover:bg-gray-200 transition-colors cursor-pointer"
                      >
                        {participantToken}
                      </button>
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

      <EConsentDialog 
        open={showEConsent} 
        onOpenChange={setShowEConsent}
      />
    </div>
  );
};

export default ParticipantDashboard;
