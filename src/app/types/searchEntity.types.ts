export type SearchEntity = {
  pnx: PNX;
};

export type PNX = {
  addata: AdData;
  display: Display;
};

export type Display = {
  title: string[];
  type: string[];
  oa: string[] | undefined;
};

export type AdData = {
  issn: string[];
  eissn: string[];
  doi: string[];
};
