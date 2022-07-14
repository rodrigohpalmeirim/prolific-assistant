import { LogType } from '../../types';

export interface SessionState {
  last_checked: number;
  logs: any;
  flogs: any;
  popup: any;
  //spammer:[string,boolean,any,boolean,number],
  spammer_conf: { studies: { [key: string]: { enabled: boolean } } }
  spammer_output: { studies: { [key: string]: { success: boolean, error: any, iterations: number } } }
  errors: any
}

export const SESSION_LAST_CHECKED = 'SESSION_LAST_CHECKED';
export const APPEND_LOG = 'APPEND_LOG';
export const CLEAR_LOGS = 'CLEAR_LOGS';
export const SPAMMER = 'SPAMMER';
export const POPUP = 'POPUP';
export const SET_ERROR = 'SET_ERROR';
export const SET_DONE = 'SET_DONE';

export interface SessionLastCheckedAction {
  type: typeof SESSION_LAST_CHECKED;
  payload: SessionState['last_checked'];
}

export interface AppendLog {
  type: typeof APPEND_LOG;
  payload: { log: string, type: LogType, description: string };
}

export interface ClearLogs {
  type: typeof CLEAR_LOGS;
  payload: '';
}

export interface Popup {
  type: typeof POPUP;
  payload: SessionState['popup'];
}

export type spammerActionPayload =
  { data: { enabled: boolean }, type: 'config', studyID: string }
  | { data: { success: boolean, error: any, iterations: number }, type: 'output', studyID: string }
  | { type: 'delete', studyID: string }
  | { type: 'clear' }

export interface Spammer {
  type: typeof SPAMMER;
  payload: spammerActionPayload;
}

export interface SetError {
  type: typeof SET_ERROR;
  payload: { type: string, error: any, done: boolean };
}

export interface SetDone {
  type: typeof SET_DONE;
  payload: { type: string, done: boolean };
}

export type SessionActionTypes =
  SessionLastCheckedAction
  | AppendLog
  | Popup
  | Spammer
  | SetError
  | SetDone
  | ClearLogs;
