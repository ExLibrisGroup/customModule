import { FullDisplayDetailsComponentDist } from "../full-display-details/full-display-details.component";
import { TestAfterComponent } from "../test-after/test-after.component";
import { TestBeforeComponent } from "../test-before/test-before.component";
import { TestBottomComponent } from "../test-bottom/test-bottom.component";
import { TestTopComponent } from "../test-top/test-top.component";

// Define the map
export const selectorComponentMap = new Map<string, any>([
  ["nde-full-display-details",FullDisplayDetailsComponentDist],
  ["nde-full-display-details-after",TestAfterComponent],
  ["nde-full-display-details-top",TestTopComponent],
  ["nde-full-display-details-before",TestBeforeComponent],
  ["nde-full-display-details-bottom",TestBottomComponent]



]);
