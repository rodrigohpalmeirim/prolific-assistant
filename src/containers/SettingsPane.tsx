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
  settingProxy,
  settingTheme,
  settingUID,
  settingWebhook,
  testingAlertSound,
  testingStudy,
  settingOpenStudy,
  settingAcceptStudy,
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
  function onChangeProxyBox(proxy: string) {
    dispatch(settingProxy(proxy));
  }

  function onChangeCheckInterval(event: any) {
    const value = Number(event.target.value);

    if (1 <= value) {
      dispatch(settingCheckInterval(Number(event.target.value)));
    }

  }

  function onChangeTheme(event: any) {
    dispatch(settingTheme(event.target.value));
    location.href = '?v=settings';
  }

  function onChangeDesktopNotification(event: any) {
    dispatch(settingDesktopNotifications(event.target.checked));
  }

  function onChangeOpenStudy(event: any) {
    dispatch(settingOpenStudy(event.target.checked));
  }

  function onChangeAcceptStudy(event: any) {
    dispatch(settingAcceptStudy(event.target.checked));
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
        <Form.Label>Alert Volume</Form.Label>
        <Form.Control type="number" onChange={onChangeAlertVolume} value={settings.alert_volume.toString()} />
      </Form.Group>
      <Form.Group>
        <Form.Check
          label="Desktop notifications"
          type="checkbox"
          checked={settings.desktop_notifications}
          onChange={onChangeDesktopNotification}
        />
        <Form.Check
          label="Automatically open studies in new tab"
          type="checkbox"
          checked={settings.open_study}
          onChange={onChangeOpenStudy}
        />
        <Form.Check
          label="Automatically accept studies"
          type="checkbox"
          checked={settings.accept_study}
          onChange={onChangeAcceptStudy}
        />
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
        <Form.Label>Start Proxy: "{settings.proxy}"</Form.Label>
        <Form.Control id="proxy_box" type="text" />
      </Form.Group>
      <Form.Group>
        <Button onClick={() => {
          // @ts-ignore
          onChangeProxyBox(document.getElementById('proxy_box').value);
        }}>
          SET Proxy
        </Button>
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
