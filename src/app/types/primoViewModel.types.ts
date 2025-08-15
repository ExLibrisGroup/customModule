import { ButtonType } from '../shared/button-type.enum';
import { EntityType } from '../shared/entity-type.enum';
import { IconType } from '../shared/icon-type.enum';

export interface PrimoViewModel {
  onlineLinks: OnlineLink[];
  consolidatedCoverage: string;
  directLink: string;
  ariaLabel: string;
}

export interface OnlineLink {
  type: 'PDF' | 'HTML' | 'directLink'; // PDF, HTML, directLink, plus TI EntityType (Article, Journal, Unknown)
  url: string;
  ariaLabel?: string;
  source?: string; // quicklink, directLink
  label?: string; // Get PDF, Read Online, Other online options
}

export type LinkEntityType = 'PDF' | 'HTML' | 'directLink' | EntityType;

// used for the combined link values from the Primo viewModel and Third Iron display options
export interface CombinedLink {
  entityType: LinkEntityType; // PDF, HTML, directLink, plus TI EntityType (Article, Journal, Unknown)
  url: string;
  ariaLabel?: string;
  icon?: IconType; // Third Iron icons
  label?: string;
  mainButtonType?: ButtonType; // Third Iron button types
  showSecondaryButton?: boolean;
  source?: string; // quicklink, directLink, thirdIron
}
