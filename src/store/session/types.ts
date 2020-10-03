import { SettingsState } from '../settings/types';

export interface SessionState {
  last_checked: number;
  logs:any
}

export const SESSION_LAST_CHECKED = 'SESSION_LAST_CHECKED';
export const SESSION_LOGS = 'SETTING_LOGS';

export interface SessionLastCheckedAction {
  type: typeof SESSION_LAST_CHECKED | typeof SESSION_LOGS;
  payload: SessionState['last_checked'];
}

export interface SessionLogs {
  type: typeof SESSION_LOGS;
  payload: SessionState['logs'];
}

export type SessionActionTypes = SessionLastCheckedAction | SessionLogs;
