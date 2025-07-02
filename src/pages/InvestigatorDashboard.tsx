import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Header from "@/components/Header";
import { Users, FileCheck, AlertTriangle, BarChart3, Calendar, UserCheck } from "lucide-react";

interface InvestigatorDashboardProps {
  onLogout: () => void;
}

const InvestigatorDashboard = ({ onLogout }: InvestigatorDashboardProps) => {
  const [isDemoMode, setIsDemoMode] = useState(false);

  const recentActivities = [
    { participant: "P-001", action: "Completed Visit 3", time: "2 hours ago" },
    { participant: "P-007", action: "Submitted AE Report", time: "4 hours ago" },
    { participant: "P-003", action: "Missed Scheduled Visit", time: "1 day ago" }
  ];

  return (
    <div className="min-h-screen bg-studio-bg">
      <Header
        role="investigator"
        onDemoToggle={() => setIsDemoMode(!isDemoMode)}
        isDemoMode={isDemoMode}
        onLogout={onLogout}
      />

      <main className="p-6 max-w-6xl mx-auto space-y-6">
        <div className="space-y-2">
          <h2 className="text-xl font-medium text-studio-text">
            Study Management Dashboard
          </h2>
          <p className="text-studio-text-muted">
            Protocol: PROTO-2024-001 | Site: Metro General Hospital
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <Card className="bg-studio-surface border-studio-border">
            <CardContent className="p-6">
              <div className="flex items-center space-x-2">
                <Users className="h-5 w-5 text-studio-text-muted" />
                <span className="text-2xl font-semibold text-studio-text">24</span>
              </div>
              <p className="text-studio-text-muted text-sm mt-1">
                Active participants
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
                Pending reviews
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
                Adverse events
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="bg-studio-surface border-studio-border lg:col-span-2">
            <CardHeader>
              <CardTitle className="text-studio-text">Recent Participant Activity</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {recentActivities.map((item, index) => (
                <div key={index} className="flex justify-between items-center p-3 bg-studio-bg rounded">
                  <div>
                    <p className="font-medium text-studio-text">{item.participant}</p>
                    <p className="text-sm text-studio-text-muted">{item.action}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-studio-text-muted">{item.time}</p>
                    <Button variant="studio" size="sm" className="mt-1">
                      Review
                    </Button>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card className="bg-studio-surface border-studio-border">
            <CardHeader>
              <CardTitle className="text-studio-text">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button variant="studio" className="w-full justify-start">
                <UserCheck className="h-4 w-4 mr-2" />
                Enroll Participant
              </Button>
              <Button variant="studio" className="w-full justify-start">
                <Calendar className="h-4 w-4 mr-2" />
                Schedule Visit
              </Button>
              <Button variant="studio" className="w-full justify-start">
                <BarChart3 className="h-4 w-4 mr-2" />
                Generate Report
              </Button>
              <Button variant="studio" className="w-full justify-start">
                <AlertTriangle className="h-4 w-4 mr-2" />
                Report AE
              </Button>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="bg-studio-surface border-studio-border">
            <CardHeader>
              <CardTitle className="text-studio-text">Study Progress</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-studio-text-muted">Enrollment</span>
                  <span className="text-studio-text">24/30 (80%)</span>
                </div>
                <div className="w-full bg-studio-bg rounded-full h-2">
                  <div className="bg-primary h-2 rounded-full" style={{ width: '80%' }}></div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-studio-surface border-studio-border">
            <CardHeader>
              <CardTitle className="text-studio-text">Compliance Rate</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-studio-text-muted">Overall</span>
                  <span className="text-studio-text">92%</span>
                </div>
                <div className="w-full bg-studio-bg rounded-full h-2">
                  <div className="bg-primary h-2 rounded-full" style={{ width: '92%' }}></div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default InvestigatorDashboard;