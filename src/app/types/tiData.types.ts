export interface ApiResult {
  body: ResponseBody;
  meta?: MetaObject;
  ok: boolean;
  status: number;
  type?: number;
  url: string;
}

export interface ResponseBody {
  data: ArticleData | JournalData;
  included?: JournalData | JournalData[];
}

export interface MetaObject {
  avoidUnpaywall?: boolean;
}

export interface ArticleData {
  authors: string;
  availableThroughBrowzine: boolean;
  bestIntegratorLink: string;
  browzineWebLink?: string;
  contentLocation: string;
  date: string;
  doi: string;
  expressionOfConcernNoticeUrl?: string;
  fullTextFile: string;
  id: number;
  inPress: boolean;
  openAccess: boolean;
  title: string;
  type: string;
  unpaywallUsable: boolean;
  problematicJournalArticleNoticeUrl?: string;
  retractionNoticeUrl?: string;
}

export interface JournalData {
  browzineEnabled: boolean;
  browzineWebLink?: string;
  coverImageUrl: string;
  id: string;
  issn: string;
  sjrValue: string;
  title: string;
  type: string;
}
