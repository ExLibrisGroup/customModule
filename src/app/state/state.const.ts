export const SUCCESS: "success" = 'success';
export const FAIL: "fail" = 'fail';
export const LOADING: "loading" = 'loading';
export const PENDING: "pending" = 'pending';
export type LoadingStatus = typeof PENDING | typeof LOADING | typeof SUCCESS| typeof FAIL;
export const MAX_STATE_ACTIONS_IN_HISTORY = 25;
export const MAX_STACK_FRAMES_IN_HISTORY = 25;
