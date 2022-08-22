import produce from 'immer';

import {
  ACC_INFO_UPDATE,
  PROLIFIC_ERROR_UPDATE,
  PROLIFIC_STUDIES_UPDATE,
  PROLIFIC_SUBMISSIONS_UPDATE,
  ProlificActionTypes, ProlificState, SET_SHARED_STUDIES,
} from './types';
import { auth } from '../../functions/firebaseAuth';
import { userID } from '../../pages/background';

const initialState: ProlificState = {
  error: undefined,
  studies: [],
  acc_info: {},
  submissions:[],
  sharedStudies:{available:{},own:{},claimed:{}}
};

export function prolificReducer(state = initialState, action: ProlificActionTypes) {
  return produce(state, (draftState: ProlificState) => {
    switch (action.type) {
      case PROLIFIC_ERROR_UPDATE:
        draftState.error = action.payload;
        draftState.studies = [];
        break;
      case PROLIFIC_STUDIES_UPDATE:
        draftState.error = undefined;
        draftState.studies = action.payload;
        break;
      case PROLIFIC_SUBMISSIONS_UPDATE:
        draftState.error = undefined;
        draftState.submissions = action.payload;
        break;
      case ACC_INFO_UPDATE:
        draftState.acc_info = action.payload;
        break;
      case SET_SHARED_STUDIES:
        let own = ((action?.payload?.available??{})[auth.currentUser.uid]??{})[userID];
        draftState.sharedStudies = {...action.payload,own};
        break;
    }
  });
}
