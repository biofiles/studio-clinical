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
import { 
  CDISCODMStudy, 
  CDISCExportRequest, 
  CDISCValidationResult, 
  CDISCSDTMDomain,
  CDISCDMRecord,
  CDISCAERecord,
  CDISCQSRecord,
  CDISCVSRecord,
  CDISCDSRecord,
  CDISCFHIRMapping
} from "@/types/cdisc";

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

  // ==== CDISC INTEROPERABILITY METHODS ====

  // Convert FHIR Bundle to CDISC ODM
  static fhirBundleToCDISCODM(bundle: FHIRBundle, studyOid: string): CDISCODMStudy {
    const odmStudy: CDISCODMStudy = {
      oid: studyOid,
      name: `Study ${studyOid}`,
      protocolName: studyOid,
      metaDataVersion: {
        oid: `${studyOid}.v1.0`,
        name: `Study ${studyOid} Metadata v1.0`,
        studyEventDefs: [
          {
            oid: "SE.SCREENING",
            name: "Screening",
            repeating: "No",
            type: "Scheduled",
            formRefs: [
              { formOid: "FORM.DM", mandatory: "Yes" },
              { formOid: "FORM.QS", mandatory: "No" }
            ]
          }
        ],
        formDefs: [
          {
            oid: "FORM.DM",
            name: "Demographics",
            repeating: "No",
            itemGroupRefs: [{ itemGroupOid: "IG.DM", mandatory: "Yes" }]
          },
          {
            oid: "FORM.QS",
            name: "Questionnaires",
            repeating: "Yes",
            itemGroupRefs: [{ itemGroupOid: "IG.QS", mandatory: "Yes" }]
          }
        ],
        itemGroupDefs: [
          {
            oid: "IG.DM",
            name: "Demographics",
            repeating: "No",
            domain: "DM",
            purpose: "Tabulation",
            itemRefs: [
              { itemOid: "IT.USUBJID", mandatory: "Yes", keySequence: 1 },
              { itemOid: "IT.AGE", mandatory: "No" },
              { itemOid: "IT.SEX", mandatory: "No" },
              { itemOid: "IT.RACE", mandatory: "No" }
            ]
          },
          {
            oid: "IG.QS",
            name: "Questionnaire Responses",
            repeating: "Yes",
            domain: "QS",
            purpose: "Tabulation",
            itemRefs: [
              { itemOid: "IT.USUBJID", mandatory: "Yes", keySequence: 1 },
              { itemOid: "IT.QSTEST", mandatory: "Yes" },
              { itemOid: "IT.QSORRES", mandatory: "No" }
            ]
          }
        ],
        itemDefs: [
          { oid: "IT.USUBJID", name: "Unique Subject Identifier", dataType: "text", length: 50 },
          { oid: "IT.AGE", name: "Age", dataType: "integer" },
          { oid: "IT.SEX", name: "Sex", dataType: "text", codeListRef: "CL.SEX" },
          { oid: "IT.RACE", name: "Race", dataType: "text" },
          { oid: "IT.QSTEST", name: "Question Name", dataType: "text" },
          { oid: "IT.QSORRES", name: "Result or Finding in Original Units", dataType: "text" }
        ],
        codeListDefs: [
          {
            oid: "CL.SEX",
            name: "Sex",
            dataType: "text",
            codeListItems: [
              { codedValue: "M", decode: "Male" },
              { codedValue: "F", decode: "Female" },
              { codedValue: "U", decode: "Unknown" }
            ]
          }
        ]
      }
    };

    return odmStudy;
  }

  // Convert participant data to CDISC DM domain
  static participantToCDISCDM(participant: any, studyId: string): CDISCDMRecord {
    return {
      STUDYID: studyId,
      DOMAIN: "DM",
      USUBJID: participant.subjectId || participant.id,
      SITEID: "001",
      AGE: participant.dateOfBirth ? 
        Math.floor((Date.now() - new Date(participant.dateOfBirth).getTime()) / (365.25 * 24 * 60 * 60 * 1000)) : 
        undefined,
      AGEU: participant.dateOfBirth ? "YEARS" : undefined,
      SEX: participant.gender?.toUpperCase().charAt(0) || "U",
      RACE: participant.race || "NOT REPORTED",
      ETHNIC: participant.ethnicity || "NOT REPORTED",
      COUNTRY: participant.country || "USA",
      RFSTDTC: participant.enrollmentDate,
      RFENDTC: participant.completionDate
    };
  }

  // Convert questionnaire response to CDISC QS domain
  static questionnaireResponseToCDISCQS(response: any, studyId: string): CDISCQSRecord[] {
    if (!response.answers) return [];

    return Object.entries(response.answers).map(([questionId, answer], index) => ({
      STUDYID: studyId,
      DOMAIN: "QS",
      USUBJID: response.participantId,
      QSSEQ: index + 1,
      QSCAT: response.title || "QUESTIONNAIRE",
      QSTEST: questionId,
      QSTESTCD: questionId.toUpperCase().substring(0, 8),
      QSORRES: typeof answer === 'string' ? answer : JSON.stringify(answer),
      QSSTRESC: typeof answer === 'string' ? answer : JSON.stringify(answer),
      QSDTC: response.submittedAt || new Date().toISOString().split('T')[0],
      VISITNUM: 1,
      VISIT: "SCREENING"
    }));
  }

  // Export study data to CDISC format
  async exportToCDISC(request: CDISCExportRequest): Promise<any> {
    try {
      // Import supabase client for edge function calls
      const { createClient } = await import('@supabase/supabase-js');
      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
      const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
      
      if (!supabaseUrl || !supabaseAnonKey) {
        throw new Error('Supabase configuration is missing');
      }
      
      const supabase = createClient(supabaseUrl, supabaseAnonKey);
      
      const { data, error } = await supabase.functions.invoke('cdisc-export', {
        body: request
      });
      
      if (error) {
        console.error('Supabase function error:', error);
        throw new Error(`CDISC Export failed: ${error.message}`);
      }
      
      return data;
    } catch (error) {
      console.error('CDISC Export Error:', error);
      throw error;
    }
  }

  // Validate CDISC data
  async validateCDISCData(domains: CDISCSDTMDomain[]): Promise<CDISCValidationResult> {
    try {
      const authHeaders = await this.getAuthHeaders();
      const response = await fetch(`${this.baseUrl}/cdisc-validate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...authHeaders
        },
        body: JSON.stringify({ domains })
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('CDISC Validation Error:', error);
      throw error;
    }
  }

  // Transform FHIR to CDISC
  async transformFHIRToCDISC(bundle: FHIRBundle, mappings: CDISCFHIRMapping[]): Promise<CDISCSDTMDomain[]> {
    try {
      const authHeaders = await this.getAuthHeaders();
      const response = await fetch(`${this.baseUrl}/cdisc-transform`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...authHeaders
        },
        body: JSON.stringify({ bundle, mappings })
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('CDISC Transform Error:', error);
      throw error;
    }
  }
}

// Create authenticated FHIR client factory
export const createAuthenticatedFHIRClient = (getAuthHeaders: () => Promise<Record<string, string>>) => {
  return new FHIRClient(undefined, getAuthHeaders);
};