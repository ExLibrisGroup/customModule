export interface PrimoViewModel {
  onlineLinks: Link[];
  consolidatedCoverage: string;
  directLink: string;
  ariaLabel: string;
}

export interface Link {
  source: string; // quicklink
  type: string; // PDF, HTML
  url: string;
}
