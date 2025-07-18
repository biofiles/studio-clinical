
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import Header from "@/components/Header";
import { Users, FileCheck, AlertTriangle, BarChart3, Calendar, UserCheck, MessageCircle, Download, Settings, QrCode, Globe, Database } from "lucide-react";
import ParticipantList from "@/components/ParticipantList";
import AIChatbot from "@/components/AIChatbot";
import CalendarManagement from "@/components/CalendarManagement";
import BarcodeScanner from "@/components/BarcodeScanner";
import FHIRExportDialog from "@/components/FHIRExportDialog";
import { CDISCExportDialog } from "@/components/CDISCExportDialog";
import InvestigatorQuestionnaires from "@/components/InvestigatorQuestionnaires";
import InvestigatorConsentDashboard from "@/components/InvestigatorConsentDashboard";
import StudyResultsSignup from "@/components/StudyResultsSignup";
import { useLanguage } from "@/contexts/LanguageContext";
import { useStudy } from "@/contexts/StudyContext";
import { useNavigate } from "react-router-dom";

const InvestigatorDashboard = () => {
  const [showParticipantList, setShowParticipantList] = useState(false);
  const [showChatbot, setShowChatbot] = useState(false);
  const [showCalendarManagement, setShowCalendarManagement] = useState(false);
  const [showBarcodeScanner, setShowBarcodeScanner] = useState(false);
  const [showFHIRExport, setShowFHIRExport] = useState(false);
  const [showCDISCExport, setShowCDISCExport] = useState(false);
  const [showQuestionnaires, setShowQuestionnaires] = useState(false);
  const [showConsentDashboard, setShowConsentDashboard] = useState(false);
  const { t } = useLanguage();
  const { selectedStudy } = useStudy();
  const navigate = useNavigate();

  // Redirect to study selection if no study is selected
  useEffect(() => {
    if (!selectedStudy) {
      navigate('/select-study');
    }
  }, [selectedStudy, navigate]);

  // Dynamic data based on selected study
  const getStudyData = () => {
    if (!selectedStudy) return null;
    
    switch (selectedStudy.id) {
      case '1': // PARADIGM-CV
        return {
          enrolled: { current: 24, total: 40, percentage: 60 },
          pendingReviews: 12,
          adverseEvents: 1,
          upcomingVisits: 8,
          diaryCompliance: 91,
          visitCompliance: 94,
          nextEvents: [
            { date: "Jul 18, 2025", time: "9:30 AM", event: "S004 - " + (t ? t('dashboard.event.baseline.assessment') : 'Baseline Assessment'), type: "visit" },
            { date: "Jul 22, 2025", time: "1:15 PM", event: "S007 - " + (t ? t('dashboard.event.ecg.monitoring') : 'ECG Monitoring'), type: "lab" },
            { date: "Jul 25, 2025", time: "11:00 AM", event: t ? t('dashboard.event.safety.review') : 'Weekly Safety Review', type: "meeting" },
            { date: "Aug 02, 2025", time: "3:45 PM", event: "S002 - " + (t ? t('dashboard.event.followup.visit') : 'Follow-up Visit'), type: "visit" }
          ]
        };
      case '2': // ATLAS-DM2
        return {
          enrolled: { current: 18, total: 35, percentage: 51 },
          pendingReviews: 7,
          adverseEvents: 0,
          upcomingVisits: 5,
          diaryCompliance: 88,
          visitCompliance: 97,
          nextEvents: [
            { date: "Jul 19, 2025", time: "10:00 AM", event: "P003 - " + (t ? t('dashboard.event.hba1c.test') : 'HbA1c Test'), type: "lab" },
            { date: "Jul 24, 2025", time: "2:30 PM", event: "P008 - " + (t ? t('dashboard.event.dosing.visit') : 'Dosing Visit'), type: "visit" },
            { date: "Jul 28, 2025", time: "4:00 PM", event: t ? t('dashboard.event.dmc.safety.meeting') : 'DMC Safety Meeting', type: "meeting" }
          ]
        };
      case '3': // HORIZON-Onc
        return {
          enrolled: { current: 12, total: 25, percentage: 48 },
          pendingReviews: 15,
          adverseEvents: 3,
          upcomingVisits: 11,
          diaryCompliance: 85,
          visitCompliance: 92,
          nextEvents: [
            { date: "Jul 20, 2025", time: "8:45 AM", event: "H001 - " + (t ? t('dashboard.event.tumor.assessment') : 'Tumor Assessment'), type: "visit" },
            { date: "Jul 23, 2025", time: "11:30 AM", event: "H005 - " + (t ? t('dashboard.event.biomarker.analysis') : 'Biomarker Analysis'), type: "lab" },
            { date: "Jul 26, 2025", time: "1:00 PM", event: t ? t('dashboard.event.oncology.team.review') : 'Oncology Team Review', type: "meeting" }
          ]
        };
      case '4': // GUARDIAN-Ped
        return {
          enrolled: { current: 31, total: 50, percentage: 62 },
          pendingReviews: 9,
          adverseEvents: 0,
          upcomingVisits: 14,
          diaryCompliance: 93,
          visitCompliance: 98,
          nextEvents: [
            { date: "Jul 21, 2025", time: "3:15 PM", event: "G006 - " + (t ? t('dashboard.event.growth.assessment') : 'Growth Assessment'), type: "visit" },
            { date: "Jul 24, 2025", time: "9:00 AM", event: "G012 - " + (t ? t('dashboard.event.safety.labs') : 'Safety Labs'), type: "lab" },
            { date: "Jul 27, 2025", time: "10:30 AM", event: t ? t('dashboard.event.pediatric.safety.review') : 'Pediatric Safety Review', type: "meeting" }
          ]
        };
      default:
        return null;
    }
  };

  const studyData = getStudyData();

  const handleExportQuestionnaires = () => {
    alert("Exporting questionnaire data as PDF...");
  };

  const handleQuestionnaires = () => {
    setShowQuestionnaires(true);
  };

  return (
    <div className="min-h-screen bg-studio-bg">
      <Header
        role="investigator"
      />

      <main className="p-6 max-w-6xl mx-auto space-y-6">
        <div className="space-y-2">
          <h2 className="text-xl font-medium text-studio-text">
            {t('dashboard.title')}
          </h2>
          <p className="text-studio-text-muted">
            {selectedStudy ? `${selectedStudy.protocol} | ${selectedStudy.name} | ${selectedStudy.sponsor}` : t('dashboard.protocol')}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4" data-onboarding="study-metrics">
          <Card className="bg-studio-surface border-studio-border">
            <CardContent className="p-6">
              <div className="flex items-center space-x-2">
                <Users className="h-5 w-5 text-studio-text-muted" />
                <span className="text-2xl font-semibold text-studio-text">
                  {studyData ? `${studyData.enrolled.current}/${studyData.enrolled.total}` : '0/0'}
                </span>
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
                <span className="text-2xl font-semibold text-studio-text">
                  {studyData ? studyData.pendingReviews : '0'}
                </span>
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
                <span className="text-2xl font-semibold text-studio-text">
                  {studyData ? studyData.adverseEvents : '0'}
                </span>
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
                <span className="text-2xl font-semibold text-studio-text">
                  {studyData ? studyData.upcomingVisits : '0'}
                </span>
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
              {studyData && studyData.nextEvents.map((item, index) => (
                <div key={index} className="flex justify-between items-center p-3 bg-studio-bg rounded">
                  <div>
                    <p className="font-medium text-studio-text">{item.event}</p>
                    <p className="text-sm text-studio-text-muted">{item.date} {t('dashboard.at')} {item.time}</p>
                  </div>
                  <div className="text-right">
                    <span className={`px-2 py-1 text-xs rounded border ${
                      item.type === 'visit' ? 'bg-[hsl(var(--progress-info))]/10 text-[hsl(var(--progress-info))] border-[hsl(var(--progress-info))]/20' :
                      item.type === 'lab' ? 'bg-[hsl(var(--progress-success))]/10 text-[hsl(var(--progress-success))] border-[hsl(var(--progress-success))]/20' :
                      'bg-[hsl(var(--progress-accent))]/10 text-[hsl(var(--progress-accent))] border-[hsl(var(--progress-accent))]/20'
                    }`}>
                      {t(`dashboard.event.type.${item.type}`)}
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
                data-onboarding="participant-list-btn"
              >
                <Users className="h-4 w-4 mr-2" />
                {t('dashboard.participant.list')}
              </Button>
              <Button 
                variant="studio" 
                className="w-full justify-start"
                onClick={() => setShowCalendarManagement(true)}
                data-onboarding="calendar-btn"
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
                onClick={() => setShowConsentDashboard(true)}
              >
                <UserCheck className="h-4 w-4 mr-2" />
                {t('consent.dashboard.title')}
              </Button>
              <Button 
                variant="studio" 
                className="w-full justify-start"
                onClick={() => setShowBarcodeScanner(true)}
                data-onboarding="barcode-btn"
              >
                <QrCode className="h-4 w-4 mr-2" />
                {t('dashboard.barcode.scanner')}
              </Button>
              <StudyResultsSignup variant="investigator" />
              <Button 
                variant="studio" 
                className="w-full justify-start"
                onClick={() => setShowFHIRExport(true)}
                data-onboarding="fhir-btn"
              >
                <Globe className="h-4 w-4 mr-2" />
                {t('dashboard.fhir.interoperability')}
              </Button>
              <Button 
                variant="studio" 
                className="w-full justify-start"
                onClick={() => setShowCDISCExport(true)}
                data-onboarding="cdisc-btn"
              >
                <Database className="h-4 w-4 mr-2" />
                {t('dashboard.cdisc.export') || 'Export CDISC Data'}
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

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6" data-onboarding="progress-cards">
          <Card className="bg-studio-surface border-studio-border">
            <CardHeader>
              <CardTitle className="text-studio-text">{t('dashboard.study.progress')}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-studio-text-muted">{t('dashboard.enrollment')}</span>
                  <span className="text-studio-text">
                    {studyData ? `${studyData.enrolled.current}/${studyData.enrolled.total} (${studyData.enrolled.percentage}%)` : '0/0 (0%)'}
                  </span>
                </div>
                <Progress 
                  value={studyData ? studyData.enrolled.percentage : 0} 
                  color="primary"
                  className="h-2"
                />
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
                  <span className="text-studio-text">{studyData ? studyData.diaryCompliance : 0}%</span>
                </div>
                <Progress 
                  value={studyData ? studyData.diaryCompliance : 0} 
                  color={studyData && studyData.diaryCompliance < 90 ? 'warning' : 'success'}
                  className="h-2"
                />
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
                  <span className="text-studio-text">{studyData ? studyData.visitCompliance : 0}%</span>
                </div>
                <Progress 
                  value={studyData ? studyData.visitCompliance : 0} 
                  color={studyData && studyData.visitCompliance < 90 ? 'warning' : 'success'}
                  className="h-2"
                />
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

      <BarcodeScanner 
        open={showBarcodeScanner}
        onOpenChange={setShowBarcodeScanner}
      />

      <FHIRExportDialog 
        open={showFHIRExport} 
        onOpenChange={setShowFHIRExport} 
      />

      <CDISCExportDialog 
        open={showCDISCExport}
        onOpenChange={setShowCDISCExport}
        studyId={selectedStudy?.id || ''}
        studyName={selectedStudy?.name || ''}
      />

      <InvestigatorQuestionnaires
        open={showQuestionnaires}
        onOpenChange={setShowQuestionnaires}
      />

      <InvestigatorConsentDashboard
        open={showConsentDashboard}
        onOpenChange={setShowConsentDashboard}
      />
    </div>
  );
};

export default InvestigatorDashboard;
