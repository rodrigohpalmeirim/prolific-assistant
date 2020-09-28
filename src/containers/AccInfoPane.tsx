import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Form from 'react-bootstrap/Form';
import Tab from 'react-bootstrap/Tab';

import { selectSettings } from '../store/settings/selectors';
import {
  settingAlertSound,
  settingAlertVolume,
  settingCheckInterval,
  settingDesktopNotifications, testingAlertSound,
} from '../store/settings/actions';
import { browser } from 'webextension-scripts/polyfill';
import moment from 'moment';
import Button from 'react-bootstrap/Button';
import { AppState, configureStore } from '../store';
import { playAlertSound } from '../functions/playAlertSound';
import { prolificStudiesUpdateMiddleware } from '../store/prolificStudiesUpdateMiddleware';
import { settingsAlertSoundMiddleware } from '../store/settingsAlertSoundMiddleware';
import { selectAcc_Info } from '../store/prolific/selectors';
import ReactDom from 'react-dom';

export function AccountInfoPane() {
  const dispatch = useDispatch();
  const settings = useSelector(selectSettings);
  const acc_info = useSelector(selectAcc_Info);
  const elements:any = [];
  try{
  Object.keys(acc_info).forEach(key=>{
    let value = String(JSON.stringify(acc_info[key]));
    console.log(value)
    let el = (<div><div className="acc_property_h"><div className="acc_property">{key}</div>:&nbsp;&nbsp;&nbsp;<div className="acc_value">{value}</div></div></div>)
    elements.push(el)
  })}catch {}
  let html = (
    <Tab.Pane className="p-1" eventKey="accinfo">
      <Form.Group>
        {elements}
      </Form.Group>
    </Tab.Pane>
  );
  return html;
}
