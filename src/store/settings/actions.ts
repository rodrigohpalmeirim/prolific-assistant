import {
  RELOAD,
  ReloadAction,
  RESET,
  ResetSettingsAction,
  SETTING_ALERT_SOUND,
  SETTING_ALERT_VOLUME,
  SETTING_AUTOSTART,
  SETTING_CHECK_INTERVAL,
  SETTING_DESKTOP_NOTIFICATIONS,
  SETTING_THEME,
  SETTING_UID,
  SettingAlertSoundAction,
  SettingAlertVolumeAction,
  SettingAutostartAction,
  SettingCheckIntervalAction,
  SettingsDesktopNotificationAction,
  SettingThemeAction,
  SettingUIDAction,
  TEST_ALERT_SOUND,
  TEST_STUDY,
  TestingAlertSoundAction,
  TestingStudyAction,
} from './types';

export function settingAlertSound(payload: SettingAlertSoundAction['payload']): SettingAlertSoundAction {
  return {
    type: SETTING_ALERT_SOUND,
    payload,
  };
}
export function testingAlertSound(): TestingAlertSoundAction {
  return {
    type: TEST_ALERT_SOUND, payload: ''
  };
}

export function testingStudy(): TestingStudyAction {
  return {
    type: TEST_STUDY, payload: ''
  };
}

export function settingAlertVolume(payload: SettingAlertVolumeAction['payload']): SettingAlertVolumeAction {
  return {
    type: SETTING_ALERT_VOLUME,
    payload,
  };
}

export function settingCheckInterval(payload: SettingCheckIntervalAction['payload']): SettingCheckIntervalAction {
  return {
    type: SETTING_CHECK_INTERVAL,
    payload,
  };
}

export function settingDesktopNotifications(
  payload: SettingsDesktopNotificationAction['payload'],
): SettingsDesktopNotificationAction {
  return {
    type: SETTING_DESKTOP_NOTIFICATIONS,
    payload,
  };
}

export function settingTheme(payload: SettingThemeAction['payload']): SettingThemeAction {
  return {
    type: SETTING_THEME,
    payload,
  };
}

export function settingUID(payload: SettingUIDAction['payload']): SettingUIDAction {
  return {
    type: SETTING_UID,
    payload,
  };
}


export function settingAutoStart(payload: SettingAutostartAction['payload']): SettingAutostartAction {
  return {
    type: SETTING_AUTOSTART,
    payload,
  };
}

export function resetSettings(): ResetSettingsAction {
  return {
    type: RESET, payload: ''
  };
}
export function reload(): ReloadAction {
  return {
    type: RELOAD, payload: ''
  };
}