// FHIR Resource Types for Clinical Research
export interface FHIRPatient {
  resourceType: "Patient";
  id?: string;
  identifier?: Array<{
    use?: string;
    system?: string;
    value: string;
  }>;
  active?: boolean;
  name?: Array<{
    use?: string;
    family?: string;
    given?: string[];
  }>;
  telecom?: Array<{
    system: string;
    value: string;
    use?: string;
  }>;
  gender?: "male" | "female" | "other" | "unknown";
  birthDate?: string;
  address?: Array<{
    use?: string;
    line?: string[];
    city?: string;
    state?: string;
    postalCode?: string;
    country?: string;
  }>;
}

export interface FHIRResearchStudy {
  resourceType: "ResearchStudy";
  id?: string;
  identifier?: Array<{
    use?: string;
    system?: string;
    value: string;
  }>;
  status: "active" | "administratively-completed" | "approved" | "closed-to-accrual" | "closed-to-accrual-and-intervention" | "completed" | "disapproved" | "in-review" | "temporarily-closed-to-accrual" | "temporarily-closed-to-accrual-and-intervention" | "withdrawn";
  category?: Array<{
    coding?: Array<{
      system?: string;
      code?: string;
      display?: string;
    }>;
  }>;
  title?: string;
  protocol?: Array<{
    reference?: string;
  }>;
  partOf?: Array<{
    reference?: string;
  }>;
  description?: string;
  enrollment?: Array<{
    reference?: string;
  }>;
  period?: {
    start?: string;
    end?: string;
  };
  sponsor?: {
    reference?: string;
  };
  principalInvestigator?: {
    reference?: string;
  };
  site?: Array<{
    reference?: string;
  }>;
}

export interface FHIRResearchSubject {
  resourceType: "ResearchSubject";
  id?: string;
  identifier?: Array<{
    use?: string;
    system?: string;
    value: string;
  }>;
  status: "candidate" | "eligible" | "follow-up" | "ineligible" | "not-registered" | "off-study" | "on-study" | "on-study-intervention" | "on-study-observation" | "pending-on-study" | "potential-candidate" | "screening" | "withdrawn";
  period?: {
    start?: string;
    end?: string;
  };
  study: {
    reference: string;
  };
  individual: {
    reference: string;
  };
  assignedArm?: string;
  actualArm?: string;
  consent?: {
    reference?: string;
  };
}

export interface FHIRObservation {
  resourceType: "Observation";
  id?: string;
  identifier?: Array<{
    use?: string;
    system?: string;
    value: string;
  }>;
  status: "registered" | "preliminary" | "final" | "amended" | "corrected" | "cancelled" | "entered-in-error" | "unknown";
  category?: Array<{
    coding?: Array<{
      system?: string;
      code?: string;
      display?: string;
    }>;
  }>;
  code: {
    coding?: Array<{
      system?: string;
      code?: string;
      display?: string;
    }>;
    text?: string;
  };
  subject: {
    reference: string;
  };
  encounter?: {
    reference?: string;
  };
  effectiveDateTime?: string;
  effectivePeriod?: {
    start?: string;
    end?: string;
  };
  issued?: string;
  performer?: Array<{
    reference?: string;
  }>;
  valueQuantity?: {
    value?: number;
    unit?: string;
    system?: string;
    code?: string;
  };
  valueCodeableConcept?: {
    coding?: Array<{
      system?: string;
      code?: string;
      display?: string;
    }>;
    text?: string;
  };
  valueString?: string;
  valueBoolean?: boolean;
  valueInteger?: number;
  valueRange?: {
    low?: {
      value?: number;
      unit?: string;
    };
    high?: {
      value?: number;
      unit?: string;
    };
  };
  component?: Array<{
    code: {
      coding?: Array<{
        system?: string;
        code?: string;
        display?: string;
      }>;
    };
    valueQuantity?: {
      value?: number;
      unit?: string;
    };
    valueString?: string;
  }>;
}

export interface FHIRQuestionnaireResponse {
  resourceType: "QuestionnaireResponse";
  id?: string;
  identifier?: {
    use?: string;
    system?: string;
    value: string;
  };
  basedOn?: Array<{
    reference?: string;
  }>;
  partOf?: Array<{
    reference?: string;
  }>;
  questionnaire?: string;
  status: "in-progress" | "completed" | "amended" | "entered-in-error" | "stopped";
  subject?: {
    reference?: string;
  };
  encounter?: {
    reference?: string;
  };
  authored?: string;
  author?: {
    reference?: string;
  };
  source?: {
    reference?: string;
  };
  item?: Array<{
    linkId: string;
    definition?: string;
    text?: string;
    answer?: Array<{
      valueBoolean?: boolean;
      valueDecimal?: number;
      valueInteger?: number;
      valueDate?: string;
      valueDateTime?: string;
      valueTime?: string;
      valueString?: string;
      valueUri?: string;
      valueAttachment?: {
        contentType?: string;
        language?: string;
        data?: string;
        url?: string;
        size?: number;
        hash?: string;
        title?: string;
        creation?: string;
      };
      valueCoding?: {
        system?: string;
        version?: string;
        code?: string;
        display?: string;
        userSelected?: boolean;
      };
      valueQuantity?: {
        value?: number;
        comparator?: string;
        unit?: string;
        system?: string;
        code?: string;
      };
      valueReference?: {
        reference?: string;
      };
      item?: Array<any>;
    }>;
    item?: Array<any>;
  }>;
}

// Bundle for batch operations
export interface FHIRBundle {
  resourceType: "Bundle";
  id?: string;
  meta?: {
    lastUpdated?: string;
  };
  type: "document" | "message" | "transaction" | "transaction-response" | "batch" | "batch-response" | "history" | "searchset" | "collection";
  timestamp?: string;
  total?: number;
  link?: Array<{
    relation: string;
    url: string;
  }>;
  entry?: Array<{
    link?: Array<{
      relation: string;
      url: string;
    }>;
    fullUrl?: string;
    resource?: FHIRPatient | FHIRResearchStudy | FHIRResearchSubject | FHIRObservation | FHIRQuestionnaireResponse;
    search?: {
      mode?: string;
      score?: number;
    };
    request?: {
      method: "GET" | "POST" | "PUT" | "DELETE";
      url: string;
      ifNoneMatch?: string;
      ifModifiedSince?: string;
      ifMatch?: string;
      ifNoneExist?: string;
    };
    response?: {
      status: string;
      location?: string;
      etag?: string;
      lastModified?: string;
      outcome?: any;
    };
  }>;
}

// Export formats
export interface FHIRExportRequest {
  resourceTypes?: string[];
  since?: string;
  type?: string;
  _outputFormat?: string;
  _since?: string;
  patient?: string[];
}

export interface FHIRExportStatus {
  transactionTime: string;
  request: string;
  requiresAccessToken: boolean;
  output: Array<{
    type: string;
    url: string;
    count?: number;
  }>;
  error?: Array<{
    type: string;
    url: string;
    count?: number;
  }>;
}