export interface UnpaywallResponse {
  body: UnpaywallData;
  meta?: MetaObject;
  ok: boolean;
  status: number;
  type?: number;
  url: string;
}

export interface MetaObject {
  avoidUnpaywall?: boolean;
}

export interface UnpaywallData {
  best_oa_location: BestOALocation | null;
  // data_standard: number;
  // doi: string;
  // doi_url: string;
  // first_oa_location: string | null;
  // genre: string;
  // has_repository_copy: boolean;
  // is_oa: boolean;
  // is_paratext: boolean;
  // journal_is_in_doaj: boolean;
  // journal_is_oa: boolean;
  // journal_issn_l: string;
  // journal_issns: string;
  // journal_name: string;
  // oa_locations: string[];
  // oa_locations_embargoed: string[];
  // oa_status: string;
  // published_date: string;
  // publisher: string;
  // title: string;
  // updated: string;
  // year: number;
}

export interface BestOALocation {
  host_type: string;
  version: string;
  url_for_pdf: string;
  url_for_landing_page: string;
}
