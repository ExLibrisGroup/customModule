export interface PrimoViewModel {
  onlineLinks: OnlineLink[];
  consolidatedCoverage: string;
  directLink: string;
  ariaLabel: string;
}

export interface OnlineLink {
  type: string; // PDF, HTML, directLink
  url: string;
  ariaLabel?: string;
  source?: string; // quicklink, directLink
  label?: string; // Get PDF, Read Online, Other online options
}
