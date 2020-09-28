import {
  SettingAlertSoundAction,
  SettingAlertVolumeAction,
  SettingCheckIntervalAction,
  SettingsDesktopNotificationAction,
  SETTING_ALERT_SOUND,
  SETTING_ALERT_VOLUME,
  SETTING_CHECK_INTERVAL,
  SETTING_DESKTOP_NOTIFICATIONS, TEST_ALERT_SOUND, TestingAlertSoundAction,
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
