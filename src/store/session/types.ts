export interface SessionState {
  last_checked: number;
  logs: any;
  flogs: any;
  popup: any;
  spammer:[string,boolean,any,boolean,number]
}

export const SESSION_LAST_CHECKED = 'SESSION_LAST_CHECKED';
export const SESSION_LOGS = 'SETTING_LOGS';
export const SESSION_FLOGS = 'SETTING_FLOGS';
export const SPAMMER = 'SPAMMER';
export const POPUP = 'POPUP';

export interface SessionLastCheckedAction {
  type: typeof SESSION_LAST_CHECKED | typeof SESSION_LOGS;
  payload: SessionState['last_checked'];
}

export interface SessionLogs {
  type: typeof SESSION_LOGS;
  payload: SessionState['logs'];
}

export interface SessionFullLogs {
  type: typeof SESSION_FLOGS;
  payload: SessionState['flogs'];
}

export interface Popup {
  type: typeof POPUP;
  payload: SessionState['popup'];
}

export interface Spammer {
  type: typeof SPAMMER;
  payload: SessionState['spammer'];
}

export type SessionActionTypes = SessionLastCheckedAction | SessionLogs | Popup | SessionFullLogs | Spammer;
