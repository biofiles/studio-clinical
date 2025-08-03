import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import * as XLSX from 'xlsx';

const StudySignupsReportDialog = () => {
  const [isDownloading, setIsDownloading] = useState(false);
  const { toast } = useToast();

  const handleDownloadReport = async () => {
    setIsDownloading(true);
    
    try {
      // Generate fake data for participants who signed up
      const fakeData = [
        {
          'Estudio': 'Estudio de Diabetes Tipo 2',
          'Protocolo': 'DT2-2024-001',
          'Email': 'maria.garcia@email.com',
          'Fecha de Registro': '2024-01-15',
          'Estado': 'Participante Activo'
        },
        {
          'Estudio': 'Estudio de Hipertensión',
          'Protocolo': 'HTA-2024-002',
          'Email': 'carlos.rodriguez@email.com',
          'Fecha de Registro': '2024-01-20',
          'Estado': 'Registro Externo'
        },
        {
          'Estudio': 'Estudio de Obesidad',
          'Protocolo': 'OB-2024-003',
          'Email': 'ana.martinez@email.com',
          'Fecha de Registro': '2024-02-01',
          'Estado': 'Participante Activo'
        },
        {
          'Estudio': 'Estudio de Diabetes Tipo 2',
          'Protocolo': 'DT2-2024-001',
          'Email': 'jose.lopez@email.com',
          'Fecha de Registro': '2024-02-10',
          'Estado': 'Registro Externo'
        },
        {
          'Estudio': 'Estudio de Hipertensión',
          'Protocolo': 'HTA-2024-002',
          'Email': 'lucia.fernandez@email.com',
          'Fecha de Registro': '2024-02-15',
          'Estado': 'Participante Activo'
        }
      ];

      // Create workbook and worksheet
      const wb = XLSX.utils.book_new();
      const ws = XLSX.utils.json_to_sheet(fakeData);
      
      // Add worksheet to workbook
      XLSX.utils.book_append_sheet(wb, ws, "Suscripciones");
      
      // Generate file and download
      const fileName = `reporte_suscripciones_resultados_${new Date().toISOString().split('T')[0]}.xlsx`;
      XLSX.writeFile(wb, fileName);

      toast({
        title: "¡Descarga exitosa!",
        description: "El reporte XLSX ha sido descargado correctamente.",
      });
    } catch (error) {
      console.error("Error downloading report:", error);
      toast({
        title: "Error",
        description: "No se pudo descargar el reporte",
        variant: "destructive",
      });
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <Button 
      variant="outline" 
      className="w-full justify-start h-auto py-3 px-4"
      onClick={handleDownloadReport}
      disabled={isDownloading}
    >
      <div className="flex flex-col items-start space-y-1 flex-1 min-w-0 mr-3">
        <span className="font-medium text-sm sm:text-base w-full text-left">
          {isDownloading ? "Descargando..." : "Reporte de Suscripciones a Resumen del Estudio"}
        </span>
      </div>
      <Download className="h-4 w-4 flex-shrink-0" />
    </Button>
  );
};

export default StudySignupsReportDialog;