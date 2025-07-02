
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Header from "@/components/Header";
import { Building2, Globe, TrendingUp, Shield, AlertCircle, CheckCircle, Clock, FileText, Calendar, Users, Settings } from "lucide-react";
import { toast } from "sonner";

interface CROSponsorDashboardProps {
  onLogout: () => void;
}

const CROSponsorDashboard = ({ onLogout }: CROSponsorDashboardProps) => {
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const [selectedStudy, setSelectedStudy] = useState<string | null>(null);

  const studies = [
    { id: "PROTO-2024-001", title: "Phase II Oncology Trial", sites: 12, participants: 156, status: "Active" },
    { id: "PROTO-2024-002", title: "Phase III Cardiology Study", sites: 8, participants: 89, status: "Recruiting" },
    { id: "PROTO-2023-015", title: "Phase I Safety Study", sites: 3, participants: 24, status: "Completed" }
  ];

  const alerts = [
    { type: "warning", message: "Site 003 enrollment behind target", time: "2 hours ago" },
    { type: "info", message: "Monthly safety report submitted", time: "1 day ago" },
    { type: "success", message: "Study PROTO-2024-001 milestone reached", time: "2 days ago" }
  ];

  const handlePDFGeneration = async () => {
    setIsGeneratingPDF(true);
    
    // Simulate PDF generation process
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    toast.success("Questionnaire PDF Report Generated", {
      description: "Complete questionnaire data exported for regulatory submission"
    });
    
    setIsGeneratingPDF(false);
  };

  const getContextTitle = () => {
    if (selectedStudy) {
      const study = studies.find(s => s.id === selectedStudy);
      return `Viewing Study: ${study?.title} (${study?.id})`;
    }
    return "Portfolio Overview - All Active Studies";
  };

  return (
    <div className="min-h-screen bg-studio-bg">
      <Header
        role="cro-sponsor"
        onLogout={onLogout}
      />

      {/* User Context Bar */}
      <div className="bg-studio-surface border-b border-studio-border px-6 py-3">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <div className="flex items-center space-x-2">
            <Building2 className="h-4 w-4 text-studio-text-muted" />
            <span className="text-sm font-medium text-studio-text">
              {getContextTitle()}
            </span>
          </div>
          <div className="flex items-center space-x-2 text-xs text-studio-text-muted">
            <Clock className="h-3 w-3" />
            <span>Last updated: {new Date().toLocaleString()}</span>
          </div>
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
        <Tabs defaultValue="studies" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="studies" className="flex items-center space-x-2">
              <Building2 className="h-4 w-4" />
              <span>Studies</span>
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

          <TabsContent value="studies" className="space-y-6">
            <Card className="bg-studio-surface border-studio-border">
              <CardHeader>
                <CardTitle className="text-studio-text">Active Studies</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {studies.map((study, index) => (
                  <div key={index} className="p-4 bg-studio-bg rounded border border-studio-border hover:border-primary/30 transition-colors cursor-pointer"
                       onClick={() => setSelectedStudy(study.id)}>
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h4 className="font-medium text-studio-text">{study.title}</h4>
                        <p className="text-sm text-studio-text-muted">{study.id}</p>
                      </div>
                      <span className={`px-2 py-1 rounded text-xs ${
                        study.status === 'Active' ? 'bg-accent text-accent-foreground' :
                        study.status === 'Recruiting' ? 'bg-primary text-primary-foreground' :
                        'bg-muted text-muted-foreground'
                      }`}>
                        {study.status}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm text-studio-text-muted">
                      <span>{study.sites} sites</span>
                      <span>{study.participants} participants</span>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="questionnaires" className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-medium text-studio-text">Questionnaire Management</h3>
              <Button
                onClick={handlePDFGeneration}
                disabled={isGeneratingPDF}
                variant="outline"
                size="sm"
                className="flex items-center space-x-2"
              >
                {isGeneratingPDF ? (
                  <>
                    <div className="animate-spin h-3 w-3 border border-primary border-t-transparent rounded-full" />
                    <span>Generating PDF...</span>
                  </>
                ) : (
                  <>
                    <FileText className="h-3 w-3" />
                    <span>Generate Questionnaire PDF Report</span>
                  </>
                )}
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
                      <span className="text-studio-text">89%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-studio-text-muted">Weekly QoL Assessment</span>
                      <span className="text-studio-text">76%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-studio-text-muted">Monthly Health Survey</span>
                      <span className="text-studio-text">92%</span>
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
                      <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded text-xs">23</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-studio-text">Data Validation</span>
                      <span className="bg-red-100 text-red-800 px-2 py-1 rounded text-xs">7</span>
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
                  <div className="flex justify-between items-center p-3 bg-studio-bg rounded">
                    <div>
                      <p className="font-medium text-studio-text">First Patient Last Visit</p>
                      <p className="text-sm text-studio-text-muted">PROTO-2024-001</p>
                    </div>
                    <span className="text-studio-text">Mar 2025</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-studio-bg rounded">
                    <div>
                      <p className="font-medium text-studio-text">Database Lock</p>
                      <p className="text-sm text-studio-text-muted">PROTO-2024-002</p>
                    </div>
                    <span className="text-studio-text">Jun 2025</span>
                  </div>
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
                      <span className="text-studio-text">1,247/1,500</span>
                    </div>
                    <div className="w-full bg-studio-bg rounded-full h-2">
                      <div className="bg-primary h-2 rounded-full" style={{ width: '83%' }}></div>
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
                      <span className="text-studio-text">94.2%</span>
                    </div>
                    <div className="w-full bg-studio-bg rounded-full h-2">
                      <div className="bg-primary h-2 rounded-full" style={{ width: '94%' }}></div>
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
                      <span className="text-studio-text">98.5%</span>
                    </div>
                    <div className="w-full bg-studio-bg rounded-full h-2">
                      <div className="bg-primary h-2 rounded-full" style={{ width: '98%' }}></div>
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
                      <span className="text-studio-text">$2.4M/$3.2M</span>
                    </div>
                    <div className="w-full bg-studio-bg rounded-full h-2">
                      <div className="bg-primary h-2 rounded-full" style={{ width: '75%' }}></div>
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
                      <span className="text-studio-text">67%</span>
                    </div>
                    <div className="w-full bg-studio-bg rounded-full h-2">
                      <div className="bg-primary h-2 rounded-full" style={{ width: '67%' }}></div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-studio-surface border-studio-border">
                <CardHeader>
                  <CardTitle className="text-studio-text">Recent Alerts</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {alerts.map((alert, index) => (
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
    </div>
  );
};

export default CROSponsorDashboard;
