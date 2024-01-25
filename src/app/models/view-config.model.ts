/* eslint-disable */
export interface ViewConfigData {
    beaconO22:                         string;
    vid:                               string
    "primo-view":                      PrimoView;
    tiles:                             Tiles;
    "system-configuration":            SystemConfiguration;
    "mapping-tables":                  MappingTables;
    authentication:                    Authentication[];
    "scopes-context-map":              ScopesContextMap;
    backend_system:                    string;
    customization:                     Customization;
    UIComponents:                      UIComponents;
    queryTerms:                        { [key: string]: string[] };
    "bx-enable":                       boolean;
    "tab-to-tiles":                    TabToTiles;
    searchWithinJournalConfig:         SearchWithinJournalConfig;
    journal_tab:                       string;
    "institution-base-url":            string;
    fieldsWithUseTranslation:          any[];
    summon_over_alma:                  boolean;
    rapido_sa_enabled:                 boolean;
    "syndeticunbound-enable":          boolean;
    enableSingleLogout:                boolean;
    enableExtendSession:               boolean;
    enableExtendSessionToMax:          boolean;
    enableUserSettingForExtendSession: boolean;
    useEsploroFullAssetPage:           boolean;
    useEsploroSearchPage:              boolean;
    "feature-flags":                   { [key: string]: boolean };
    "country-codes":                   string[];
    discovery_services_page:           boolean;
    discovery_local_no_login:          boolean;
    discovery_with_external_no_login:  boolean;
}

export interface UIComponents {
    "583209347UI":  The1100315795_UI;
    "1641229997UI": The1100315795_UI;
    "1759181046UI": The1100315795_UI;
    drStartYear:    The1100315795_UI;
    boolOperator:   The1100315795_UI;
    drStartDay:     The1100315795_UI;
    "947577188UI":  The1100315795_UI;
    "3169448UI":    The1100315795_UI;
    drEndMonth:     The1100315795_UI;
    "377269842UI":  The1100315795_UI;
    "888840311UI":  The1100315795_UI;
    "1763123372UI": The1100315795_UI;
    "1990929722UI": The1100315795_UI;
    "1410115621UI": The1100315795_UI;
    "2047526908UI": The1100315795_UI;
    "1616829328UI": The1100315795_UI;
    "1405368152UI": The1100315795_UI;
    "957309741UI":  The1100315795_UI;
    "1321677582UI": The1100315795_UI;
    "1376024419UI": The1100315795_UI;
    drEndDay:       The1100315795_UI;
    "2003928281UI": The1100315795_UI;
    "1951029823UI": The1100315795_UI;
    "613131687UI":  The1100315795_UI;
    drStartMonth:   The1100315795_UI;
    drEndYear:      The1100315795_UI;
    "2015330391UI": The1100315795_UI;
    "1969837079UI": The1100315795_UI;
    "922931513UI":  The1100315795_UI;
    "1100315795UI": The1100315795_UI;
    "1673426514UI": The1100315795_UI;
    "1916938621UI": The1100315795_UI;
    "1218266844UI": The1100315795_UI;
    "42295145UI":   The1100315795_UI;
    "918184044UI":  The1100315795_UI;
    "444888963UI":  The1100315795_UI;
    "1706526186UI": The1100315795_UI;
    freeText:       FreeText;
    "1275939264UI": The1100315795_UI;
    "1219342078UI": The1100315795_UI;
    "731082736UI":  The1100315795_UI;
    "1945191404UI": The1100315795_UI;
    "1862591784UI": The1100315795_UI;
    "2133281440UI": The1100315795_UI;
}

export interface The1100315795_UI {
    indexFields:    IndexField[];
    type:           Type;
    defaultOption:  string;
    displayOptions: string[];
    options:        string[];
}

export enum IndexField {
    And = "AND",
    Any = "any",
    BeginsWith = "begins_with",
    Cdate = "cdate",
    Contains = "contains",
    Creator = "creator",
    Equals = "equals",
    Exact = "exact",
    Issn = "issn",
    Lang = "lang",
    Not = "NOT",
    Or = "OR",
    Rtype = "rtype",
    Sub = "sub",
    Title = "title",
    UserTags = "user_tags",
}

export interface Type {
    _string: string;
}

export interface FreeText {
    indexFields:    IndexField[];
    type:           AdditionalLocationIcons;
    defaultOption:  string;
    displayOptions: any[];
    options:        any[];
}

export interface AdditionalLocationIcons {
}

export interface Authentication {
    "profile-name":          string;
    "authentication-system": string;
    "silent-login-enabled":  string;
}

export interface Customization {
    resourceIcons:           Record<string , string>;
    additionalLocationIcons: AdditionalLocationIcons;
    staticHtml:              AdditionalLocationIcons;
}

export interface MappingTables {
    "Citation Linker Definitions":                         MappingTable[];
    "Request (Hold and Booking) Optional Parameters":      MappingTable[];
    "Prima Direct Login To Other Institutions":            any[];
    "Library Level List":                                  AlmaViewItConfig[];
    "Personalize Your Results Disciplines Fields":         MappingTable[];
    "Personal Setting Fields":                             MappingTable[];
    "Photocopy Request Detailed Display":                  MappingTable[];
    "Call Slip Optional Request Parameters":               MappingTable[];
    "Requests Brief Display":                              MappingTable[];
    "My Account Menu Configuration - OvP":                 MappingTable[];
    "Report a Problem":                                    any[];
    "Resource Recommender Config":                         MappingTable[];
    "Alma ViewIt Config":                                  AlmaViewItConfig[];
    "My Account Links":                                    any[];
    sort_fields_config:                                    MappingTable[];
    "Institution Properties":                              AlmaViewItConfig[];
    "View Properties":                                     MappingTable[];
    "Resource Sharing Request Parameters":                 MappingTable[];
    "Featured newspapers":                                 MappingTable[];
    "Controlled Digital Lending Request Detailed Display": MappingTable[];
    "Digitization Optional Request Parameters":            MappingTable[];
    "Purchase Request Optional Parameters":                MappingTable[];
    "Share Action Configuration":                          AlmaViewItConfig[];
    "Loans Detailed Display":                              MappingTable[];
    "Actions List":                                        MappingTable[];
    "Recent Searches Configuration":                       AlmaViewItConfig[];
    "Hypertext Linking Definitions":                       MappingTable[];
    "Browse Lists":                                        MappingTable[];
    "Holdings Display In Locations List":                  HoldingsDisplayInLocationsList[];
    "Loans Brief Display":                                 MappingTable[];
    "ILL Optional Request Parameters":                     MappingTable[];
    "Voice Languages":                                     MappingTable[];
    "Bulk Definition":                                     AlmaViewItConfig[];
    "Items Brief Display":                                 MappingTable[];
    "Photocopy Optional Request Parameters":               MappingTable[];
    "User Login Links":                                    UserLoginLink[];
    "Acquisition Request Detailed Display":                MappingTable[];
    primo_central_institutions_unique_ids:                 AlmaViewItConfig[];
    "Fines Detailed Display":                              MappingTable[];
    "ILL Request Detailed Display":                        MappingTable[];
    "Personal Details Configuration":                      AlmaViewItConfig[];
    "Prima Filter Bar Resource Types":                     MappingTable[];
    "Call Slip Request Detailed Display":                  MappingTable[];
    "Featured Results":                                    MappingTable[];
    "Fines Brief Display":                                 MappingTable[];
    "Hold Optional Request Parameters":                    MappingTable[];
    "Location Item content":                               MappingTable[];
    "Short Loan and Booking Request Detailed Display":     MappingTable[];
    "Voice Search Languages Activation":                   any[];
    "General Configuration":                               AlmaViewItConfig[];
    "consortia member codes":                              any[];
    "get it prefilter locations":                          any[];
    "Auto Complete Configuration":                         MappingTable[];
    "Main Menu URLs for the New UI":                       any[];
    "direct linking config":                               MappingTable[];
    "Citation styles":                                     AlmaViewItConfig[];
    "Export RIS encodings":                                AlmaViewItConfig[];
    "Recall Optional Request Parameters":                  MappingTable[];
    "Hold/Recall Request Detailed Display":                MappingTable[];
    "Holdings Record Configuration":                       MappingTable[];
    "Institution Base URLs":                               MappingTable[];
}

export interface MappingTable {
    target:   string;
    source1:  string;
    source2?: string;
    source3?: string;
    source4?: string;
    source5?: string;
    source6?: string;
}

export interface AlmaViewItConfig {
    target:  string;
    source1: string;
}

export interface HoldingsDisplayInLocationsList {
    target:  string;
    source2: string;
}

export interface UserLoginLink {
    source1: string;
}

export interface PrimoView {
    "available-tabs":                 string[];
    institution:                      Institution;
    "pc-availability-tab-scopes-map": TabScopesMap;
    "view-org-level":                 ViewOrgLevel;
    "attributes-map":                 AttributesMap;
    "auto-complete-enabled-map":      AutoCompleteEnabledMap;
    scopes:                           Scope[];
    "cdi-ft-search-tab-scopes-map":   TabScopesMap;
    timeout:                          Timeout;
    "is-union-catalog-view":          boolean;
    "display-unpaywall-links":        boolean;
    display_quick_links:              string;
}

export interface AttributesMap {
    tabsRemote:                          string;
    css:                                 string;
    sessionTimeoutURL:                   string;
    interfaceLanguageOptions:            string;
    threeLettersLanguagesOptions:        string;
    libCard:                             string;
    defaultUserInstitution:              string;
    customerCode:                        string;
    layout:                              string;
    bulkSizeOptions:                     string;
    institution:                         string;
    bulkSize:                            string;
    supportedDocumentsLanguageOptions:   string;
    interfaceLanguage:                   string;
    institutionCode:                     string;
    mobileCss:                           string;
    ownerInstituionCode:                 string;
    citationTrailsEnabled:               boolean;
    citationTrailsFilterByAvailability:  boolean;
    selectedFacetLocation:               string;
    personalizationEnabled:              boolean;
    moreLikeCourse:                      boolean;
    moreLikeCollection:                  boolean;
    collectionDiscoveryEnabled:          boolean;
    displayNewspapersLink:               boolean;
    displayFeaturedNewspapers:           boolean;
    refEntryActive:                      boolean;
    relatedItemsActive:                  boolean;
    legantoURLTemplate:                  string;
    multilingualConfigurationEnabled:    boolean;
    journalCategoriesTree:               boolean;
    newspaperSearchFilterByAvailability: boolean;
    displayVoiceSearch:                  boolean;
    displayLibraryNameLocationFacet:     boolean;
    virtualBrowseType:                   string;
    editMyLibraryCard:                   boolean;
    mayAlsoBeHeldByEnabled:              boolean;
}

export interface AutoCompleteEnabledMap {
    CentralIndex:  boolean;
    MyInst_and_CI: boolean;
    DeepSearch:    boolean;
    WorldCat:      boolean;
    jsearch_scope: boolean;
    Ebsco:         boolean;
    Webhook:       boolean;
    Research:      boolean;
    MyInstitution: boolean;
}

export interface TabScopesMap {
    Everything:   Everything;
    CentralIndex: CentralIndex;
}

export interface CentralIndex {
    CentralIndex: string;
}

export interface Everything {
    MyInst_and_CI: string;
}

export interface Institution {
    description:                string;
    id:                         number;
    "org-fields":               ViewOrgLevel;
    "is-org-fields-set":        boolean;
    "institution-code":         string;
    "institution-name":         string;
    "last-modified-time-stamp": string;
    "updated-by":               string;
    "newspapers-search":        boolean;
}

export interface ViewOrgLevel {
    "customer-code":  string;
    "customer-id":    number;
    "institution-id": number;
}

export interface Scope {
    "scope-id":                     string;
    locations:                      string;
    types:                          string;
    tab:                            string;
    "tab-id-for-scope-matching":    string;
    "contains-central-index-scope": boolean;
}

export interface Timeout {
    "guest-ui-timeout": string;
}

export interface ScopesContextMap {
    CentralIndex:  string;
    MyInst_and_CI: string;
    DeepSearch:    string;
    WorldCat:      string;
    jsearch_scope: string;
    Ebsco:         string;
    Webhook:       string;
    Research:      string;
    MyInstitution: string;
}

export interface SearchWithinJournalConfig {
    tab:   string;
    scope: string;
}

export interface SystemConfiguration {
    "Session Timeout":                                  string;
    Auto_Complete_Server_URL:                           string;
    "FE UI - Scrolling Threshold":                      string;
    Auto_Complete_Feature_Enabled:                      string;
    "Use local fields 30-39 as lateral links":          string;
    showICPLicenseFooter:                               string;
    manualAlternativeEmailRS:                           boolean;
    GATHER_SEARCH_STAT:                                 string;
    GATHER_PAGE_STAT:                                   string;
    "Show More (replaces scrolling) Threshold":         string;
    RUM_URL:                                            string;
    Alma_Version:                                       string;
    disable_cache:                                      boolean;
    skip_delivery:                                      boolean;
    skip_delivery_for_collection_discovery:             boolean;
    skip_relations_delivery:                            boolean;
    split_mms_query:                                    boolean;
    split_facets_max_wait:                              number;
    split_facets_wait_interval:                         number;
    Proxy_Server:                                       string;
    "Show ICP License Footer":                          string;
    "request item availability check timeout":          string;
    hostLB:                                             string;
    unionViewScopeSuffix:                               string;
    ngrs_enabled:                                       boolean;
    ngrs_implementation_mode:                           boolean;
    cdi_enable_global_title_catalog:                    boolean;
    ngrs_enable_best_offer_local_records:               boolean;
    ngrs_pickup_anywhere:                               boolean;
    temp_rapido_locate_serial_multivolume_offers:       boolean;
    rapido_lender_supply_directly_to_patron:            boolean;
    activeAccessModelEnabled:                           boolean;
    number_of_representations:                          string;
    use_facet_in_creator_hyperlink:                     boolean;
    tmp_enable_results_per_page:                        boolean;
    number_of_results_per_page_series:                  string;
    activate_suspend_watchers_for_browser:              string;
    disable_suspend_watchers_for_x_results:             string;
    rapido_hide_how_to_get_it_section:                  boolean;
    delivery_bulk_from_brief:                           boolean;
    brief_results_journal_coverage:                     boolean;
    view_it_show_all_results:                           boolean;
    facet_alphanumeric_icelandic_sort:                  boolean;
    use_expanded_db_label:                              boolean;
    use_rapido_functionality:                           boolean;
    allow_self_registration:                            boolean;
    hide_rapido_expand_link_map:                        HideRapidoExpandLinkMap;
    subjects_alphabetical_sort_fullDisplay:             boolean;
    "Activate Captcha [Y/N]":                           string;
    "Public Captcha Key":                               string;
    async_brief_result_delivery:                        boolean;
    display_holdings_without_waiting:                   boolean;
    enable_direct_linking_in_record_full_view:          boolean;
    hide_rapido_offers_tiles:                           boolean;
    rapido_hide_section_when_user_not_logged_in:        boolean;
    rapido_hide_get_it_user_groups:                     AdditionalLocationIcons;
    default_user_search_history_off:                    boolean;
    equals_search_operator_hypertext_linking_enabled:   boolean;
    allow_start_with_for_call_number:                   boolean;
    allow_activity_on_transferred_finesfees:            boolean;
    display_person_info_card:                           boolean;
    primoVE_remove_duplicate_records_in_virtual_browse: boolean;
    rapido_show_physical_journal_offer:                 boolean;
    primo_ve_enable_browse_search_paging:               boolean;
    direct_login_transfer_all_parameters:               boolean;
    default_sort_newspaper_by_date_newest:              boolean;
    alphabetical_sort_pickup_inst_lib:                  boolean;
    primoVE_my_account_number_of_requests:              string;
}

export interface HideRapidoExpandLinkMap {
    Everything:     boolean;
    CentralIndex:   boolean;
    SearchWebhook:  boolean;
    DeepSearch:     boolean;
    WorldCat:       boolean;
    Ebsco:          boolean;
    Research:       boolean;
    CourseReserves: boolean;
    LibraryCatalog: boolean;
}

export interface TabToTiles {
    Everything:     string[];
    CentralIndex:   string[];
    jsearch_slot:   string[];
    SearchWebhook:  string[];
    DeepSearch:     string[];
    WorldCat:       string[];
    Ebsco:          string[];
    Research:       string[];
    LibraryCatalog: string[];
}

export interface Tiles {
    HeaderTileInterface:      AdditionalLocationIcons;
    FacetTileInterface:       { [key: string]: FacetTileInterface };
    KeepingItemTileInterface: KeepingItemTileInterface;
    MainMenuTileInterface:    Record<string, MainMenuTileInterface>;
    StaticHTMLTileInterface:  StaticHTMLTileInterface;
    SearchTileInterface:      { [key: string]: SearchTileInterface };
    ResultFullTileInterface:  { [key: string]: ResultFullTileInterface };
    ResultTileInterface:      { [key: string]: ResultTileInterface };
    LocationsTileInterface:   { [key: string]: LocationsTileInterface };
}

export interface FacetTileInterface {
    toplevelfacet:      boolean;
    toplevelsidefacet:  boolean;
    generalpageactions: boolean;
    facetview:          Facetview[];
    relatedfacetview:   AdditionalLocationIcons;
    id:                 string;
}

export interface Facetview {
    display:         boolean;
    viewinstsort:    boolean;
    instsort:        boolean;
    valid:           boolean;
    count:           number;
    sort:            Sort;
    id:              string;
    useTranslations: boolean;
}

export interface Sort {
    _string: Rta;
    _int:    number;
}

export enum Rta {
    AlphaNumeric = "alpha_numeric",
    BySize = "by_size",
    None = "none",
}

export interface KeepingItemTileInterface {
    "TRAINING_1_INST:AUTO1.KeepingItemTileInterface": TRAINING1_INSTAUTO1KeepingItemTileInterface;
}

export interface TRAINING1_INSTAUTO1KeepingItemTileInterface {
    keepingitemfunctionview: any[];
    id:                      string;
}

export interface LocationsTileInterface {
    viewinstsort:           boolean;
    rta:                    Rta;
    displayholdingsfilters: boolean;
    filtersop:              string;
    instsort:               boolean;
    id:                     string;
}

export interface MainMenuTileInterface {
    mainview: Mainview[];
    id:       string;
}

export interface Mainview {
    url:    string;
    label:  string;
    target: string;
}

export interface ResultFullTileInterface {
    eshelf:         boolean;
    delimiter:      Delimiter;
    getitbutton:    boolean;
    resultlinks:    Resultlink[];
    resultitemview: Resultitemview[];
    id:             string;
}

export enum Delimiter {
    Delimiter = ";",
    Empty = "; ",
}

export interface Resultitemview {
    items:           string;
    displayInViewer: boolean;
}

export interface Resultlink {
    links: string;
}

export interface ResultTileInterface {
    ilsapi:             boolean;
    bulksize:           number;
    eshelf:             boolean;
    showsnip:           boolean;
    resultview:         Resultview[];
    facebookenabled:    boolean;
    linkabletitle:      string;
    sortby:             Sortby;
    frbrdisplay:        number;
    frbrsortby:         Frbrsortby;
    tabsorder:          Tabsorder;
    getall:             boolean;
    showsnipifnotfound: boolean;
    boostinst:          boolean;
    numofresults:       number;
    id:                 string;
    displaysigninmsg:   boolean;
    groupmessage:       number;
}

export enum Frbrsortby {
    DateD = "date_d",
}

export interface Resultview {
    items:     Items;
    delimiter: Delimiter;
}

export enum Items {
    Creationdate = "creationdate",
    CreatorContributor = "creator,contributor",
    Ispartof = "ispartof",
    VertitleTitle = "vertitle,title",
}

export enum Sortby {
    RankDateDDateATitleAuthor = "rank,date_d,date_a,title,author",
    TitleRank = "title,rank",
}

export interface Tabsorder {
    items: string;
}

export interface SearchTileInterface {
    qtvinstance:                  Qtvinstance[];
    prefiltersenable:             boolean;
    indexedPrefiltersenable:      boolean;
    resourcetypePrefiltersenable: boolean;
    alphabeticLanguagesSort:      boolean;
}

export interface Qtvinstance {
    qtvid: string;
}

export interface StaticHTMLTileInterface {
    "TRAINING_1_INST:AUTO1.StaticHTMLTileInterface": TRAINING1_INSTAUTO1StaticHTMLTileInterface;
}

export interface TRAINING1_INSTAUTO1StaticHTMLTileInterface {
    news:       string;
    featured:   string;
    signinTips: string;
    ideasFull:  string;
    atoz:       string;
    footer:     string;
    service:    string;
    signin:     string;
    noResults:  string;
    header:     string;
    ideasBrief: string;
    browse:     string;
}
