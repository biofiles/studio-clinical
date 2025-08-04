import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import * as XLSX from 'xlsx';

export const ParticipantsReportDialog = () => {
  const [isDownloading, setIsDownloading] = useState(false);
  const { toast } = useToast();

  const handleDownloadReport = async () => {
    setIsDownloading(true);
    
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Create fake participant data
      const participantData = [
        {
          'ID Participante': 'P001',
          'Nombre': 'María González',
          'Email': 'maria.gonzalez@email.com',
          'Estado': 'Activo',
          'Fecha Inscripción': '2024-01-15',
          'Fecha Nacimiento': '1985-03-22',
          'Género': 'Femenino',
          'Dirección': 'Av. Corrientes 1234, CABA',
          'Teléfono': '+54 11 4567-8901',
          'Estudio': 'CARDIO-2024',
          'Brazo': 'Tratamiento A',
          'Visitas Completadas': 3,
          'Visitas Pendientes': 2,
          'Última Visita': '2024-10-15',
          'Próxima Visita': '2024-11-20',
          'Compliance': '95%'
        },
        {
          'ID Participante': 'P002',
          'Nombre': 'Carlos Rodriguez',
          'Email': 'carlos.rodriguez@email.com',
          'Estado': 'Activo',
          'Fecha Inscripción': '2024-01-22',
          'Fecha Nacimiento': '1978-07-10',
          'Género': 'Masculino',
          'Dirección': 'Av. Rivadavia 5678, CABA',
          'Teléfono': '+54 11 9876-5432',
          'Estudio': 'CARDIO-2024',
          'Brazo': 'Placebo',
          'Visitas Completadas': 4,
          'Visitas Pendientes': 1,
          'Última Visita': '2024-10-22',
          'Próxima Visita': '2024-11-25',
          'Compliance': '88%'
        },
        {
          'ID Participante': 'P003',
          'Nombre': 'Ana Martinez',
          'Email': 'ana.martinez@email.com',
          'Estado': 'Completado',
          'Fecha Inscripción': '2024-02-01',
          'Fecha Nacimiento': '1990-12-05',
          'Género': 'Femenino',
          'Dirección': 'Av. Santa Fe 9012, CABA',
          'Teléfono': '+54 11 2345-6789',
          'Estudio': 'NEURO-2024',
          'Brazo': 'Tratamiento B',
          'Visitas Completadas': 6,
          'Visitas Pendientes': 0,
          'Última Visita': '2024-10-28',
          'Próxima Visita': 'N/A',
          'Compliance': '100%'
        },
        {
          'ID Participante': 'P004',
          'Nombre': 'Luis Fernandez',
          'Email': 'luis.fernandez@email.com',
          'Estado': 'Inactivo',
          'Fecha Inscripción': '2024-02-10',
          'Fecha Nacimiento': '1982-05-18',
          'Género': 'Masculino',
          'Dirección': 'Av. 9 de Julio 3456, CABA',
          'Teléfono': '+54 11 8765-4321',
          'Estudio': 'ONCO-2024',
          'Brazo': 'Tratamiento A',
          'Visitas Completadas': 2,
          'Visitas Pendientes': 0,
          'Última Visita': '2024-09-15',
          'Próxima Visita': 'N/A',
          'Compliance': '45%'
        }
      ];

      // Create workbook and worksheet
      const workbook = XLSX.utils.book_new();
      const worksheet = XLSX.utils.json_to_sheet(participantData);

      // Add worksheet to workbook
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Participantes');

      // Generate buffer and create blob
      const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
      const blob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });

      // Create download link
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `reporte_participantes_${new Date().toISOString().split('T')[0]}.xlsx`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      toast({
        title: "Reporte descargado exitosamente",
        description: "El reporte de participantes se ha generado y descargado correctamente.",
      });
    } catch (error) {
      console.error('Error generating report:', error);
      toast({
        title: "Error al generar reporte",
        description: "Hubo un problema al generar el reporte. Por favor intente nuevamente.",
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
          {isDownloading ? 'Descargando...' : 'Reporte de Participantes'}
        </span>
      </div>
      <Download className="h-4 w-4 flex-shrink-0" />
    </Button>
  );
};