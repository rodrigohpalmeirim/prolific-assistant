import { browser } from 'webextension-scripts/polyfill';
import { Middleware } from 'redux';

import { centsToGBP } from '../functions/centsToGBP';
import { playAlertSound, sendWebhook } from '../functions/playAlertSound';

import { AppState } from '.';
import {
  CLAIM_SHARED_STUDY,
  CLEAR_CLAIMED_SHARED_STUDIES,
  PROLIFIC_STUDIES_UPDATE,
  READ_SHARED_STUDIES,
  SHARE_STUDY,
} from './prolific/types';
import { authHeader, incStats, store } from '../pages/background';
import { ProlificStudy } from '../types';
import { fetchProlificStudy } from '../functions/fetchProlificStudies';
import { claimStudy, readOwnClaimed, readShare, writeShare } from '../functions/firebase';
import { readSharedStudies, setSharedStudies } from './prolific/actions';
import { reportErrorAction } from './session/actions';

const seen: ProlificStudy['id'][] = [];

export const prolificStudiesUpdateMiddleware: Middleware = (store) => (next) => async (action) => {
  try{
    if (action.type === PROLIFIC_STUDIES_UPDATE) {
      const state: AppState = store.getState();
      const studies: ProlificStudy[] = action.payload;

      const newStudies = studies.reduce((acc: ProlificStudy[], study) => {
        if (!seen.includes(study.id)) {
          seen.push(study.id);
          if (state.settings.desktop_notifications) {
            browser.notifications.create(study.id, {
              type: 'list',
              title: study.name,
              message: '',
              iconUrl: 'icon.png',
              items: [
                {
                  title: 'Hosted By',
                  message: study.researcher.name,
                },
                {
                  title: 'Reward',
                  message: `${centsToGBP(study.reward)} | Avg. ${centsToGBP(study.average_reward_per_hour)}`,
                },
                {
                  title: 'Places',
                  message: `${study.total_available_places - study.places_taken}`,
                },
              ],
            });
          }

          return [...acc, study];
        }

        return acc;
      }, []);

      if (newStudies.length) {
        playAlertSound(state);
        newStudies.forEach(el => {
          sendWebhook(state, el);
        });
        let totalReward = newStudies.reduce((old, study) => {
          if (study.id.includes('TEST')) return old;
          return old + study.reward;
        }, 0);
        let foundCount = newStudies.reduce((old, study) => {
          if (study.id.includes('TEST')) return old;
          return old + 1;
        }, 0);
        if (foundCount > 0)
          await incStats(['found', 'found_amount'], [foundCount, totalReward], [false, true]);
      }
    }
    if (action.type === SHARE_STUDY){
      let studyID = action.payload.studyID;
      if(studyID === undefined){
        await writeShare({});
        store.dispatch(readSharedStudies());
        return next(action);
      }
      let study = await fetchProlificStudy(authHeader,studyID);
      if(study.id === studyID){
        //PROLIFIC_PID={{%PROLIFIC_PID%}}&STUDY_ID={{%STUDY_ID%}}&SESSION_ID={{%SESSION_ID%}}
        let url = study.external_study_url;
        let state = store.getState();
        url = url.replaceAll('{{%PROLIFIC_PID%}}',state.settings.uid);
        url = url.replaceAll('{{%STUDY_ID%}}',studyID);
        url = url.replaceAll('{{%SESSION_ID%}}',study.submission.id);
        study.external_study_url = url;

        await writeShare(study);
        store.dispatch(readSharedStudies());
      }
    }
    if (action.type === READ_SHARED_STUDIES){
      let sharedStudies = await readShare();
      let ownClaimed = await readOwnClaimed();
      store.dispatch(setSharedStudies({available:sharedStudies,claimed:ownClaimed}))
    }
    if (action.type === CLAIM_SHARED_STUDY){
      let sharedStudies = await readShare();
      let ownClaimed = await readOwnClaimed();
      store.dispatch(setSharedStudies({available:sharedStudies,claimed:ownClaimed}))
      if (sharedStudies[action.payload.accountID][action.payload.remoteUserID]?.id !== action.payload.studyID) {
        throw 'study no longer available!';
      }
      if (sharedStudies[action.payload.accountID][action.payload.remoteUserID]?.claimed){
        throw 'study no longer available!';
      }
      await claimStudy(action.payload.accountID, action.payload.remoteUserID, action.payload.studyID);
      ownClaimed = await readOwnClaimed();
      store.dispatch(setSharedStudies({available:sharedStudies,claimed:ownClaimed}))
    }
    if (action.type === CLEAR_CLAIMED_SHARED_STUDIES){
      await claimStudy("", "", "");
      store.dispatch(readSharedStudies());
    }
  }catch(e){
    store.dispatch(reportErrorAction({type:action.type,error:e}));
  }
  return next(action);
};
