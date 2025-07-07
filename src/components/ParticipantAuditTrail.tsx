import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { History, User, FileText, Calendar, Download } from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";

interface AuditLogEntry {
  id: string;
  user_id: string;
  activity_type: string;
  details: any;
  created_at: string;
  ip_address?: unknown;
}

interface ParticipantAuditTrailProps {
  participantId: string;
  participantName?: string;
}

export const ParticipantAuditTrail = ({ participantId, participantName }: ParticipantAuditTrailProps) => {
  const [auditLogs, setAuditLogs] = useState<AuditLogEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [isOpen, setIsOpen] = useState(false);

  const fetchParticipantAuditLogs = async () => {
    try {
      setLoading(true);
      
      // Fetch all logs that mention this participant
      const { data, error } = await supabase
        .from('user_activity_log')
        .select('*')
        .or(`details->participant_id.eq.${participantId},activity_type.ilike.%PARTICIPANT%`)
        .order('created_at', { ascending: false })
        .limit(50);

      if (error) {
        console.error('Error fetching participant audit logs:', error);
        return;
      }

      // Filter logs that actually relate to this participant
      const relevantLogs = data?.filter(log => {
        const details = log.details as any;
        return details?.participant_id === participantId ||
          (log.activity_type.includes('PARTICIPANT') && details?.participant_id === participantId);
      }) || [];

      setAuditLogs(relevantLogs);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchParticipantAuditLogs();
    }
  }, [isOpen, participantId]);

  const exportParticipantAudit = () => {
    const headers = ['Fecha', 'Actividad', 'Usuario', 'Detalles', 'IP'];
    const csvData = auditLogs.map(log => [
      format(new Date(log.created_at), 'dd/MM/yyyy HH:mm:ss'),
      log.activity_type,
      log.user_id,
      JSON.stringify(log.details || {}),
      (log.ip_address as string) || 'N/A'
    ]);

    const csvContent = [headers, ...csvData]
      .map(row => row.map(field => `"${field}"`).join(','))
      .join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `audit-participante-${participantId}-${format(new Date(), 'yyyy-MM-dd')}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const getActivityDescription = (activityType: string, details: any) => {
    switch (activityType) {
      case 'PARTICIPANT_CREATE':
        return 'Participante registrado en el estudio';
      case 'PARTICIPANT_UPDATE':
        return 'Datos del participante actualizados';
      case 'PARTICIPANT_STATUS_CHANGE':
        return `Estado cambiado a: ${details?.new_status || 'N/A'}`;
      case 'QUESTIONNAIRE_SUBMIT':
        return `Cuestionario "${details?.questionnaire_title || 'N/A'}" enviado`;
      case 'QUESTIONNAIRE_UPDATE':
        return `Cuestionario "${details?.questionnaire_title || 'N/A'}" actualizado`;
      case 'PARTICIPANT_VIEW':
        return 'Perfil del participante visualizado';
      default:
        return activityType.replace(/_/g, ' ').toLowerCase();
    }
  };

  const getActivityIcon = (activityType: string) => {
    if (activityType.includes('PARTICIPANT')) return <User className="h-4 w-4" />;
    if (activityType.includes('QUESTIONNAIRE')) return <FileText className="h-4 w-4" />;
    return <Calendar className="h-4 w-4" />;
  };

  const getActivityColor = (activityType: string) => {
    if (activityType.includes('CREATE')) return 'bg-green-100 text-green-800 border-green-200';
    if (activityType.includes('UPDATE')) return 'bg-blue-100 text-blue-800 border-blue-200';
    if (activityType.includes('SUBMIT')) return 'bg-purple-100 text-purple-800 border-purple-200';
    if (activityType.includes('VIEW')) return 'bg-gray-100 text-gray-800 border-gray-200';
    return 'bg-orange-100 text-orange-800 border-orange-200';
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <History className="h-4 w-4" />
          Historial
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[80vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <History className="h-5 w-5" />
            Historial de Auditoría - {participantName || 'Participante'}
          </DialogTitle>
          <DialogDescription>
            Registro completo de todas las actividades relacionadas con este participante
          </DialogDescription>
        </DialogHeader>

        <div className="flex justify-between items-center">
          <div className="text-sm text-studio-text-muted">
            {auditLogs.length} eventos registrados
          </div>
          <Button onClick={exportParticipantAudit} size="sm" variant="outline" className="gap-2">
            <Download className="h-4 w-4" />
            Exportar
          </Button>
        </div>

        <ScrollArea className="max-h-[500px] pr-4">
          {loading ? (
            <div className="flex items-center justify-center h-32">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-studio-primary"></div>
            </div>
          ) : auditLogs.length === 0 ? (
            <div className="text-center py-8 text-studio-text-muted">
              <History className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No se encontraron actividades para este participante</p>
            </div>
          ) : (
            <div className="space-y-4">
              {auditLogs.map((log, index) => (
                <Card key={log.id} className="relative">
                  {index < auditLogs.length - 1 && (
                    <div className="absolute left-6 top-12 w-px h-full bg-studio-border -z-10" />
                  )}
                  <CardContent className="pt-6">
                    <div className="flex items-start gap-4">
                      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-studio-background-secondary flex items-center justify-center border-2 border-studio-border">
                        {getActivityIcon(log.activity_type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-2">
                          <Badge 
                            variant="outline" 
                            className={`text-xs ${getActivityColor(log.activity_type)}`}
                          >
                            {log.activity_type}
                          </Badge>
                          <span className="text-xs text-studio-text-muted font-mono">
                            {format(new Date(log.created_at), 'dd/MM/yyyy HH:mm:ss', { locale: es })}
                          </span>
                        </div>
                        <p className="text-sm text-studio-text-primary font-medium mb-1">
                          {getActivityDescription(log.activity_type, log.details)}
                        </p>
                        {log.details && Object.keys(log.details).length > 0 && (
                          <div className="text-xs text-studio-text-muted bg-studio-background-muted p-2 rounded border">
                            <pre className="whitespace-pre-wrap font-mono">
                              {JSON.stringify(log.details, null, 2)}
                            </pre>
                          </div>
                        )}
                        <div className="flex items-center gap-4 mt-2 text-xs text-studio-text-muted">
                          <span>Usuario: {log.user_id.substring(0, 8)}...</span>
                          {log.ip_address && <span>IP: {log.ip_address as string}</span>}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};