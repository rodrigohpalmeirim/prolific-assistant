import {
  ACC_INFO_UPDATE,
  AccInfoUpdateAction,
  PROLIFIC_ERROR_UPDATE,
  PROLIFIC_STUDIES_UPDATE,
  PROLIFIC_SUBMISSIONS_UPDATE,
  ProlificErrorUpdateAction,
  ProlificStudiesUpdateAction,
  ProlificSubmissionsUpdateAction,
} from './types';
import { SESSION_LOGS, SessionLogs } from '../session/types';

export function prolificErrorUpdate(payload: ProlificErrorUpdateAction['payload']): ProlificErrorUpdateAction {
  return {
    type: PROLIFIC_ERROR_UPDATE,
    payload,
  };
}

export function prolificStudiesUpdate(payload: ProlificStudiesUpdateAction['payload']): ProlificStudiesUpdateAction {
  return {
    type: PROLIFIC_STUDIES_UPDATE,
    payload,
  };
}
export function prolificSubmissionsUpdate(payload: ProlificSubmissionsUpdateAction['payload']): ProlificSubmissionsUpdateAction {
  return {
    type: PROLIFIC_SUBMISSIONS_UPDATE,
    payload,
  };
}

export function accInfoUpdate(payload: AccInfoUpdateAction['payload']): AccInfoUpdateAction {
  return {
    type: ACC_INFO_UPDATE,
    payload,
  };
}