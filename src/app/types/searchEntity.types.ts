export interface SearchEntity {
  pnx: PNX;
}

export interface PNX {
  addata: AdData;
  display: Display;
}

export interface Display {
  title: string[];
  type: string[];
  oa?: string[];
}

export interface AdData {
  issn?: string[];
  eissn?: string[];
  doi?: string[];
}
