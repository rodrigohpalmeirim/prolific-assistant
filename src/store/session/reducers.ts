import produce from 'immer';

import { POPUP, SESSION_FLOGS, SESSION_LAST_CHECKED, SESSION_LOGS, SessionActionTypes, SessionState } from './types';

const initialState: SessionState = {
  last_checked: 0, logs: [], popup: {}, flogs: [],
};

export function sessionReducer(state = initialState, action: SessionActionTypes) {
  return produce(state, (draftState) => {
    switch (action.type) {
      case SESSION_LAST_CHECKED:
        draftState.last_checked = action.payload;
        break;
      case SESSION_LOGS:
        draftState.logs = action.payload;
        break;
      case SESSION_FLOGS:
        draftState.flogs = action.payload;
        break;
      case POPUP:
        draftState.popup = action.payload;
    }
  });
}
