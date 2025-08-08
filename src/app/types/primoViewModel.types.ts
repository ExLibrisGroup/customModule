export interface PrimoViewModel {
  onlineLinks: OnlineService[];
  consolidatedCoverage: string;
  directLink: string;
  ariaLabel: string;
}

// export interface Link {
//   source: string; // quicklink
//   type: string; // PDF, HTML
//   url: string;
// }

export interface OnlineService {
  type: string;
  url: string;
  ariaLabel?: string;
  source?: string;
  label?: string;
}
