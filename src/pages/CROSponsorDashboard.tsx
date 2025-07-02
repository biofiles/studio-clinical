
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Header from "@/components/Header";
import { Building2, Globe, TrendingUp, Shield, AlertCircle, CheckCircle, Camera, Download, Clock } from "lucide-react";
import { toast } from "sonner";

interface CROSponsorDashboardProps {
  onLogout: () => void;
}

const CROSponsorDashboard = ({ onLogout }: CROSponsorDashboardProps) => {
  const [isGeneratingScreenshot, setIsGeneratingScreenshot] = useState<string | null>(null);
  const [currentView, setCurrentView] = useState("dashboard");
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

  const handleScreenshotCapture = async (section: string) => {
    setIsGeneratingScreenshot(section);
    
    // Simulate screenshot generation process
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    toast.success(`${section} screenshot generated for audit trail`, {
      description: `Compliance document ready for regulatory submission`
    });
    
    setIsGeneratingScreenshot(null);
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

      <main className="p-6 max-w-7xl mx-auto space-y-6">
        <div className="flex justify-between items-start">
          <div className="space-y-2">
            <h2 className="text-xl font-medium text-studio-text">
              Portfolio Overview
            </h2>
            <p className="text-studio-text-muted">
              Global Research Operations Dashboard
            </p>
          </div>
          
          <Button
            onClick={() => handleScreenshotCapture("Portfolio Overview")}
            disabled={isGeneratingScreenshot === "Portfolio Overview"}
            variant="outline"
            size="sm"
            className="flex items-center space-x-2"
          >
            {isGeneratingScreenshot === "Portfolio Overview" ? (
              <>
                <div className="animate-spin h-3 w-3 border border-primary border-t-transparent rounded-full" />
                <span>Generating...</span>
              </>
            ) : (
              <>
                <Camera className="h-3 w-3" />
                <span>Generate Screenshot for Audit</span>
              </>
            )}
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
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

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="bg-studio-surface border-studio-border lg:col-span-2">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-studio-text">Active Studies</CardTitle>
              <Button
                onClick={() => handleScreenshotCapture("Study Overview")}
                disabled={isGeneratingScreenshot === "Study Overview"}
                variant="outline"
                size="sm"
                className="flex items-center space-x-1"
              >
                {isGeneratingScreenshot === "Study Overview" ? (
                  <>
                    <div className="animate-spin h-3 w-3 border border-primary border-t-transparent rounded-full" />
                    <span className="text-xs">Generating...</span>
                  </>
                ) : (
                  <>
                    <Camera className="h-3 w-3" />
                    <span className="text-xs">Screenshot</span>
                  </>
                )}
              </Button>
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
                    <div className="flex items-center space-x-2">
                      <span className={`px-2 py-1 rounded text-xs ${
                        study.status === 'Active' ? 'bg-accent text-accent-foreground' :
                        study.status === 'Recruiting' ? 'bg-primary text-primary-foreground' :
                        'bg-muted text-muted-foreground'
                      }`}>
                        {study.status}
                      </span>
                      <Button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleScreenshotCapture(`Visit Logs - ${study.id}`);
                        }}
                        disabled={isGeneratingScreenshot === `Visit Logs - ${study.id}`}
                        variant="ghost"
                        size="sm"
                        className="h-6 w-6 p-0"
                      >
                        {isGeneratingScreenshot === `Visit Logs - ${study.id}` ? (
                          <div className="animate-spin h-3 w-3 border border-primary border-t-transparent rounded-full" />
                        ) : (
                          <Camera className="h-3 w-3" />
                        )}
                      </Button>
                    </div>
                  </div>
                  <div className="flex justify-between text-sm text-studio-text-muted">
                    <span>{study.sites} sites</span>
                    <span>{study.participants} participants</span>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card className="bg-studio-surface border-studio-border">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-studio-text">Recent Alerts</CardTitle>
              <Button
                onClick={() => handleScreenshotCapture("Alerts Log")}
                disabled={isGeneratingScreenshot === "Alerts Log"}
                variant="outline"
                size="sm"
                className="flex items-center space-x-1"
              >
                {isGeneratingScreenshot === "Alerts Log" ? (
                  <div className="animate-spin h-3 w-3 border border-primary border-t-transparent rounded-full" />
                ) : (
                  <Camera className="h-3 w-3" />
                )}
              </Button>
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

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="bg-studio-surface border-studio-border">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-studio-text">Enrollment Progress</CardTitle>
              <Button
                onClick={() => handleScreenshotCapture("Enrollment Report")}
                disabled={isGeneratingScreenshot === "Enrollment Report"}
                variant="ghost"
                size="sm"
                className="h-6 w-6 p-0"
              >
                {isGeneratingScreenshot === "Enrollment Report" ? (
                  <div className="animate-spin h-3 w-3 border border-primary border-t-transparent rounded-full" />
                ) : (
                  <Camera className="h-3 w-3" />
                )}
              </Button>
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
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-studio-text">Budget Utilization</CardTitle>
              <Button
                onClick={() => handleScreenshotCapture("Budget Report")}
                disabled={isGeneratingScreenshot === "Budget Report"}
                variant="ghost"
                size="sm"
                className="h-6 w-6 p-0"
              >
                {isGeneratingScreenshot === "Budget Report" ? (
                  <div className="animate-spin h-3 w-3 border border-primary border-t-transparent rounded-full" />
                ) : (
                  <Camera className="h-3 w-3" />
                )}
              </Button>
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
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-studio-text">Timeline Progress</CardTitle>
              <Button
                onClick={() => handleScreenshotCapture("Timeline Report")}
                disabled={isGeneratingScreenshot === "Timeline Report"}
                variant="ghost"
                size="sm"
                className="h-6 w-6 p-0"
              >
                {isGeneratingScreenshot === "Timeline Report" ? (
                  <div className="animate-spin h-3 w-3 border border-primary border-t-transparent rounded-full" />
                ) : (
                  <Camera className="h-3 w-3" />
                )}
              </Button>
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
        </div>
      </main>
    </div>
  );
};

export default CROSponsorDashboard;
