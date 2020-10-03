import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Form from 'react-bootstrap/Form';
import Tab from 'react-bootstrap/Tab';

import { selectLogs, selectSettings } from '../store/settings/selectors';
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
export function LogsPane() {
  const dispatch = useDispatch();
  const logs = useSelector(selectLogs);
  const elements:any = [];
  //console.log(logs)
  try{
  logs.forEach((el:any,i)=>{
    let value = String(JSON.stringify(el.data));
    let timestamp = (el.timestamp);
    let date_f = formatDate(timestamp)
    let el2 = (<div><div className="log_el"><div className="log_time">{date_f}</div><div className="log_data">{value}</div> </div></div>)
    elements.push(el2)
  })}catch {}
  let html = (
    <Tab.Pane className="p-1 logs" eventKey="logs">
      <Form.Group>
        {elements}
      </Form.Group>
    </Tab.Pane>
  );
  return html;
}

function formatDate(date: any) {
  var d = new Date(date),
    hour = '' + (d.getHours()),
    min = '' + d.getMinutes(),
    sec = '' + d.getSeconds();

  if (hour.length < 2)
    hour = '0' + hour;
  if (min.length < 2)
    min = '0' + min;
  if (sec.length < 2)
    sec = '0' + sec;

  return [hour, min, sec].join(':');
}
