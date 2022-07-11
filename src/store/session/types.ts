export interface SessionState {
  last_checked: number;
  logs: any;
  flogs: any;
  popup: any;
  spammer:[string,boolean,any,boolean,number],
  canUsePA:string|boolean,
  errors:any
}

export const SESSION_LAST_CHECKED = 'SESSION_LAST_CHECKED';
export const SESSION_LOGS = 'SETTING_LOGS';
export const SESSION_FLOGS = 'SETTING_FLOGS';
export const SPAMMER = 'SPAMMER';
export const POPUP = 'POPUP';
export const SET_ERROR = 'SET_ERROR';
export const SET_DONE = 'SET_DONE';

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

export interface SetError {
  type: typeof SET_ERROR;
  payload: {type:string,error:any,done:boolean};
}

export interface SetDone {
  type: typeof SET_DONE;
  payload: {type:string,done:boolean};
}

export type SessionActionTypes = SessionLastCheckedAction | SessionLogs | Popup | SessionFullLogs | Spammer | SetError | SetDone;
