// FHIR Client for Clinical Research Data
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://xwixpiyptdykphqqfyru.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh3aXhwaXlwdGR5a3BocXFmeXJ1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTE1MDcyMDQsImV4cCI6MjA2NzA4MzIwNH0.giE_0Mwzvs_TZHdqY1Q13WOc68GaqIyh18F445oefsQ";
const supabase = createClient(supabaseUrl, supabaseKey);
import { 
  FHIRPatient, 
  FHIRResearchStudy, 
  FHIRResearchSubject, 
  FHIRObservation, 
  FHIRQuestionnaireResponse,
  FHIRBundle 
} from "@/types/fhir";

export class FHIRClient {
  private baseUrl: string;
  
  constructor(baseUrl?: string) {
    this.baseUrl = baseUrl || `https://xwixpiyptdykphqqfyru.supabase.co/functions/v1/fhir-server`;
  }
  
  // Convert study participant data to FHIR Patient
  static participantToFHIRPatient(participant: any): FHIRPatient {
    return {
      resourceType: "Patient",
      id: participant.id,
      identifier: [
        {
          use: "usual",
          system: "https://clinical-research.org/participant-id",
          value: participant.subjectId || participant.id
        }
      ],
      active: participant.status === "active",
      name: [
        {
          use: "official",
          family: participant.lastName,
          given: [participant.firstName]
        }
      ],
      telecom: participant.email ? [
        {
          system: "email",
          value: participant.email,
          use: "home"
        }
      ] : undefined,
      gender: participant.gender?.toLowerCase() as "male" | "female" | "other" | "unknown",
      birthDate: participant.dateOfBirth,
      address: participant.address ? [
        {
          use: "home",
          line: [participant.address],
          city: participant.city,
          state: participant.state,
          postalCode: participant.zipCode,
          country: participant.country
        }
      ] : undefined
    };
  }
  
  // Convert study data to FHIR ResearchStudy
  static studyToFHIRResearchStudy(study: any): FHIRResearchStudy {
    return {
      resourceType: "ResearchStudy",
      id: study.id,
      identifier: [
        {
          use: "official",
          system: "https://clinical-research.org/study-protocol",
          value: study.protocol
        }
      ],
      status: study.status === "active" ? "active" : "completed",
      category: [
        {
          coding: [
            {
              system: "http://hl7.org/fhir/research-study-phase",
              code: study.phase || "phase-2",
              display: study.phase ? `Phase ${study.phase}` : "Phase II"
            }
          ]
        }
      ],
      title: study.name,
      description: study.description,
      period: {
        start: study.startDate,
        end: study.endDate
      },
      sponsor: study.sponsor ? {
        reference: `Organization/${study.sponsor}`
      } : undefined
    };
  }
  
  // Convert enrollment to FHIR ResearchSubject
  static enrollmentToFHIRResearchSubject(participant: any, studyId: string): FHIRResearchSubject {
    return {
      resourceType: "ResearchSubject",
      id: `${participant.id}-${studyId}`,
      identifier: [
        {
          use: "secondary",
          system: "https://clinical-research.org/enrollment-id",
          value: `${participant.subjectId}-${studyId}`
        }
      ],
      status: participant.status === "active" ? "on-study" : "withdrawn",
      period: {
        start: participant.enrollmentDate,
        end: participant.completionDate
      },
      study: {
        reference: `ResearchStudy/${studyId}`
      },
      individual: {
        reference: `Patient/${participant.id}`
      },
      assignedArm: participant.arm,
      actualArm: participant.arm
    };
  }
  
  // Convert questionnaire response to FHIR
  static questionnaireToFHIRResponse(response: any): FHIRQuestionnaireResponse {
    return {
      resourceType: "QuestionnaireResponse",
      id: response.id,
      identifier: {
        use: "official",
        system: "https://clinical-research.org/questionnaire-response",
        value: response.id
      },
      questionnaire: response.questionnaireId,
      status: response.status || "completed",
      subject: {
        reference: `Patient/${response.participantId}`
      },
      authored: response.submittedAt || new Date().toISOString(),
      author: {
        reference: `Patient/${response.participantId}`
      },
      item: response.answers ? Object.entries(response.answers).map(([linkId, answer]: [string, any]) => ({
        linkId,
        answer: [
          {
            valueString: typeof answer === 'string' ? answer : JSON.stringify(answer)
          }
        ]
      })) : undefined
    };
  }
  
  // Export data to FHIR Bundle
  async exportToFHIRBundle(studyId: string): Promise<FHIRBundle> {
    try {
      const { data, error } = await supabase.functions.invoke('fhir-export', {
        body: { studyId }
      });
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('FHIR Export Error:', error);
      throw error;
    }
  }
  
  // Import FHIR Bundle
  async importFHIRBundle(bundle: FHIRBundle): Promise<any> {
    try {
      const { data, error } = await supabase.functions.invoke('fhir-import', {
        body: { bundle }
      });
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('FHIR Import Error:', error);
      throw error;
    }
  }
  
  // Validate FHIR Resource
  async validateResource(resource: any): Promise<any> {
    try {
      const { data, error } = await supabase.functions.invoke('fhir-validate', {
        body: { resource }
      });
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('FHIR Validation Error:', error);
      throw error;
    }
  }
  
  // Send to external FHIR server
  async sendToFHIRServer(endpoint: string, resource: any, headers?: Record<string, string>): Promise<any> {
    try {
      const { data, error } = await supabase.functions.invoke('fhir-client', {
        body: { 
          endpoint, 
          resource, 
          headers: headers || {},
          method: 'POST'
        }
      });
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('FHIR Client Error:', error);
      throw error;
    }
  }
  
  // Query external FHIR server
  async queryFHIRServer(endpoint: string, params?: Record<string, string>, headers?: Record<string, string>): Promise<any> {
    try {
      const { data, error } = await supabase.functions.invoke('fhir-client', {
        body: { 
          endpoint, 
          params: params || {},
          headers: headers || {},
          method: 'GET'
        }
      });
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('FHIR Query Error:', error);
      throw error;
    }
  }
}

// Default client instance
export const fhirClient = new FHIRClient();