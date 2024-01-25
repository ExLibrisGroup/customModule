import { createFeatureSelector, createSelector } from "@ngrx/store";
import {viewConfigFeatureName, ViewConfigState} from "./viewConfig.reducer";
import {AttributesMap} from "../../models/view-config.model";
import { COMMA, EMPTY_STRING } from "src/app/infra/string.const";

const selectViewConfigFeature = createFeatureSelector<ViewConfigState>(viewConfigFeatureName);

export const selectViewConfigLoadingStatus = createSelector(
    selectViewConfigFeature,
    viewConfig => viewConfig.status
);

const selectViewConfigData = createSelector(
    selectViewConfigFeature,
    viewConfig => viewConfig.config
)

export const selectCurrentConfigVid = createSelector(
    selectViewConfigData,
    viewConfigData => viewConfigData?.vid
)

const selectPrimoView = createSelector(
    selectViewConfigData,
    (config) => config?.['primo-view']
)

const selectPrimoViewAttributesMap = createSelector(
    selectPrimoView,
    (primoView) => primoView?.['attributes-map']
)

export const selectPrimoViewAttribute = <K extends keyof AttributesMap, T extends AttributesMap[K]>(attributeName: K) =>
    createSelector(
        selectPrimoViewAttributesMap,
        (attributeMap) => attributeMap?.[attributeName] as T
    );

export const selectAvailableLanguages = createSelector(
    selectPrimoViewAttribute('interfaceLanguageOptions'),
    (languages) => (languages ?? EMPTY_STRING).split(COMMA)
)

export const selectViewConfigTiles = createSelector(
    selectViewConfigData,
    viewConfigObj => viewConfigObj?.tiles
)

export const selectViewConfigCustomization = createSelector(
  selectViewConfigData,
  viewConfigObj => viewConfigObj?.customization
)
export const selectViewConfigCustomizationResourceIcons = createSelector(
  selectViewConfigCustomization,
  customizaiton => customizaiton?.resourceIcons
)
export const selectViewConfigMainMenuTile =(key: string) => createSelector(
    selectViewConfigTiles,
    tiles => tiles?.MainMenuTileInterface[key]
)

export const selectViewConfigMainMenuTileForCurrentVid = createSelector(
    selectCurrentConfigVid,
    selectViewConfigTiles,
    (vid, tiles) =>
        vid ? tiles?.MainMenuTileInterface[vid + '.MainMenuTileInterface'] : undefined
)
export const selectMainMenuTileMainView = createSelector(
    selectViewConfigMainMenuTileForCurrentVid,
    MenuTileMainViewSelector => MenuTileMainViewSelector?.mainview
)

export const selectPrimoViewScopesMap = createSelector(
    selectPrimoView,
    (primoView) => primoView?.scopes
)

const selectMappingTables = createSelector(
  selectViewConfigData,
  (config) => config?.['mapping-tables']
)

const selectPrimoViewPropertiesMap = createSelector(
  selectMappingTables,
  (mappingTables) =>
    mappingTables?.['View Properties']
)

export const selectActionsListMap = createSelector(
  selectMappingTables,
  (mappingTables) =>
    mappingTables?.['Actions List']
)

const selectViewProperty = (keyToFind: string) => createSelector(
  selectPrimoViewPropertiesMap,
  selectCurrentConfigVid,
  (viewProperties, vid) => viewProperties
    ?.find(mt => (mt.source1 === vid) && (mt.source2 === keyToFind))
)

export const selectIsViewPropertyEnabled = (keyToFind: string) => createSelector(
  selectViewProperty(keyToFind),
  mt => mt && (mt.target === 'true')
)

export const selectPrimoViewInstitutionCode = createSelector(
  selectPrimoView,
  (primoView) => primoView?.institution['institution-code']
)

export const selectCitationStyles = createSelector(
  selectMappingTables,
  (mappingTables) =>
    mappingTables?.['Citation styles']
)

