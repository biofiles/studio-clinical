import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Header from "@/components/Header";
import StudyDropdown from "@/components/StudyDropdown";
import { Building2, Globe, TrendingUp, Shield, AlertCircle, CheckCircle, Clock, FileText, Calendar, Users, Settings } from "lucide-react";
import { toast } from "sonner";
import { useStudy } from "@/contexts/StudyContext";
import { useNavigate } from "react-router-dom";
interface CROSponsorDashboardProps {
  onLogout: () => void;
}
const CROSponsorDashboard = ({
  onLogout
}: CROSponsorDashboardProps) => {
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const [selectedStudyLocal, setSelectedStudyLocal] = useState<string | null>(null);
  const {
    selectedStudy,
    studies,
    setSelectedStudy
  } = useStudy();
  const navigate = useNavigate();
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
    toast.success("Questionnaire PDF Report Generated", {
      description: "Complete questionnaire data exported for regulatory submission"
    });
    setIsGeneratingPDF(false);
  };
  // Get dynamic data based on selected study
  const getStudySpecificData = () => {
    if (!selectedStudy) return null;
    
    switch (selectedStudy.id) {
      case '1': // Novartis PARADIGM-CV
        return {
          questionnaires: {
            dailySymptom: 91,
            weeklyQoL: 88,
            monthlyHealth: 94,
            qualityReviews: 15,
            dataValidation: 3
          },
          schedule: [
            { event: "First Patient Last Visit", protocol: selectedStudy.protocol, date: "Mar 2025" },
            { event: "Database Lock", protocol: selectedStudy.protocol, date: "Jun 2025" },
            { event: "Statistical Analysis Plan", protocol: selectedStudy.protocol, date: "Jul 2025" }
          ],
          participants: {
            enrollment: { current: 385, target: 450, percentage: 86 },
            retention: 96.2,
            compliance: 94.1
          },
          reports: {
            budget: { spent: 2.8, total: 3.5, percentage: 80 },
            timeline: 72,
            alerts: [
              { type: "info", message: "Cardiology milestone achieved ahead of schedule", time: "1 hour ago" },
              { type: "success", message: "PARADIGM-CV interim analysis completed", time: "3 days ago" }
            ]
          }
        };
      case '2': // Pfizer ATLAS-DM2
        return {
          questionnaires: {
            dailySymptom: 87,
            weeklyQoL: 92,
            monthlyHealth: 89,
            qualityReviews: 8,
            dataValidation: 2
          },
          schedule: [
            { event: "Mid-study Analysis", protocol: selectedStudy.protocol, date: "Aug 2025" },
            { event: "Safety Review", protocol: selectedStudy.protocol, date: "Sep 2025" }
          ],
          participants: {
            enrollment: { current: 162, target: 200, percentage: 81 },
            retention: 93.8,
            compliance: 96.7
          },
          reports: {
            budget: { spent: 1.6, total: 2.2, percentage: 73 },
            timeline: 68,
            alerts: [
              { type: "warning", message: "Diabetes endpoint review scheduled", time: "4 hours ago" },
              { type: "info", message: "ATLAS-DM2 site training completed", time: "2 days ago" }
            ]
          }
        };
      case '3': // Roche HORIZON-Onc
        return {
          questionnaires: {
            dailySymptom: 83,
            weeklyQoL: 79,
            monthlyHealth: 86,
            qualityReviews: 22,
            dataValidation: 9
          },
          schedule: [
            { event: "Interim Safety Analysis", protocol: selectedStudy.protocol, date: "Oct 2025" },
            { event: "Biomarker Analysis Complete", protocol: selectedStudy.protocol, date: "Nov 2025" }
          ],
          participants: {
            enrollment: { current: 94, target: 120, percentage: 78 },
            retention: 91.5,
            compliance: 89.3
          },
          reports: {
            budget: { spent: 1.9, total: 2.8, percentage: 68 },
            timeline: 61,
            alerts: [
              { type: "warning", message: "Oncology biomarker delays reported", time: "6 hours ago" },
              { type: "success", message: "HORIZON-Onc Phase I completed", time: "1 week ago" }
            ]
          }
        };
      case '4': // J&J GUARDIAN-Ped
        return {
          questionnaires: {
            dailySymptom: 95,
            weeklyQoL: 91,
            monthlyHealth: 97,
            qualityReviews: 6,
            dataValidation: 1
          },
          schedule: [
            { event: "Pediatric Safety Review", protocol: selectedStudy.protocol, date: "Sep 2025" },
            { event: "Growth Assessment Analysis", protocol: selectedStudy.protocol, date: "Dec 2025" }
          ],
          participants: {
            enrollment: { current: 278, target: 320, percentage: 87 },
            retention: 98.1,
            compliance: 97.4
          },
          reports: {
            budget: { spent: 2.1, total: 2.9, percentage: 72 },
            timeline: 79,
            alerts: [
              { type: "success", message: "Pediatric enrollment exceeding targets", time: "2 hours ago" },
              { type: "info", message: "GUARDIAN-Ped safety data reviewed", time: "1 day ago" }
            ]
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
      <Header role="cro-sponsor" onLogout={onLogout} />

      {/* User Context Bar */}
      <div className="bg-studio-surface border-b border-studio-border px-6 py-3">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <div className="flex items-center space-x-4">
            <Building2 className="h-4 w-4 text-studio-text-muted" />
            <span className="text-sm font-medium text-studio-text">
              {getContextTitle()}
            </span>
          </div>
          <StudyDropdown />
        </div>
      </div>

      <main className="p-6 max-w-7xl mx-auto">
        <div className="space-y-2 mb-6">
          <h2 className="text-xl font-medium text-studio-text">
            Portfolio Overview
          </h2>
          <p className="text-studio-text-muted">
            Global Research Operations Dashboard
          </p>
        </div>

        {/* Overview Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card className="bg-studio-surface border-studio-border">
            <CardContent className="p-6">
              <div className="flex items-center space-x-2">
                <Building2 className="h-5 w-5 text-studio-text-muted" />
                <span className="text-2xl font-semibold text-studio-text">23</span>
              </div>
              <p className="text-studio-text-muted text-sm mt-1">
                Active studies
              </p>
            </CardContent>
          </Card>

          <Card className="bg-studio-surface border-studio-border">
            <CardContent className="p-6">
              <div className="flex items-center space-x-2">
                <Globe className="h-5 w-5 text-studio-text-muted" />
                <span className="text-2xl font-semibold text-studio-text">47</span>
              </div>
              <p className="text-studio-text-muted text-sm mt-1">
                Research sites
              </p>
            </CardContent>
          </Card>

          <Card className="bg-studio-surface border-studio-border">
            <CardContent className="p-6">
              <div className="flex items-center space-x-2">
                <TrendingUp className="h-5 w-5 text-studio-text-muted" />
                <span className="text-2xl font-semibold text-studio-text">1,247</span>
              </div>
              <p className="text-studio-text-muted text-sm mt-1">
                Total participants
              </p>
            </CardContent>
          </Card>

          <Card className="bg-studio-surface border-studio-border">
            <CardContent className="p-6">
              <div className="flex items-center space-x-2">
                <Shield className="h-5 w-5 text-studio-text-muted" />
                <span className="text-2xl font-semibold text-studio-text">98.5%</span>
              </div>
              <p className="text-studio-text-muted text-sm mt-1">
                Compliance rate
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Sectioned Content */}
        <Tabs defaultValue="details" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="details" className="flex items-center space-x-2">
              <Building2 className="h-4 w-4" />
              <span>Study Details</span>
            </TabsTrigger>
            <TabsTrigger value="questionnaires" className="flex items-center space-x-2">
              <FileText className="h-4 w-4" />
              <span>Questionnaires</span>
            </TabsTrigger>
            <TabsTrigger value="schedule" className="flex items-center space-x-2">
              <Calendar className="h-4 w-4" />
              <span>Schedule</span>
            </TabsTrigger>
            <TabsTrigger value="participants" className="flex items-center space-x-2">
              <Users className="h-4 w-4" />
              <span>Participants</span>
            </TabsTrigger>
            <TabsTrigger value="reports" className="flex items-center space-x-2">
              <TrendingUp className="h-4 w-4" />
              <span>Reports</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="details" className="space-y-6">
            <Card className="bg-studio-surface border-studio-border">
              <CardHeader>
                <CardTitle className="text-studio-text">
                  {selectedStudy ? `${selectedStudy.name} Details` : 'Select a Study'}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {selectedStudy ? (
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <span className="text-sm text-studio-text-muted">Protocol</span>
                        <p className="font-medium text-studio-text">{selectedStudy.protocol}</p>
                      </div>
                      <div className="space-y-2">
                        <span className="text-sm text-studio-text-muted">Phase</span>
                        <p className="font-medium text-studio-text">{selectedStudy.phase}</p>
                      </div>
                      <div className="space-y-2">
                        <span className="text-sm text-studio-text-muted">Status</span>
                        <Badge className={getStatusColor(selectedStudy.status)}>
                          {selectedStudy.status}
                        </Badge>
                      </div>
                      <div className="space-y-2">
                        <span className="text-sm text-studio-text-muted">Sites</span>
                        <p className="font-medium text-studio-text">{selectedStudy.sites}</p>
                      </div>
                      <div className="space-y-2">
                        <span className="text-sm text-studio-text-muted">Sponsor</span>
                        <p className="font-medium text-studio-text">{selectedStudy.sponsor}</p>
                      </div>
                      <div className="space-y-2">
                        <span className="text-sm text-studio-text-muted">Participants</span>
                        <p className="font-medium text-studio-text text-2xl">{selectedStudy.participants}</p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8 text-studio-text-muted">
                    <Building2 className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>Select a study from the dropdown to view details</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="questionnaires" className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-medium text-studio-text">Questionnaire Management</h3>
              <Button onClick={handlePDFGeneration} disabled={isGeneratingPDF} variant="outline" size="sm" className="flex items-center space-x-2">
                {isGeneratingPDF ? <>
                    <div className="animate-spin h-3 w-3 border border-primary border-t-transparent rounded-full" />
                    <span>Generating PDF...</span>
                  </> : <>
                    <FileText className="h-3 w-3" />
                    <span>Generate Questionnaire PDF Report</span>
                  </>}
              </Button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="bg-studio-surface border-studio-border">
                <CardHeader>
                  <CardTitle className="text-studio-text">Completion Rates</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span className="text-studio-text-muted">Daily Symptom Diary</span>
                      <span className="text-studio-text">{studyData ? studyData.questionnaires.dailySymptom : 89}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-studio-text-muted">Weekly QoL Assessment</span>
                      <span className="text-studio-text">{studyData ? studyData.questionnaires.weeklyQoL : 76}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-studio-text-muted">Monthly Health Survey</span>
                      <span className="text-studio-text">{studyData ? studyData.questionnaires.monthlyHealth : 92}%</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-studio-surface border-studio-border">
                <CardHeader>
                  <CardTitle className="text-studio-text">Pending Reviews</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-studio-text">Quality Review Required</span>
                      <span className="bg-[hsl(var(--progress-accent))]/10 text-[hsl(var(--progress-accent))] border border-[hsl(var(--progress-accent))]/20 px-2 py-1 rounded text-xs">{studyData ? studyData.questionnaires.qualityReviews : 23}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-studio-text">Data Validation</span>
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
                <CardTitle className="text-studio-text">Study Milestones</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {studyData && studyData.schedule.map((milestone, index) => (
                    <div key={index} className="flex justify-between items-center p-3 bg-studio-bg rounded">
                      <div>
                        <p className="font-medium text-studio-text">{milestone.event}</p>
                        <p className="text-sm text-studio-text-muted">{milestone.protocol}</p>
                      </div>
                      <span className="text-studio-text">{milestone.date}</span>
                    </div>
                  ))}
                  {!studyData && (
                    <div className="text-center py-8 text-studio-text-muted">
                      <Calendar className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p>Select a study to view milestones</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="participants" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="bg-studio-surface border-studio-border">
                <CardHeader>
                  <CardTitle className="text-studio-text">Enrollment Progress</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-studio-text-muted">Target</span>
                      <span className="text-studio-text">
                        {studyData ? `${studyData.participants.enrollment.current}/${studyData.participants.enrollment.target}` : '1,247/1,500'}
                      </span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div className="bg-[hsl(var(--progress-primary))] h-2 rounded-full" 
                           style={{ width: `${studyData ? studyData.participants.enrollment.percentage : 83}%` }}></div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-studio-surface border-studio-border">
                <CardHeader>
                  <CardTitle className="text-studio-text">Retention Rate</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-studio-text-muted">Active</span>
                      <span className="text-studio-text">{studyData ? studyData.participants.retention : 94.2}%</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div className="bg-[hsl(var(--progress-success))] h-2 rounded-full" 
                           style={{ width: `${studyData ? studyData.participants.retention : 94}%` }}></div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-studio-surface border-studio-border">
                <CardHeader>
                  <CardTitle className="text-studio-text">Compliance</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-studio-text-muted">Overall</span>
                      <span className="text-studio-text">{studyData ? studyData.participants.compliance : 98.5}%</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div className="bg-[hsl(var(--progress-info))] h-2 rounded-full" 
                           style={{ width: `${studyData ? studyData.participants.compliance : 98}%` }}></div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="reports" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="bg-studio-surface border-studio-border">
                <CardHeader>
                  <CardTitle className="text-studio-text">Budget Utilization</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-studio-text-muted">Spent</span>
                      <span className="text-studio-text">
                        {studyData ? `$${studyData.reports.budget.spent}M/$${studyData.reports.budget.total}M` : '$2.4M/$3.2M'}
                      </span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div className="bg-[hsl(var(--progress-primary))] h-2 rounded-full" 
                           style={{ width: `${studyData ? studyData.reports.budget.percentage : 75}%` }}></div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-studio-surface border-studio-border">
                <CardHeader>
                  <CardTitle className="text-studio-text">Timeline Progress</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-studio-text-muted">Completion</span>
                      <span className="text-studio-text">{studyData ? studyData.reports.timeline : 67}%</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div className="bg-[hsl(var(--progress-accent))] h-2 rounded-full" 
                           style={{ width: `${studyData ? studyData.reports.timeline : 67}%` }}></div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-studio-surface border-studio-border">
                <CardHeader>
                  <CardTitle className="text-studio-text">Recent Alerts</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {(studyData ? studyData.reports.alerts : alerts).map((alert, index) => (
                    <div key={index} className="flex items-start space-x-3">
                      {alert.type === 'warning' && <AlertCircle className="h-4 w-4 text-destructive mt-0.5" />}
                      {alert.type === 'info' && <AlertCircle className="h-4 w-4 text-studio-text-muted mt-0.5" />}
                      {alert.type === 'success' && <CheckCircle className="h-4 w-4 text-primary mt-0.5" />}
                      <div className="flex-1">
                        <p className="text-sm text-studio-text">{alert.message}</p>
                        <p className="text-xs text-studio-text-muted">{alert.time}</p>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>;
};
export default CROSponsorDashboard;