import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Form from 'react-bootstrap/Form';
import Tab from 'react-bootstrap/Tab';

import { selectSettings } from '../store/settings/selectors';
import {
  reload,
  resetSettings,
  settingAlertSound,
  settingAlertVolume,
  settingAutoStart,
  settingCheckInterval,
  settingDesktopNotifications,
  settingLimitBypass,
  settingTheme,
  settingUID,
  settingWebhook,
  testingAlertSound,
  testingStudy,
} from '../store/settings/actions';
import { browser } from 'webextension-scripts/polyfill';
import Button from 'react-bootstrap/Button';
import { getCombinedThemesS, hiddenThemes, themes } from '../components/App';

export function SettingsPane() {
  const dispatch = useDispatch();
  const settings = useSelector(selectSettings);

  function onChangeAlertSound(event: any) {
    dispatch(settingAlertSound(event.target.value));

  }

  function onTestAlertSound() {
    dispatch(testingAlertSound());
  }

  function onTestStudy() {
    dispatch(testingStudy());
  }

  function onChangeAlertVolume(event: any) {
    const value = Number(event.target.value);

    if (0 <= value && value <= 100) {
      dispatch(settingAlertVolume(value));
    }
  }

  function onChangeUID(uid: string) {
    dispatch(settingUID(uid));
  }

  function onChangeCheckInterval(event: any) {
    const value = Number(event.target.value);
    if (!settings.limit_bypass) {
      if (15 <= value) {
        dispatch(settingCheckInterval(Number(event.target.value)));
      } else {
        dispatch(settingCheckInterval(15));
      }
    } else {
      if (5 <= value) {
        dispatch(settingCheckInterval(Number(event.target.value)));
      } else {
        dispatch(settingCheckInterval(5));
      }
    }

  }

  function onChangeTheme(event: any) {
    dispatch(settingTheme(event.target.value));
    location.href = '?v=settings';
  }

  function onChangeDesktopNotification(event: any) {
    dispatch(settingDesktopNotifications(event.target.checked));
  }

  function onChangeLimitBypass(event: any) {
    dispatch(settingLimitBypass(event.target.checked));

    if (!settings.limit_bypass && settings.check_interval < 15) {
      dispatch(settingCheckInterval(15));
    }
  }

  function onChangeAutoStart(event: any) {
    dispatch(settingAutoStart(event.target.checked));
  }

  function createThemesOptions() {
    let elements: JSX.Element[] = [];
    Object.keys(getCombinedThemesS(settings)).forEach(key => {
      let str = key;
      let fstr = str[0].toUpperCase() + str.substring(1);
      elements.push(<option key={str} value={str}>{fstr}</option>);
    });
    return elements;
  }

  function ResetSettings() {
    dispatch(resetSettings());
    Reload();
  }

  function Reload() {
    dispatch(reload());
    location.reload();
  }

  return (
    <Tab.Pane className="p-1 settings" eventKey="settings">
      <Form.Group>
        <Form.Label>Check Interval</Form.Label>
        <Form.Control type="number" onChange={onChangeCheckInterval} value={settings.check_interval.toString()} />
      </Form.Group>
      <Form.Group>
        <Form.Check
          label="Allow values lower than 15"
          type="checkbox"
          checked={settings.limit_bypass}
          onChange={onChangeLimitBypass}
        />
      </Form.Group>
      <Form.Group>
        <Form.Label>Alert Sound</Form.Label>
        <Form.Control as="select" onChange={onChangeAlertSound} value={settings.alert_sound}>
          <option value="none">None</option>
          <option value="voice">Voice</option>
          <option value="sweet-alert-1">Sweet Alert 1</option>
          <option value="sweet-alert-2">Sweet Alert 2</option>
          <option value="sweet-alert-3">Sweet Alert 3</option>
          <option value="sweet-alert-4">Sweet Alert 4</option>
          <option value="sweet-alert-5">Sweet Alert 5</option>
          {(settings.easter_egg&&settings.easter_egg.glowa)?(<option value="glowa">Glowa</option>):("")}
          {(settings.easter_egg&&settings.easter_egg.trial)?(<option value="trial">Trial</option>):("")}

        </Form.Control>
      </Form.Group>
      <Form.Group>
        <Button onClick={() => {
          onTestAlertSound();
        }}>
          TEST NOTIFICATION
        </Button>
      </Form.Group>
      <Form.Group>
        <Form.Label>Alert Volume</Form.Label>
        <Form.Control type="number" onChange={onChangeAlertVolume} value={settings.alert_volume.toString()} />
      </Form.Group>
      <Form.Group>
        <Form.Label>Prolific ID</Form.Label>
        <Form.Control id="uid_box" type="text" />
      </Form.Group>
      <Form.Group>
        <Button onClick={() => {
          // @ts-ignore
          onChangeUID(document.getElementById('uid_box').value);
          browser.runtime.sendMessage('check_for_studies-cuid');
        }}>
          SET Prolific ID
        </Button>
      </Form.Group>
      <Form.Group>
        <Form.Check
          label="Desktop Notifications"
          type="checkbox"
          checked={settings.desktop_notifications}
          onChange={onChangeDesktopNotification}
        />
      </Form.Group>
      <Form.Group>
        <Form.Check
          label="AutoStart Studies"
          type="checkbox"
          checked={settings.autostart}
          onChange={onChangeAutoStart}
        />
      </Form.Group>
      <Form.Group>
        <Button onClick={() => {
          onTestStudy();
        }}>
          TEST FAKE STUDY
        </Button>
      </Form.Group>
      <Form.Group>
        <Form.Label>Theme</Form.Label>
        <Form.Control as="select" onChange={onChangeTheme} value={settings.theme}>
          {createThemesOptions()}
        </Form.Control>
      </Form.Group>
      <Form.Group>
        <Button onClick={() => {
          ResetSettings();
        }}>
          RESET SETTINGS
        </Button>
        &nbsp;&nbsp;&nbsp;
        <Button onClick={() => {
          Reload();
        }}>
          RELOAD
        </Button>
      </Form.Group>
    </Tab.Pane>
  );
}
