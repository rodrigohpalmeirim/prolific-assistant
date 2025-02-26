import {
  Popup,
  POPUP,
  SESSION_FLOGS,
  SESSION_LAST_CHECKED,
  SESSION_LOGS,
  SessionFullLogs,
  SessionLastCheckedAction,
  SessionLogs, SPAMMER, Spammer,
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