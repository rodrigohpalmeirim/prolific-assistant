import { AppState } from '..';
import { selectSession } from '../session/selectors';

export function selectProlific(state: AppState) {
  return state.prolific;
}

export function selectProlificError(state: AppState) {
  return selectProlific(state).error;
}

export function selectProlificStudies(state: AppState) {
  return selectProlific(state).studies;
}

export function selectAcc_Info(state: AppState) {
  return selectProlific(state).acc_info;
}
