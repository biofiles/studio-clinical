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

  // Export study data to CDISC format (Prototype with mock data)
  async exportToCDISC(request: CDISCExportRequest): Promise<any> {
    try {
      // Simulate processing delay for realistic UX
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Generate mock CDISC data based on the requested format
      let exportData: any = {};
      
      if (request.format === 'ODM') {
        exportData = this.generateMockODMData(request);
      } else if (request.format === 'SDTM') {
        exportData = this.generateMockSDTMData(request);
      } else if (request.format === 'ADaM') {
        exportData = this.generateMockADaMData(request);
      }
      
      // Add metadata if requested
      if (request.includeMetadata) {
        exportData.metadata = {
          studyId: request.studyId,
          studyName: "Clinical Study Prototype",
          protocol: "PROTO-001",
          exportDate: new Date().toISOString(),
          format: request.format,
          domains: request.domains,
          participantCount: 50,
          responseCount: 125
        };
      }
      
      // Add Define.xml if requested and format is SDTM
      if (request.includeDefineXML && request.format === 'SDTM') {
        exportData.defineXML = this.generateMockDefineXML(request.domains);
      }
      
      return exportData;
    } catch (error) {
      console.error('CDISC Export Error:', error);
      throw error;
    }
  }

  // Generate mock ODM data
  private generateMockODMData(request: CDISCExportRequest): any {
    return {
      ODM: {
        '@_FileOID': `ODM.${request.studyId}`,
        '@_FileType': 'Snapshot',
        '@_CreationDateTime': new Date().toISOString(),
        '@_ODMVersion': '1.3.2',
        Study: {
          '@_OID': request.studyId,
          GlobalVariables: {
            StudyName: "Clinical Study Prototype",
            StudyDescription: "Sample clinical study for CDISC export demonstration",
            ProtocolName: "PROTO-001"
          },
          MetaDataVersion: {
            '@_OID': `${request.studyId}.v1.0`,
            '@_Name': "Study Metadata v1.0",
            StudyEventDef: [{
              '@_OID': 'SE.SCREENING',
              '@_Name': 'Screening',
              '@_Repeating': 'No',
              '@_Type': 'Scheduled'
            }],
            FormDef: [{
              '@_OID': 'FORM.DM',
              '@_Name': 'Demographics',
              '@_Repeating': 'No'
            }]
          }
        }
      }
    };
  }

  // Generate mock SDTM data
  private generateMockSDTMData(request: CDISCExportRequest): any {
    const domains: any = {};
    
    // Generate DM (Demographics) domain
    if (request.domains.includes('DM')) {
      domains.DM = Array.from({ length: 50 }, (_, i) => ({
        STUDYID: "PROTO-001",
        DOMAIN: "DM",
        USUBJID: `SUBJ-${String(i + 1).padStart(3, '0')}`,
        SITEID: "001",
        AGE: Math.floor(Math.random() * 40) + 25,
        AGEU: "YEARS",
        SEX: Math.random() > 0.5 ? 'M' : 'F',
        RACE: "WHITE",
        ETHNIC: "NOT HISPANIC OR LATINO",
        COUNTRY: "USA",
        RFSTDTC: "2024-01-15",
        RFENDTC: null
      }));
    }
    
    // Generate QS (Questionnaire) domain
    if (request.domains.includes('QS')) {
      domains.QS = Array.from({ length: 150 }, (_, i) => ({
        STUDYID: "PROTO-001",
        DOMAIN: "QS",
        USUBJID: `SUBJ-${String(Math.floor(i / 3) + 1).padStart(3, '0')}`,
        QSSEQ: (i % 3) + 1,
        QSCAT: "QUALITY OF LIFE",
        QSTEST: `Question ${(i % 10) + 1}`,
        QSTESTCD: `Q${(i % 10) + 1}`,
        QSORRES: `Response ${Math.floor(Math.random() * 5) + 1}`,
        QSSTRESC: `${Math.floor(Math.random() * 5) + 1}`,
        QSDTC: "2024-02-01",
        VISITNUM: 1,
        VISIT: "SCREENING"
      }));
    }
    
    // Generate DS (Disposition) domain
    if (request.domains.includes('DS')) {
      domains.DS = Array.from({ length: 50 }, (_, i) => ({
        STUDYID: "PROTO-001",
        DOMAIN: "DS",
        USUBJID: `SUBJ-${String(i + 1).padStart(3, '0')}`,
        DSSEQ: 1,
        DSTERM: "ONGOING",
        DSDECOD: "ONGOING",
        DSCAT: "DISPOSITION EVENT",
        DSSTDTC: "2024-01-15"
      }));
    }
    
    return {
      domains,
      summary: {
        studyId: request.studyId,
        totalDomains: Object.keys(domains).length,
        totalRecords: Object.values(domains).reduce((sum: number, domain: any) => sum + domain.length, 0),
        generatedDomains: Object.keys(domains)
      }
    };
  }

  // Generate mock ADaM data
  private generateMockADaMData(request: CDISCExportRequest): any {
    const adsl = Array.from({ length: 50 }, (_, i) => ({
      STUDYID: "PROTO-001",
      USUBJID: `SUBJ-${String(i + 1).padStart(3, '0')}`,
      SUBJID: `SUBJ-${String(i + 1).padStart(3, '0')}`,
      SITEID: "001",
      AGE: Math.floor(Math.random() * 40) + 25,
      AGEGR1: Math.random() > 0.5 ? '<65' : '>=65',
      SEX: Math.random() > 0.5 ? 'M' : 'F',
      RACE: "WHITE",
      ETHNIC: "NOT HISPANIC OR LATINO",
      COUNTRY: "USA",
      RFSTDTC: "2024-01-15",
      DTHFL: "N",
      SAFFL: "Y",
      ITTFL: "Y",
      EFFFL: "Y",
      TRT01P: Math.random() > 0.5 ? "TREATMENT A" : "TREATMENT B",
      TRT01A: Math.random() > 0.5 ? "TREATMENT A" : "TREATMENT B"
    }));
    
    return {
      datasets: {
        ADSL: adsl
      },
      summary: {
        studyId: request.studyId,
        totalDatasets: 1,
        totalSubjects: adsl.length,
        generatedDatasets: ['ADSL']
      }
    };
  }

  // Generate mock Define.xml
  private generateMockDefineXML(domains: string[]): any {
    return {
      ODM: {
        '@_xmlns': 'http://www.cdisc.org/ns/odm/v1.3',
        '@_xmlns:def': 'http://www.cdisc.org/ns/def/v2.0',
        '@_FileOID': 'Define.PROTO-001',
        '@_FileType': 'Snapshot',
        '@_CreationDateTime': new Date().toISOString(),
        '@_ODMVersion': '1.3.2',
        Study: {
          '@_OID': 'PROTO-001',
          GlobalVariables: {
            StudyName: "Clinical Study Prototype",
            StudyDescription: "Sample clinical study for CDISC export demonstration",
            ProtocolName: "PROTO-001"
          },
          MetaDataVersion: {
            '@_OID': 'PROTO-001.define.v1.0',
            '@_Name': 'Study Define Metadata v1.0',
            '@_DefineVersion': '2.0.0',
            ItemGroupDef: domains.map(domain => ({
              '@_OID': `IG.${domain}`,
              '@_Name': this.getDomainName(domain),
              '@_Repeating': 'Yes',
              '@_Domain': domain,
              '@_Purpose': 'Tabulation',
              '@_def:Structure': 'One record per event',
              '@_def:Class': this.getDomainClass(domain)
            }))
          }
        }
      }
    };
  }

  // Helper methods for domain names and classes
  private getDomainName(domain: string): string {
    const domainNames: { [key: string]: string } = {
      'DM': 'Demographics',
      'QS': 'Questionnaires',
      'DS': 'Disposition',
      'AE': 'Adverse Events',
      'CM': 'Concomitant Medications',
      'VS': 'Vital Signs',
      'LB': 'Laboratory Test Results'
    };
    return domainNames[domain] || domain;
  }

  private getDomainClass(domain: string): string {
    const domainClasses: { [key: string]: string } = {
      'DM': 'SPECIAL PURPOSE',
      'QS': 'QUESTIONNAIRES',
      'DS': 'SPECIAL PURPOSE',
      'AE': 'EVENTS',
      'CM': 'INTERVENTIONS',
      'VS': 'FINDINGS',
      'LB': 'FINDINGS'
    };
    return domainClasses[domain] || 'FINDINGS';
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