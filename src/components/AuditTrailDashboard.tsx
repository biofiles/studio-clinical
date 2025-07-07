import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, Download, Filter, Search, Shield, User, FileText, Database, Lock } from "lucide-react";
import { format, subDays } from "date-fns";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/contexts/LanguageContext";

interface AuditLogEntry {
  id: string;
  user_id: string;
  activity_type: string;
  details: any;
  created_at: string;
  ip_address?: unknown;
  user_agent?: string;
}

const getActivityIcon = (activityType: string) => {
  if (activityType.includes('AUTH')) return <Lock className="h-4 w-4" />;
  if (activityType.includes('PARTICIPANT')) return <User className="h-4 w-4" />;
  if (activityType.includes('QUESTIONNAIRE')) return <FileText className="h-4 w-4" />;
  if (activityType.includes('STUDY')) return <Database className="h-4 w-4" />;
  if (activityType.includes('SECURITY')) return <Shield className="h-4 w-4" />;
  return <FileText className="h-4 w-4" />;
};

const getActivityColor = (activityType: string) => {
  if (activityType.includes('CREATE')) return 'bg-green-100 text-green-800 border-green-200';
  if (activityType.includes('UPDATE') || activityType.includes('EDIT')) return 'bg-blue-100 text-blue-800 border-blue-200';
  if (activityType.includes('DELETE')) return 'bg-red-100 text-red-800 border-red-200';
  if (activityType.includes('AUTH') || activityType.includes('LOGIN')) return 'bg-purple-100 text-purple-800 border-purple-200';
  if (activityType.includes('SECURITY')) return 'bg-orange-100 text-orange-800 border-orange-200';
  return 'bg-gray-100 text-gray-800 border-gray-200';
};

export const AuditTrailDashboard = () => {
  const { user } = useAuth();
  const { t } = useLanguage();
  const [auditLogs, setAuditLogs] = useState<AuditLogEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [activityFilter, setActivityFilter] = useState("all");
  const [dateRange, setDateRange] = useState({
    from: subDays(new Date(), 30),
    to: new Date()
  });
  const [showCalendar, setShowCalendar] = useState(false);

  useEffect(() => {
    fetchAuditLogs();
  }, [user, dateRange, activityFilter]);

  const fetchAuditLogs = async () => {
    if (!user) return;

    try {
      setLoading(true);
      let query = supabase
        .from('user_activity_log')
        .select('*')
        .gte('created_at', dateRange.from.toISOString())
        .lte('created_at', dateRange.to.toISOString())
        .order('created_at', { ascending: false })
        .limit(100);

      // Apply activity filter
      if (activityFilter !== 'all') {
        query = query.ilike('activity_type', `%${activityFilter}%`);
      }

      const { data, error } = await query;

      if (error) {
        console.error('Error fetching audit logs:', error);
        return;
      }

      setAuditLogs(data || []);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const exportToCSV = () => {
    const headers = ['Fecha', 'Usuario', 'Actividad', 'Detalles', 'IP'];
    const csvData = auditLogs.map(log => [
      format(new Date(log.created_at), 'dd/MM/yyyy HH:mm:ss'),
      log.user_id,
      log.activity_type,
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
    a.download = `audit-trail-${format(new Date(), 'yyyy-MM-dd')}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const filteredLogs = auditLogs.filter(log =>
    log.activity_type.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (log.details && JSON.stringify(log.details).toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-studio-text-primary">Audit Trail</h1>
          <p className="text-studio-text-muted">Registro completo de actividades del sistema</p>
        </div>
        <Button onClick={exportToCSV} className="gap-2">
          <Download className="h-4 w-4" />
          Exportar CSV
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filtros
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-studio-text-muted" />
              <Input
                placeholder="Buscar actividades..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <Select value={activityFilter} onValueChange={setActivityFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Tipo de actividad" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas las actividades</SelectItem>
                <SelectItem value="auth">Autenticación</SelectItem>
                <SelectItem value="participant">Participantes</SelectItem>
                <SelectItem value="questionnaire">Cuestionarios</SelectItem>
                <SelectItem value="study">Estudios</SelectItem>
                <SelectItem value="security">Seguridad</SelectItem>
              </SelectContent>
            </Select>

            <Popover open={showCalendar} onOpenChange={setShowCalendar}>
              <PopoverTrigger asChild>
                <Button variant="outline" className="justify-start text-left font-normal">
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {dateRange.from ? (
                    dateRange.to ? (
                      <>
                        {format(dateRange.from, "dd/MM/yy")} - {format(dateRange.to, "dd/MM/yy")}
                      </>
                    ) : (
                      format(dateRange.from, "dd/MM/yyyy")
                    )
                  ) : (
                    <span>Seleccionar fechas</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <div className="p-3 space-y-2">
                  <div className="grid grid-cols-2 gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setDateRange({
                          from: subDays(new Date(), 7),
                          to: new Date()
                        });
                        setShowCalendar(false);
                      }}
                    >
                      Últimos 7 días
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setDateRange({
                          from: subDays(new Date(), 30),
                          to: new Date()
                        });
                        setShowCalendar(false);
                      }}
                    >
                      Últimos 30 días
                    </Button>
                  </div>
                </div>
                <Calendar
                  initialFocus
                  mode="range"
                  defaultMonth={dateRange.from}
                  selected={{ from: dateRange.from, to: dateRange.to }}
                  onSelect={(range) => {
                    if (range?.from) {
                      setDateRange({
                        from: range.from,
                        to: range.to || range.from
                      });
                    }
                  }}
                  numberOfMonths={2}
                />
              </PopoverContent>
            </Popover>

            <Button 
              variant="outline" 
              onClick={fetchAuditLogs}
              disabled={loading}
            >
              Actualizar
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Eventos</CardTitle>
            <FileText className="h-4 w-4 text-studio-text-muted" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{filteredLogs.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Eventos de Seguridad</CardTitle>
            <Shield className="h-4 w-4 text-studio-text-muted" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {filteredLogs.filter(log => log.activity_type.includes('SECURITY')).length}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Accesos de Usuario</CardTitle>
            <User className="h-4 w-4 text-studio-text-muted" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {filteredLogs.filter(log => log.activity_type.includes('AUTH')).length}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Modificaciones</CardTitle>
            <Database className="h-4 w-4 text-studio-text-muted" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {filteredLogs.filter(log => log.activity_type.includes('UPDATE') || log.activity_type.includes('CREATE')).length}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Audit Trail Table */}
      <Card>
        <CardHeader>
          <CardTitle>Registro de Actividades</CardTitle>
          <CardDescription>
            Historial detallado de todas las actividades del sistema
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center h-32">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-studio-primary"></div>
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Fecha/Hora</TableHead>
                    <TableHead>Actividad</TableHead>
                    <TableHead>Usuario</TableHead>
                    <TableHead>Detalles</TableHead>
                    <TableHead>IP</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredLogs.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-8 text-studio-text-muted">
                        No se encontraron registros para el período seleccionado
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredLogs.map((log) => (
                      <TableRow key={log.id}>
                        <TableCell className="font-mono text-xs">
                          {format(new Date(log.created_at), 'dd/MM/yyyy HH:mm:ss')}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            {getActivityIcon(log.activity_type)}
                            <Badge 
                              variant="outline" 
                              className={cn("text-xs", getActivityColor(log.activity_type))}
                            >
                              {log.activity_type}
                            </Badge>
                          </div>
                        </TableCell>
                        <TableCell className="font-mono text-xs">
                          {log.user_id.substring(0, 8)}...
                        </TableCell>
                        <TableCell>
                          <div className="max-w-xs truncate text-sm">
                            {log.details ? JSON.stringify(log.details) : 'N/A'}
                          </div>
                        </TableCell>
                        <TableCell className="font-mono text-xs">
                          {(log.ip_address as string) || 'N/A'}
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};