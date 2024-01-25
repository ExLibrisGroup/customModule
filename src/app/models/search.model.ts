import {LoadingStatus} from "../state/state.const";

export type stringBoolean= "N" | "Y";
export interface SearchParams {
  searchTerm: string,
  scope: string,
  skipDelivery?: stringBoolean
}

export type SearchMetaData = Omit<SearchData, 'docs'>;
export interface SearchData {
  beaconO22:  string;
  info:       Info;
  highlights: Highlights;
  docs:       Doc[];
  timelog:    Timelog;
}

export interface Doc {
  context:   Context;
  adaptor:   Adaptor;
  "@id":     string;
  pnx:       Pnx;
  delivery?: DocDelivery;
  deliveryStatus: LoadingStatus;
  extras?:   Extras;
  enrichment?: Enrichment;
}

export enum Adaptor {
  LocalSearchEngine = "Local Search Engine",
  PrimoCentral = "Primo Central",
}

export enum Context {
  L = "L",
  PC = "PC",
}

export interface DocDelivery {
  // link:                    any[];
  deliveryCategory:        string[];
  availability:            string[];
  displayLocation:         boolean;
  additionalLocations:     boolean;
  physicalItemTextCodes:   string;
  feDisplayOtherLocations: boolean;
  displayedAvailability:   string;
  // holding:                 any[];
  almaOpenurl:             string;
}

export interface Extras {
  citationTrails: CitationTrails;
  timesCited:     TimesCited;
}

export interface CitationTrails {
  citing:  string[];
  citedby: string[];
}

export interface TimesCited {
  dummy : string
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
}

export enum Sourceformat {
  Marc21 = "MARC21",
  XML = "XML",
}

export enum Sourcesystem {
  Ils = "ILS",
  Other = "Other",
}

export interface PnxDelivery {
  fulltext:    string[];
  delcategory: string[];
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
}

export interface RecordMainDetailsIfc {
  pnx: Pnx;
}

export interface Sort {
  title:        string[];
  author?:      string[];
  creationdate: string[];
}

export interface Highlights {
  general:     string[];
  creator:     string[];
  contributor: string[];
  subject:     string[];
  title:       string[];
  addtitle:    string[];
  termsUnion:  string[];
  snippet:     string[];
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
