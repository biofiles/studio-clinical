import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Download, FileText, Database, BarChart3, AlertCircle, CheckCircle, Loader2 } from 'lucide-react';
import { FHIRClient } from '@/lib/fhir-client';
import { CDISCExportRequest } from '@/types/cdisc';
import { useLanguage } from '@/contexts/LanguageContext';

interface CDISCExportDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  studyId: string;
  studyName: string;
}

export const CDISCExportDialog: React.FC<CDISCExportDialogProps> = ({
  open,
  onOpenChange,
  studyId,
  studyName
}) => {
  const { toast } = useToast();
  const { language } = useLanguage();
  const [exportFormat, setExportFormat] = useState<'ODM' | 'SDTM' | 'ADaM'>('SDTM');
  const [selectedDomains, setSelectedDomains] = useState<string[]>(['DM', 'QS']);
  const [includeMetadata, setIncludeMetadata] = useState(true);
  const [includeDefineXML, setIncludeDefineXML] = useState(true);
  const [isExporting, setIsExporting] = useState(false);
  const [exportStatus, setExportStatus] = useState<'idle' | 'processing' | 'completed' | 'failed'>('idle');

  const availableDomains = [
    { code: 'DM', name: language === 'spanish' ? 'Demografía' : 'Demographics', required: true },
    { code: 'QS', name: language === 'spanish' ? 'Cuestionarios' : 'Questionnaires', required: false },
    { code: 'DS', name: language === 'spanish' ? 'Disposición' : 'Disposition', required: false },
    { code: 'AE', name: language === 'spanish' ? 'Eventos Adversos' : 'Adverse Events', required: false },
    { code: 'CM', name: language === 'spanish' ? 'Medicamentos Concomitantes' : 'Concomitant Medications', required: false },
    { code: 'VS', name: language === 'spanish' ? 'Signos Vitales' : 'Vital Signs', required: false },
    { code: 'LB', name: language === 'spanish' ? 'Resultados de Laboratorio' : 'Laboratory Results', required: false }
  ];

  const handleDomainToggle = (domainCode: string, checked: boolean) => {
    const domain = availableDomains.find(d => d.code === domainCode);
    if (domain?.required) return; // Don't allow unchecking required domains

    if (checked) {
      setSelectedDomains(prev => [...prev, domainCode]);
    } else {
      setSelectedDomains(prev => prev.filter(d => d !== domainCode));
    }
  };

  const handleExport = async () => {
    setIsExporting(true);
    setExportStatus('processing');

    try {
      const fhirClient = new FHIRClient();
      const exportRequest: CDISCExportRequest = {
        studyId,
        domains: selectedDomains,
        format: exportFormat,
        includeMetadata,
        includeDefineXML: includeDefineXML && exportFormat === 'SDTM'
      };

      const result = await fhirClient.exportToCDISC(exportRequest);
      
      if (result.error) {
        throw new Error(result.error);
      }

      // Create and download the export file
      const fileName = `${studyName}_${exportFormat}_${new Date().toISOString().split('T')[0]}.json`;
      const blob = new Blob([JSON.stringify(result, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      setExportStatus('completed');
      toast({
        title: language === 'spanish' ? "Exportación Exitosa" : "Export Successful",
        description: language === 'spanish' ? 
          `Datos CDISC exportados como ${fileName}` : 
          `CDISC data exported as ${fileName}`,
      });

      // Auto close after success
      setTimeout(() => {
        onOpenChange(false);
        setExportStatus('idle');
      }, 2000);

    } catch (error) {
      console.error('CDISC Export Error:', error);
      setExportStatus('failed');
      toast({
        title: language === 'spanish' ? "Error de Exportación" : "Export Error",
        description: language === 'spanish' ? 
          "No se pudieron exportar los datos CDISC. Inténtelo de nuevo." : 
          "Failed to export CDISC data. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsExporting(false);
    }
  };

  const getFormatIcon = (format: string) => {
    switch (format) {
      case 'ODM': return <FileText className="h-4 w-4" />;
      case 'SDTM': return <Database className="h-4 w-4" />;
      case 'ADaM': return <BarChart3 className="h-4 w-4" />;
      default: return <FileText className="h-4 w-4" />;
    }
  };

  const getStatusIcon = () => {
    switch (exportStatus) {
      case 'processing': return <Loader2 className="h-4 w-4 animate-spin" />;
      case 'completed': return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'failed': return <AlertCircle className="h-4 w-4 text-red-600" />;
      default: return <Download className="h-4 w-4" />;
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Database className="h-5 w-5" />
            <span>
              {language === 'spanish' ? 'Exportar Datos CDISC' : 'Export CDISC Data'}
            </span>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Study Info */}
          <div className="bg-muted p-4 rounded-lg">
            <h4 className="font-medium mb-2">
              {language === 'spanish' ? 'Información del Estudio' : 'Study Information'}
            </h4>
            <p className="text-sm text-muted-foreground">
              <strong>{language === 'spanish' ? 'Estudio:' : 'Study:'}</strong> {studyName}
            </p>
            <p className="text-sm text-muted-foreground">
              <strong>ID:</strong> {studyId}
            </p>
          </div>

          {/* Export Format */}
          <div className="space-y-3">
            <Label className="text-base font-medium">
              {language === 'spanish' ? 'Formato de Exportación' : 'Export Format'}
            </Label>
            <Select value={exportFormat} onValueChange={(value: 'ODM' | 'SDTM' | 'ADaM') => setExportFormat(value)}>
              <SelectTrigger>
                <SelectValue placeholder={language === 'spanish' ? 'Seleccionar formato' : 'Select format'} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="SDTM">
                  <div className="flex items-center space-x-2">
                    {getFormatIcon('SDTM')}
                    <div>
                      <div className="font-medium">SDTM</div>
                      <div className="text-xs text-muted-foreground">
                        {language === 'spanish' ? 'Modelo de Tabulación de Datos de Estudio' : 'Study Data Tabulation Model'}
                      </div>
                    </div>
                  </div>
                </SelectItem>
                <SelectItem value="ODM">
                  <div className="flex items-center space-x-2">
                    {getFormatIcon('ODM')}
                    <div>
                      <div className="font-medium">ODM</div>
                      <div className="text-xs text-muted-foreground">
                        {language === 'spanish' ? 'Modelo de Datos Operacionales' : 'Operational Data Model'}
                      </div>
                    </div>
                  </div>
                </SelectItem>
                <SelectItem value="ADaM">
                  <div className="flex items-center space-x-2">
                    {getFormatIcon('ADaM')}
                    <div>
                      <div className="font-medium">ADaM</div>
                      <div className="text-xs text-muted-foreground">
                        {language === 'spanish' ? 'Modelo de Datos de Análisis' : 'Analysis Data Model'}
                      </div>
                    </div>
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Domain Selection */}
          {exportFormat === 'SDTM' && (
            <div className="space-y-3">
              <Label className="text-base font-medium">
                {language === 'spanish' ? 'Dominios CDISC' : 'CDISC Domains'}
              </Label>
              <div className="grid grid-cols-2 gap-3">
                {availableDomains.map((domain) => (
                  <div key={domain.code} className="flex items-center space-x-2">
                    <Checkbox
                      id={domain.code}
                      checked={selectedDomains.includes(domain.code)}
                      onCheckedChange={(checked) => handleDomainToggle(domain.code, checked === true)}
                      disabled={domain.required}
                    />
                    <Label 
                      htmlFor={domain.code} 
                      className={`text-sm ${domain.required ? 'font-medium' : ''}`}
                    >
                      {domain.code} - {domain.name}
                      {domain.required && (
                        <span className="text-xs text-muted-foreground ml-1">
                          ({language === 'spanish' ? 'requerido' : 'required'})
                        </span>
                      )}
                    </Label>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Export Options */}
          <div className="space-y-3">
            <Label className="text-base font-medium">
              {language === 'spanish' ? 'Opciones de Exportación' : 'Export Options'}
            </Label>
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="includeMetadata"
                  checked={includeMetadata}
                  onCheckedChange={(checked) => setIncludeMetadata(checked === true)}
                />
                <Label htmlFor="includeMetadata" className="text-sm">
                  {language === 'spanish' ? 'Incluir metadatos del estudio' : 'Include study metadata'}
                </Label>
              </div>
              
              {exportFormat === 'SDTM' && (
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="includeDefineXML"
                    checked={includeDefineXML}
                    onCheckedChange={(checked) => setIncludeDefineXML(checked === true)}
                  />
                  <Label htmlFor="includeDefineXML" className="text-sm">
                    {language === 'spanish' ? 'Incluir Define.xml' : 'Include Define.xml'}
                  </Label>
                </div>
              )}
            </div>
          </div>

          {/* Export Status */}
          {exportStatus !== 'idle' && (
            <div className={`p-4 rounded-lg border ${
              exportStatus === 'completed' ? 'bg-green-50 border-green-200' :
              exportStatus === 'failed' ? 'bg-red-50 border-red-200' :
              'bg-blue-50 border-blue-200'
            }`}>
              <div className="flex items-center space-x-2">
                {getStatusIcon()}
                <span className="text-sm font-medium">
                  {exportStatus === 'processing' && (language === 'spanish' ? 'Procesando exportación...' : 'Processing export...')}
                  {exportStatus === 'completed' && (language === 'spanish' ? 'Exportación completada' : 'Export completed')}
                  {exportStatus === 'failed' && (language === 'spanish' ? 'Error en la exportación' : 'Export failed')}
                </span>
              </div>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button 
            variant="outline" 
            onClick={() => onOpenChange(false)}
            disabled={isExporting}
          >
            {language === 'spanish' ? 'Cancelar' : 'Cancel'}
          </Button>
          <Button 
            onClick={handleExport}
            disabled={isExporting || selectedDomains.length === 0}
            className="flex items-center space-x-2"
          >
            {getStatusIcon()}
            <span>
              {isExporting ? 
                (language === 'spanish' ? 'Exportando...' : 'Exporting...') :
                (language === 'spanish' ? 'Exportar' : 'Export')
              }
            </span>
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};