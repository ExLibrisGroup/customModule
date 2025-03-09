import {LoadingStatus} from "../state/state.const";

export type stringBoolean= "N" | "Y";
export interface SearchParams {
  q: string,
  scope: string,
  skipDelivery?: stringBoolean,
  offset?: number,
  limit?: number,
  sort?: string,
  inst?: string,
  refEntryActive?: boolean,
  disableCache?: boolean,
  newspapersActive?: boolean,
  qInclude?: string[],
  qExclude?: string[],
  multiFacets?: string[],
  pfilter?: string,
  tab?: string,
  mode?: string,
  isCDSearch?: boolean,
  pcAvailability?: boolean,
  searchInFulltextUserSelection?: boolean
}

export interface SearchParamsWithStrParams extends Omit<SearchParams, 'qInclude' | 'qExclude'> {
  qInclude?: string; // Change qInclude to a string
  qExclude?: string; // Change qInclude to a string
}

export type SearchMetaData = Omit<SearchData, 'docs'>;
export interface SearchData {
  beaconO22:  string;
  info:       Info;
  highlights: Highlights;
  docs:       Doc[];
  facets?:    Facet[];
  timelog:    Timelog;
  did_u_mean?:  string;
}

export interface FullDisplayQueryParams {
  docid: string;
  context?: Context;
  adaptor?: Adaptor;
  isFrbr?: boolean;
  search_scope?: string;
  isHighlightedRecord?: boolean;
  tab?: string;
  vid?: string;
  state?: string;
}

export interface FullDisplayParams {
  docid: string;
  context?: Context;
  adaptor?: Adaptor;
  isFrbr?: boolean;
  scope?: string;
  isHighlightedRecord?: boolean;
}

export interface Doc {
  context:   Context;
  adaptor:   Adaptor;
  "@id":     string;
  pnx:       Pnx;
  extras?:   Extras;
  enrichment?: Enrichment;
  thumbnailForCD?: ThumbnailForCD;
  unpaywallStatus?: LoadingStatus;
  delivery?: DocDelivery;
  expired?: boolean; // indicates the record should be reloaded
}

export enum Adaptor {
  LocalSearchEngine = "Local Search Engine",
  PrimoCentral = "Primo Central",
  PrimoVeDeepSearch = "Primo VE Deep Search",
  EbscoLocal = "EbscoLocal",
  WorldCatLocal = 'WorldCatLocal',
  SummonLocal = 'SummonLocal',
  SearchWebhook = 'SearchWebhook',
  WebHook = 'WEBHOOK',
}

export enum Context {
  L = "L",
  PC = "PC",
  SP = "SP",
  U = "U"
}

export interface ThumbnailForCD {
  link?: DeliveryLink[];
  hasD?: boolean;
}

export interface IEDeliveryRecord {
  recId: string;
  sharedDigitalCandidates: string[] | null;
}


export interface MergedDelivery {
  docDelivery: DocDelivery;
  recordId: string;
}

export interface ElectronicService {
  adaptorid: string
  ilsApiId: string
  serviceUrl: string
  licenceExist: string
  packageName: string
  availiability: string
  authNote: string
  publicNote: string
  hasAccess: boolean
  serviceType: string
  registrationRequired: boolean
  numberOfFiles: number
  cdlItemAvailable: boolean
  cdl: boolean
  parsedAvailability: string[]
  licenceUrl: string
  relatedTitle: string;
  serviceDescription?: string;
  deniedNote?: string;
  fileType?: string;
  firstFileSize?: string;
  representationEntityType? : string
  contextServiceId? : string
  publicAccessModel?: string
}

export interface AdditionalElectronicService {
  OpenURL: ElectronicService[]
  LinktorsrcOA: ElectronicService[]
  LinktorsrcNonOA: ElectronicService[]
  RelatedServices: ElectronicService[]
}


export interface DocDelivery {
  link?:                   DeliveryLink[];
  deliveryCategory:        string[];
  availability:            string[];
  availabilityLinks?:      string[];
  availabilityLinksUrl?:   string[];
  displayLocation:         boolean;
  additionalLocations:     boolean;
  physicalItemTextCodes:   string;
  feDisplayOtherLocations: boolean;
  displayedAvailability:   string;
  holding?:                Location[];
  almaOpenurl:             string;
  electronicServices?:     ElectronicService[];
  additionalElectronicServices?: AdditionalElectronicService
  recordInstitutionCode:   string;
  sharedDigitalCandidates: string[];
  hasD?:                   boolean;
  digitalAuxiliaryMode?:   boolean;
  bestlocation?:           Location;
  serviceMode?:            string[];
  consolidatedCoverage?:   string;
  isFilteredHoldings?:     boolean;
  physicalServiceId?:      string;
  recordOwner?:            string;
  GetIt1: GetIt1[];
  hideResourceSharing: boolean;
  almaInstitutionsList?: AlmaInstitutionsList[];
  hasFilteredServices?: string;
  electronicContextObjectId?: string;
}

export interface AlmaInstitutionsList {
  availabilityStatus: string;
  envURL: string;
  getitLink: string[];
  instCode: string;
  instId: string;
  instName: string;
}

export interface Location {
  organization:      string;
  libraryCode:       string;
  mainLocation:       string;
  subLocation:       string;
  callNumber:        string;
  availabilityStatus: string;
  ilsApiId?:          string;
  isValidUser?:       boolean;
  subLocationCode:   string;
  matchForHoldings?:  MatchForHolding[];
  holdId:            string;
  holKey:            string;
  stackMapUrl?:       string;
  relatedTitle?:      string;
}

export interface MatchForHolding {
  matchOn:        string;
  holdingRecord:  string;
}

export interface Extras {
  citationTrails: CitationTrails;
  timesCited:     TimesCited;
}

export interface DeliveryLink {
  displayLabel?: string;
  linkType?: string;
  linkURL?: string;
  '@id'?: string;
  publicNote?: string
}
export interface CitationTrails {
  citing:  string[];
  citedby: string[];
}

export interface TimesCited {
  scopus?:     Scopus;
  wos?:        WebOfScience;
}

export interface  Scopus {
  citedRedId?:    string;
  extensionVal?:  string;
}

export interface WebOfScience {
  citedRedId?:    string;
  extensionVal?:  string;
  wosFinalLink?:  string;
}

export interface Pnx {
  display:   { [key: string]: string[] };
  control:   Control;
  addata:    { [key: string]: string[] };
  sort:      Sort;
  facets:    { [key: string]: string[] };
  links?:    Links;
  search?:   { [key: string]: string[] };
  delivery?: PnxDelivery;
}

export interface Control {
  sourcerecordid:   string[];
  recordid:         string[];
  sourceid:         string[] | string;
  originalsourceid: string[];
  gtiid?:           string[];
  sourcesystem:     Sourcesystem[];
  sourceformat:     Sourceformat[];
  score:            Array<number | string>;
  isDedup?:         boolean;
  save_score?:      number[];
  recordtype?:      string[];
  sourcetype?:      string[];
  pqid?:            string[];
  addsrcrecordid?:  string[];
  jstorid?:         string[];
  galeid?:          string[];
  attribute?:       string[];
  rapidosourcerecordid? : string;
  networklinkedrecordid? : string;
  colldiscovery?:   string[];
}

export enum Sourceformat {
  Marc21 = "MARC21",
  XML = "XML",
  ESPLORO = 'ESPLORO'
}

export enum Sourcesystem {
  Ils = "ILS",
  Other = "Other",
}

export interface PnxDelivery {
  fulltext:    string[];
  delcategory: string[];
  availabilityLinkUrl: string;
}

export interface Links {
  openurl:               string[];
  linktorsrc?:           string[];
  thumbnail:             string[];
  linktohtml:            string[];
  openurlfulltext:       string[];
  linktopdf?:            string[];
  backlink?:             string[];
  linktorsrcadditional?: string[];
  openurladditional?:    string[];
  unpaywalllink?:        string[];
}

export interface GetItLinks {
  '@id': string,
  adaptorid: string,
  displayText: string | null,
  getItTabText: string,
  ilsApiId: string,
  inst4opac: string,
  isLinktoOnline: boolean,
  link: string
}

export interface GetIt1 {
  category: string,
  links: GetItLinks[]
}

export interface RecordMainDetailsIfc {
  pnx: Pnx;
}

export interface Sort {
  title:        string[];
  author?:      string[];
  creationdate: string[];
}

export interface  Facets {
  beaconO22: string;
  facets:    Facet[];
}

export interface Facet {
  name:   string;
  values: FacetValue[];
}

export interface FacetValue {
  value: string;
  count: number;
}

export interface Highlights {
  general:        string[];
  creator:        string[];
  contributor:    string[];
  subject:        string[];
  title:          string[];
  addtitle:       string[];
  alttitle:       string[];
  vertitle:       string[];
  termsUnion:     string[];
  snippet:        string[];
}

export interface Info {
  totalResultsLocal: number;
  totalResultsPC:    number;
  total:             number;
  first:             number;
  last:              number;
}

export interface Timelog {
  BUILD_RESULTS_RETRIVE_FROM_DB:                 string;
  CALL_SOLR_GET_IDS_LIST:                        string;
  RETRIVE_FROM_DB_COURSE_INFO:                   string;
  RETRIVE_FROM_DB_RECORDS:                       string;
  RETRIVE_FROM_DB_RELATIONS:                     string;
  PRIMA_LOCAL_INFO_FACETS_BUILD_DOCS_HIGHLIGHTS: string;
  PRIMA_LOCAL_SEARCH_TOTAL:                      string;
  PC_SEARCH_CALL_TIME:                           string;
  PC_BUILD_JSON_AND_HIGLIGHTS:                   string;
  PC_SEARCH_TIME_TOTAL:                          string;
  BUILD_BLEND_AND_CACHE_RESULTS:                 number;
  BUILD_COMBINED_RESULTS_MAP:                    number;
  COMBINED_SEARCH_TIME:                          number;
  PROCESS_COMBINED_RESULTS:                      number;
  FEATURED_SEARCH_TIME:                          number;
}

export interface Enrichment {
  virtualBrowseObject:    VirtualBrowseObject;
  bibVirtualBrowseObject: VirtualBrowseObject;
}

export interface VirtualBrowseObject {
  isVirtualBrowseEnabled: boolean;
  callNumber:             string;
  callNumberBrowseField:  string;
}

export type IgnoreMapSimpleString = {
  [key: string]: string;
}

export type IgnoreMapSimpleBoolean = {
  [key: string]: boolean;
}

export type IgnoreMapMulti = {
  [key: string]: number | string | string[] | undefined | null;
}



