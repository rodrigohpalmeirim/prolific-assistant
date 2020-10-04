import produce from 'immer';

import {
  SettingsState,
  SettingsActionTypes,
  SETTING_ALERT_SOUND,
  SETTING_ALERT_VOLUME,
  SETTING_CHECK_INTERVAL,
  SETTING_DESKTOP_NOTIFICATIONS, SETTING_THEME, SETTING_AUTOSTART,
} from './types';

const initialState: SettingsState = {
  alert_sound: 'voice',
  alert_volume: 100,
  check_interval: 60,
  desktop_notifications: true,
  theme:'white',
  autostart:false,
};

export function settingsReducer(state = initialState, action: SettingsActionTypes) {
  return produce(state, (draftState) => {
    switch (action.type) {
      case SETTING_ALERT_SOUND:
        draftState.alert_sound = action.payload;
        break;
      case SETTING_ALERT_VOLUME:
        draftState.alert_volume = action.payload;
        break;
      case SETTING_CHECK_INTERVAL:
        draftState.check_interval = action.payload;
        break;
      case SETTING_DESKTOP_NOTIFICATIONS:
        draftState.desktop_notifications = action.payload;
        break;
      case SETTING_THEME:
        draftState.theme = action.payload;
        break;
      case SETTING_AUTOSTART:
        draftState.autostart = action.payload;
        break;
    }
  });
}
