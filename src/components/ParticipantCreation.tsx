import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { UserPlus, QrCode, Mail, Copy } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useStudy } from "@/contexts/StudyContext";
import { toast } from "sonner";

interface ParticipantCreationProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const ParticipantCreation = ({ open, onOpenChange }: ParticipantCreationProps) => {
  const [step, setStep] = useState(1);
  const [participantForm, setParticipantForm] = useState({
    subject_id: "",
    first_name: "",
    last_name: "",
    email: "",
    date_of_birth: "",
    gender: "",
    arm: ""
  });
  const [generatedCredentials, setGeneratedCredentials] = useState({
    email: "",
    password: "",
    token: ""
  });
  const [loading, setLoading] = useState(false);

  const { user } = useAuth();
  const { selectedStudy } = useStudy();

  const generateSecurePassword = () => {
    const chars = 'ABCDEFGHJKMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789';
    return Array.from({ length: 12 }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
  };

  const generateParticipantToken = () => {
    const prefix = 'PTK';
    const randomPart = Math.random().toString(36).substring(2, 8).toUpperCase();
    const numPart = Math.floor(Math.random() * 9000) + 1000;
    return `${prefix}-${numPart}-${randomPart}`;
  };

  const handleCreateParticipant = async () => {
    try {
      setLoading(true);

      if (!selectedStudy) {
        toast.error('Please select a study first');
        return;
      }

      // Generate credentials
      const password = generateSecurePassword();
      const token = generateParticipantToken();
      const participantEmail = participantForm.email || `${participantForm.subject_id.toLowerCase()}@temp.studioclinical.com`;

      // Create auth user
      const { data: authData, error: authError } = await supabase.auth.admin.createUser({
        email: participantEmail,
        password: password,
        email_confirm: true,
        user_metadata: {
          full_name: `${participantForm.first_name} ${participantForm.last_name}`,
          participant_token: token
        }
      });

      if (authError) {
        throw authError;
      }

      // Create participant record
      const { error: participantError } = await supabase
        .from('participants')
        .insert({
          study_id: selectedStudy.id,
          subject_id: participantForm.subject_id,
          first_name: participantForm.first_name,
          last_name: participantForm.last_name,
          email: participantEmail,
          date_of_birth: participantForm.date_of_birth || null,
          gender: participantForm.gender || null,
          arm: participantForm.arm || null,
          status: 'enrolled'
        });

      if (participantError) {
        // Cleanup auth user if participant creation fails
        await supabase.auth.admin.deleteUser(authData.user.id);
        throw participantError;
      }

      // Create user role
      const { error: roleError } = await supabase
        .from('user_roles')
        .insert({
          user_id: authData.user.id,
          role: 'participant',
          study_id: selectedStudy.id,
          assigned_by: user?.id,
          status: 'active'
        });

      if (roleError) {
        console.error('Role assignment error:', roleError);
        // Don't fail the whole process for role assignment
      }

      // Log activity
      await supabase.rpc('log_user_activity', {
        user_id: user?.id,
        activity_type: 'participant_created',
        details: {
          participant_id: authData.user.id,
          subject_id: participantForm.subject_id,
          study_id: selectedStudy.id
        }
      });

      setGeneratedCredentials({
        email: participantEmail,
        password: password,
        token: token
      });

      setStep(2);
      toast.success('Participant account created successfully');

    } catch (error) {
      console.error('Error creating participant:', error);
      toast.error('Failed to create participant account');
    } finally {
      setLoading(false);
    }
  };

  const handleCopyCredentials = () => {
    const credentials = `
Login Details for Clinical Study
===============================
Email: ${generatedCredentials.email}
Password: ${generatedCredentials.password}
Participant Token: ${generatedCredentials.token}

Please keep these credentials secure.
    `.trim();

    navigator.clipboard.writeText(credentials);
    toast.success('Credentials copied to clipboard');
  };

  const handleClose = () => {
    setStep(1);
    setParticipantForm({
      subject_id: "",
      first_name: "",
      last_name: "",
      email: "",
      date_of_birth: "",
      gender: "",
      arm: ""
    });
    setGeneratedCredentials({ email: "", password: "", token: "" });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <UserPlus className="h-5 w-5" />
            <span>Create Participant Account</span>
          </DialogTitle>
        </DialogHeader>

        {step === 1 && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="subject_id">Subject ID *</Label>
                <Input
                  id="subject_id"
                  value={participantForm.subject_id}
                  onChange={(e) => setParticipantForm(prev => ({ ...prev, subject_id: e.target.value }))}
                  placeholder="S001, P001, etc."
                />
              </div>
              <div>
                <Label htmlFor="arm">Study Arm</Label>
                <Input
                  id="arm"
                  value={participantForm.arm}
                  onChange={(e) => setParticipantForm(prev => ({ ...prev, arm: e.target.value }))}
                  placeholder="Control, Treatment A, etc."
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="first_name">First Name *</Label>
                <Input
                  id="first_name"
                  value={participantForm.first_name}
                  onChange={(e) => setParticipantForm(prev => ({ ...prev, first_name: e.target.value }))}
                  placeholder="John"
                />
              </div>
              <div>
                <Label htmlFor="last_name">Last Name *</Label>
                <Input
                  id="last_name"
                  value={participantForm.last_name}
                  onChange={(e) => setParticipantForm(prev => ({ ...prev, last_name: e.target.value }))}
                  placeholder="Doe"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="email">Email (Optional)</Label>
              <Input
                id="email"
                type="email"
                value={participantForm.email}
                onChange={(e) => setParticipantForm(prev => ({ ...prev, email: e.target.value }))}
                placeholder="participant@example.com (leave blank to auto-generate)"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="date_of_birth">Date of Birth</Label>
                <Input
                  id="date_of_birth"
                  type="date"
                  value={participantForm.date_of_birth}
                  onChange={(e) => setParticipantForm(prev => ({ ...prev, date_of_birth: e.target.value }))}
                />
              </div>
              <div>
                <Label htmlFor="gender">Gender</Label>
                <Select
                  value={participantForm.gender}
                  onValueChange={(value) => setParticipantForm(prev => ({ ...prev, gender: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select gender" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="male">Male</SelectItem>
                    <SelectItem value="female">Female</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                    <SelectItem value="unknown">Prefer not to say</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex justify-end space-x-2 pt-4">
              <Button variant="outline" onClick={handleClose}>
                Cancel
              </Button>
              <Button 
                onClick={handleCreateParticipant}
                disabled={!participantForm.subject_id || !participantForm.first_name || !participantForm.last_name || loading}
              >
                {loading ? 'Creating...' : 'Create Account'}
              </Button>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-6">
            <Card className="bg-green-50 border-green-200">
              <CardHeader>
                <CardTitle className="text-green-800 text-lg">Account Created Successfully!</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div>
                    <Label className="text-sm font-medium text-green-700">Login Email</Label>
                    <div className="flex items-center space-x-2">
                      <Input value={generatedCredentials.email} readOnly className="bg-white" />
                      <Button size="sm" variant="outline" onClick={() => navigator.clipboard.writeText(generatedCredentials.email)}>
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-green-700">Temporary Password</Label>
                    <div className="flex items-center space-x-2">
                      <Input value={generatedCredentials.password} readOnly className="bg-white font-mono" />
                      <Button size="sm" variant="outline" onClick={() => navigator.clipboard.writeText(generatedCredentials.password)}>
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-green-700">Participant Token</Label>
                    <div className="flex items-center space-x-2">
                      <Input value={generatedCredentials.token} readOnly className="bg-white font-mono font-bold" />
                      <Button size="sm" variant="outline" onClick={() => navigator.clipboard.writeText(generatedCredentials.token)}>
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>

                <div className="flex space-x-2">
                  <Button onClick={handleCopyCredentials} className="flex-1">
                    <Copy className="h-4 w-4 mr-2" />
                    Copy All Credentials
                  </Button>
                  <Button variant="outline">
                    <QrCode className="h-4 w-4 mr-2" />
                    Generate QR Code
                  </Button>
                  <Button variant="outline">
                    <Mail className="h-4 w-4 mr-2" />
                    Send via Email
                  </Button>
                </div>

                <div className="text-sm text-green-700">
                  <p>• Share these credentials securely with the participant</p>
                  <p>• The participant should change their password on first login</p>
                  <p>• The participant token is used for data privacy and compliance</p>
                </div>
              </CardContent>
            </Card>

            <div className="flex justify-end">
              <Button onClick={handleClose}>
                Close
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default ParticipantCreation;