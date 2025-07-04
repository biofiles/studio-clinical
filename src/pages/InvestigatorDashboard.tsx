
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Header from "@/components/Header";
import { Users, FileCheck, AlertTriangle, BarChart3, Calendar, UserCheck, MessageCircle, Download, Settings } from "lucide-react";
import ParticipantList from "@/components/ParticipantList";
import AIChatbot from "@/components/AIChatbot";
import CalendarManagement from "@/components/CalendarManagement";
import { useLanguage } from "@/contexts/LanguageContext";

interface InvestigatorDashboardProps {
  onLogout: () => void;
}

const InvestigatorDashboard = ({ onLogout }: InvestigatorDashboardProps) => {
  const [showParticipantList, setShowParticipantList] = useState(false);
  const [showChatbot, setShowChatbot] = useState(false);
  const [showCalendarManagement, setShowCalendarManagement] = useState(false);
  const { t } = useLanguage();

  const nextEvents = [
    { date: "Dec 15, 2024", time: "2:00 PM", event: "P001 - Site Visit", type: "visit" },
    { date: "Dec 16, 2024", time: "10:00 AM", event: "P002 - Blood Draw", type: "lab" },
    { date: "Dec 18, 2024", time: "3:00 PM", event: "Monthly Team Meeting", type: "meeting" }
  ];

  const handleExportQuestionnaires = () => {
    alert("Exporting questionnaire data as PDF...");
  };

  const handleQuestionnaires = () => {
    alert("Opening questionnaire management interface...");
  };

  return (
    <div className="min-h-screen bg-studio-bg">
      <Header
        role="investigator"
        onLogout={onLogout}
      />

      <main className="p-6 max-w-6xl mx-auto space-y-6">
        <div className="space-y-2">
          <h2 className="text-xl font-medium text-studio-text">
            {t('dashboard.title')}
          </h2>
          <p className="text-studio-text-muted">
            {t('dashboard.protocol')}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="bg-studio-surface border-studio-border">
            <CardContent className="p-6">
              <div className="flex items-center space-x-2">
                <Users className="h-5 w-5 text-studio-text-muted" />
                <span className="text-2xl font-semibold text-studio-text">15/30</span>
              </div>
              <p className="text-studio-text-muted text-sm mt-1">
                {t('dashboard.participants.enrolled')}
              </p>
            </CardContent>
          </Card>

          <Card className="bg-studio-surface border-studio-border">
            <CardContent className="p-6">
              <div className="flex items-center space-x-2">
                <FileCheck className="h-5 w-5 text-studio-text-muted" />
                <span className="text-2xl font-semibold text-studio-text">8</span>
              </div>
              <p className="text-studio-text-muted text-sm mt-1">
                {t('dashboard.pending.reviews')}
              </p>
            </CardContent>
          </Card>

          <Card className="bg-studio-surface border-studio-border">
            <CardContent className="p-6">
              <div className="flex items-center space-x-2">
                <AlertTriangle className="h-5 w-5 text-studio-text-muted" />
                <span className="text-2xl font-semibold text-studio-text">2</span>
              </div>
              <p className="text-studio-text-muted text-sm mt-1">
                {t('dashboard.adverse.events')}
              </p>
            </CardContent>
          </Card>

          <Card className="bg-studio-surface border-studio-border">
            <CardContent className="p-6">
              <div className="flex items-center space-x-2">
                <Calendar className="h-5 w-5 text-studio-text-muted" />
                <span className="text-2xl font-semibold text-studio-text">12</span>
              </div>
              <p className="text-studio-text-muted text-sm mt-1">
                {t('dashboard.upcoming.visits')}
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="bg-studio-surface border-studio-border lg:col-span-2">
            <CardHeader>
              <CardTitle className="text-studio-text">{t('dashboard.next.events')}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {nextEvents.map((item, index) => (
                <div key={index} className="flex justify-between items-center p-3 bg-studio-bg rounded">
                  <div>
                    <p className="font-medium text-studio-text">{item.event}</p>
                    <p className="text-sm text-studio-text-muted">{item.date} at {item.time}</p>
                  </div>
                  <div className="text-right">
                    <span className={`px-2 py-1 text-xs rounded ${
                      item.type === 'visit' ? 'bg-blue-100 text-blue-800' :
                      item.type === 'lab' ? 'bg-green-100 text-green-800' :
                      'bg-purple-100 text-purple-800'
                    }`}>
                      {item.type}
                    </span>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card className="bg-studio-surface border-studio-border">
            <CardHeader>
              <CardTitle className="text-studio-text">{t('dashboard.study.management')}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button 
                variant="studio" 
                className="w-full justify-start"
                onClick={() => setShowParticipantList(true)}
              >
                <Users className="h-4 w-4 mr-2" />
                {t('dashboard.participant.list')}
              </Button>
              <Button 
                variant="studio" 
                className="w-full justify-start"
                onClick={() => setShowCalendarManagement(true)}
              >
                <Calendar className="h-4 w-4 mr-2" />
                {t('dashboard.manage.calendar')}
              </Button>
              <Button 
                variant="studio" 
                className="w-full justify-start"
                onClick={handleQuestionnaires}
              >
                <FileCheck className="h-4 w-4 mr-2" />
                {t('dashboard.questionnaires')}
              </Button>
              <Button 
                variant="studio" 
                className="w-full justify-start"
                onClick={handleExportQuestionnaires}
              >
                <Download className="h-4 w-4 mr-2" />
                {t('dashboard.export.questionnaires')}
              </Button>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="bg-studio-surface border-studio-border">
            <CardHeader>
              <CardTitle className="text-studio-text">{t('dashboard.study.progress')}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-studio-text-muted">{t('dashboard.enrollment')}</span>
                  <span className="text-studio-text">15/30 (50%)</span>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div className="bg-primary h-2 rounded-full" style={{ width: '50%' }}></div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-studio-surface border-studio-border">
            <CardHeader>
              <CardTitle className="text-studio-text">{t('dashboard.diary.compliance')}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-studio-text-muted">{t('dashboard.daily.diaries')}</span>
                  <span className="text-studio-text">89%</span>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div className="bg-green-500 h-2 rounded-full" style={{ width: '89%' }}></div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-studio-surface border-studio-border">
            <CardHeader>
              <CardTitle className="text-studio-text">{t('dashboard.visit.compliance')}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-studio-text-muted">{t('dashboard.site.visits')}</span>
                  <span className="text-studio-text">96%</span>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div className="bg-blue-500 h-2 rounded-full" style={{ width: '96%' }}></div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>

      {/* AI Chatbot Button */}
      <div className="fixed bottom-6 right-6">
        <Button
          onClick={() => setShowChatbot(true)}
          size="icon"
          className="h-14 w-14 rounded-full bg-primary hover:bg-primary/90 shadow-lg"
        >
          <MessageCircle className="h-6 w-6" />
        </Button>
      </div>

      {/* Dialogs */}
      <ParticipantList 
        open={showParticipantList}
        onOpenChange={setShowParticipantList}
      />

      <CalendarManagement
        open={showCalendarManagement}
        onOpenChange={setShowCalendarManagement}
      />

      <AIChatbot 
        open={showChatbot}
        onOpenChange={setShowChatbot}
      />
    </div>
  );
};

export default InvestigatorDashboard;
