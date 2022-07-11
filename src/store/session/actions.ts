import {
  Popup,
  POPUP,
  SESSION_FLOGS,
  SESSION_LAST_CHECKED,
  SESSION_LOGS,
  SessionFullLogs,
  SessionLastCheckedAction,
  SessionLogs, SET_DONE, SET_ERROR, SetDone, SetError, SPAMMER, Spammer,
} from './types';

export function sessionLastChecked(): SessionLastCheckedAction {
  return {
    type: SESSION_LAST_CHECKED,
    payload: Date.now(),
  };
}

export function logUpdate(payload: SessionLogs['payload']): SessionLogs {
  return {
    type: SESSION_LOGS,
    payload,
  };
}

export function flogUpdate(payload: SessionFullLogs['payload']): SessionFullLogs {
  return {
    type: SESSION_FLOGS,
    payload,
  };
}

export function popup(payload: Popup['payload']): Popup {
  return {
    type: POPUP,
    payload,
  };
}

export function spammerAction(payload: [string, boolean, string, boolean, number]): Spammer {
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