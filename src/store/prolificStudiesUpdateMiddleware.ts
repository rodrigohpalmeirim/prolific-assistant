import { browser } from 'webextension-scripts/polyfill';
import { Middleware } from 'redux';

import { centsToGBP } from '../functions/centsToGBP';
import { playAlertSound, sendWebhook } from '../functions/playAlertSound';

import { AppState } from '.';
import { PROLIFIC_STUDIES_UPDATE } from './prolific/types';

import { openProlificStudy } from '../functions/openProlificStudy';
import { acceptProlificStudy } from '../functions/acceptProlificStudy';

const seen: ProlificStudy['id'][] = [];

export const prolificStudiesUpdateMiddleware: Middleware = (store) => (next) => (action) => {
  const result = next(action);

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
            iconUrl: 'mug.png',
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

        if (state.settings.accept_study)
          acceptProlificStudy(study.id)

        if (state.settings.open_study && study.id)
          openProlificStudy(study.id);

        return [...acc, study];
      }

      return acc;
    }, []);

    if (newStudies.length) {
      playAlertSound(state);
      newStudies.forEach(el=>{
        sendWebhook(state,el)
      })
    }
  }

  return result;
};
