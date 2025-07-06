import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Download, FileText, Mail, Calendar, Users } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useStudy } from "@/contexts/StudyContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { Badge } from "@/components/ui/badge";

interface SignupData {
  id: string;
  email: string;
  signed_up_at: string;
  study_id: string;
  participant_id: string | null;
}

const StudySignupsReportDialog = () => {
  const [open, setOpen] = useState(false);
  const [signups, setSignups] = useState<SignupData[]>([]);
  const [loading, setLoading] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const { toast } = useToast();
  const { selectedStudy, studies } = useStudy();
  const { t } = useLanguage();

  const fetchSignups = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('study_results_signups')
        .select('*')
        .order('signed_up_at', { ascending: false });

      if (error) throw error;
      setSignups(data || []);
    } catch (error: any) {
      console.error("Error fetching signups:", error);
      toast({
        title: "Error",
        description: t('report.signups.no.signups'),
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (open) {
      fetchSignups();
    }
  }, [open]);

  const handleDownloadReport = async () => {
    setIsDownloading(true);
    
    try {
      // Generate CSV content
      const csvHeader = `${t('report.signups.study')},${t('report.signups.protocol')},${t('report.signups.email')},${t('report.signups.registration.date')},${t('report.signups.status')}\n`;
      const csvContent = signups.map(signup => {
        const study = studies.find(s => s.id === signup.study_id);
        const studyName = study ? study.name : t('report.signups.study') + " no encontrado";
        const protocol = study ? study.protocol : "";
        const date = new Date(signup.signed_up_at).toLocaleDateString('es-ES');
        const status = signup.participant_id ? t('report.signups.active.participant') : t('report.signups.external.registration');
        
        return `"${studyName}","${protocol}","${signup.email}","${date}","${status}"`;
      }).join("\n");

      const csvBlob = new Blob([csvHeader + csvContent], { type: 'text/csv;charset=utf-8;' });
      const csvUrl = URL.createObjectURL(csvBlob);
      
      const link = document.createElement('a');
      link.href = csvUrl;
      link.download = `reporte_suscripciones_resultados_${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(csvUrl);

      toast({
        title: t('report.signups.download.success'),
        description: t('report.signups.download.description'),
      });
    } catch (error) {
      console.error("Error downloading report:", error);
      toast({
        title: "Error",
        description: t('report.signups.download.error'),
        variant: "destructive",
      });
    } finally {
      setIsDownloading(false);
    }
  };

  const getStudyStats = () => {
    const totalSignups = signups.length;
    const studyGroups = signups.reduce((acc, signup) => {
      const study = studies.find(s => s.id === signup.study_id);
      const studyName = study ? study.name : "Desconocido";
      acc[studyName] = (acc[studyName] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const activeParticipants = signups.filter(s => s.participant_id).length;
    const externalSignups = totalSignups - activeParticipants;

    return { totalSignups, studyGroups, activeParticipants, externalSignups };
  };

  const stats = getStudyStats();

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <div className="flex flex-col items-start space-y-1 flex-1 min-w-0">
          <span className="font-medium text-sm sm:text-base truncate pr-2">{t('report.signups.title')}</span>
          <span className="text-xs text-studio-text-muted line-clamp-2 break-words">Download report of users registered for study results notifications</span>
        </div>
        <Download className="h-4 w-4 ml-2 flex-shrink-0" />
      </DialogTrigger>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <FileText className="h-5 w-5" />
            <span>{t('report.signups.title')}</span>
          </DialogTitle>
        </DialogHeader>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-blue-600">{stats.totalSignups}</div>
              <div className="text-sm text-blue-600">{t('report.signups.total')}</div>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-green-600">{stats.activeParticipants}</div>
              <div className="text-sm text-green-600">{t('report.signups.active.participants')}</div>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-purple-600">{stats.externalSignups}</div>
              <div className="text-sm text-purple-600">{t('report.signups.external.signups')}</div>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-orange-600">{Object.keys(stats.studyGroups).length}</div>
              <div className="text-sm text-orange-600">{t('report.signups.studies.with.signups')}</div>
            </CardContent>
          </Card>
        </div>

        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium">{t('report.signups.detailed.records')}</h3>
          <Button 
            onClick={handleDownloadReport}
            disabled={isDownloading || signups.length === 0}
            className="bg-green-600 hover:bg-green-700"
          >
            {isDownloading ? (
              <>{t('report.signups.downloading')}</>
            ) : (
              <>
                <Download className="h-4 w-4 mr-2" />
                {t('report.signups.download.csv')}
              </>
            )}
          </Button>
        </div>

        {loading ? (
          <div className="text-center py-8">{t('common.loading')}</div>
        ) : signups.length === 0 ? (
          <Card className="bg-gray-50 border-gray-200">
            <CardContent className="p-8 text-center">
              <Mail className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">{t('report.signups.no.signups')}</p>
            </CardContent>
          </Card>
        ) : (
          <div className="border rounded-lg">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t('report.signups.study')}</TableHead>
                  <TableHead>{t('report.signups.protocol')}</TableHead>
                  <TableHead>{t('report.signups.email')}</TableHead>
                  <TableHead>{t('report.signups.registration.date')}</TableHead>
                  <TableHead>{t('report.signups.status')}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {signups.map((signup) => {
                  const study = studies.find(s => s.id === signup.study_id);
                  return (
                    <TableRow key={signup.id}>
                      <TableCell className="font-medium">
                        {study ? study.name : t('report.signups.study') + " no encontrado"}
                      </TableCell>
                      <TableCell className="text-sm text-gray-600">
                        {study ? study.protocol : "-"}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <Mail className="h-4 w-4 text-gray-400" />
                          <span>{signup.email}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <Calendar className="h-4 w-4 text-gray-400" />
                          <span>{new Date(signup.signed_up_at).toLocaleDateString('es-ES')}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge 
                          variant={signup.participant_id ? "default" : "secondary"}
                          className={signup.participant_id ? 
                            "bg-green-100 text-green-800 border-green-200" : 
                            "bg-blue-100 text-blue-800 border-blue-200"
                          }
                        >
                          {signup.participant_id ? t('report.signups.active.participant') : t('report.signups.external.registration')}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default StudySignupsReportDialog;