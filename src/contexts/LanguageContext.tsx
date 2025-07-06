
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
    'dashboard.manage.calendar': 'Calendar',
    'dashboard.questionnaires': 'Questionnaires',
    'dashboard.export.questionnaires': 'Export Questionnaires',
    'dashboard.study.progress': 'Study Progress',
    'dashboard.diary.compliance': 'Diary Compliance',
    'dashboard.visit.compliance': 'Visit Compliance',
    'dashboard.enrollment': 'Enrollment',
    'dashboard.daily.diaries': 'Daily Diaries',
    'dashboard.site.visits': 'Visits',
    
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
    'details.icf.title': 'Informed Consent (ICF)',
    'details.icf.version': 'ICF Version',
    'details.icf.signed.date': 'Signed Date',
    'details.icf.status': 'Status',
    'details.icf.action.required': 'Action Required',
    'details.icf.updated.schedule': 'ICF has been updated to v2.1. Please schedule re-consent visit.',
    
    // Participant specific
    'participant.profile': 'Profile',
    'participant.your.schedule': 'Your Schedule',
    'participant.days.remaining': 'days remaining',
    'participant.token': 'Participant Token',
    
    // Questionnaires
    'questionnaire.daily.symptom': 'Daily Symptom Diary',
    
    // Contact Information
    'contact.info': 'Contact',
    'contact.site.staff': 'Site Staff',
    'contact.principal.investigator': 'Principal Investigator',
    'contact.study.coordinator': 'Study Coordinator',
    'contact.phone': 'Phone',
    'contact.email': 'Email',
    'contact.emergency': 'Emergency Contact',
    'contact.emergency.info': 'Available 24/7 for urgent study-related matters',
    'contact.regulatory.authorities': 'Regulatory Authorities',
    'contact.safety.reporting': 'Safety Reporting',
    'contact.safety.note': 'Important',
    'contact.safety.description': 'Report any adverse events immediately to your study team',
    'contact.sponsor': 'Study Sponsor',
    'contact.company': 'Company',
    'contact.medical.monitor': 'Medical Monitor',
    'contact.unblinding.emergency': 'Emergency Unblinding',
    'contact.issued': 'Issued',
    'contact.tap.for.details': 'Tap for details',
    'contact.token.description': 'Click to view your participant profile and barcode details',
    
    // Activities
    'activity.weekly.survey': 'Weekly Survey',
    'activity.weekly.survey.details': 'Quick 5-minute questionnaire about your daily symptoms and medication adherence',
    'activity.online.location': 'Online - Complete from home',
    'activity.site.visit.blood': 'Site Visit - Blood Draw',
    'activity.site.visit.blood.details': 'Routine blood analysis for safety monitoring and efficacy evaluation',
    'activity.hospital.location': 'Metro General Hospital - Laboratory Building, 2nd Floor',
    'activity.site.visit.notes': 'Please fast for 12 hours before the visit. Bring your medication diary and any questions you may have.',
    'activity.daily.diary': 'Daily Diary Entry',
    'activity.anytime': 'Anytime',
    'activity.daily.diary.details': 'Record your daily symptoms, medications taken, and any side effects',
    'activity.mobile.location': 'Online - Mobile app or web portal',
    'activity.survey.completed': 'Survey completed successfully! Thank you for your participation.',
    'activity.pdf.export': 'PDF export initiated - questionnaire responses would be downloaded as a secure, de-identified document.',
    'activity.view.details': 'Ver Detalles',
    
    // Calendar
    'calendar.view.full': 'View Full Calendar',
    
    // Questionnaires
    'questionnaire.your.surveys': 'Your Questionnaires',
    'questionnaire.view.all': 'View All Questionnaires',
    'questionnaire.pending': 'Pending',
    'questionnaire.completed': 'Completed',
    'questionnaire.completion.rate': 'Completion Rate',
    'questionnaire.thanks.completing': 'Thank you for completing today\'s questionnaire!',
    'questionnaire.quick.survey': 'Quick 5-minute survey about your daily symptoms',
    'questionnaire.complete.now': 'Complete Now',
    
    // Visits
    'visits.site.visits': 'Visits',
    'visits.baseline.completed': 'Baseline Visit - Completed',
    'visits.baseline.procedures': 'Blood draw, vital signs, questionnaires completed',
    'visits.notes': 'Visit Notes',
    'visits.baseline.notes': 'All procedures completed successfully. Blood pressure slightly elevated, will monitor at next visit. Patient reported no adverse events.',
    'visits.week4.scheduled': 'Week 4 Visit - Scheduled',
    'visits.week4.procedures': 'Blood draw, safety evaluation, questionnaires',
    'visits.preparation.notes': 'Preparation Notes',
    'visits.week4.notes': 'Please fast for 12 hours before the visit. Bring your medication diary and any questions you may have.',
    
    // Profile
    'profile.view.settings': 'View Profile & Settings',
    'profile.export.pdf': 'Export My Responses (PDF)',
    'profile.privacy.security': 'Privacy & Security',
    'profile.privacy.description': 'Your data is encrypted and protected according to HIPAA standards. All responses are de-identified for analysis.',
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
    'econsent.title': 'Consent',
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
    'econsent.history': 'History',
    'econsent.status.signed': 'Signed',
    'econsent.status.superseded': 'Superseded',
    'econsent.status.pending': 'Pending',
    
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
    'common.completed': 'Completed',
    'common.due.today': 'Due Today',
    'common.pending': 'Pending',
    'common.details': 'Details',
    'common.milestone': 'Milestone',
    'common.regulatory': 'Regulatory',
    
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
    'login.roles.cro-sponsor': 'Sponsor/CRO',
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
    'activity.call': 'call',
    'activity.diary': 'diary',
    'activity.assessment': 'assessment',
    'activity.lab': 'lab work',
    'activity.meeting': 'meeting',
    
    // Study Selector
    'study.selector.investigator.title': 'Select Study - Site Investigator',
    'study.selector.cro.title': 'Select Study - CRO/Sponsor',
    'study.selector.subtitle': 'Choose the study you want to access',
    'study.sites': 'sites',
    'study.participants': 'participants',
    'study.status.active': 'Active',
    'study.status.recruiting': 'Recruiting',
    'study.status.completed': 'Completed',
    
    // CRO/Sponsor Dashboard
    'cro.portfolio.overview': 'Portfolio Overview',
    'cro.global.research.ops': 'Global Research Operations Dashboard',
    'cro.active.studies': 'Active studies',
    'cro.research.sites': 'Research sites',
    'cro.total.participants': 'Total participants',
    'cro.compliance.rate': 'Compliance rate',
    'cro.study.details': 'Study Details',
    'cro.questionnaires': 'Questionnaires',
    'cro.schedule': 'Schedule',
    'cro.participants': 'Participants',
    'cro.reports': 'Reports',
    'cro.select.study': 'Select a Study',
    'cro.performance.metrics': 'Performance Metrics',
    'cro.budget.utilization': 'Budget Utilization',
    'cro.timeline.progress': 'Timeline Progress',
    'cro.spent': 'Spent',
    'cro.completion': 'Completion',
    'cro.enrollment.tracker': 'Enrollment Tracker',
    'cro.current': 'Current',
    'cro.target': 'Target',
    'cro.retention.rate': 'Retention Rate',
    'cro.compliance.score': 'Compliance Score',
    'cro.set.favorite': 'Set as Favorite',
    'cro.remove.favorite': 'Remove Favorite',
    'cro.favorite.study': 'Favorite Study',
    'cro.milestone.schedule': 'Study Milestones & Schedule',
    'cro.key.milestones': 'Key Study Milestones',
    'cro.milestone.completed': 'Completed',
    'cro.milestone.pending': 'Pending',
    'cro.questionnaire.analytics': 'Questionnaire Analytics',
    'cro.response.rates': 'Response Rates',
    'cro.quality.reviews': 'Quality Reviews',
    'cro.data.validation': 'Data Validation Issues',
    'cro.daily.symptom': 'Daily Symptom',
    'cro.weekly.qol': 'Weekly QoL',
    'cro.monthly.health': 'Monthly Health',
    'cro.download.reports': 'Download Reports',
    'cro.site.users.report': 'Site Users Report',
    'cro.questionnaire.report': 'Questionnaire Report',
    'cro.milestones.report': 'Milestones Report',
    'cro.interoperability': 'Interoperability Module',
    'cro.export.fhir': 'Export FHIR Data',
    'cro.export.hl7': 'Export HL7 Messages',
    'cro.validate.cdisc': 'Validate CDISC Standards',
    'cro.advanced.analytics': 'Advanced Analytics'
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
    'dashboard.manage.calendar': 'Calendario',
    'dashboard.questionnaires': 'Cuestionarios',
    'dashboard.export.questionnaires': 'Exportar Cuestionarios',
    'dashboard.study.progress': 'Progreso del Estudio',
    'dashboard.diary.compliance': 'Cumplimiento del Diario',
    'dashboard.visit.compliance': 'Cumplimiento de Visitas',
    'dashboard.enrollment': 'Inscripción',
    'dashboard.daily.diaries': 'Diarios Diarios',
    'dashboard.site.visits': 'Visitas',
    
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
    'participant.profile': 'Perfil',
    'participant.your.schedule': 'Tu Agenda',
    'participant.days.remaining': 'días restantes',
    'participant.token': 'Token de Participante',
    
    // Questionnaires
    'questionnaire.daily.symptom': 'Diario de Síntomas Diarios',
    
    // Contact Information
    'contact.info': 'Contacto',
    'contact.site.staff': 'Personal del Sitio',
    'contact.principal.investigator': 'Investigador Principal',
    'contact.study.coordinator': 'Coordinador del Estudio',
    'contact.phone': 'Teléfono',
    'contact.email': 'Correo Electrónico',
    'contact.emergency': 'Contacto de Emergencia',
    'contact.emergency.info': 'Disponible 24/7 para asuntos urgentes relacionados con el estudio',
    'contact.regulatory.authorities': 'Autoridades Regulatorias',
    'contact.safety.reporting': 'Reporte de Seguridad',
    'contact.safety.note': 'Importante',
    'contact.safety.description': 'Reporte cualquier evento adverso inmediatamente a su equipo de estudio',
    'contact.sponsor': 'Patrocinador del Estudio',
    'contact.company': 'Empresa',
    'contact.medical.monitor': 'Monitor Médico',
    'contact.unblinding.emergency': 'Desenmascaramiento de Emergencia',
    'contact.issued': 'Emitido',
    'contact.tap.for.details': 'Toca para ver detalles',
    'contact.token.description': 'Haz clic para ver tu perfil de participante y detalles del código de barras',
    
    // Activities  
    'activity.weekly.survey': 'Cuestionario Semanal',
    'activity.weekly.survey.details': 'Cuestionario rápido de 5 minutos sobre sus síntomas diarios y adherencia a la medicación',
    'activity.online.location': 'En línea - Complete desde casa',
    'activity.site.visit.blood': 'Visita al Sitio - Extracción de Sangre',
    'activity.site.visit.blood.details': 'Análisis de sangre de rutina para monitoreo de seguridad y evaluación de eficacia',
    'activity.hospital.location': 'Hospital General Metro - Edificio de Laboratorio, 2do Piso',
    'activity.site.visit.notes': 'Por favor ayune durante 12 horas antes de la visita. Traiga su diario de medicamentos y cualquier pregunta que pueda tener.',
    'activity.daily.diary': 'Entrada de Diario Diario',
    'activity.anytime': 'Cualquier momento',
    'activity.daily.diary.details': 'Registre sus síntomas diarios, medicamentos tomados y cualquier efecto secundario',
    'activity.mobile.location': 'En línea - Aplicación móvil o portal web',
    'activity.survey.completed': 'Cuestionario completado exitosamente! Gracias por su participación.',
    'activity.pdf.export': 'Exportación PDF iniciada - las respuestas del cuestionario se descargarían como un documento seguro y sin identificación.',
    'activity.view.details': 'Ver Detalles',
    
    // Calendar
    'calendar.view.full': 'Ver Calendario Completo',
    
    // Questionnaires
    'questionnaire.your.surveys': 'Sus Cuestionarios',
    'questionnaire.view.all': 'Ver Todos los Cuestionarios',
    'questionnaire.pending': 'Pendientes',
    'questionnaire.completed': 'Completadas',
    'questionnaire.completion.rate': 'Tasa de Finalización',
    'questionnaire.thanks.completing': '¡Gracias por completar el cuestionario de hoy!',
    'questionnaire.quick.survey': 'Cuestionario rápido de 5 minutos sobre sus síntomas diarios',
    'questionnaire.complete.now': 'Completar Ahora',
    
    // Visits
    'visits.site.visits': 'Visitas',
    'visits.baseline.completed': 'Visita Basal - Completada',
    'visits.baseline.procedures': 'Extracción de sangre, signos vitales, cuestionarios completados',
    'visits.notes': 'Notas de la Visita',
    'visits.baseline.notes': 'Todos los procedimientos completados exitosamente. Presión arterial ligeramente elevada, se monitoreará en la próxima visita. El paciente no reportó eventos adversos.',
    'visits.week4.scheduled': 'Visita Semana 4 - Programada',
    'visits.week4.procedures': 'Extracción de sangre, evaluación de seguridad, cuestionarios',
    'visits.preparation.notes': 'Notas de Preparación',
    'visits.week4.notes': 'Por favor ayune durante 12 horas antes de la visita. Traiga su diario de medicamentos y cualquier pregunta que pueda tener.',
    
    // Profile
    'profile.view.settings': 'Ver Perfil y Configuración',
    'profile.export.pdf': 'Exportar Mis Respuestas (PDF)',
    'profile.privacy.security': 'Privacidad y Seguridad',
    'profile.privacy.description': 'Sus datos están encriptados y protegidos según los estándares HIPAA. Todas las respuestas son desidentificadas para el análisis.',
    
    // Participant Details
    'details.title': 'Detalles del Participante',
    'details.alerts': 'Alertas',
    'details.visit.overdue': 'Visita vencida',
    'details.monthly.assessment': 'Pendiente de evaluación mensual',
    'details.basic.info': 'Información Básica',
    'details.demographics': 'Demografía',
    'details.icf.title': 'Consentimiento Informado (ICF)',
    'details.icf.version': 'Versión ICF',
    'details.icf.signed.date': 'Fecha de Firma',
    'details.icf.status': 'Estado',
    'details.icf.action.required': 'Acción Requerida',
    'details.icf.updated.schedule': 'ICF ha sido actualizado a v2.1. Por favor programe una visita de re-consentimiento.',
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
    'econsent.title': 'Consentimiento',
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
    'econsent.history': 'Historial',
    'econsent.status.signed': 'Firmado',
    'econsent.status.superseded': 'Reemplazado',
    'econsent.status.pending': 'Pendiente',
    
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
    'common.completed': 'Completado',
    'common.due.today': 'Vence Hoy',
    'common.complete': 'Completar',
    'common.pending': 'Pendiente',
    'common.active': 'Activo',
    'common.inactive': 'Inactivo',
    'common.details': 'Detalles',
    'common.milestone': 'Hito',
    'common.regulatory': 'Regulatorio',
    
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
    'activity.call': 'llamada',
    'activity.diary': 'diario',
    'activity.assessment': 'evaluación',
    'activity.lab': 'laboratorio',
    'activity.meeting': 'reunión',
    
    // Study Selector
    'study.selector.investigator.title': 'Seleccionar Estudio - Investigador del Sitio',
    'study.selector.cro.title': 'Seleccionar Estudio - CRO/Patrocinador',
    'study.selector.subtitle': 'Elige el estudio al que quieres acceder',
    'study.sites': 'sitios',
    'study.participants': 'participantes',
    'study.status.active': 'Activo',
    'study.status.recruiting': 'Reclutando',
    'study.status.completed': 'Completado',
    
    // CRO/Sponsor Dashboard
    'cro.portfolio.overview': 'Resumen del Portafolio',
    'cro.global.research.ops': 'Panel de Operaciones de Investigación Global',
    'cro.active.studies': 'Estudios activos',
    'cro.research.sites': 'Sitios de investigación',
    'cro.total.participants': 'Participantes totales',
    'cro.compliance.rate': 'Tasa de cumplimiento',
    'cro.study.details': 'Detalles del Estudio',
    'cro.questionnaires': 'Cuestionarios',
    'cro.schedule': 'Cronograma',
    'cro.participants': 'Participantes',
    'cro.reports': 'Reportes',
    'cro.select.study': 'Seleccionar un Estudio',
    'cro.performance.metrics': 'Métricas de Rendimiento',
    'cro.budget.utilization': 'Utilización del Presupuesto',
    'cro.timeline.progress': 'Progreso del Cronograma',
    'cro.spent': 'Gastado',
    'cro.completion': 'Finalización',
    'cro.enrollment.tracker': 'Seguimiento de Inscripción',
    'cro.current': 'Actual',
    'cro.target': 'Objetivo',
    'cro.retention.rate': 'Tasa de Retención',
    'cro.compliance.score': 'Puntuación de Cumplimiento',
    'cro.set.favorite': 'Marcar como Favorito',
    'cro.remove.favorite': 'Quitar Favorito',
    'cro.favorite.study': 'Estudio Favorito',
    'cro.milestone.schedule': 'Hitos y Cronograma del Estudio',
    'cro.key.milestones': 'Hitos Clave del Estudio',
    'cro.milestone.completed': 'Completado',
    'cro.milestone.pending': 'Pendiente',
    'cro.questionnaire.analytics': 'Análisis de Cuestionarios',
    'cro.response.rates': 'Tasas de Respuesta',
    'cro.quality.reviews': 'Revisiones de Calidad',
    'cro.data.validation': 'Problemas de Validación de Datos',
    'cro.daily.symptom': 'Síntomas Diarios',
    'cro.weekly.qol': 'Calidad de Vida Semanal',
    'cro.monthly.health': 'Salud Mensual',
    'cro.download.reports': 'Descargar Reportes',
    'cro.site.users.report': 'Reporte de Usuarios del Sitio',
    'cro.questionnaire.report': 'Reporte de Cuestionarios',
    'cro.milestones.report': 'Reporte de Hitos',
    'cro.interoperability': 'Módulo de Interoperabilidad',
    'cro.export.fhir': 'Exportar Datos FHIR',
    'cro.export.hl7': 'Exportar Mensajes HL7',
    'cro.validate.cdisc': 'Validar Estándares CDISC',
    'cro.advanced.analytics': 'Análisis Avanzado'
  }
};

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState(() => {
    return localStorage.getItem('language') || 'spanish';
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
