import produce from 'immer';

import {
  APPEND_LOG, CLEAR_LOGS,
  POPUP,
  SESSION_LAST_CHECKED,
  SessionActionTypes,
  SessionState,
  SET_DONE,
  SET_ERROR,
  SPAMMER,
} from './types';

const initialState: SessionState = {
  last_checked: 0, logs: [], popup: {}, flogs: [], errors:{},
  spammer_conf:{studies:{}},
  spammer_output:{studies:{}},
};

export function sessionReducer(state = initialState, action: SessionActionTypes) {
  return produce(state, (draftState) => {
    switch (action.type) {
      case SESSION_LAST_CHECKED:
        draftState.last_checked = action.payload;
        break;
      case APPEND_LOG:
        if(!draftState.logs)draftState.logs = [];
        if(!draftState.flogs)draftState.flogs = [];
        let logItem = { data: action.payload.log, type: action.payload.type, timestamp: (+new Date()), desc: action.payload.description }
        draftState.logs.push(logItem);
        draftState.flogs.push(logItem);

        while (draftState.logs.length > 299) {
          draftState.logs.shift();
        }
        while (draftState.flogs.length > 3000) {
          draftState.flogs.shift();
        }
        break;
      case CLEAR_LOGS:
        draftState.logs = [];
        draftState.flogs = [];
        break;
      case POPUP:
        draftState.popup = action.payload;
        break;
      case SPAMMER:
        if(action.payload.type === "config"){
          draftState.spammer_conf.studies[action.payload.studyID] = action.payload.data;
        }
        if(action.payload.type === "output"){
          draftState.spammer_output.studies[action.payload.studyID] = action.payload.data;
        }
        if(action.payload.type === "delete"){
          delete draftState.spammer_conf.studies[action.payload.studyID];
          delete draftState.spammer_output.studies[action.payload.studyID];
        }
        if(action.payload.type === "clear"){
          draftState.spammer_conf.studies = {};
        }

        break;
      case SET_ERROR:
        draftState.errors[action.payload.type] = {error:action.payload.error,done:action.payload.done};
        break;
      case SET_DONE:
        if(draftState.errors[action.payload.type])
        draftState.errors[action.payload.type].done = action.payload.done;
        break;
    }
  });
}
