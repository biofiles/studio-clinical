import { useState } from "react";
import { useNavigate } from "react-router-dom";
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
import StudyResultsSignup from "@/components/StudyResultsSignup";
import { useLanguage } from "@/contexts/LanguageContext";
import { Calendar, FileText, Bell, Activity, Download, MessageCircle, User, Shield, Clock, CheckCircle, MapPin, Stethoscope, Barcode, Signature, Building, Settings, Scale } from "lucide-react";
const ParticipantDashboard = () => {
  const {
    t,
    language
  } = useLanguage();
  const navigate = useNavigate();
  const [showCalendar, setShowCalendar] = useState(false);
  const [showQuestionnaires, setShowQuestionnaires] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [showChatbot, setShowChatbot] = useState(false);
  const [showEConsent, setShowEConsent] = useState(false);
  const [eConsentMode, setEConsentMode] = useState<'sign' | 'view'>('sign');
  const [surveyCompleted, setSurveyCompleted] = useState(false);
  const studyProgress = 65;
  const daysLeft = 30;
  const participantToken = "PTK-9283-WZ1";
  const upcomingActivities = [{
    date: t('common.next'),
    activity: t('activity.weekly.survey'),
    time: "10:00 AM",
    type: "questionnaire",
    details: t('activity.weekly.survey.details'),
    location: t('activity.online.location')
  }, {
    date: "15 Dic",
    activity: t('activity.site.visit.blood'),
    time: "2:00 PM",
    type: "visit",
    details: t('activity.site.visit.blood.details'),
    location: t('activity.hospital.location'),
    notes: t('activity.site.visit.notes')
  }, {
    date: "20 Dic",
    activity: t('activity.daily.diary'),
    time: t('activity.anytime'),
    type: "diary",
    details: t('activity.daily.diary.details'),
    location: t('activity.mobile.location')
  }];
  const handleCompleteSurvey = () => {
    setSurveyCompleted(true);
    alert(t('activity.survey.completed'));
  };
  const handleExportPDF = () => {
    alert(t('activity.pdf.export'));
  };
  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'visit':
        return <Stethoscope className="h-5 w-5" />;
      case 'questionnaire':
        return <FileText className="h-5 w-5" />;
      case 'diary':
        return <FileText className="h-5 w-5" />;
      default:
        return <Activity className="h-5 w-5" />;
    }
  };
  return <div className="min-h-screen bg-studio-bg">
      <Header role="participant" />


      <main className="p-3 sm:p-4 max-w-6xl mx-auto">{/* Reduced padding for mobile */}
        {/* Welcome Section - Mobile first */}
        <div className="space-y-1 mb-4" data-onboarding="welcome-section">
          <h2 className="text-xl sm:text-2xl font-medium text-studio-text">
            {t('common.welcome')}
          </h2>
          <p className="text-studio-text-muted text-sm sm:text-base">
            Protocolo NVS-4578-301 | Patrocinador: Novartis AG | PARADIGM-CV
          </p>
        </div>

        {/* Progress Overview - Mobile optimized */}
        <Card className="bg-studio-surface border-studio-border mb-4" data-onboarding="progress-card">{/* Reduced margin */}
          <CardContent className="p-4 sm:p-6">
            <div className="space-y-4 sm:space-y-0 sm:flex sm:items-center sm:justify-between">
              <div className="flex-1 sm:mr-6">
                <div className="flex justify-between items-center mb-3">
                  <span className="text-base sm:text-lg font-medium text-studio-text-muted">{t('dashboard.study.progress')}</span>
                  <span className="text-xl sm:text-2xl font-bold text-studio-text">{studyProgress}%</span>
                </div>
                <Progress value={studyProgress} color="gray" className="h-4 mb-1" />
              </div>
              <div className="flex items-center justify-between sm:block sm:text-right bg-studio-surface/50 rounded-lg p-3 sm:bg-transparent sm:p-0">
                <div className="sm:text-center">
                  <p className="text-4xl sm:text-5xl font-bold text-studio-text">{daysLeft}</p>
                  <p className="text-base sm:text-lg text-studio-text-muted font-medium">{t('participant.days.remaining')}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Main Sections - Mobile-first tabs */}
        <Tabs defaultValue="schedule" className="space-y-3">{/* Reduced spacing */}
          <TabsList className="grid w-full grid-cols-3 sm:grid-cols-6 h-auto gap-1">{/* Updated for 6 tabs */}
            <TabsTrigger value="schedule" data-tab="schedule" className="flex flex-col items-center space-y-0.5 h-14 sm:h-10 sm:flex-row sm:space-y-0 sm:space-x-2 text-sm">
              <Calendar className="h-5 w-5 sm:h-4 sm:w-4" />
              <span className="text-xs sm:text-xs">{t('dashboard.manage.calendar')}</span>
            </TabsTrigger>
            <TabsTrigger value="questionnaires" data-tab="questionnaires" className="flex flex-col items-center space-y-0.5 h-14 sm:h-10 sm:flex-row sm:space-y-0 sm:space-x-2 text-sm">
              <FileText className="h-5 w-5 sm:h-4 sm:w-4" />
              <span className="text-xs sm:text-xs">{t('dashboard.questionnaires')}</span>
            </TabsTrigger>
            <TabsTrigger value="econsent" data-tab="econsent" className="flex flex-col items-center space-y-0.5 h-14 sm:h-10 sm:flex-row sm:space-y-0 sm:space-x-2 text-sm">
              <Signature className="h-5 w-5 sm:h-4 sm:w-4" />
              <span className="text-xs sm:text-xs">{t('econsent.title')}</span>
            </TabsTrigger>
            <TabsTrigger value="visits" data-tab="visits" className="flex flex-col items-center space-y-0.5 h-14 sm:h-10 sm:flex-row sm:space-y-0 sm:space-x-2 text-sm">
              <Activity className="h-5 w-5 sm:h-4 sm:w-4" />
              <span className="text-xs sm:text-xs">{t('dashboard.site.visits')}</span>
            </TabsTrigger>
            <TabsTrigger value="contact" data-tab="contact" className="flex flex-col items-center space-y-0.5 h-14 sm:h-10 sm:flex-row sm:space-y-0 sm:space-x-2 text-sm">
              <MapPin className="h-5 w-5 sm:h-4 sm:w-4" />
              <span className="text-xs sm:text-xs">{t('contact.info')}</span>
            </TabsTrigger>
            <TabsTrigger value="profile" data-tab="profile" className="flex flex-col items-center space-y-0.5 h-14 sm:h-10 sm:flex-row sm:space-y-0 sm:space-x-2 text-sm">
              <User className="h-5 w-5 sm:h-4 sm:w-4" />
              <span className="text-xs sm:text-xs">{t('participant.profile')}</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="schedule" className="space-y-3">{/* Reduced spacing */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-2 sm:space-y-0">
              <h3 className="text-lg sm:text-xl font-medium text-studio-text">{t('participant.schedule')}</h3>
              <Button variant="studio" size="sm" onClick={() => setShowCalendar(true)} className="w-full sm:w-auto">
                <Calendar className="h-4 w-4 mr-2" />
                {t('calendar.view.full')}
              </Button>
            </div>
            
            <div className="space-y-4">
              {upcomingActivities.map((item, index) => <Card key={index} className="bg-studio-surface border-studio-border">
                  <CardContent className="p-4">
                    <div className="space-y-3">
                      <div className="flex items-start space-x-3">
                        <div className="flex-shrink-0 mt-1">
                          {getActivityIcon(item.type)}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-1">
                            <p className="font-medium text-studio-text text-base sm:text-lg">{item.activity}</p>
                            <Badge variant="secondary" className={`text-sm border ${item.type === 'visit' ? 'bg-destructive/10 text-destructive border-destructive/20' : item.type === 'questionnaire' ? 'bg-[hsl(var(--progress-info))]/10 text-[hsl(var(--progress-info))] border-[hsl(var(--progress-info))]/20' : item.type === 'diary' ? 'bg-[hsl(var(--progress-success))]/10 text-[hsl(var(--progress-success))] border-[hsl(var(--progress-success))]/20' : 'bg-muted text-muted-foreground border-border'}`}>
                              {t(`activity.${item.type}`)}
                            </Badge>
                          </div>
                          <p className="text-sm sm:text-base text-studio-text-muted mb-2">{item.date} at {item.time}</p>
                          <p className="text-sm sm:text-base text-studio-text mb-2">{item.details}</p>
                          <div className="flex items-center space-x-1 text-sm text-studio-text-muted mb-2">
                            <MapPin className="h-4 w-4" />
                            <span>{item.location}</span>
                          </div>
                           {item.notes && <div className="bg-blue-50 border border-blue-200 rounded p-3 text-sm text-blue-800">
                              <strong>{t('activity.important.notes')}:</strong> {item.notes}
                            </div>}
                        </div>
                      </div>
                      
                    </div>
                  </CardContent>
                </Card>)}
            </div>
          </TabsContent>

          <TabsContent value="questionnaires" className="space-y-4">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-2 sm:space-y-0">
              <h3 className="text-lg sm:text-xl font-medium text-studio-text">{t('questionnaire.surveys')}</h3>
              <Button variant="studio" size="sm" onClick={() => setShowQuestionnaires(true)} className="w-full sm:w-auto">
                <FileText className="h-4 w-4 mr-2" />
                {t('questionnaire.view.all')}
              </Button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              <Card className="bg-[hsl(var(--progress-info))]/5 border-[hsl(var(--progress-info))]/20">
                <CardContent className="p-4 text-center">
                  <div className="text-2xl sm:text-3xl font-bold text-[hsl(var(--progress-info))]">3</div>
                  <div className="text-sm sm:text-base text-[hsl(var(--progress-info))]/80">{t('questionnaire.pending')}</div>
                </CardContent>
              </Card>
              <Card className="bg-[hsl(var(--progress-success))]/5 border-[hsl(var(--progress-success))]/20">
                <CardContent className="p-4 text-center">
                  <div className="text-2xl sm:text-3xl font-bold text-[hsl(var(--progress-success))]">12</div>
                  <div className="text-sm sm:text-base text-[hsl(var(--progress-success))]/80">{t('questionnaire.completed')}</div>
                </CardContent>
              </Card>
              <Card className="bg-[hsl(var(--progress-primary))]/5 border-[hsl(var(--progress-primary))]/20 col-span-2 sm:col-span-1">
                <CardContent className="p-4 text-center">
                  <div className="text-2xl sm:text-3xl font-bold text-[hsl(var(--progress-primary))]">80%</div>
                  <div className="text-sm sm:text-base text-[hsl(var(--progress-primary))]/80">{t('questionnaire.completion.rate')}</div>
                </CardContent>
              </Card>
            </div>

            <div className="space-y-3">
              
            </div>
          </TabsContent>

          <TabsContent value="econsent" className="space-y-4">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-2 sm:space-y-0">
              <h3 className="text-lg sm:text-xl font-medium text-studio-text">{t('econsent.section.title')}</h3>
              <Button variant="studio" size="sm" onClick={() => setShowEConsent(true)} className="w-full sm:w-auto">
                <Signature className="h-4 w-4 mr-2" />
                {t('econsent.view.signed')}
              </Button>
            </div>

            {/* Consent Signature Dates Widget */}
            <div className="grid grid-cols-2 gap-4">
              <Card className="bg-[hsl(var(--progress-success))]/5 border-[hsl(var(--progress-success))]/20">
                <CardContent className="p-4 text-center">
                  <div className="text-lg font-bold text-[hsl(var(--progress-success))]">15 Oct 2024</div>
                  <div className="text-xs text-[hsl(var(--progress-success))]/80">Primer Consentimiento</div>
                </CardContent>
              </Card>
              <Card className="bg-[hsl(var(--progress-primary))]/5 border-[hsl(var(--progress-primary))]/20">
                <CardContent className="p-4 text-center">
                  <div className="text-lg font-bold text-[hsl(var(--progress-primary))]">24 Nov 2024</div>
                  <div className="text-xs text-[hsl(var(--progress-primary))]/80">Último Consentimiento</div>
                </CardContent>
              </Card>
            </div>

            {/* Consent History */}
            <Card className="bg-studio-surface border-studio-border">
              <CardHeader>
                <CardTitle className="text-sm">{t('econsent.history')}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="space-y-2">
                  <div className="flex items-center justify-between p-2 bg-[hsl(var(--progress-success))]/5 border border-[hsl(var(--progress-success))]/20 rounded">
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="h-4 w-4 shrink-0 text-[hsl(var(--progress-success))]" />
                      <div>
                        <p className="text-sm font-medium">{language === 'spanish' ? 'Formulario de consentimiento informado Principal v2.0' : 'Main Informed Consent Form v2.0'}</p>
                        <p className="text-xs text-studio-text-muted">Firmado el 24 Nov 2024</p>
                      </div>
                    </div>
                    <Badge className="bg-[hsl(var(--progress-success))]/10 text-[hsl(var(--progress-success))] border border-[hsl(var(--progress-success))]/20 cursor-pointer hover:bg-[hsl(var(--progress-success))]/20 transition-colors" onClick={() => {
                    setEConsentMode('view');
                    setShowEConsent(true);
                  }}>
                      {t('econsent.status.signed')}
                    </Badge>
                  </div>
                  
                  <div className="flex items-center justify-between p-2 bg-gray-50 border border-gray-200 rounded">
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="h-4 w-4 shrink-0 text-gray-600" />
                      <div>
                        <p className="text-sm font-medium">{language === 'spanish' ? 'Formulario de consentimiento informado Principal v1.0' : 'Main Informed Consent Form v1.0'}</p>
                        <p className="text-xs text-studio-text-muted">Firmado el 15 Oct 2024</p>
                      </div>
                    </div>
                    <Badge className="bg-gray-100 text-gray-800 cursor-pointer hover:bg-gray-200 transition-colors" onClick={() => {
                    setEConsentMode('view');
                    setShowEConsent(true);
                  }}>
                      {t('econsent.status.superseded')}
                    </Badge>
                  </div>

                  <div className="flex items-center justify-between p-2 bg-yellow-50 border border-yellow-200 rounded">
                    <div className="flex items-center space-x-2">
                      <Clock className="h-4 w-4 shrink-0 text-yellow-600" />
                      <div>
                        <p className="text-sm font-medium">Adenda de Seguridad v1.0</p>
                        <p className="text-xs text-studio-text-muted">Disponible para firma</p>
                      </div>
                    </div>
                    <Badge className="bg-yellow-100 text-yellow-800 cursor-pointer hover:bg-yellow-200 transition-colors" onClick={() => {
                    setEConsentMode('sign');
                    setShowEConsent(true);
                  }}>
                      {t('econsent.status.pending')}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-blue-50 border-blue-200">
              <CardContent className="p-4">
                <div className="flex items-start space-x-3">
                  <Clock className="h-6 w-6 text-blue-600 mt-1" />
                  <div className="flex-1">
                    <p className="font-medium text-blue-800">Próximo Consentimiento Pendiente</p>
                    <p className="text-sm text-blue-700 mt-1">
                      <strong>Adenda de Seguridad v1.0</strong> - Disponible para firma
                    </p>
                    <div className="text-xs text-blue-600 mt-2 space-y-1">
                      <p>• Documento disponible desde: 1 Dic 2024</p>
                      <p>• Plazo para firmar: Hasta 15 Dic 2024</p>
                      <p>• Modalidad: Firma electrónica con audio disponible</p>
                    </div>
                    <Button size="sm" className="mt-3" onClick={() => {
                    setEConsentMode('sign');
                    setShowEConsent(true);
                  }}>
                      <Signature className="h-4 w-4 mr-2" />
                      Firmar Ahora
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="visits" className="space-y-4">
            <h3 className="text-lg sm:text-xl font-medium text-studio-text">{t('visits.site.visits')}</h3>
            
            <div className="space-y-3">
              <Card className="bg-gray-50 border-gray-200">
                <CardContent className="p-4">
                  <div className="flex items-start space-x-3">
                    <CheckCircle className="h-5 w-5 text-gray-600 mt-0.5" />
                    <div className="flex-1">
                      <p className="font-medium text-gray-800">{t('visits.baseline.completed')}</p>
                      <p className="text-sm text-gray-600">15 Nov 2024 a las 2:00 PM</p>
                      <p className="text-xs text-gray-600 mt-1">{t('visits.baseline.procedures')}</p>
                      <div className="bg-gray-100 border border-gray-300 rounded p-2 text-xs text-gray-700 mt-2">
                        <strong>{t('visits.notes')}:</strong> {t('visits.baseline.notes')}
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
                      <p className="font-medium text-gray-800">{t('visits.week4.scheduled')}</p>
                      <p className="text-sm text-gray-600">15 Dic 2024 a las 2:00 PM</p>
                      <p className="text-xs text-gray-600 mt-1">{t('visits.week4.procedures')}</p>
                      <div className="bg-gray-50 border border-gray-200 rounded p-2 text-xs text-gray-700 mt-2">
                        <strong>{t('visits.preparation.notes')}:</strong> {t('visits.week4.notes')}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="contact" className="space-y-3">
            <h3 className="text-lg sm:text-xl font-medium text-studio-text">{t('contact.info')}</h3>
            
            {/* Important Safety Note - Moved to top */}
            <div className="bg-orange-50 border border-orange-200 rounded p-2 text-xs text-orange-800">
              <strong>{t('contact.safety.note')}:</strong> {t('contact.safety.description')}
            </div>
            
            <div className="space-y-4">
              {/* Site Staff Contact */}
              <Card className="bg-studio-surface border-studio-border">
                <CardHeader>
                  <CardTitle className="text-sm flex items-center space-x-2">
                    <Stethoscope className="h-4 w-4" />
                    <span>{t('contact.site.staff')}</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-studio-text-muted">{t('contact.principal.investigator')}:</span>
                      <span className="text-sm font-medium">Dr. Carlos Mendoza</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-studio-text-muted">{t('contact.study.coordinator')}:</span>
                      <span className="text-sm font-medium">Lic. Sofía Gutierrez</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-studio-text-muted">{t('contact.phone')}:</span>
                      <a href="tel:+541148765432" className="text-sm text-blue-600 hover:underline">+54 11 4876-5432</a>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-studio-text-muted">{t('contact.email')}:</span>
                      <a href="mailto:estudio@hospital.com.ar" className="text-sm text-blue-600 hover:underline">estudio@hospital.com.ar</a>
                    </div>
                    
                  </div>
                </CardContent>
              </Card>

              {/* Regulatory Authorities */}
              <Card className="bg-studio-surface border-studio-border">
                <CardHeader>
                  <CardTitle className="text-sm flex items-center space-x-2">
                    <Shield className="h-4 w-4" />
                    <span>{t('contact.regulatory.authorities')}</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-studio-text-muted">ANMAT (Argentina):</span>
                      <a href="tel:+541143401400" className="text-sm text-blue-600 hover:underline">+54 11 4340-1400</a>
                    </div>
                    
                    
                  </div>
                </CardContent>
              </Card>

              {/* Ethics Committee */}
              <Card className="bg-studio-surface border-studio-border">
                <CardHeader>
                  <CardTitle className="text-sm flex items-center space-x-2">
                    <Scale className="h-4 w-4" />
                    <span>Comité de Ética</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-studio-text-muted">Comité:</span>
                      <span className="text-sm font-medium">CEI Hospital Metro General</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-studio-text-muted">Presidente:</span>
                      <span className="text-sm font-medium">Dr. María Elena Rodriguez</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-studio-text-muted">{t('contact.phone')}:</span>
                      <a href="tel:+541148765450" className="text-sm text-blue-600 hover:underline">+54 11 4876-5450</a>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-studio-text-muted">{t('contact.email')}:</span>
                      <a href="mailto:cei@hospital.com.ar" className="text-sm text-blue-600 hover:underline">cei@hospital.com.ar</a>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="profile" className="space-y-3">
            <h3 className="text-lg sm:text-xl font-medium text-studio-text">{t('participant.profile')}</h3>
            
            <div className="space-y-4">
              {/* Patient ID Card */}
              <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-2">
                      
                      <p className="text-sm opacity-90">Patient ID Card</p>
                      <div className="space-y-1">
                        <p className="text-xs opacity-75">Protocolo: NVS-4578-301</p>
                        <p className="text-xs opacity-75">Site: Metro General Hospital</p>
                      </div>
                    </div>
                    <div className="text-right space-y-1">
                      <div onClick={() => setShowProfile(true)} className="bg-white text-gray-800 px-3 py-2 rounded cursor-pointer hover:bg-gray-100 transition-colors">
                        <div className="text-xs font-mono leading-tight text-center">
                          ||||||||||||||||<br />
                          {participantToken}<br />
                          ||||||||||||||||
                        </div>
                      </div>
                      <p className="text-xs opacity-75">{t('contact.tap.for.details')}</p>
                    </div>
                  </div>
                  <div className="mt-4 pt-3 border-t border-white/20">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="text-xs opacity-75">{t('contact.unblinding.emergency')}</p>
                        <p className="text-sm font-semibold">24/7: +54 11 987-654-321</p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs opacity-75">{t('contact.issued')}</p>
                        <p className="text-xs">15 Oct 2024</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Participant Token Section */}
              <Card className="bg-studio-surface border-studio-border">
                <CardContent className="p-4">
                  <div className="flex items-center space-x-3">
                    <div className="flex-1">
                      <p className="font-medium text-studio-text">{t('participant.token')}</p>
                      <button onClick={() => setShowProfile(true)} className="text-lg font-mono bg-gray-100 px-3 py-1 rounded hover:bg-gray-200 transition-colors cursor-pointer border-2 border-dashed border-gray-300 hover:border-gray-400">
                        {participantToken}
                      </button>
                      <p className="text-xs text-studio-text-muted mt-1">
                        {t('contact.token.description')}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              
              <StudyResultsSignup variant="participant" />
              
              <Button variant="studio" className="w-full justify-start" onClick={handleExportPDF}>
                <Download className="h-4 w-4 mr-2" />
                {t('profile.export.pdf')}
              </Button>

              <Card className="bg-blue-50 border-blue-200">
                <CardContent className="p-4">
                  <div className="flex items-start space-x-3">
                    <Shield className="h-5 w-5 text-blue-600 mt-0.5" />
                    <div>
                      <p className="font-medium text-blue-800">{t('profile.privacy.security')}</p>
                      <p className="text-xs text-blue-700 mt-1">
                        {t('profile.privacy.description')}
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
        <Button onClick={() => setShowChatbot(true)} className="h-12 w-12 sm:h-14 sm:w-14 rounded-full bg-blue-600 hover:bg-blue-700 shadow-lg" size="icon">
          <MessageCircle className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
        </Button>
      </div>

      {/* Dialogs */}
      <CalendarView open={showCalendar} onOpenChange={setShowCalendar} activities={upcomingActivities} />
      
      <QuestionnairesView open={showQuestionnaires} onOpenChange={setShowQuestionnaires} />

      <UserProfileDialog open={showProfile} onOpenChange={setShowProfile} />

      <AIChatbot open={showChatbot} onOpenChange={setShowChatbot} />

      <EConsentDialog open={showEConsent} onOpenChange={setShowEConsent} mode={eConsentMode} />
    </div>;
};
export default ParticipantDashboard;