import { ButtonType } from '../shared/button-type.enum';
import { EntityType } from '../shared/entity-type.enum';

export type DisplayWaterfallResponse = {
  entityType: EntityType;
  mainButtonType: ButtonType;
  mainUrl: string;
  showSecondaryButton?: boolean;
  secondaryUrl?: string;
  browzineUrl?: string;
  showBrowzineButton?: boolean;
};
