
import React, { createContext, useContext, useState, useEffect } from 'react';

interface LanguageContextType {
  language: string;
  setLanguage: (lang: string) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const translations = {
  english: {
    // Header
    'header.settings': 'Settings',
    'header.logout': 'Logout',
    
    // Dashboard
    'dashboard.title': 'Study Management Dashboard',
    'dashboard.protocol': 'Protocol: PROTO-2024-001 | Site: Metro General Hospital',
    'dashboard.participants.enrolled': 'Participants enrolled',
    'dashboard.pending.reviews': 'Pending reviews',
    'dashboard.adverse.events': 'Adverse events',
    'dashboard.upcoming.visits': 'Upcoming visits',
    'dashboard.next.events': 'Next 3 Study Events',
    'dashboard.study.management': 'Study Management',
    'dashboard.participant.list': 'Participant List',
    'dashboard.manage.calendar': 'Manage Calendar',
    'dashboard.questionnaires': 'Questionnaires',
    'dashboard.export.questionnaires': 'Export Questionnaires',
    'dashboard.study.progress': 'Study Progress',
    'dashboard.diary.compliance': 'Diary Compliance',
    'dashboard.visit.compliance': 'Visit Compliance',
    'dashboard.enrollment': 'Enrollment',
    'dashboard.daily.diaries': 'Daily Diaries',
    'dashboard.site.visits': 'Site Visits',
    
    // Participant Management
    'participant.management': 'Participant Management',
    'participant.search': 'Search by patient ID or token...',
    'participant.of': 'of',
    'participant.participants': 'participants',
    'participant.patient.id': 'Patient ID',
    'participant.enrollment': 'Enrollment',
    'participant.visit.status': 'Visit Status',
    'participant.compliance': 'Compliance',
    'participant.next.visit': 'Next Visit',
    'participant.actions': 'Actions',
    'participant.view.details': 'View Details',
    'participant.view.questionnaires': 'View Questionnaires',
    'participant.schedule.visit': 'Schedule Visit',
    'participant.barcode.click': 'Click to view barcode',
    
    // Participant Details
    'details.title': 'Participant Details',
    'details.alerts': 'Alerts',
    'details.visit.overdue': 'Visit overdue',
    'details.monthly.assessment': 'Due for monthly assessment',
    'details.basic.info': 'Basic Information',
    'details.demographics': 'Demographics',
    'details.study.progress': 'Study Progress',
    'details.recent.activity': 'Recent Activity',
    'details.upcoming.events': 'Upcoming Events',
    'details.age': 'Age',
    'details.gender': 'Gender',
    'details.ethnicity': 'Ethnicity',
    
    // Settings
    'settings.title': 'Settings',
    'settings.subtitle': 'Manage your preferences and account',
    'settings.back': 'Back',
    'settings.language.preferences': 'Language Preferences',
    'settings.display.language': 'Display Language',
    'settings.language.note': 'Changes will be applied after refreshing the page',
    'settings.account.actions': 'Account Actions',
    'settings.sign.out': 'Sign Out',
    'settings.sign.out.note': 'You will be redirected to the login page',
    
    // eConsent
    'econsent.title': 'Electronic Consent',
    'econsent.subtitle': 'Review and sign your informed consent document',
    'econsent.document.title': 'Informed Consent Form',
    'econsent.audio.play': 'Play Audio',
    'econsent.audio.pause': 'Pause Audio',
    'econsent.audio.stop': 'Stop Audio',
    'econsent.search.placeholder': 'Search in document...',
    'econsent.search.results': 'Search Results',
    'econsent.search.no.results': 'No results found',
    'econsent.signature.required': 'Electronic Signature Required',
    'econsent.signature.full.name': 'Full Name',
    'econsent.signature.date': 'Date',
    'econsent.signature.agree': 'I agree to participate in this study',
    'econsent.signature.sign': 'Sign Document',
    'econsent.signature.clear': 'Clear Signature',
    'econsent.signature.complete': 'Consent Signed Successfully',
    'econsent.download.pdf': 'Download PDF',
    'econsent.view.signed': 'View Signed Document',
    
    // Common
    'common.welcome': 'Welcome',
    'common.loading': 'Loading...',
    'common.save': 'Save',
    'common.cancel': 'Cancel',
    'common.close': 'Close',
    'common.continue': 'Continue',
    'common.back': 'Back',
    'common.next': 'Next',
    'common.previous': 'Previous',
    'common.complete': 'Complete',
    'common.pending': 'Pending',
    'common.active': 'Active',
    'common.inactive': 'Inactive',
    
    // Login and Authentication
    'login.title': 'Sign In',
    'login.subtitle': 'Sign in to access your account',
    'login.email': 'Email',
    'login.email.placeholder': 'Enter your email',
    'login.password': 'Password',
    'login.password.placeholder': 'Enter your password',
    'login.role.select': 'Select your role',
    'login.role.selection.subtitle': 'Select your role to continue',
    'login.button': 'Sign In',
    'login.back': 'Back to Role Selection',
    'login.help': "Don't have access? Contact your administrator",
    'login.roles.participant': 'Participant',
    'login.roles.investigator': 'Site',
    'login.roles.cro-sponsor': 'CRO/Sponsor',
    'login.roles.participant.description': 'Access your study participation portal',
    'login.roles.investigator.description': 'Manage and monitor clinical studies',
    'login.roles.cro-sponsor.description': 'Oversee and administer research programs',
    
    // Status values
    'status.completed': 'completed',
    'status.scheduled': 'scheduled',
    'status.overdue': 'overdue',
    
    // Activity types
    'activity.visit': 'visit',
    'activity.questionnaire': 'questionnaire',
    'activity.call': 'call'
  },
  spanish: {
    // Header
    'header.settings': 'Configuración',
    'header.logout': 'Cerrar Sesión',
    
    // Dashboard
    'dashboard.title': 'Panel de Gestión del Estudio',
    'dashboard.protocol': 'Protocolo: PROTO-2024-001 | Sitio: Hospital General Metro',
    'dashboard.participants.enrolled': 'Participantes inscritos',
    'dashboard.pending.reviews': 'Revisiones pendientes',
    'dashboard.adverse.events': 'Eventos adversos',
    'dashboard.upcoming.visits': 'Visitas próximas',
    'dashboard.next.events': 'Próximos 3 Eventos del Estudio',
    'dashboard.study.management': 'Gestión del Estudio',
    'dashboard.participant.list': 'Lista de Participantes',
    'dashboard.manage.calendar': 'Gestionar Calendario',
    'dashboard.questionnaires': 'Cuestionarios',
    'dashboard.export.questionnaires': 'Exportar Cuestionarios',
    'dashboard.study.progress': 'Progreso del Estudio',
    'dashboard.diary.compliance': 'Cumplimiento del Diario',
    'dashboard.visit.compliance': 'Cumplimiento de Visitas',
    'dashboard.enrollment': 'Inscripción',
    'dashboard.daily.diaries': 'Diarios Diarios',
    'dashboard.site.visits': 'Visitas al Sitio',
    
    // Participant Management
    'participant.management': 'Gestión de Participantes',
    'participant.search': 'Buscar por ID de paciente o token...',
    'participant.of': 'de',
    'participant.participants': 'participantes',
    'participant.patient.id': 'ID del Paciente',
    'participant.enrollment': 'Inscripción',
    'participant.visit.status': 'Estado de Visita',
    'participant.compliance': 'Cumplimiento',
    'participant.next.visit': 'Próxima Visita',
    'participant.actions': 'Acciones',
    'participant.view.details': 'Ver Detalles',
    'participant.view.questionnaires': 'Ver Cuestionarios',
    'participant.schedule.visit': 'Programar Visita',
    'participant.barcode.click': 'Haga clic para ver el código de barras',
    
    // Participant Details
    'details.title': 'Detalles del Participante',
    'details.alerts': 'Alertas',
    'details.visit.overdue': 'Visita vencida',
    'details.monthly.assessment': 'Pendiente de evaluación mensual',
    'details.basic.info': 'Información Básica',
    'details.demographics': 'Demografía',
    'details.study.progress': 'Progreso del Estudio',
    'details.recent.activity': 'Actividad Reciente',
    'details.upcoming.events': 'Eventos Próximos',
    'details.age': 'Edad',
    'details.gender': 'Género',
    'details.ethnicity': 'Etnia',
    
    // Settings
    'settings.title': 'Configuración',
    'settings.subtitle': 'Gestiona tus preferencias y cuenta',
    'settings.back': 'Atrás',
    'settings.language.preferences': 'Preferencias de Idioma',
    'settings.display.language': 'Idioma de Visualización',
    'settings.language.note': 'Los cambios se aplicarán después de actualizar la página',
    'settings.account.actions': 'Acciones de Cuenta',
    'settings.sign.out': 'Cerrar Sesión',
    'settings.sign.out.note': 'Serás redirigido a la página de inicio de sesión',
    
    // eConsent
    'econsent.title': 'Consentimiento Electrónico',
    'econsent.subtitle': 'Revisa y firma tu documento de consentimiento informado',
    'econsent.document.title': 'Formulario de Consentimiento Informado',
    'econsent.audio.play': 'Reproducir Audio',
    'econsent.audio.pause': 'Pausar Audio',
    'econsent.audio.stop': 'Detener Audio',
    'econsent.search.placeholder': 'Buscar en documento...',
    'econsent.search.results': 'Resultados de Búsqueda',
    'econsent.search.no.results': 'No se encontraron resultados',
    'econsent.signature.required': 'Firma Electrónica Requerida',
    'econsent.signature.full.name': 'Nombre Completo',
    'econsent.signature.date': 'Fecha',
    'econsent.signature.agree': 'Acepto participar en este estudio',
    'econsent.signature.sign': 'Firmar Documento',
    'econsent.signature.clear': 'Limpiar Firma',
    'econsent.signature.complete': 'Consentimiento Firmado Exitosamente',
    'econsent.download.pdf': 'Descargar PDF',
    'econsent.view.signed': 'Ver Documento Firmado',
    
    // Common
    'common.welcome': 'Bienvenido',
    'common.loading': 'Cargando...',
    'common.save': 'Guardar',
    'common.cancel': 'Cancelar',
    'common.close': 'Cerrar',
    'common.continue': 'Continuar',
    'common.back': 'Atrás',
    'common.next': 'Siguiente',
    'common.previous': 'Anterior',
    'common.complete': 'Completar',
    'common.pending': 'Pendiente',
    'common.active': 'Activo',
    'common.inactive': 'Inactivo',
    
    // Login and Authentication (Spanish)
    'login.title': 'Iniciar Sesión',
    'login.subtitle': 'Inicia sesión para acceder a tu cuenta',
    'login.email': 'Correo Electrónico',
    'login.email.placeholder': 'Ingresa tu correo electrónico',
    'login.password': 'Contraseña',
    'login.password.placeholder': 'Ingresa tu contraseña',
    'login.role.select': 'Selecciona tu rol',
    'login.role.selection.subtitle': 'Selecciona tu rol para continuar',
    'login.button': 'Iniciar Sesión',
    'login.back': 'Volver a Selección de Rol',
    'login.help': '¿No tienes acceso? Contacta a tu administrador',
    'login.roles.participant': 'Participante',
    'login.roles.investigator': 'Sitio',
    'login.roles.cro-sponsor': 'CRO/Patrocinador',
    'login.roles.participant.description': 'Accede a tu portal de participación en estudios',
    'login.roles.investigator.description': 'Gestiona y monitorea estudios clínicos',
    'login.roles.cro-sponsor.description': 'Supervisa y administra programas de investigación',
    
    // Status values
    'status.completed': 'completado',
    'status.scheduled': 'programado',
    'status.overdue': 'vencido',
    
    // Activity types
    'activity.visit': 'visita',
    'activity.questionnaire': 'cuestionario',
    'activity.call': 'llamada'
  }
};

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState(() => {
    return localStorage.getItem('language') || 'english';
  });

  useEffect(() => {
    localStorage.setItem('language', language);
  }, [language]);

  const t = (key: string): string => {
    return translations[language as keyof typeof translations]?.[key as keyof typeof translations.english] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
