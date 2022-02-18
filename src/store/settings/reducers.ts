import produce from 'immer';

import {
  SETTING_ALERT_SOUND,
  SETTING_ALERT_VOLUME,
  SETTING_AUTOSTART,
  SETTING_CHECK_INTERVAL, SETTING_CTHEME,
  SETTING_DESKTOP_NOTIFICATIONS,
  SETTING_EASTEREGG,
  SETTING_LIMIT_BYPASS, SETTING_PROXY,
  SETTING_THEME,
  SETTING_UID,
  SETTING_WEBHOOK,
  SettingsActionTypes,
  SettingsState,
  SETTING_OPEN_STUDY,
  SETTING_ACCEPT_STUDY,
} from './types';

const initialState: SettingsState = {
  alert_sound: 'voice',
  alert_volume: 100,
  check_interval: 60,
  desktop_notifications: true,
  theme: 'Rod',
  ctheme: [{},false],
  autostart: [false, [-1,-1],["-","-",false]],
  uid: undefined,
  limit_bypass:false,
  webhook:["","",false],
  easter_egg:{},
  proxy:"",
  open_study: true,
  accept_study: false,
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
      case SETTING_UID:
        draftState.uid = action.payload;
        break;
      case SETTING_LIMIT_BYPASS:
        draftState.limit_bypass = action.payload;
        break;
      case SETTING_WEBHOOK:
        draftState.webhook = action.payload;
        break;
      case SETTING_EASTEREGG:
        draftState.easter_egg = action.payload;
        break;
      case SETTING_CTHEME:
        draftState.ctheme = action.payload;
        break;
      case SETTING_PROXY:
        draftState.proxy = action.payload;
        break;
      case SETTING_OPEN_STUDY:
        draftState.open_study = action.payload;
        break;
      case SETTING_ACCEPT_STUDY:
        draftState.accept_study = action.payload;
        break;
    }
  });
}
