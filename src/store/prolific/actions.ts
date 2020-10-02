import {
  ProlificErrorUpdateAction,
  ProlificStudiesUpdateAction,
  PROLIFIC_ERROR_UPDATE,
  PROLIFIC_STUDIES_UPDATE, AccInfoUpdateAction, ACC_INFO_UPDATE,
} from './types';
import { SETTING_LOGS, SettingLogs, SettingsState } from '../settings/types';
import { Immutable, Produced } from 'immer';
import { SessionState } from '../session/types';
import { PersistPartial } from 'redux-persist/es/persistReducer';
import { AnyAction } from 'redux';

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

export function accInfoUpdate(payload: AccInfoUpdateAction['payload']): AccInfoUpdateAction {
  return {
    type: ACC_INFO_UPDATE,
    payload,
  };
}

export function logUpdate(payload: SettingLogs['payload']): SettingLogs {
  return {
    type: SETTING_LOGS,
    payload,
  };
}
