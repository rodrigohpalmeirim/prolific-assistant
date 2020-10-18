import { AppState } from '..';

export function selectSession(state: AppState) {
  return state.session;
}

export function selectSessionLastChecked(state: AppState) {
  return selectSession(state).last_checked;
}

export function selectLogs(state: AppState) {
  return state.session.logs;
}
export function selectFLogs(state: AppState) {
  return state.session.flogs;
}

export function selectPopup(state:AppState){
  return state.session.popup;
}