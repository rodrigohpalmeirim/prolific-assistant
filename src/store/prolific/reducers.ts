import produce from 'immer';

import {
  ProlificState,
  ProlificActionTypes,
  PROLIFIC_ERROR_UPDATE,
  PROLIFIC_STUDIES_UPDATE,
  ACC_INFO_UPDATE,
  AccInfoUpdateAction
} from './types';

const initialState:any = {
  error: undefined,
  studies: [],
  acc_info:{},
};

export function prolificReducer(state = initialState, action: ProlificActionTypes) {
  return produce(state, (draftState:any) => {
    switch (action.type) {
      case PROLIFIC_ERROR_UPDATE:
        draftState.error = action.payload;
        draftState.studies = [];
        break;
      case PROLIFIC_STUDIES_UPDATE:
        draftState.error = undefined;
        draftState.studies = action.payload;
        break;
      case ACC_INFO_UPDATE:
        draftState.acc_info = action.payload;
        break;
    }
  });
}
