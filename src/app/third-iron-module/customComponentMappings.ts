import { ThirdIronButtonsComponent } from './third-iron-buttons/third-iron-buttons.component';
import { ThirdIronJournalCoverComponent } from './third-iron-journal-cover/third-iron-journal-cover.component';

// Define the map
export const selectorComponentMap = new Map<string, any>([
  ['nde-online-availability-before', ThirdIronButtonsComponent],
  ['nde-record-image-before', ThirdIronJournalCoverComponent],
]);
