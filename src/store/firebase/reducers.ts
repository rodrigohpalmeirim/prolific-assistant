import produce from 'immer';
import {
  FirebaseActionTypes,
  SET_PREFERENCES, SET_STATISTICS, SET_USER,

} from './actions';
import { auth, canUsePA } from '../../functions/firebaseAuth';
import { FullStatistics } from '../../types';

export type FirebaseState={
  preferences: {prolific:{}}|any,
  currentUser:any,
  canUsePA:boolean|string,
  statistics: FullStatistics
}

const initialState: FirebaseState = {
  preferences: {prolific:{}} = {prolific:{}},
  currentUser:undefined,
  canUsePA:false,
  statistics:{this_user:{},bulk:{default:{statistics:{}}}}
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