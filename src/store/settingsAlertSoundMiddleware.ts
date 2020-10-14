import { Middleware } from 'redux';

import { playAlertSound } from '../functions/playAlertSound';

import { AppState } from '.';
import { NOOP, RELOAD, RESET, SETTING_ALERT_SOUND, TEST_ALERT_SOUND, TEST_STUDY } from './settings/types';
import { updateResults } from '../pages/background';

export const settingsAlertSoundMiddleware: Middleware = (store) => (next) => (action) => {
  const result = next(action);

  if (action.type === SETTING_ALERT_SOUND) {
    const state: AppState = store.getState();
    playAlertSound(state);
  }
  if (action.type === TEST_ALERT_SOUND) {
    const state: AppState = store.getState();
    playAlertSound(state);
  }
  if (action.type === TEST_STUDY) {
    const state: AppState = store.getState();
    updateResults([{
      average_completion_time: 5,
      average_reward_per_hour: 100,
      date_created: '',
      description: 'TEST STUDY DESCRIPTION',
      estimated_completion_time: 5,
      estimated_reward_per_hour: 100,
      id: 'TEST_STUDY_ID',
      is_desktop_compatible: true,
      is_mobile_compatible: true,
      is_tablet_compatible: true,
      maximum_allowed_time: 50,
      name: 'TEST STUDY',
      places_taken: 10,
      published_at: '',
      researcher: {
        id: 'researcher',
        name: 'researcher NAME',
        institution: {
          name: null,
          logo: null,
          link: '',
        },
      },
      reward: 5,
      study_type: 'SINGLE',
      total_available_places: 300,
    }]);
  }
  if (action.type === RESET) {
    localStorage.clear();
    location.reload();
  }
  if (action.type === RELOAD) {
    location.reload();
  }
  if(action.type===NOOP){
    const state: AppState = store.getState();
    playAlertSound(state);
  }
  return result;
};
