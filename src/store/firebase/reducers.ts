import produce from 'immer';
import {
  FIREBASE_LOGIN,
  FirebaseActionTypes,
  GET_USER,
  READ_PREFERENCES,
  SET_PREFERENCES, SET_STATISTICS, SET_USER,
  UPLOAD_PREFERENCES,
} from './actions';
import {
  _canUsePA,
  auth, canUsePA,
  canUseProlificAssistant,
  getUserPreferences,
  login,
  setUserPreferences,
} from '../../functions/firebaseAuth';
import { Statistics } from '../../pages/background';

export type FirebaseState={
  preferences: {prolific:{}}|any,
  currentUser:any,
  canUsePA:boolean|string,
  statistics: Statistics|any
}

const initialState: FirebaseState = {
  preferences: {prolific:{}} = {prolific:{}},
  currentUser:undefined,
  canUsePA:false,
  statistics:{}
};

export function firebaseReducer(state = initialState, action: FirebaseActionTypes) {
  return produce(state, (draftState) => {
    switch (action.type) {
      case SET_PREFERENCES:
        draftState.preferences = action.payload;
        break;
      case SET_USER:
        draftState.canUsePA = canUsePA();
        draftState.currentUser = JSON.parse(JSON.stringify(auth.currentUser));
        break;
      case SET_STATISTICS:
        draftState.statistics = action.payload;
        break;
    }
  });
}