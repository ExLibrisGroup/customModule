const DEFAULT_VID = 'TRAINING_1_INST:Auto1';
export const vid = new URLSearchParams(window.location.search).get('vid') || DEFAULT_VID;
export const SYS_PATH = window.location.toString();

const PRIMA_WS_PREFIX = '/primaws/rest'
const PRIMA_WS_PUBLIC = PRIMA_WS_PREFIX + '/pub';
export const CONFIG_REQUEST_PATH = PRIMA_WS_PUBLIC + '/configuration/vid';
export const TRANSLATION_REQUEST_PATH = PRIMA_WS_PUBLIC + '/translations';
export const SEARCH_REQUEST_PATH = PRIMA_WS_PUBLIC + '/pnxs';
export const DELIVERY_REQUEST_PATH = PRIMA_WS_PUBLIC + '/delivery';
export const CITATION_STYLES_REQUEST_PATH =  PRIMA_WS_PUBLIC + '/pushto/citation';
export const GUEST_JWT_REQUEST_PATH_SUFFIX = '/guestJwt';
export const GUEST_JWT_REQUEST_PATH = PRIMA_WS_PUBLIC + '/institution/{inst_code}' + GUEST_JWT_REQUEST_PATH_SUFFIX

