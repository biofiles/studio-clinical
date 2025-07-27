import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Header from "@/components/Header";
import StudyDropdown from "@/components/StudyDropdown";
import { Building2, Globe, TrendingUp, Shield, AlertCircle, CheckCircle, Clock, FileText, Calendar, Users, Settings, Download } from "lucide-react";
import FHIRExportDialog from "@/components/FHIRExportDialog";
import { CDISCExportDialog } from "@/components/CDISCExportDialog";
import StudySignupsReportDialog from "@/components/StudySignupsReportDialog";
import { toast } from "sonner";
import { useStudy } from "@/contexts/StudyContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { formatDate } from "@/lib/utils";
import { useNavigate } from "react-router-dom";
const CROSponsorDashboard = () => {
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const [selectedStudyLocal, setSelectedStudyLocal] = useState<string | null>(null);
  const [showFHIRExport, setShowFHIRExport] = useState(false);
  const [showCDISCExport, setShowCDISCExport] = useState(false);
  const [favoriteStudyId, setFavoriteStudyId] = useState<string | null>(null);
  const {
    selectedStudy,
    studies,
    setSelectedStudy
  } = useStudy();
  const {
    t,
    language
  } = useLanguage();
  const navigate = useNavigate();

  // Helper function to convert milestone date strings to formatted dates
  const formatMilestoneDate = (dateStr: string) => {
    // Convert "Month Year" format to proper date
    const [month, year] = dateStr.split(' ');
    const monthIndex = {
      'Jan': 0, 'Feb': 1, 'Mar': 2, 'Apr': 3, 'May': 4, 'Jun': 5,
      'Jul': 6, 'Aug': 7, 'Sep': 8, 'Oct': 9, 'Nov': 10, 'Dec': 11
    }[month];
    
    if (monthIndex !== undefined && year) {
      // Use the first day of the month
      const date = new Date(parseInt(year), monthIndex, 1);
      return formatDate(date, language);
    }
    
    return dateStr; // Fallback to original string if parsing fails
  };

  // Load favorite study from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('favoriteStudyId');
    if (saved) {
      setFavoriteStudyId(saved);
      // If no study is currently selected, select the favorite one
      if (!selectedStudy) {
        const favoriteStudy = studies.find(s => s.id === saved);
        if (favoriteStudy) {
          setSelectedStudy(favoriteStudy);
        }
      }
    }
  }, [selectedStudy, studies, setSelectedStudy]);
  const localStudies = [{
    id: "PROTO-2024-001",
    title: "Phase II Oncology Trial",
    sites: 12,
    participants: 156,
    status: "Active"
  }, {
    id: "PROTO-2024-002",
    title: "Phase III Cardiology Study",
    sites: 8,
    participants: 89,
    status: "Recruiting"
  }, {
    id: "PROTO-2023-015",
    title: "Phase I Safety Study",
    sites: 3,
    participants: 24,
    status: "Completed"
  }];
  const handleStudySelect = (studyId: string) => {
    const study = studies.find(s => s.id === studyId);
    if (study) {
      setSelectedStudy(study);
    }
  };
  const alerts = [{
    type: "warning",
    message: "Site 003 enrollment behind target",
    time: "2 hours ago"
  }, {
    type: "info",
    message: "Monthly safety report submitted",
    time: "1 day ago"
  }, {
    type: "success",
    message: "Study PROTO-2024-001 milestone reached",
    time: "2 days ago"
  }];
  const handlePDFGeneration = async () => {
    setIsGeneratingPDF(true);

    // Simulate PDF generation process
    await new Promise(resolve => setTimeout(resolve, 3000));
    toast.success(t('cro.pdf.report.generated'), {
      description: t('cro.pdf.report.description')
    });
    setIsGeneratingPDF(false);
  };
  // Get dynamic data based on selected study
  const getStudySpecificData = () => {
    if (!selectedStudy) return null;
    switch (selectedStudy.id) {
      case '1':
        // Novartis PARADIGM-CV
        return {
          questionnaires: {
            dailySymptom: 91,
            weeklyQoL: 88,
            monthlyHealth: 94,
            qualityReviews: 15,
            dataValidation: 3
          },
          recruitmentMetrics: {
            rate: 12.5,
            siteActivationDays: 45
          },
          schedule: [{
            event: "Primer Sitio Iniciado",
            protocol: selectedStudy.protocol,
            date: "Oct 2024",
            type: "milestone",
            status: "completed"
          }, {
            event: "Primer Sitio Activado",
            protocol: selectedStudy.protocol,
            date: "Nov 2024",
            type: "milestone",
            status: "completed"
          }, {
            event: t('milestone.first.patient.first.visit'),
            protocol: selectedStudy.protocol,
            date: "Dec 2024",
            type: "milestone",
            status: "completed"
          }, {
            event: t('milestone.first.patient.last.visit'),
            protocol: selectedStudy.protocol,
            date: "Mar 2025",
            type: "milestone",
            status: "pending"
          }, {
            event: t('milestone.last.patient.first.visit'),
            protocol: selectedStudy.protocol,
            date: "May 2025",
            type: "milestone",
            status: "pending"
          }, {
            event: t('milestone.last.patient.last.visit'),
            protocol: selectedStudy.protocol,
            date: "Sep 2025",
            type: "milestone",
            status: "pending"
          }, {
            event: t('milestone.database.lock'),
            protocol: selectedStudy.protocol,
            date: "Jun 2025",
            type: "regulatory",
            status: "pending"
          }, {
            event: t('milestone.statistical.analysis.plan'),
            protocol: selectedStudy.protocol,
            date: "Jul 2025",
            type: "regulatory",
            status: "pending"
          }],
          participants: {
            enrollment: {
              current: 385,
              target: 450,
              percentage: 86
            },
            retention: 96.2,
            compliance: 94.1
          },
          reports: {
            budget: {
              spent: 2.8,
              total: 3.5,
              percentage: 80
            },
            timeline: 72,
            alerts: [{
              type: "info",
              message: t('alert.cardiology.milestone'),
              time: "1 hour ago"
            }, {
              type: "success",
              message: t('alert.interim.analysis'),
              time: "3 days ago"
            }]
          }
        };
      case '2':
        // Pfizer ATLAS-DM2
        return {
          questionnaires: {
            dailySymptom: 87,
            weeklyQoL: 92,
            monthlyHealth: 89,
            qualityReviews: 8,
            dataValidation: 2
          },
          recruitmentMetrics: {
            rate: 8.3,
            siteActivationDays: 62
          },
          schedule: [{
            event: "Primer Sitio Iniciado",
            protocol: selectedStudy.protocol,
            date: "Jan 2025",
            type: "milestone",
            status: "completed"
          }, {
            event: "Primer Sitio Activado",
            protocol: selectedStudy.protocol,
            date: "Feb 2025",
            type: "milestone",
            status: "completed"
          }, {
            event: t('milestone.first.patient.first.visit'),
            protocol: selectedStudy.protocol,
            date: "Mar 2025",
            type: "milestone",
            status: "completed"
          }, {
            event: t('milestone.mid.study.analysis'),
            protocol: selectedStudy.protocol,
            date: "Aug 2025",
            type: "regulatory",
            status: "pending"
          }, {
            event: t('milestone.last.patient.first.visit'),
            protocol: selectedStudy.protocol,
            date: "Oct 2025",
            type: "milestone",
            status: "pending"
          }, {
            event: t('milestone.safety.review'),
            protocol: selectedStudy.protocol,
            date: "Sep 2025",
            type: "regulatory",
            status: "pending"
          }],
          participants: {
            enrollment: {
              current: 162,
              target: 200,
              percentage: 81
            },
            retention: 93.8,
            compliance: 96.7
          },
          reports: {
            budget: {
              spent: 1.6,
              total: 2.2,
              percentage: 73
            },
            timeline: 68,
            alerts: [{
              type: "warning",
              message: t('alert.enrollment.target'),
              time: "4 hours ago"
            }, {
              type: "info",
              message: t('alert.safety.review'),
              time: "2 days ago"
            }]
          }
        };
      case '3':
        // Roche HORIZON-Onc
        return {
          questionnaires: {
            dailySymptom: 83,
            weeklyQoL: 79,
            monthlyHealth: 86,
            qualityReviews: 22,
            dataValidation: 9
          },
          recruitmentMetrics: {
            rate: 6.7,
            siteActivationDays: 89
          },
          schedule: [{
            event: "Primer Sitio Iniciado",
            protocol: selectedStudy.protocol,
            date: "May 2024",
            type: "milestone",
            status: "completed"
          }, {
            event: "Primer Sitio Activado",
            protocol: selectedStudy.protocol,
            date: "Jun 2024",
            type: "milestone",
            status: "completed"
          }, {
            event: t('milestone.first.patient.first.visit'),
            protocol: selectedStudy.protocol,
            date: "Jul 2024",
            type: "milestone",
            status: "completed"
          }, {
            event: t('milestone.first.patient.last.visit'),
            protocol: selectedStudy.protocol,
            date: "Feb 2025",
            type: "milestone",
            status: "completed"
          }, {
            event: t('milestone.interim.safety.analysis'),
            protocol: selectedStudy.protocol,
            date: "Oct 2025",
            type: "regulatory",
            status: "pending"
          }, {
            event: t('milestone.last.patient.last.visit'),
            protocol: selectedStudy.protocol,
            date: "Dec 2025",
            type: "milestone",
            status: "pending"
          }, {
            event: t('milestone.biomarker.analysis.complete'),
            protocol: selectedStudy.protocol,
            date: "Nov 2025",
            type: "regulatory",
            status: "pending"
          }],
          participants: {
            enrollment: {
              current: 94,
              target: 120,
              percentage: 78
            },
            retention: 91.5,
            compliance: 89.3
          },
          reports: {
            budget: {
              spent: 1.9,
              total: 2.8,
              percentage: 68
            },
            timeline: 61,
            alerts: [{
              type: "warning",
              message: t('alert.site.activation'),
              time: "6 hours ago"
            }, {
              type: "success",
              message: t('alert.biomarker.analysis'),
              time: "1 week ago"
            }]
          }
        };
      case '4':
        // J&J GUARDIAN-Ped
        return {
          questionnaires: {
            dailySymptom: 95,
            weeklyQoL: 91,
            monthlyHealth: 97,
            qualityReviews: 6,
            dataValidation: 1
          },
          recruitmentMetrics: {
            rate: 15.2,
            siteActivationDays: 38
          },
          schedule: [{
            event: "Primer Sitio Iniciado",
            protocol: selectedStudy.protocol,
            date: "Mar 2024",
            type: "milestone",
            status: "completed"
          }, {
            event: "Primer Sitio Activado",
            protocol: selectedStudy.protocol,
            date: "Apr 2024",
            type: "milestone",
            status: "completed"
          }, {
            event: t('milestone.first.patient.first.visit'),
            protocol: selectedStudy.protocol,
            date: "May 2024",
            type: "milestone",
            status: "completed"
          }, {
            event: t('milestone.first.patient.last.visit'),
            protocol: selectedStudy.protocol,
            date: "Jan 2025",
            type: "milestone",
            status: "completed"
          }, {
            event: t('milestone.last.patient.first.visit'),
            protocol: selectedStudy.protocol,
            date: "Jul 2025",
            type: "milestone",
            status: "pending"
          }, {
            event: t('milestone.pediatric.safety.review'),
            protocol: selectedStudy.protocol,
            date: "Sep 2025",
            type: "regulatory",
            status: "pending"
          }, {
            event: t('milestone.last.patient.last.visit'),
            protocol: selectedStudy.protocol,
            date: "Nov 2025",
            type: "milestone",
            status: "pending"
          }, {
            event: t('milestone.growth.assessment.analysis'),
            protocol: selectedStudy.protocol,
            date: "Dec 2025",
            type: "regulatory",
            status: "pending"
          }],
          participants: {
            enrollment: {
              current: 278,
              target: 320,
              percentage: 87
            },
            retention: 98.1,
            compliance: 97.4
          },
          reports: {
            budget: {
              spent: 2.1,
              total: 2.9,
              percentage: 72
            },
            timeline: 79,
            alerts: [{
              type: "success",
              message: t('alert.enrollment.target'),
              time: "2 hours ago"
            }, {
              type: "info",
              message: t('alert.regulatory.submission'),
              time: "1 day ago"
            }]
          }
        };
      default:
        return null;
    }
  };
  const studyData = getStudySpecificData();
  const getContextTitle = () => {
    if (selectedStudy) {
      return `${selectedStudy.protocol} | ${selectedStudy.name}`;
    }
    return "Portfolio Overview - All Active Studies";
  };
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active':
        return 'bg-progress-success/10 text-progress-success border-progress-success/20';
      case 'Recruiting':
        return 'bg-progress-info/10 text-progress-info border-progress-info/20';
      case 'Completed':
        return 'bg-progress-gray/10 text-progress-gray border-progress-gray/20';
      default:
        return 'bg-studio-border text-studio-text-muted';
    }
  };
  return <div className="min-h-screen bg-studio-bg">
      <Header role="cro-sponsor" />


      <main className="p-3 sm:p-4 max-w-7xl mx-auto">{/* Mobile-friendly padding */}
        <div className="space-y-1 mb-4">{/* Reduced spacing for mobile */}
          <h2 className="text-xl sm:text-2xl font-medium text-studio-text">{/* Responsive text */}
            {t('cro.portfolio.overview')}
          </h2>
          <p className="text-studio-text-muted text-sm sm:text-base">{/* Responsive text */}
            {t('cro.global.research.ops')}
          </p>
        </div>

        {/* Overview Stats - Mobile responsive */}
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6 sm:mb-8" data-onboarding="portfolio-stats">{/* Responsive grid */}
                  <Card className="bg-studio-surface border-studio-border">
            <CardContent className="p-4 sm:p-6">{/* Responsive padding */}
              <div className="flex items-center space-x-2">
                <Building2 className="h-5 w-5 text-studio-text-muted" />
                <span className="text-2xl font-semibold text-studio-text">4</span>
              </div>
              <p className="text-studio-text-muted text-sm mt-1">
                {t('cro.active.studies')}
              </p>
            </CardContent>
          </Card>

          <Card className="bg-studio-surface border-studio-border">
            <CardContent className="p-4 sm:p-6">{/* Responsive padding */}
              <div className="flex items-center space-x-2">
                <Globe className="h-5 w-5 text-studio-text-muted" />
                <span className="text-2xl font-semibold text-studio-text">61</span>
              </div>
              <p className="text-studio-text-muted text-sm mt-1">
                {t('cro.research.sites')}
              </p>
            </CardContent>
          </Card>

          <Card className="bg-studio-surface border-studio-border">
            <CardContent className="p-4 sm:p-6">{/* Responsive padding */}
              <div className="flex items-center space-x-2">
                <TrendingUp className="h-5 w-5 text-studio-text-muted" />
                <span className="text-2xl font-semibold text-studio-text">919</span>
              </div>
              <p className="text-studio-text-muted text-sm mt-1">
                {t('cro.total.participants')}
              </p>
            </CardContent>
          </Card>

          <Card className="bg-studio-surface border-studio-border">
            <CardContent className="p-4 sm:p-6">{/* Responsive padding */}
              <div className="flex items-center space-x-2">
                <Shield className="h-5 w-5 text-studio-text-muted" />
                <span className="text-2xl font-semibold text-studio-text">95.2%</span>
              </div>
              <p className="text-studio-text-muted text-sm mt-1">
                {t('cro.compliance.rate')}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Sectioned Content - Mobile-friendly tabs */}
        <Tabs defaultValue="details" className="space-y-3 sm:space-y-6" data-onboarding="main-tabs">{/* Responsive spacing */}
          <TabsList className="grid w-full grid-cols-2 sm:grid-cols-5 h-auto gap-1">{/* Mobile: 2 cols, Desktop: 5 cols */}
            <TabsTrigger value="details" className="flex flex-col items-center space-y-0.5 h-14 sm:h-10 sm:flex-row sm:space-y-0 sm:space-x-2 text-sm">
              <Building2 className="h-5 w-5 sm:h-4 sm:w-4" />
              <span className="text-xs sm:text-sm">{t('cro.study.details')}</span>
            </TabsTrigger>
            <TabsTrigger value="questionnaires" data-tab="questionnaires" className="flex flex-col items-center space-y-0.5 h-14 sm:h-10 sm:flex-row sm:space-y-0 sm:space-x-2 text-sm">
              <FileText className="h-5 w-5 sm:h-4 sm:w-4" />
              <span className="text-xs sm:text-sm">{t('cro.questionnaires')}</span>
            </TabsTrigger>
            <TabsTrigger value="schedule" className="flex flex-col items-center space-y-0.5 h-14 sm:h-10 sm:flex-row sm:space-y-0 sm:space-x-2 text-sm">
              <Calendar className="h-5 w-5 sm:h-4 sm:w-4" />
              <span className="text-xs sm:text-sm">{t('cro.schedule')}</span>
            </TabsTrigger>
            <TabsTrigger value="participants" className="flex flex-col items-center space-y-0.5 h-14 sm:h-10 sm:flex-row sm:space-y-0 sm:space-x-2 text-sm">
              <Users className="h-5 w-5 sm:h-4 sm:w-4" />
              <span className="text-xs sm:text-sm">{t('cro.participants')}</span>
            </TabsTrigger>
            <TabsTrigger value="reports" data-tab="reports" className="flex flex-col items-center space-y-0.5 h-14 sm:h-10 sm:flex-row sm:space-y-0 sm:space-x-2 text-sm col-span-2 sm:col-span-1">
              <TrendingUp className="h-5 w-5 sm:h-4 sm:w-4" />
              <span className="text-xs sm:text-sm">{t('cro.reports')}</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="details" className="space-y-6">
            <Card className="bg-studio-surface border-studio-border">
              <CardHeader>
                <CardTitle className="text-studio-text flex items-center justify-between">
                  <span>{selectedStudy ? selectedStudy.name : t('cro.select.study')}</span>
                  {selectedStudy && <Button variant={favoriteStudyId === selectedStudy.id ? "default" : "outline"} size="sm" onClick={() => {
                  if (favoriteStudyId === selectedStudy.id) {
                    setFavoriteStudyId(null);
                    localStorage.removeItem('favoriteStudyId');
                    toast.success(t('cro.remove.favorite'));
                  } else {
                    setFavoriteStudyId(selectedStudy.id);
                    localStorage.setItem('favoriteStudyId', selectedStudy.id);
                    toast.success(t('cro.set.favorite'));
                  }
                }}>
                      {favoriteStudyId === selectedStudy.id ? t('cro.remove.favorite') : t('cro.set.favorite')}
                    </Button>}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {selectedStudy ? <div className="space-y-6">
                    {/* Basic Study Information - Mobile responsive grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">{/* Responsive: 1 col mobile, 2 cols tablet, 3 cols desktop */}
                      <div className="space-y-2">
                        <span className="text-sm text-studio-text-muted">{t('study.protocol')}</span>
                        <p className="font-medium text-studio-text">{selectedStudy.protocol}</p>
                      </div>
                      <div className="space-y-2">
                        <span className="text-sm text-studio-text-muted">{t('study.phase')}</span>
                        <p className="font-medium text-studio-text">{selectedStudy.phase.replace('Phase', t('study.phase'))}</p>
                      </div>
                      <div className="space-y-2 row-span-3">
                        <span className="text-sm text-studio-text-muted">{t('study.recent.alerts')}</span>
                        <div className="space-y-2">
                          {studyData && studyData.reports.alerts.slice(0, 2).map((alert, index) => <div key={index} className="flex items-start space-x-2">
                              {alert.type === 'success' && <CheckCircle className="h-3 w-3 text-primary mt-0.5 flex-shrink-0" />}
                              {alert.type === 'info' && <AlertCircle className="h-3 w-3 text-studio-text-muted mt-0.5 flex-shrink-0" />}
                              {alert.type === 'warning' && <AlertCircle className="h-3 w-3 text-destructive mt-0.5 flex-shrink-0" />}
                              <div className="flex-1 min-w-0">
                                <p className="text-xs text-studio-text leading-tight">{alert.message}</p>
                                <p className="text-xs text-studio-text-muted">{alert.time}</p>
                              </div>
                            </div>)}
                        </div>
                      </div>
                      <div className="space-y-2">
                        <span className="text-sm text-studio-text-muted">{t('study.status')}</span>
                        <p className="font-medium text-studio-text">{t(`study.status.${selectedStudy.status}`)}</p>
                      </div>
                      <div className="space-y-2">
                        <span className="text-sm text-studio-text-muted">{t('study.sites.count')}</span>
                        <p className="font-medium text-studio-text">{selectedStudy.sites}</p>
                      </div>
                      <div className="space-y-2">
                        <span className="text-sm text-studio-text-muted">{t('study.sponsor')}</span>
                        <p className="font-medium text-studio-text">{selectedStudy.sponsor}</p>
                      </div>
                      <div className="space-y-2">
                        <span className="text-sm text-studio-text-muted">{t('study.participants.count')}</span>
                        <p className="font-medium text-studio-text">{selectedStudy.participants}</p>
                      </div>
                    </div>

                    {/* Study Performance Metrics */}
                    {studyData && <div className="space-y-4">
                        <h4 className="text-md font-medium text-studio-text border-b border-studio-border pb-2">{t('cro.performance.metrics')}</h4>
                        
                        {/* Recruitment and Site Metrics */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                          <Card className="bg-studio-bg border-studio-border">
                            <CardHeader className="pb-3">
                              <CardTitle className="text-sm text-studio-text">{t('study.recruitment.metrics')}</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3">
                              <div className="flex justify-between">
                                <span className="text-studio-text-muted text-sm">{t('study.recruitment.rate')}</span>
                                <span className="text-studio-text text-sm font-medium">{studyData.recruitmentMetrics ? studyData.recruitmentMetrics.rate : 12.5} {t('study.patients.per.month')}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-studio-text-muted text-sm">{t('cro.current')}</span>
                                <span className="text-studio-text text-sm">{studyData.participants.enrollment.current}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-studio-text-muted text-sm">{t('cro.target')}</span>
                                <span className="text-studio-text text-sm">{studyData.participants.enrollment.target}</span>
                              </div>
                            </CardContent>
                          </Card>
                          
                          <Card className="bg-studio-bg border-studio-border">
                            <CardHeader className="pb-3">
                              <CardTitle className="text-sm text-studio-text">{t('study.site.metrics')}</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3">
                              <div className="flex justify-between">
                                <span className="text-studio-text-muted text-sm">{t('study.sites.opened')}</span>
                                <span className="text-studio-text text-sm font-medium">{selectedStudy.sites}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-studio-text-muted text-sm">{t('study.sites.planned')}</span>
                                <span className="text-studio-text text-sm">{selectedStudy.sites + 3}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-studio-text-muted text-sm">{t('study.site.activation.rate')}</span>
                                <span className="text-studio-text text-sm">{studyData.recruitmentMetrics ? studyData.recruitmentMetrics.siteActivationDays : 45} {t('study.days.to.activate')}</span>
                              </div>
                            </CardContent>
                          </Card>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <Card className="bg-studio-bg border-studio-border">
                            <CardHeader className="pb-3">
                              <CardTitle className="text-sm text-studio-text">{t('cro.budget.utilization')}</CardTitle>
                            </CardHeader>
                            <CardContent>
                              <div className="space-y-2">
                                <div className="flex justify-between">
                                  <span className="text-studio-text-muted text-sm">{t('cro.spent')}</span>
                                  <span className="text-studio-text text-sm">
                                    ${studyData.reports.budget.spent}M/${studyData.reports.budget.total}M
                                  </span>
                                </div>
                                <div className="w-full bg-muted rounded-full h-2">
                                  <div className="bg-[hsl(var(--progress-primary))] h-2 rounded-full" style={{
                              width: `${studyData.reports.budget.percentage}%`
                            }}></div>
                                </div>
                              </div>
                            </CardContent>
                          </Card>

                          <Card className="bg-studio-bg border-studio-border">
                            <CardHeader className="pb-3">
                              <CardTitle className="text-sm text-studio-text">{t('cro.timeline.progress')}</CardTitle>
                            </CardHeader>
                            <CardContent>
                              <div className="space-y-2">
                                <div className="flex justify-between">
                                  <span className="text-studio-text-muted text-sm">{t('cro.completion')}</span>
                                  <span className="text-studio-text text-sm">{studyData.reports.timeline}%</span>
                                </div>
                                <div className="w-full bg-muted rounded-full h-2">
                                  <div className="bg-[hsl(var(--progress-accent))] h-2 rounded-full" style={{
                              width: `${studyData.reports.timeline}%`
                            }}></div>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        </div>
                      </div>}
                  </div> : <div className="text-center py-8 text-studio-text-muted">
                    <Building2 className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>Select a study from the dropdown to view details</p>
                  </div>}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="questionnaires" className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-medium text-studio-text">{t('cro.questionnaire.analytics')}</h3>
              <Button onClick={handlePDFGeneration} disabled={isGeneratingPDF} variant="outline" size="sm" className="flex items-center space-x-2">
                {isGeneratingPDF ? <>
                    <div className="animate-spin h-3 w-3 border border-primary border-t-transparent rounded-full" />
                    <span>{t('cro.generating.pdf')}</span>
                  </> : <>
                    <FileText className="h-3 w-3" />
                    <span>{t('cro.generate.pdf.report')}</span>
                  </>}
              </Button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="bg-studio-surface border-studio-border">
                <CardHeader>
                  <CardTitle className="text-studio-text">{t('cro.response.rates')}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span className="text-studio-text-muted">{t('cro.daily.symptom')}</span>
                      <span className="text-studio-text">{studyData ? studyData.questionnaires.dailySymptom : 89}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-studio-text-muted">{t('cro.weekly.qol')}</span>
                      <span className="text-studio-text">{studyData ? studyData.questionnaires.weeklyQoL : 76}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-studio-text-muted">{t('cro.monthly.health')}</span>
                      <span className="text-studio-text">{studyData ? studyData.questionnaires.monthlyHealth : 92}%</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-studio-surface border-studio-border">
                <CardHeader>
                  <CardTitle className="text-studio-text">{t('cro.quality.reviews')}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-studio-text">{t('cro.quality.reviews')}</span>
                      <span className="bg-[hsl(var(--progress-accent))]/10 text-[hsl(var(--progress-accent))] border border-[hsl(var(--progress-accent))]/20 px-2 py-1 rounded text-xs">{studyData ? studyData.questionnaires.qualityReviews : 23}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-studio-text">{t('cro.data.validation')}</span>
                      <span className="bg-destructive/10 text-destructive border border-destructive/20 px-2 py-1 rounded text-xs">{studyData ? studyData.questionnaires.dataValidation : 7}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="schedule" className="space-y-6">
            <Card className="bg-studio-surface border-studio-border">
              <CardHeader>
                <CardTitle className="text-studio-text">{t('cro.milestone.schedule')}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {studyData && studyData.schedule.map((milestone, index) => <div key={index} className="flex justify-between items-center p-3 bg-studio-bg rounded">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2">
                          <p className="font-medium text-studio-text">{milestone.event}</p>
                          {milestone.status === 'completed' && <CheckCircle className="h-4 w-4 text-primary" />}
                          {milestone.status === 'pending' && <Clock className="h-4 w-4 text-studio-text-muted" />}
                        </div>
                        <p className="text-sm text-studio-text-muted">{milestone.protocol}</p>
                        <div className="flex items-center space-x-2 mt-1">
                          <Badge variant="outline" className="text-xs">
                            {milestone.type === 'milestone' ? t('common.milestone') : t('common.regulatory')}
                          </Badge>
                          <Badge variant={milestone.status === 'completed' ? 'default' : 'secondary'} className="text-xs">
                            {milestone.status === 'completed' ? t('cro.milestone.completed') : t('cro.milestone.pending')}
                          </Badge>
                        </div>
                      </div>
                      <span className="text-studio-text font-medium">{formatMilestoneDate(milestone.date)}</span>
                    </div>)}
                  {!studyData && <div className="text-center py-8 text-studio-text-muted">
                      <Calendar className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p>Select a study to view milestones</p>
                    </div>}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="participants" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="bg-studio-surface border-studio-border">
                <CardHeader>
                  <CardTitle className="text-studio-text">{t('cro.enrollment.tracker')}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-studio-text-muted">{t('cro.target')}</span>
                      <span className="text-studio-text">
                        {studyData ? `${studyData.participants.enrollment.current}/${studyData.participants.enrollment.target}` : '1,247/1,500'}
                      </span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div className="bg-[hsl(var(--progress-primary))] h-2 rounded-full" style={{
                      width: `${studyData ? studyData.participants.enrollment.percentage : 83}%`
                    }}></div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-studio-surface border-studio-border">
                <CardHeader>
                  <CardTitle className="text-studio-text">{t('cro.retention.rate')}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-studio-text-muted">{t('common.active')}</span>
                      <span className="text-studio-text">{studyData ? studyData.participants.retention : 94.2}%</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div className="bg-[hsl(var(--progress-success))] h-2 rounded-full" style={{
                      width: `${studyData ? studyData.participants.retention : 94}%`
                    }}></div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-studio-surface border-studio-border">
                <CardHeader>
                  <CardTitle className="text-studio-text">{t('cro.compliance.score')}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-studio-text-muted">Overall</span>
                      <span className="text-studio-text">{studyData ? studyData.participants.compliance : 98.5}%</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div className="bg-[hsl(var(--progress-info))] h-2 rounded-full" style={{
                      width: `${studyData ? studyData.participants.compliance : 98}%`
                    }}></div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="reports" className="space-y-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-medium text-studio-text">{t('cro.reports')} & {t('cro.advanced.analytics')}</h3>
              
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Downloadable Reports */}
              <Card className="bg-studio-surface border-studio-border">
                <CardHeader>
                  <CardTitle className="text-studio-text flex items-center space-x-2">
                    <Download className="h-5 w-5" />
                    <span>{t('cro.download.reports')}</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <Button variant="outline" className="w-full justify-start h-auto py-3 px-4" onClick={() => toast.success("Generating Site Users Report...", {
                    description: "Report will be available for download shortly"
                  })}>
                      <div className="flex flex-col items-start space-y-1 flex-1 min-w-0 mr-3">
                        <span className="font-medium text-sm sm:text-base w-full text-left">{t('cro.site.users.report')}</span>
                      </div>
                      <Download className="h-4 w-4 flex-shrink-0" />
                    </Button>
                    
                    <Button variant="outline" className="w-full justify-start h-auto py-3 px-4" onClick={() => toast.success("Generating Questionnaire Report...", {
                    description: "Comprehensive questionnaire data compilation started"
                  })}>
                      <div className="flex flex-col items-start space-y-1 flex-1 min-w-0 mr-3">
                        <span className="font-medium text-sm sm:text-base w-full text-left">{t('cro.questionnaire.report')}</span>
                      </div>
                      <Download className="h-4 w-4 flex-shrink-0" />
                    </Button>
                    
                    <Button variant="outline" className="w-full justify-start h-auto py-3 px-4" onClick={() => toast.success("Generating Milestones Report...", {
                    description: "Study timeline and milestone tracking report in progress"
                  })}>
                      <div className="flex flex-col items-start space-y-1 flex-1 min-w-0 mr-3">
                        <span className="font-medium text-sm sm:text-base w-full text-left">{t('cro.milestones.report')}</span>
                      </div>
                      <Download className="h-4 w-4 flex-shrink-0" />
                    </Button>
                    
                    {/* Fantasy button for study results signups report */}
                    <div className="pt-2 border-t border-studio-border">
                      <StudySignupsReportDialog />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Interoperability Module */}
              <Card className="bg-studio-surface border-studio-border">
                <CardHeader>
                  <CardTitle className="text-studio-text flex items-center space-x-2">
                    <Globe className="h-5 w-5" />
                    <span>{t('cro.interoperability')}</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <Button variant="outline" className="w-full justify-start h-auto py-3 px-4" onClick={() => setShowFHIRExport(true)}>
                      <div className="flex flex-col items-start space-y-1 flex-1 min-w-0 mr-3">
                        <span className="font-medium text-sm sm:text-base w-full text-left">{t('cro.export.fhir')}</span>
                      </div>
                      <Globe className="h-4 w-4 flex-shrink-0" />
                    </Button>
                    
                    <Button variant="outline" className="w-full justify-start h-auto py-3 px-4" onClick={() => toast.success("Initiating HL7 Export...", {
                    description: "HL7 message format export for healthcare systems integration"
                  })}>
                      <div className="flex flex-col items-start space-y-1 flex-1 min-w-0 mr-3">
                        <span className="font-medium text-sm sm:text-base w-full text-left">{t('cro.export.hl7')}</span>
                      </div>
                      <FileText className="h-4 w-4 flex-shrink-0" />
                    </Button>
                    
                    <Button variant="outline" className="w-full justify-start h-auto py-3 px-4" onClick={() => setShowCDISCExport(true)}>
                      <div className="flex flex-col items-start space-y-1 flex-1 min-w-0 mr-3">
                        <span className="font-medium text-sm sm:text-base w-full text-left">{t('cro.export.cdisc')}</span>
                      </div>
                      <Shield className="h-4 w-4 flex-shrink-0" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Additional Analytics Section */}
            <Card className="bg-studio-surface border-studio-border">
              <CardHeader>
                <CardTitle className="text-studio-text">{t('cro.advanced.analytics')}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center p-4 bg-studio-bg rounded">
                    <TrendingUp className="h-8 w-8 mx-auto mb-2 text-primary" />
                    <h4 className="font-medium text-studio-text">{t('cro.performance.trends')}</h4>
                    <p className="text-sm text-studio-text-muted mt-1">{t('cro.performance.trends.description')}</p>
                  </div>
                  <div className="text-center p-4 bg-studio-bg rounded">
                    <Users className="h-8 w-8 mx-auto mb-2 text-primary" />
                    <h4 className="font-medium text-studio-text">{t('cro.site.comparisons')}</h4>
                    <p className="text-sm text-studio-text-muted mt-1">{t('cro.site.comparisons.description')}</p>
                  </div>
                  <div className="text-center p-4 bg-studio-bg rounded">
                    <FileText className="h-8 w-8 mx-auto mb-2 text-primary" />
                    <h4 className="font-medium text-studio-text">{t('cro.regulatory.readiness')}</h4>
                    <p className="text-sm text-studio-text-muted mt-1">{t('cro.regulatory.readiness.description')}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>

      {/* FHIR Export Dialog */}
      <FHIRExportDialog open={showFHIRExport} onOpenChange={setShowFHIRExport} />

      {/* CDISC Export Dialog */}
      <CDISCExportDialog open={showCDISCExport} onOpenChange={setShowCDISCExport} studyId={selectedStudy?.id || ''} studyName={selectedStudy?.name || ''} />
    </div>;
};
export default CROSponsorDashboard;