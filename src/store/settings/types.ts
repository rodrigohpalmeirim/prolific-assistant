export interface SettingsState {
  autostart: boolean;
  alert_sound:
    | 'none'
    | 'voice'
    | 'sweet-alert-1'
    | 'sweet-alert-2'
    | 'sweet-alert-3'
    | 'sweet-alert-4'
    | 'sweet-alert-5'
    | 'glowa'

  alert_volume: number;
  check_interval: number;
  desktop_notifications: boolean;
  theme: string;
  uid:string;
}

export const SETTING_ALERT_SOUND = 'SETTING_ALERT_SOUND';
export const TEST_ALERT_SOUND = 'TEST_ALERT_SOUND';
export const TEST_STUDY = 'TEST_STUDY';
export const SETTING_ALERT_VOLUME = 'SETTING_ALERT_VOLUME';
export const SETTING_CHECK_INTERVAL = 'SETTING_CHECK_INTERVAL';
export const SETTING_DESKTOP_NOTIFICATIONS = 'SETTING_DESKTOP_NOTIFICATIONS';
export const SETTING_THEME = 'SETTING_THEME';
export const SETTING_UID = 'SETTING_UID';
export const SETTING_AUTOSTART = 'SETTING_AUTOSTART';

export interface SettingAlertSoundAction {
  type: typeof SETTING_ALERT_SOUND;
  payload: SettingsState['alert_sound'];
}
export interface TestingAlertSoundAction {
  type: typeof TEST_ALERT_SOUND;
  payload: "";
}

export interface TestingStudyAction {
  type: typeof TEST_STUDY;
  payload: "";
}

export interface SettingAlertVolumeAction {
  type: typeof SETTING_ALERT_VOLUME;
  payload: SettingsState['alert_volume'];
}

export interface SettingCheckIntervalAction {
  type: typeof SETTING_CHECK_INTERVAL;
  payload: SettingsState['check_interval'];
}

export interface SettingThemeAction {
  type: typeof SETTING_THEME;
  payload: SettingsState['theme'];
}

export interface SettingUIDAction {
  type: typeof SETTING_UID;
  payload: SettingsState['uid'];
}

export interface SettingsDesktopNotificationAction {
  type: typeof SETTING_DESKTOP_NOTIFICATIONS;
  payload: SettingsState['desktop_notifications'];
}

export interface SettingAutostartAction {
  type: typeof SETTING_AUTOSTART;
  payload: SettingsState['autostart'];
}


export type SettingsActionTypes =
  | SettingAlertSoundAction
  | SettingAlertVolumeAction
  | SettingCheckIntervalAction
  | SettingsDesktopNotificationAction
  | SettingThemeAction
  | SettingAutostartAction
  | SettingUIDAction
