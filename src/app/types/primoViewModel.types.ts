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
  type: string; // PDF, HTML, directLink
  url: string;
  ariaLabel?: string;
  source?: string; // quicklink, directLink
  label?: string; // Get PDF, Read Online, Other online options
}
