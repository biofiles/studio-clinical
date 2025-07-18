// CDISC ODM (Operational Data Model) Types
export interface CDISCODMStudy {
  oid: string;
  name: string;
  description?: string;
  protocolName: string;
  metaDataVersion: CDISCMetaDataVersion;
  clinicalData?: CDISCClinicalData[];
}

export interface CDISCMetaDataVersion {
  oid: string;
  name: string;
  description?: string;
  studyEventDefs: CDISCStudyEventDef[];
  formDefs: CDISCFormDef[];
  itemGroupDefs: CDISCItemGroupDef[];
  itemDefs: CDISCItemDef[];
  codeListDefs: CDISCCodeListDef[];
}

export interface CDISCStudyEventDef {
  oid: string;
  name: string;
  repeating: 'Yes' | 'No';
  type: 'Scheduled' | 'Unscheduled' | 'Common';
  formRefs: CDISCFormRef[];
}

export interface CDISCFormDef {
  oid: string;
  name: string;
  repeating: 'Yes' | 'No';
  itemGroupRefs: CDISCItemGroupRef[];
}

export interface CDISCItemGroupDef {
  oid: string;
  name: string;
  repeating: 'Yes' | 'No';
  domain?: string;
  purpose?: 'Tabulation' | 'Analysis';
  itemRefs: CDISCItemRef[];
}

export interface CDISCItemDef {
  oid: string;
  name: string;
  dataType: 'text' | 'integer' | 'float' | 'date' | 'datetime' | 'time' | 'boolean';
  length?: number;
  significantDigits?: number;
  codeListRef?: string;
  question?: CDISCQuestion;
}

export interface CDISCFormRef {
  formOid: string;
  mandatory: 'Yes' | 'No';
  orderNumber?: number;
}

export interface CDISCItemGroupRef {
  itemGroupOid: string;
  mandatory: 'Yes' | 'No';
  orderNumber?: number;
}

export interface CDISCItemRef {
  itemOid: string;
  mandatory: 'Yes' | 'No';
  orderNumber?: number;
  keySequence?: number;
}

export interface CDISCCodeListDef {
  oid: string;
  name: string;
  dataType: string;
  codeListItems: CDISCCodeListItem[];
}

export interface CDISCCodeListItem {
  codedValue: string;
  decode: string;
}

export interface CDISCQuestion {
  text: string;
}

// CDISC Clinical Data Types
export interface CDISCClinicalData {
  studyOid: string;
  metaDataVersionOid: string;
  subjectData: CDISCSubjectData[];
}

export interface CDISCSubjectData {
  subjectKey: string;
  studyEventData: CDISCStudyEventData[];
}

export interface CDISCStudyEventData {
  studyEventOid: string;
  studyEventRepeatKey?: string;
  formData: CDISCFormData[];
}

export interface CDISCFormData {
  formOid: string;
  formRepeatKey?: string;
  itemGroupData: CDISCItemGroupData[];
}

export interface CDISCItemGroupData {
  itemGroupOid: string;
  itemGroupRepeatKey?: string;
  itemData: CDISCItemData[];
}

export interface CDISCItemData {
  itemOid: string;
  value: string | number | boolean | null;
}

// CDISC SDTM Domain Types
export interface CDISCSDTMDomain {
  domain: string;
  records: CDISCSDTMRecord[];
}

export interface CDISCSDTMRecord {
  STUDYID: string;
  DOMAIN: string;
  USUBJID: string;
  [key: string]: string | number | Date | null;
}

// Demographics (DM) Domain
export interface CDISCDMRecord extends CDISCSDTMRecord {
  RFSTDTC?: string; // Reference Start Date/Time
  RFENDTC?: string; // Reference End Date/Time
  SITEID?: string;
  AGE?: number;
  AGEU?: string;
  SEX?: string;
  RACE?: string;
  ETHNIC?: string;
  COUNTRY?: string;
  DTHFL?: string;
  DTHDTC?: string;
}

// Adverse Events (AE) Domain
export interface CDISCAERecord extends CDISCSDTMRecord {
  AESEQ: number;
  AETERM: string;
  AEDECOD?: string;
  AESOC?: string;
  AESEV?: string;
  AESER?: string;
  AEREL?: string;
  AEACN?: string;
  AEOUT?: string;
  AESTDTC?: string;
  AEENDTC?: string;
}

// Questionnaires (QS) Domain
export interface CDISCQSRecord extends CDISCSDTMRecord {
  QSSEQ: number;
  QSCAT?: string;
  QSSCAT?: string;
  QSTEST: string;
  QSTESTCD: string;
  QSORRES?: string;
  QSORRESU?: string;
  QSSTRESC?: string;
  QSSTRESN?: number;
  QSSTRESU?: string;
  QSDTC?: string;
  VISITNUM?: number;
  VISIT?: string;
}

// Vital Signs (VS) Domain
export interface CDISCVSRecord extends CDISCSDTMRecord {
  VSSEQ: number;
  VSTEST: string;
  VSTESTCD: string;
  VSORRES?: string;
  VSORRESU?: string;
  VSSTRESC?: string;
  VSSTRESN?: number;
  VSSTRESU?: string;
  VSDTC?: string;
  VSPOS?: string;
  VSLOC?: string;
  VISITNUM?: number;
  VISIT?: string;
}

// Disposition (DS) Domain
export interface CDISCDSRecord extends CDISCSDTMRecord {
  DSSEQ: number;
  DSTERM: string;
  DSDECOD?: string;
  DSCAT?: string;
  DSSCAT?: string;
  DSSTDTC?: string;
  DSENDTC?: string;
}

// Export Request and Status Types
export interface CDISCExportRequest {
  studyId: string;
  domains: string[];
  format: 'ODM' | 'SDTM' | 'ADaM';
  includeMetadata: boolean;
  includeDefineXML: boolean;
}

export interface CDISCExportStatus {
  requestId: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  progress: number;
  message?: string;
  downloadUrl?: string;
  createdAt: string;
  completedAt?: string;
  error?: string;
}

// Validation Types
export interface CDISCValidationResult {
  isValid: boolean;
  errors: CDISCValidationError[];
  warnings: CDISCValidationWarning[];
  summary: CDISCValidationSummary;
}

export interface CDISCValidationError {
  domain: string;
  record?: number;
  variable?: string;
  rule: string;
  message: string;
  severity: 'Error' | 'Warning' | 'Info';
}

export interface CDISCValidationWarning {
  domain: string;
  record?: number;
  variable?: string;
  rule: string;
  message: string;
}

export interface CDISCValidationSummary {
  totalRecords: number;
  validRecords: number;
  errorCount: number;
  warningCount: number;
  complianceScore: number;
  domainsProcessed: string[];
}

// CDISC-FHIR Mapping Types
export interface CDISCFHIRMapping {
  fhirResourceType: string;
  cdiscDomain: string;
  mappingRules: CDISCMappingRule[];
}

export interface CDISCMappingRule {
  fhirPath: string;
  cdiscVariable: string;
  transformation?: string;
  defaultValue?: string;
  required: boolean;
}