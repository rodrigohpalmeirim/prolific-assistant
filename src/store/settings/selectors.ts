import { AppState } from '..';

export function selectSettings(state: AppState) {
  return state.settings;
}

export function selectLogs(state: AppState) {
  return state.settings.logs;
}