import {
  APPEND_LOG,
  AppendLog, CLEAR_LOGS, ClearLogs,
  Popup,
  POPUP,
  SESSION_LAST_CHECKED,
  SessionLastCheckedAction,
  SET_DONE,
  SET_ERROR,
  SetDone,
  SetError,
  SPAMMER,
  Spammer, spammerActionPayload,
} from './types';
import { LogType } from '../../types';

export function sessionLastChecked(): SessionLastCheckedAction {
  return {
    type: SESSION_LAST_CHECKED,
    payload: Date.now(),
  };
}

export function appendLogAction(payload: {log:string,type:LogType,description:string}): AppendLog {
  return {
    type: APPEND_LOG,
    payload,
  };
}

export function clearLogsAction(): ClearLogs {
  return {
    type: CLEAR_LOGS,
    payload:"",
  };
}

export function popup(payload: Popup['payload']): Popup {
  return {
    type: POPUP,
    payload,
  };
}

export function spammerAction(payload: spammerActionPayload): Spammer {
  return {
    type: SPAMMER,
    payload,
  };
}

export function reportErrorAction(payload: {type:string,error:any}): SetError {
  return {
    type: SET_ERROR,
    payload:{type:payload.type,error:payload.error,done:true},
  };
}

export function setErrorAction(payload: {type:string,error:any,done:boolean}): SetError {
  return {
    type: SET_ERROR,
    payload,
  };
}

export function setDoneAction(payload: {type:string,done:boolean}): SetDone {
  return {
    type: SET_DONE,
    payload,
  };
}