export type ApiResult = {
  data: Data | Data[];
  included: object | object[];
};

export type Data = {
  journal?: Journal | Journal[];
  browzineWebLink?: string;
  browzineEnabled?: boolean;
  contentLocation?: string;
  coverImageUrl?: string;
  expressionOfConcernNoticeUrl?: string;
  fullTextFile?: string;
  problematicJournalArticleNoticeUrl?: string;
  retractionNoticeUrl?: string;
};

export type Journal = {
  browzineEnabled?: boolean;
  coverImageUrl?: string;
};
