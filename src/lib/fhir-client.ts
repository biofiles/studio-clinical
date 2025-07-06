// FHIR Client for Clinical Research Data
// Secure client that uses Supabase authentication
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
  private getAuthHeaders: () => Promise<Record<string, string>>;
  
  constructor(baseUrl?: string, getAuthHeaders?: () => Promise<Record<string, string>>) {
    this.baseUrl = baseUrl || `https://xwixpiyptdykphqqfyru.supabase.co/functions/v1`;
    this.getAuthHeaders = getAuthHeaders || (async () => ({}));
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
      const authHeaders = await this.getAuthHeaders();
      const response = await fetch(`${this.baseUrl}/fhir-export`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...authHeaders
        },
        body: JSON.stringify({ studyId })
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('FHIR Export Error:', error);
      throw error;
    }
  }
  
  // Import FHIR Bundle
  async importFHIRBundle(bundle: FHIRBundle): Promise<any> {
    try {
      const authHeaders = await this.getAuthHeaders();
      const response = await fetch(`${this.baseUrl}/fhir-import`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...authHeaders
        },
        body: JSON.stringify({ bundle })
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('FHIR Import Error:', error);
      throw error;
    }
  }
  
  // Validate FHIR Resource
  async validateResource(resource: any): Promise<any> {
    try {
      const authHeaders = await this.getAuthHeaders();
      const response = await fetch(`${this.baseUrl}/fhir-validate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...authHeaders
        },
        body: JSON.stringify({ resource })
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('FHIR Validation Error:', error);
      throw error;
    }
  }
  
  // Send to external FHIR server
  async sendToFHIRServer(endpoint: string, resource: any, headers?: Record<string, string>): Promise<any> {
    try {
      const authHeaders = await this.getAuthHeaders();
      const response = await fetch(`${this.baseUrl}/fhir-client`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...authHeaders
        },
        body: JSON.stringify({ 
          endpoint, 
          resource, 
          headers: headers || {},
          method: 'POST'
        })
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('FHIR Client Error:', error);
      throw error;
    }
  }
  
  // Query external FHIR server
  async queryFHIRServer(endpoint: string, params?: Record<string, string>, headers?: Record<string, string>): Promise<any> {
    try {
      const authHeaders = await this.getAuthHeaders();
      const response = await fetch(`${this.baseUrl}/fhir-client`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...authHeaders
        },
        body: JSON.stringify({ 
          endpoint, 
          params: params || {},
          headers: headers || {},
          method: 'GET'
        })
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('FHIR Query Error:', error);
      throw error;
    }
  }
}

// Create authenticated FHIR client factory
export const createAuthenticatedFHIRClient = (getAuthHeaders: () => Promise<Record<string, string>>) => {
  return new FHIRClient(undefined, getAuthHeaders);
};