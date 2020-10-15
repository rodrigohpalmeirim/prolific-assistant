import { SettingsState } from '../settings/types';

export interface SessionState {
  last_checked: number;
  logs:any;
  popup:any;
}

export const SESSION_LAST_CHECKED = 'SESSION_LAST_CHECKED';
export const SESSION_LOGS = 'SETTING_LOGS';
export const POPUP = 'POPUP';

export interface SessionLastCheckedAction {
  type: typeof SESSION_LAST_CHECKED | typeof SESSION_LOGS;
  payload: SessionState['last_checked'];
}

export interface SessionLogs {
  type: typeof SESSION_LOGS;
  payload: SessionState['logs'];
}
export interface Popup {
  type: typeof POPUP;
  payload: SessionState['popup'];
}

export type SessionActionTypes = SessionLastCheckedAction | SessionLogs | Popup;
