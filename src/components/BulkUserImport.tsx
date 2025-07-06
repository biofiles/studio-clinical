import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Upload, Download, FileText, CheckCircle, AlertCircle, Users } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useStudy } from "@/contexts/StudyContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { toast } from "sonner";

interface BulkUserImportProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  userType: 'investigator' | 'participant';
}

interface ImportRow {
  email: string;
  full_name: string;
  role?: string;
  study_id?: string;
  subject_id?: string;
  arm?: string;
  status: 'pending' | 'success' | 'error';
  error?: string;
}

const BulkUserImport = ({ open, onOpenChange, userType }: BulkUserImportProps) => {
  const [file, setFile] = useState<File | null>(null);
  const [importData, setImportData] = useState<ImportRow[]>([]);
  const [importing, setImporting] = useState(false);
  const [progress, setProgress] = useState(0);
  const [results, setResults] = useState<{ success: number; errors: number } | null>(null);
  const [defaultRole, setDefaultRole] = useState('investigator');
  const [defaultStudy, setDefaultStudy] = useState('');

  const { user } = useAuth();
  const { t } = useLanguage();
  const { studies } = useStudy();

  const downloadTemplate = () => {
    const headers = userType === 'participant' 
      ? ['email', 'full_name', 'subject_id', 'arm', 'date_of_birth', 'gender']
      : ['email', 'full_name', 'role', 'study_id'];
    
    const csvContent = headers.join(',') + '\n' + 
      (userType === 'participant' 
        ? 'participant1@example.com,John Doe,S001,Treatment A,1990-01-01,male\n' +
          'participant2@example.com,Jane Smith,S002,Control,1985-05-15,female'
        : 'investigator1@example.com,Dr. Smith,investigator,study_id_1\n' +
          'investigator2@example.com,Dr. Johnson,investigator,study_id_2'
      );

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${userType}_import_template.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const uploadedFile = event.target.files?.[0];
    if (uploadedFile && uploadedFile.type === 'text/csv') {
      setFile(uploadedFile);
      parseCSV(uploadedFile);
    } else {
      toast.error('Please upload a valid CSV file');
    }
  };

  const parseCSV = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      const lines = text.split('\n').filter(line => line.trim());
      const headers = lines[0].split(',').map(h => h.trim().toLowerCase());
      
      const rows: ImportRow[] = lines.slice(1).map((line, index) => {
        const values = line.split(',').map(v => v.trim());
        const row: ImportRow = {
          email: '',
          full_name: '',
          status: 'pending'
        };

        headers.forEach((header, i) => {
          const value = values[i] || '';
          switch (header) {
            case 'email':
              row.email = value;
              break;
            case 'full_name':
              row.full_name = value;
              break;
            case 'role':
              row.role = value || defaultRole;
              break;
            case 'study_id':
              row.study_id = value || defaultStudy;
              break;
            case 'subject_id':
              row.subject_id = value;
              break;
            case 'arm':
              row.arm = value;
              break;
          }
        });

        return row;
      });

      setImportData(rows);
    };
    reader.readAsText(file);
  };

  const validateRow = (row: ImportRow): string | null => {
    if (!row.email || !row.email.includes('@')) {
      return 'Invalid email address';
    }
    if (!row.full_name) {
      return 'Full name is required';
    }
    if (userType === 'participant' && !row.subject_id) {
      return 'Subject ID is required for participants';
    }
    if (userType === 'investigator' && !row.role) {
      return 'Role is required for investigators';
    }
    return null;
  };

  const processImport = async () => {
    setImporting(true);
    setProgress(0);
    let successCount = 0;
    let errorCount = 0;

    for (let i = 0; i < importData.length; i++) {
      const row = importData[i];
      const validationError = validateRow(row);
      
      if (validationError) {
        row.status = 'error';
        row.error = validationError;
        errorCount++;
      } else {
        try {
          if (userType === 'participant') {
            await createParticipant(row);
          } else {
            await createInvestigator(row);
          }
          row.status = 'success';
          successCount++;
        } catch (error: any) {
          row.status = 'error';
          row.error = error.message || 'Unknown error';
          errorCount++;
        }
      }

      setProgress(((i + 1) / importData.length) * 100);
      setImportData([...importData]); // Trigger re-render
    }

    setResults({ success: successCount, errors: errorCount });
    setImporting(false);

    // Log the bulk import activity
    await supabase.rpc('log_user_activity', {
      user_id: user?.id,
      activity_type: `bulk_${userType}_import`,
      details: {
        total_rows: importData.length,
        success_count: successCount,
        error_count: errorCount
      }
    });

    toast.success(`Import completed: ${successCount} successful, ${errorCount} errors`);
  };

  const createParticipant = async (row: ImportRow) => {
    // Create auth user first
    const password = generateSecurePassword();
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email: row.email,
      password: password,
      email_confirm: true,
      user_metadata: {
        full_name: row.full_name
      }
    });

    if (authError) throw authError;

    // Create participant record
    const { error: participantError } = await supabase
      .from('participants')
      .insert({
        study_id: defaultStudy,
        subject_id: row.subject_id!,
        first_name: row.full_name.split(' ')[0],
        last_name: row.full_name.split(' ').slice(1).join(' '),
        email: row.email,
        arm: row.arm,
        status: 'enrolled'
      });

    if (participantError) {
      await supabase.auth.admin.deleteUser(authData.user.id);
      throw participantError;
    }

    // Create user role
    await supabase
      .from('user_roles')
      .insert({
        user_id: authData.user.id,
        role: 'participant',
        study_id: defaultStudy,
        assigned_by: user?.id,
        status: 'active'
      });
  };

  const createInvestigator = async (row: ImportRow) => {
    // Create invitation record
    const { error } = await supabase
      .from('user_invitations')
      .insert({
        email: row.email,
        role: row.role as any,
        study_id: row.study_id || null,
        invited_by: user?.id,
        full_name: row.full_name
      });

    if (error) throw error;
  };

  const generateSecurePassword = () => {
    const chars = 'ABCDEFGHJKMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789';
    return Array.from({ length: 12 }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Upload className="h-5 w-5" />
            <span>Bulk {userType === 'participant' ? 'Participant' : 'User'} Import</span>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Step 1: Download Template */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Step 1: Download Template</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-studio-text-muted mb-4">
                Download the CSV template and fill in your {userType} data.
              </p>
              <Button onClick={downloadTemplate} variant="outline">
                <Download className="h-4 w-4 mr-2" />
                Download CSV Template
              </Button>
            </CardContent>
          </Card>

          {/* Step 2: Configure Defaults */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Step 2: Configure Defaults</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {userType === 'investigator' && (
                <div>
                  <Label htmlFor="default-role">Default Role</Label>
                  <Select value={defaultRole} onValueChange={setDefaultRole}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="investigator">Investigator</SelectItem>
                      <SelectItem value="cro_sponsor">CRO/Sponsor</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}
              <div>
                <Label htmlFor="default-study">Default Study {userType === 'participant' ? '(Required)' : '(Optional)'}</Label>
                <Select value={defaultStudy} onValueChange={setDefaultStudy}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a study" />
                  </SelectTrigger>
                  <SelectContent>
                    {userType === 'investigator' && <SelectItem value="">No specific study</SelectItem>}
                    {studies.map(study => (
                      <SelectItem key={study.id} value={study.id}>
                        {study.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Step 3: Upload File */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Step 3: Upload CSV File</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="csv-upload">Select CSV File</Label>
                  <Input
                    id="csv-upload"
                    type="file"
                    accept=".csv"
                    onChange={handleFileUpload}
                  />
                </div>
                {file && (
                  <Alert>
                    <FileText className="h-4 w-4" />
                    <AlertDescription>
                      File loaded: {file.name} ({importData.length} rows)
                    </AlertDescription>
                  </Alert>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Step 4: Preview and Import */}
          {importData.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Step 4: Preview and Import</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="max-h-60 overflow-y-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left p-2">Status</th>
                        <th className="text-left p-2">Email</th>
                        <th className="text-left p-2">Name</th>
                        {userType === 'participant' && <th className="text-left p-2">Subject ID</th>}
                        {userType === 'investigator' && <th className="text-left p-2">Role</th>}
                        <th className="text-left p-2">Error</th>
                      </tr>
                    </thead>
                    <tbody>
                      {importData.map((row, index) => (
                        <tr key={index} className="border-b">
                          <td className="p-2">
                            {row.status === 'pending' && <div className="w-4 h-4 bg-gray-300 rounded-full" />}
                            {row.status === 'success' && <CheckCircle className="w-4 h-4 text-green-600" />}
                            {row.status === 'error' && <AlertCircle className="w-4 h-4 text-red-600" />}
                          </td>
                          <td className="p-2">{row.email}</td>
                          <td className="p-2">{row.full_name}</td>
                          {userType === 'participant' && <td className="p-2">{row.subject_id}</td>}
                          {userType === 'investigator' && <td className="p-2">{row.role}</td>}
                          <td className="p-2 text-red-600 text-xs">{row.error}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {importing && (
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Users className="h-4 w-4" />
                      <span className="text-sm">Importing {userType}s...</span>
                    </div>
                    <Progress value={progress} className="h-2" />
                  </div>
                )}

                {results && (
                  <Alert>
                    <CheckCircle className="h-4 w-4" />
                    <AlertDescription>
                      Import completed: {results.success} successful, {results.errors} errors
                    </AlertDescription>
                  </Alert>
                )}

                <div className="flex justify-end space-x-2">
                  <Button variant="outline" onClick={() => onOpenChange(false)}>
                    Cancel
                  </Button>
                  <Button 
                    onClick={processImport}
                    disabled={importing || (userType === 'participant' && !defaultStudy)}
                  >
                    {importing ? 'Importing...' : `Import ${importData.length} ${userType}s`}
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default BulkUserImport;