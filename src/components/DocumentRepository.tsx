import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Upload, Download, Eye, Trash2, Search, Filter, FileText, Shield, AlertCircle, Calendar } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useStudy } from "@/contexts/StudyContext";
import { toast } from "sonner";

interface Document {
  id: string;
  name: string;
  type: string;
  version: string;
  uploadDate: string;
  uploadedBy: string;
  fileSize: string;
  studyId: string;
}

interface DocumentRepositoryProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  userRole: 'investigator' | 'cro-sponsor';
}

const DocumentRepository = ({ open, onOpenChange, userRole }: DocumentRepositoryProps) => {
  const { t } = useLanguage();
  const { selectedStudy } = useStudy();
  const [showUploadDialog, setShowUploadDialog] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [uploadForm, setUploadForm] = useState({
    name: "",
    type: "",
    version: "",
    file: null as File | null
  });

  // Sample documents for each study
  const getSampleDocuments = (): Document[] => {
    if (!selectedStudy) return [];
    
    const baseDocuments: Document[] = [
      {
        id: "1",
        name: "Study Protocol",
        type: "protocol",
        version: "2.1",
        uploadDate: "2024-01-15",
        uploadedBy: "Dr. Sarah Johnson",
        fileSize: "2.3 MB",
        studyId: selectedStudy.id
      },
      {
        id: "2", 
        name: "Informed Consent Form",
        type: "icf",
        version: "1.5",
        uploadDate: "2024-02-10",
        uploadedBy: "Dr. Michael Chen",
        fileSize: "845 KB",
        studyId: selectedStudy.id
      },
      {
        id: "3",
        name: "Safety Monitoring Plan",
        type: "safety",
        version: "1.0",
        uploadDate: "2024-01-20",
        uploadedBy: "Dr. Emily Rodriguez",
        fileSize: "1.2 MB",
        studyId: selectedStudy.id
      }
    ];

    // Add study-specific documents
    switch (selectedStudy.id) {
      case '1': // PARADIGM-CV
        return [
          ...baseDocuments,
          {
            id: "4",
            name: "Cardiovascular Endpoint Adjudication Charter",
            type: "regulatory",
            version: "1.3",
            uploadDate: "2024-02-15",
            uploadedBy: "Dr. James Wilson",
            fileSize: "956 KB",
            studyId: selectedStudy.id
          },
          {
            id: "5",
            name: "Protocol Amendment 1 - ECG Monitoring",
            type: "amendment",
            version: "1.0",
            uploadDate: "2024-03-01",
            uploadedBy: "Dr. Sarah Johnson",
            fileSize: "623 KB",
            studyId: selectedStudy.id
          }
        ];
      case '2': // ATLAS-DM2
        return [
          ...baseDocuments,
          {
            id: "4",
            name: "Diabetes Management Guidelines",
            type: "regulatory",
            version: "2.0",
            uploadDate: "2024-02-20",
            uploadedBy: "Dr. Lisa Wang",
            fileSize: "1.8 MB",
            studyId: selectedStudy.id
          },
          {
            id: "5",
            name: "HbA1c Laboratory Manual",
            type: "other",
            version: "1.2",
            uploadDate: "2024-02-25",
            uploadedBy: "Lab Director",
            fileSize: "743 KB",
            studyId: selectedStudy.id
          }
        ];
      case '3': // HORIZON-Onc
        return [
          ...baseDocuments,
          {
            id: "4",
            name: "Tumor Assessment Guidelines",
            type: "regulatory",
            version: "1.1",
            uploadDate: "2024-02-18",
            uploadedBy: "Dr. Patricia Davis",
            fileSize: "1.5 MB",
            studyId: selectedStudy.id
          },
          {
            id: "5",
            name: "Biomarker Analysis Protocol",
            type: "other",
            version: "1.0",
            uploadDate: "2024-03-05",
            uploadedBy: "Dr. Robert Kim",
            fileSize: "892 KB",
            studyId: selectedStudy.id
          }
        ];
      case '4': // GUARDIAN-Ped
        return [
          ...baseDocuments,
          {
            id: "4",
            name: "Pediatric Safety Guidelines",
            type: "safety",
            version: "1.4",
            uploadDate: "2024-02-12",
            uploadedBy: "Dr. Maria Garcia",
            fileSize: "1.1 MB",
            studyId: selectedStudy.id
          },
          {
            id: "5",
            name: "Growth Assessment Manual",
            type: "other",
            version: "1.0",
            uploadDate: "2024-02-28",
            uploadedBy: "Pediatric Team",
            fileSize: "675 KB",
            studyId: selectedStudy.id
          }
        ];
      default:
        return baseDocuments;
    }
  };

  const documents = getSampleDocuments();

  const filteredDocuments = documents.filter(doc => {
    const matchesSearch = doc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         doc.uploadedBy.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterType === "all" || doc.type === filterType;
    return matchesSearch && matchesFilter;
  });

  const documentTypes = [
    { value: "protocol", label: t('documents.type.protocol') },
    { value: "icf", label: t('documents.type.icf') },
    { value: "amendment", label: t('documents.type.amendment') },
    { value: "safety", label: t('documents.type.safety') },
    { value: "regulatory", label: t('documents.type.regulatory') },
    { value: "other", label: t('documents.type.other') }
  ];

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'protocol':
        return <FileText className="h-4 w-4" />;
      case 'safety':
        return <Shield className="h-4 w-4" />;
      case 'amendment':
        return <AlertCircle className="h-4 w-4" />;
      default:
        return <FileText className="h-4 w-4" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'protocol':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'icf':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'amendment':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'safety':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'regulatory':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'other':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const handleUpload = () => {
    if (!uploadForm.name || !uploadForm.type || !uploadForm.version) {
      toast.error(t('documents.upload.error'));
      return;
    }
    
    toast.success(t('documents.upload.success'));
    setShowUploadDialog(false);
    setUploadForm({ name: "", type: "", version: "", file: null });
  };

  const handleDownload = (document: Document) => {
    toast.success(`Downloading ${document.name}...`);
  };

  const handleView = (document: Document) => {
    toast.info(`Opening ${document.name}...`);
  };

  const handleDelete = (document: Document) => {
    if (userRole !== 'cro-sponsor') {
      toast.error("Only sponsors can delete documents");
      return;
    }
    toast.success(`${document.name} deleted successfully`);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            {t('documents.title')}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Header Actions */}
          <div className="flex flex-col sm:flex-row gap-4 justify-between">
            <div className="flex gap-2 flex-1">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder={t('documents.search.placeholder')}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={filterType} onValueChange={setFilterType}>
                <SelectTrigger className="w-[180px]">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder={t('documents.filter.all')} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{t('documents.filter.all')}</SelectItem>
                  {documentTypes.map(type => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            {userRole === 'cro-sponsor' && (
              <Button onClick={() => setShowUploadDialog(true)}>
                <Upload className="h-4 w-4 mr-2" />
                {t('documents.upload.button')}
              </Button>
            )}
          </div>

          {/* Documents Table */}
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{t('documents.name')}</TableHead>
                    <TableHead>{t('documents.type')}</TableHead>
                    <TableHead>{t('documents.version')}</TableHead>
                    <TableHead>{t('documents.upload.date')}</TableHead>
                    <TableHead>{t('documents.uploaded.by')}</TableHead>
                    <TableHead>{t('documents.file.size')}</TableHead>
                    <TableHead className="text-right">{t('documents.actions')}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredDocuments.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-8 text-gray-500">
                        {t('documents.no.documents')}
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredDocuments.map((document) => (
                      <TableRow key={document.id}>
                        <TableCell className="font-medium">
                          <div className="flex items-center gap-2">
                            {getTypeIcon(document.type)}
                            {document.name}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge className={getTypeColor(document.type)}>
                            {documentTypes.find(t => t.value === document.type)?.label}
                          </Badge>
                        </TableCell>
                        <TableCell>{document.version}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <Calendar className="h-3 w-3 text-gray-400" />
                            {new Date(document.uploadDate).toLocaleDateString()}
                          </div>
                        </TableCell>
                        <TableCell>{document.uploadedBy}</TableCell>
                        <TableCell>{document.fileSize}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-1">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleView(document)}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDownload(document)}
                            >
                              <Download className="h-4 w-4" />
                            </Button>
                            {userRole === 'cro-sponsor' && (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleDelete(document)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>

        {/* Upload Dialog */}
        <Dialog open={showUploadDialog} onOpenChange={setShowUploadDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{t('documents.upload.title')}</DialogTitle>
            </DialogHeader>
            
            <div className="space-y-4">
              <div>
                <Label htmlFor="document-name">{t('documents.name')}</Label>
                <Input
                  id="document-name"
                  value={uploadForm.name}
                  onChange={(e) => setUploadForm({ ...uploadForm, name: e.target.value })}
                  placeholder="Enter document name"
                />
              </div>
              
              <div>
                <Label htmlFor="document-type">{t('documents.type')}</Label>
                <Select 
                  value={uploadForm.type} 
                  onValueChange={(value) => setUploadForm({ ...uploadForm, type: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select document type" />
                  </SelectTrigger>
                  <SelectContent>
                    {documentTypes.map(type => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="document-version">{t('documents.version')}</Label>
                <Input
                  id="document-version"
                  value={uploadForm.version}
                  onChange={(e) => setUploadForm({ ...uploadForm, version: e.target.value })}
                  placeholder="e.g., 1.0"
                />
              </div>
              
              <div>
                <Label htmlFor="document-file">{t('documents.file.select')}</Label>
                <Input
                  id="document-file"
                  type="file"
                  onChange={(e) => setUploadForm({ ...uploadForm, file: e.target.files?.[0] || null })}
                  accept=".pdf,.doc,.docx,.txt"
                />
              </div>
              
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setShowUploadDialog(false)}>
                  Cancel
                </Button>
                <Button onClick={handleUpload}>
                  <Upload className="h-4 w-4 mr-2" />
                  Upload
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </DialogContent>
    </Dialog>
  );
};

export default DocumentRepository;