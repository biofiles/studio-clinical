import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useState } from "react";
import { Search, Eye, FileText, Calendar, Barcode } from "lucide-react";
import ParticipantDetailView from "./ParticipantDetailView";
import ParticipantScheduler from "./ParticipantScheduler";
import ParticipantQuestionnaires from "./ParticipantQuestionnaires";

interface ParticipantListProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface Participant {
  patientId: string;
  token: string;
  enrollmentDate: string;
  lastVisit: string;
  nextVisit: string;
  questionnairesCompleted: number;
  questionnairesTotal: number;
  visitStatus: 'completed' | 'scheduled' | 'overdue';
  complianceRate: number;
}

const ParticipantList = ({ open, onOpenChange }: ParticipantListProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedParticipant, setSelectedParticipant] = useState<string | null>(null);
  const [showDetailView, setShowDetailView] = useState(false);
  const [showScheduler, setShowScheduler] = useState(false);
  const [showQuestionnaires, setShowQuestionnaires] = useState(false);

  const participants: Participant[] = [
    {
      patientId: "P001",
      token: "PTK-9283-WZ1",
      enrollmentDate: "2024-10-15",
      lastVisit: "2024-12-01",
      nextVisit: "2024-12-15",
      questionnairesCompleted: 8,
      questionnairesTotal: 10,
      visitStatus: 'scheduled',
      complianceRate: 96
    },
    {
      patientId: "P002",
      token: "PTK-4751-QR3",
      enrollmentDate: "2024-10-20",
      lastVisit: "2024-12-05",
      nextVisit: "2024-12-16",
      questionnairesCompleted: 9,
      questionnairesTotal: 10,
      visitStatus: 'scheduled',
      complianceRate: 98
    },
    {
      patientId: "P003",
      token: "PTK-8239-MN7",
      enrollmentDate: "2024-10-18",
      lastVisit: "2024-11-28",
      nextVisit: "2024-12-12",
      questionnairesCompleted: 7,
      questionnairesTotal: 10,
      visitStatus: 'overdue',
      complianceRate: 89
    },
    {
      patientId: "P004",
      token: "PTK-5642-LP9",
      enrollmentDate: "2024-11-01",
      lastVisit: "2024-12-08",
      nextVisit: "2024-12-20",
      questionnairesCompleted: 6,
      questionnairesTotal: 8,
      visitStatus: 'completed',
      complianceRate: 94
    },
    {
      patientId: "P005",
      token: "PTK-7194-KX2",
      enrollmentDate: "2024-11-05",
      lastVisit: "2024-12-02",
      nextVisit: "2024-12-18",
      questionnairesCompleted: 5,
      questionnairesTotal: 8,
      visitStatus: 'scheduled',
      complianceRate: 92
    }
  ];

  const filteredParticipants = participants.filter(p =>
    p.patientId.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.token.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'scheduled': return 'bg-blue-100 text-blue-800';
      case 'overdue': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleViewParticipant = (patientId: string) => {
    setSelectedParticipant(patientId);
    setShowDetailView(true);
  };

  const handleViewQuestionnaires = (patientId: string) => {
    setSelectedParticipant(patientId);
    setShowQuestionnaires(true);
  };

  const handleScheduleVisit = (patientId: string) => {
    setSelectedParticipant(patientId);
    setShowScheduler(true);
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-2">
              <Search className="h-5 w-5" />
              <span>Participant Management</span>
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="flex items-center space-x-4">
              <div className="flex-1">
                <Input
                  placeholder="Search by patient ID or token..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full"
                />
              </div>
              <div className="text-sm text-studio-text-muted">
                {filteredParticipants.length} of {participants.length} participants
              </div>
            </div>

            <Card className="bg-studio-surface border-studio-border">
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Patient ID</TableHead>
                      <TableHead>Token</TableHead>
                      <TableHead>Enrollment</TableHead>
                      <TableHead>Visit Status</TableHead>
                      <TableHead>Questionnaires</TableHead>
                      <TableHead>Compliance</TableHead>
                      <TableHead>Next Visit</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredParticipants.map((participant) => (
                      <TableRow key={participant.patientId}>
                        <TableCell className="font-semibold">
                          {participant.patientId}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            <Barcode className="h-4 w-4 text-studio-text-muted" />
                            <code className="font-mono text-sm">
                              {participant.token}
                            </code>
                          </div>
                        </TableCell>
                        <TableCell>
                          {new Date(participant.enrollmentDate).toLocaleDateString()}
                        </TableCell>
                        <TableCell>
                          <Badge className={getStatusColor(participant.visitStatus)}>
                            {participant.visitStatus}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {participant.questionnairesCompleted}/{participant.questionnairesTotal}
                          <div className="w-16 bg-gray-200 rounded-full h-1 mt-1">
                            <div 
                              className="bg-blue-600 h-1 rounded-full" 
                              style={{ 
                                width: `${(participant.questionnairesCompleted / participant.questionnairesTotal) * 100}%` 
                              }}
                            ></div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <span className={participant.complianceRate >= 95 ? 'text-green-600' : 
                                         participant.complianceRate >= 85 ? 'text-yellow-600' : 'text-red-600'}>
                            {participant.complianceRate}%
                          </span>
                        </TableCell>
                        <TableCell>
                          {new Date(participant.nextVisit).toLocaleDateString()}
                        </TableCell>
                        <TableCell>
                          <div className="flex space-x-1">
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => handleViewParticipant(participant.patientId)}
                              title="View Details"
                            >
                              <Eye className="h-3 w-3" />
                            </Button>
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => handleViewQuestionnaires(participant.patientId)}
                              title="View Questionnaires"
                            >
                              <FileText className="h-3 w-3" />
                            </Button>
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => handleScheduleVisit(participant.patientId)}
                              title="Schedule Visit"
                            >
                              <Calendar className="h-3 w-3" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
        </DialogContent>
      </Dialog>

      {/* Detail View Dialog */}
      <ParticipantDetailView
        open={showDetailView}
        onOpenChange={setShowDetailView}
        participantId={selectedParticipant}
      />

      {/* Schedule Dialog */}
      <ParticipantScheduler
        open={showScheduler}
        onOpenChange={setShowScheduler}
        participantId={selectedParticipant}
      />

      {/* Questionnaires Dialog */}
      <ParticipantQuestionnaires
        open={showQuestionnaires}
        onOpenChange={setShowQuestionnaires}
        participantId={selectedParticipant}
      />
    </>
  );
};

export default ParticipantList;
