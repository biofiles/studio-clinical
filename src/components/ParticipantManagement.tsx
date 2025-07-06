import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Users, Search, MoreVertical, UserPlus, MessageCircle, Upload, Download, RefreshCw, AlertCircle, CheckCircle, Clock, XCircle } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useStudy } from "@/contexts/StudyContext";
import { toast } from "sonner";
import ParticipantCreation from "./ParticipantCreation";

interface Participant {
  id: string;
  subject_id: string;
  first_name: string;
  last_name: string;
  email: string;
  status: string;
  enrollment_date: string;
  completion_date?: string;
  arm?: string;
  created_at: string;
}

interface ParticipantManagementProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const ParticipantManagement = ({ open, onOpenChange }: ParticipantManagementProps) => {
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [filteredParticipants, setFilteredParticipants] = useState<Participant[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [loading, setLoading] = useState(false);
  const [showCreation, setShowCreation] = useState(false);
  const [showStatusDialog, setShowStatusDialog] = useState(false);
  const [showCommunicationDialog, setShowCommunicationDialog] = useState(false);
  const [selectedParticipant, setSelectedParticipant] = useState<Participant | null>(null);
  const [statusUpdate, setStatusUpdate] = useState({
    status: "",
    reason: "",
    completion_date: ""
  });
  const [communicationForm, setCommunicationForm] = useState({
    subject: "",
    message: "",
    recipients: [] as string[]
  });

  const { user } = useAuth();
  const { selectedStudy } = useStudy();

  useEffect(() => {
    if (open && selectedStudy) {
      fetchParticipants();
    }
  }, [open, selectedStudy]);

  useEffect(() => {
    filterParticipants();
  }, [participants, searchTerm, statusFilter]);

  const fetchParticipants = async () => {
    try {
      setLoading(true);
      
      if (!selectedStudy) return;

      const { data, error } = await supabase
        .from('participants')
        .select('*')
        .eq('study_id', selectedStudy.id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      setParticipants(data || []);
    } catch (error) {
      console.error('Error fetching participants:', error);
      toast.error('Failed to fetch participants');
    } finally {
      setLoading(false);
    }
  };

  const filterParticipants = () => {
    let filtered = participants;

    if (searchTerm) {
      filtered = filtered.filter(p => 
        p.subject_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        `${p.first_name} ${p.last_name}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter !== "all") {
      filtered = filtered.filter(p => p.status === statusFilter);
    }

    setFilteredParticipants(filtered);
  };

  const handleStatusChange = async () => {
    try {
      if (!selectedParticipant) return;

      const updateData: any = {
        status: statusUpdate.status
      };

      if (statusUpdate.status === 'completed' && statusUpdate.completion_date) {
        updateData.completion_date = statusUpdate.completion_date;
      }

      const { error } = await supabase
        .from('participants')
        .update(updateData)
        .eq('id', selectedParticipant.id);

      if (error) throw error;

      // Log the activity
      await supabase.rpc('log_user_activity', {
        user_id: user?.id,
        activity_type: 'participant_status_changed',
        details: {
          participant_id: selectedParticipant.id,
          subject_id: selectedParticipant.subject_id,
          old_status: selectedParticipant.status,
          new_status: statusUpdate.status,
          reason: statusUpdate.reason
        }
      });

      toast.success('Participant status updated successfully');
      setShowStatusDialog(false);
      setStatusUpdate({ status: "", reason: "", completion_date: "" });
      fetchParticipants();
    } catch (error) {
      console.error('Error updating participant status:', error);
      toast.error('Failed to update participant status');
    }
  };

  const handleBulkCommunication = async () => {
    try {
      if (communicationForm.recipients.length === 0) {
        toast.error('Please select recipients');
        return;
      }

      // Log the communication
      await supabase.rpc('log_user_activity', {
        user_id: user?.id,
        activity_type: 'bulk_communication_sent',
        details: {
          subject: communicationForm.subject,
          recipient_count: communicationForm.recipients.length,
          study_id: selectedStudy?.id
        }
      });

      toast.success('Communication sent successfully');
      setShowCommunicationDialog(false);
      setCommunicationForm({ subject: "", message: "", recipients: [] });
    } catch (error) {
      console.error('Error sending communication:', error);
      toast.error('Failed to send communication');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'enrolled':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'active':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'completed':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      case 'withdrawn':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'screening':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return <CheckCircle className="h-4 w-4" />;
      case 'completed':
        return <CheckCircle className="h-4 w-4" />;
      case 'withdrawn':
        return <XCircle className="h-4 w-4" />;
      case 'screening':
        return <Clock className="h-4 w-4" />;
      default:
        return <AlertCircle className="h-4 w-4" />;
    }
  };

  const statusCounts = {
    total: participants.length,
    screening: participants.filter(p => p.status === 'screening').length,
    enrolled: participants.filter(p => p.status === 'enrolled').length,
    active: participants.filter(p => p.status === 'active').length,
    completed: participants.filter(p => p.status === 'completed').length,
    withdrawn: participants.filter(p => p.status === 'withdrawn').length
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-7xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Users className="h-5 w-5" />
            <span>Participant Management</span>
          </DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="participants">Participants</TabsTrigger>
            <TabsTrigger value="communication">Communication</TabsTrigger>
            <TabsTrigger value="reports">Reports</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              <Card>
                <CardContent className="p-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-studio-text">{statusCounts.total}</div>
                    <div className="text-sm text-studio-text-muted">Total</div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-yellow-600">{statusCounts.screening}</div>
                    <div className="text-sm text-studio-text-muted">Screening</div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">{statusCounts.enrolled}</div>
                    <div className="text-sm text-studio-text-muted">Enrolled</div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">{statusCounts.active}</div>
                    <div className="text-sm text-studio-text-muted">Active</div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-gray-600">{statusCounts.completed}</div>
                    <div className="text-sm text-studio-text-muted">Completed</div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-red-600">{statusCounts.withdrawn}</div>
                    <div className="text-sm text-studio-text-muted">Withdrawn</div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="flex space-x-2">
              <Button onClick={() => setShowCreation(true)}>
                <UserPlus className="h-4 w-4 mr-2" />
                Add Participant
              </Button>
              <Button variant="outline" onClick={fetchParticipants}>
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh
              </Button>
              <Button variant="outline">
                <Upload className="h-4 w-4 mr-2" />
                Import CSV
              </Button>
              <Button variant="outline">
                <Download className="h-4 w-4 mr-2" />
                Export Data
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="participants" className="space-y-4">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 flex-1">
                <Search className="h-4 w-4 text-studio-text-muted" />
                <Input
                  placeholder="Search participants..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="screening">Screening</SelectItem>
                  <SelectItem value="enrolled">Enrolled</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="withdrawn">Withdrawn</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {loading ? (
              <div className="text-center py-8">
                <p className="text-studio-text-muted">Loading participants...</p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Subject ID</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Arm</TableHead>
                    <TableHead>Enrolled</TableHead>
                    <TableHead></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredParticipants.map((participant) => (
                    <TableRow key={participant.id}>
                      <TableCell className="font-medium">{participant.subject_id}</TableCell>
                      <TableCell>{`${participant.first_name} ${participant.last_name}`}</TableCell>
                      <TableCell>{participant.email}</TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(participant.status)}>
                          {getStatusIcon(participant.status)}
                          <span className="ml-1">{participant.status.toUpperCase()}</span>
                        </Badge>
                      </TableCell>
                      <TableCell>{participant.arm || 'Not assigned'}</TableCell>
                      <TableCell>
                        {participant.enrollment_date ? 
                          new Date(participant.enrollment_date).toLocaleDateString() : 
                          'N/A'
                        }
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem
                              onClick={() => {
                                setSelectedParticipant(participant);
                                setStatusUpdate({ ...statusUpdate, status: participant.status });
                                setShowStatusDialog(true);
                              }}
                            >
                              Change Status
                            </DropdownMenuItem>
                            <DropdownMenuItem>View Details</DropdownMenuItem>
                            <DropdownMenuItem>Send Message</DropdownMenuItem>
                            <DropdownMenuItem>Generate QR Code</DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </TabsContent>

          <TabsContent value="communication" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Bulk Communication</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button 
                  onClick={() => setShowCommunicationDialog(true)}
                  className="w-full"
                >
                  <MessageCircle className="h-4 w-4 mr-2" />
                  Send Bulk Message
                </Button>
                <div className="text-sm text-studio-text-muted">
                  Send notifications, reminders, or announcements to selected participants.
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="reports" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle>Enrollment Report</CardTitle>
                </CardHeader>
                <CardContent>
                  <Button variant="outline" className="w-full">
                    <Download className="h-4 w-4 mr-2" />
                    Generate Report
                  </Button>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Compliance Report</CardTitle>
                </CardHeader>
                <CardContent>
                  <Button variant="outline" className="w-full">
                    <Download className="h-4 w-4 mr-2" />
                    Generate Report
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>

        {/* Status Change Dialog */}
        <Dialog open={showStatusDialog} onOpenChange={setShowStatusDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Change Participant Status</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label>Current Status: {selectedParticipant?.status?.toUpperCase()}</Label>
              </div>
              <div>
                <Label htmlFor="new-status">New Status</Label>
                <Select
                  value={statusUpdate.status}
                  onValueChange={(value) => setStatusUpdate(prev => ({ ...prev, status: value }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="screening">Screening</SelectItem>
                    <SelectItem value="enrolled">Enrolled</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="withdrawn">Withdrawn</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              {statusUpdate.status === 'completed' && (
                <div>
                  <Label htmlFor="completion-date">Completion Date</Label>
                  <Input
                    id="completion-date"
                    type="date"
                    value={statusUpdate.completion_date}
                    onChange={(e) => setStatusUpdate(prev => ({ ...prev, completion_date: e.target.value }))}
                  />
                </div>
              )}
              <div>
                <Label htmlFor="reason">Reason (Optional)</Label>
                <Textarea
                  id="reason"
                  value={statusUpdate.reason}
                  onChange={(e) => setStatusUpdate(prev => ({ ...prev, reason: e.target.value }))}
                  placeholder="Provide reason for status change..."
                />
              </div>
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setShowStatusDialog(false)}>
                  Cancel
                </Button>
                <Button onClick={handleStatusChange}>
                  Update Status
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Communication Dialog */}
        <Dialog open={showCommunicationDialog} onOpenChange={setShowCommunicationDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Send Bulk Communication</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="subject">Subject</Label>
                <Input
                  id="subject"
                  value={communicationForm.subject}
                  onChange={(e) => setCommunicationForm(prev => ({ ...prev, subject: e.target.value }))}
                  placeholder="Message subject..."
                />
              </div>
              <div>
                <Label htmlFor="message">Message</Label>
                <Textarea
                  id="message"
                  value={communicationForm.message}
                  onChange={(e) => setCommunicationForm(prev => ({ ...prev, message: e.target.value }))}
                  placeholder="Your message..."
                  rows={4}
                />
              </div>
              <div>
                <Label>Recipients</Label>
                <div className="text-sm text-studio-text-muted mb-2">
                  Select participants to send this message to
                </div>
                <div className="max-h-40 overflow-y-auto space-y-2">
                  {participants.map((participant) => (
                    <div key={participant.id} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id={`recipient-${participant.id}`}
                        checked={communicationForm.recipients.includes(participant.id)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setCommunicationForm(prev => ({
                              ...prev,
                              recipients: [...prev.recipients, participant.id]
                            }));
                          } else {
                            setCommunicationForm(prev => ({
                              ...prev,
                              recipients: prev.recipients.filter(id => id !== participant.id)
                            }));
                          }
                        }}
                      />
                      <label htmlFor={`recipient-${participant.id}`} className="text-sm">
                        {participant.subject_id} - {participant.first_name} {participant.last_name}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setShowCommunicationDialog(false)}>
                  Cancel
                </Button>
                <Button onClick={handleBulkCommunication}>
                  Send Message
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        <ParticipantCreation 
          open={showCreation}
          onOpenChange={setShowCreation}
        />
      </DialogContent>
    </Dialog>
  );
};

export default ParticipantManagement;