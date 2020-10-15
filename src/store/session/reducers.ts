import produce from 'immer';

import { SessionState, SessionActionTypes, SESSION_LAST_CHECKED, SESSION_LOGS, POPUP } from './types';

const initialState: SessionState = {
  last_checked: 0,  logs: [],popup:{}
};

export function sessionReducer(state = initialState, action: SessionActionTypes) {
  return produce(state, (draftState) => {
    switch (action.type) {
      case SESSION_LAST_CHECKED:
        draftState.last_checked = action.payload;
        break;
      case SESSION_LOGS:
        let date = + new Date()
        draftState.logs= action.payload
        break;
      case POPUP:
        draftState.popup = action.payload;
    }
  });
}
