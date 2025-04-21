export type ApiResult = {
  body: ResponseBody;
  meta?: MetaObject;
  ok: boolean;
  status: number;
  type: number;
  url: string;
};

export type ResponseBody = {
  data: Data;
  included: object | object[];
};

export type MetaObject = {
  avoidUnpaywall?: boolean;
};

export type Data = {
  journal?: Journal | Journal[];
  browzineWebLink?: string;
  browzineEnabled?: boolean;
  contentLocation?: string;
  coverImageUrl?: string;
  expressionOfConcernNoticeUrl?: string;
  fullTextFile?: string;
  unpaywallUsable?: boolean;
  problematicJournalArticleNoticeUrl?: string;
  retractionNoticeUrl?: string;
};

export type Journal = {
  browzineEnabled?: boolean;
  coverImageUrl?: string;
};
