import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

interface AuditLogEntry {
  activity_type: string;
  details?: Record<string, any>;
  ip_address?: string;
  user_agent?: string;
}

export const useAuditLog = () => {
  const { user } = useAuth();

  const logActivity = async (entry: AuditLogEntry) => {
    if (!user) return;

    try {
      const { error } = await supabase.rpc('log_user_activity', {
        user_id: user.id,
        activity_type: entry.activity_type,
        details: entry.details || null
      });

      if (error) {
        console.error('Failed to log activity:', error);
      }
    } catch (error) {
      console.error('Error logging activity:', error);
    }
  };

  const logSecurityEvent = async (eventType: string, details?: Record<string, any>) => {
    try {
      const { error } = await supabase.rpc('log_security_event', {
        event_type: eventType,
        event_details: details || null,
        user_id_param: user?.id || null
      });

      if (error) {
        console.error('Failed to log security event:', error);
      }
    } catch (error) {
      console.error('Error logging security event:', error);
    }
  };

  // Wrapper functions for common operations
  const logParticipantAction = (action: string, participantId: string, details?: Record<string, any>) => {
    logActivity({
      activity_type: `PARTICIPANT_${action.toUpperCase()}`,
      details: {
        participant_id: participantId,
        ...details
      }
    });
  };

  const logQuestionnaireAction = (action: string, questionnaireId: string, details?: Record<string, any>) => {
    logActivity({
      activity_type: `QUESTIONNAIRE_${action.toUpperCase()}`,
      details: {
        questionnaire_id: questionnaireId,
        ...details
      }
    });
  };

  const logStudyAction = (action: string, studyId: string, details?: Record<string, any>) => {
    logActivity({
      activity_type: `STUDY_${action.toUpperCase()}`,
      details: {
        study_id: studyId,
        ...details
      }
    });
  };

  const logAuthAction = (action: string, details?: Record<string, any>) => {
    logActivity({
      activity_type: `AUTH_${action.toUpperCase()}`,
      details
    });
  };

  return {
    logActivity,
    logSecurityEvent,
    logParticipantAction,
    logQuestionnaireAction,
    logStudyAction,
    logAuthAction
  };
};