import produce from 'immer';

import {
  ACC_INFO_UPDATE,
  OPEN_SUBMISSION,
  PROLIFIC_ERROR_UPDATE,
  PROLIFIC_STUDIES_UPDATE,
  PROLIFIC_SUBMISSIONS_UPDATE,
  ProlificActionTypes,
  ProlificState,
  SET_SHARED_STUDIES,
} from './types';
import { auth } from '../../functions/firebaseAuth';
import { authHeader, userID } from '../../pages/background';
//import { fetchProlificStudy } from '../../functions/fetchProlificStudies';
import { browser } from 'webextension-scripts/polyfill';
import { fetchProlificStudy } from '../../functions/fetchProlificStudies';

const initialState: ProlificState = {
  error: undefined,
  studies: [],
  acc_info: {},
  submissions:[],
  sharedStudies:{available:{},own:{},claimed:{}}
};

export function prolificReducer(state = initialState, action: ProlificActionTypes) {
  return produce(state,  (draftState: ProlificState) => {
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
        let own = ((action?.payload?.available ?? {})[auth.currentUser.uid] ?? {})[userID];
        draftState.sharedStudies = { ...action.payload, own };
        break;
      case OPEN_SUBMISSION:
        (async()=>{
          let study_id = action.payload.submission.study.id;
          let study_info = await fetchProlificStudy(authHeader, study_id);
          await browser.tabs.create({ url: study_info.submissions.find(el=>el.id === action.payload.submission.id).study_url });
        })();

        break;
    }
  });
}
