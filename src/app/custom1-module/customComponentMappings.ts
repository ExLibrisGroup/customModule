import { TeWaharoaComponent } from '../te-waharoa/te-waharoa.component' //needed

// Define the map
export const selectorComponentMap = new Map<string, any>([
    ['nde-recommendations-before', TeWaharoaComponent], // assuming that the component is imported correctly
    ['nde-recommendations-after', TeWaharoaComponent],
]);
