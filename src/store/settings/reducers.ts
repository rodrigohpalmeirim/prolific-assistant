import produce from 'immer';

import {
  SETTING_ALERT_SOUND,
  SETTING_ALERT_VOLUME,
  SETTING_AUTOSTART,
  SETTING_CHECK_INTERVAL,
  SETTING_CTHEME,
  SETTING_DESKTOP_NOTIFICATIONS,
  SETTING_EASTEREGG,
  SETTING_LIMIT_BYPASS,
  SETTING_PROXY,
  SETTING_SETTINGS,
  SETTING_THEME,
  SETTING_UID,
  SETTING_WEBHOOK,
  SettingsActionTypes,
  SettingsState,
} from './types';

const initialState: SettingsState = {
  alert_sound: 'voice',
  alert_volume: 100,
  check_interval: 60,
  desktop_notifications: true,
  theme: 'white',
  ctheme: {},
  autostart: {
    enabled: false,
    priceRange: { min: 0, max: -1, enabled: false,min_per_hour:0 },
    timeRange: { min: '00:00', max: '-', enabled: false },
  },
  uid: undefined,
  limit_bypass: false,
  webhook: {url: "",ping:"",enabled:false},
  easter_egg: {},
  proxy: '',
};

export function settingsReducer(state = initialState, action: SettingsActionTypes) {
  if (action.type == SETTING_SETTINGS) {
    return action.payload;
  }
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
        if (!draftState.autostart || !draftState.autostart.priceRange || !draftState.autostart.timeRange) draftState.autostart = {
          enabled: false,
          priceRange: { min: 0, max: -1, enabled: false,min_per_hour:0 },
          timeRange: { min: '00:00', max: '-', enabled: false },
        };

        if (action.payload.type === 'enabled') {
          draftState.autostart.enabled = action.payload.value;
        }
        if (action.payload.type === 'price-range') {
          if(action.payload.value.min < 0) action.payload.value.min = 0;
          if(action.payload.value.min_per_hour < 0) action.payload.value.min_per_hour = 0;
          draftState.autostart.priceRange.min = action.payload.value.min;
          draftState.autostart.priceRange.max = action.payload.value.max;
          draftState.autostart.priceRange.min_per_hour = action.payload.value.min_per_hour;
        }
        if (action.payload.type === 'time-range') {
          if(draftState.autostart.timeRange.min === "") draftState.autostart.timeRange.min = "-";
          if(draftState.autostart.timeRange.max === "") draftState.autostart.timeRange.max = "-";
          draftState.autostart.timeRange.min = action.payload.value.min;
          draftState.autostart.timeRange.max = action.payload.value.max;
        }
        if (action.payload.type === 'price-range-enabled') {
          draftState.autostart.priceRange.enabled = action.payload.value;
        }
        if (action.payload.type === 'time-range-enabled') {
          draftState.autostart.timeRange.enabled = action.payload.value;
        }
        if (action.payload.type === 'reset-filters') {
          draftState.autostart.timeRange = { min: '00:00', max: '-', enabled: false };
          draftState.autostart.priceRange = { min: 0, max: -1, enabled: false,min_per_hour:0 };
        }
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
    }
  });
}
