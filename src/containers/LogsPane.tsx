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
import { selectLogs } from '../store/session/selectors';

function onChangeLogsType(event: any) {
  try{
  let value = event.target.value;
  if(value=='all'){
    document.querySelectorAll('.log_el').forEach((el:any)=>el.style.display= 'revert')
  }else if(value=='status_e_s'){
    document.querySelectorAll('.log_el').forEach((el:any)=>el.style.display= 'none')
    document.querySelectorAll(`.log_type_success`).forEach((el:any)=>el.style.display= 'revert')
    document.querySelectorAll(`.log_type_error`).forEach((el:any)=>el.style.display= 'revert')
    document.querySelectorAll(`.log_type_studies`).forEach((el:any)=>el.style.display= 'revert')
  }else {
    try{
      document.querySelectorAll('.log_el').forEach((el:any)=>el.style.display= 'none')
      document.querySelectorAll(`.log_type_${value}`).forEach((el:any)=>el.style.display= 'revert')
    }catch {}
  }}catch {}
}
let logs:any;
let logsType= 'studies_e_s'
export function LogsPane() {
  const dispatch = useDispatch();
  logs = useSelector(selectLogs);
  const elements:any = [];
  //console.log(logs)
  try{
  logs.forEach((el:any,i:number)=>{
    let value = String(JSON.stringify(el.data));
    let timestamp = (el.timestamp);
    let date_f = formatDate(timestamp)
    let el2 = (<div><div className={`log_type_${el.type} log_el`}><div className="log_time">{date_f}</div><div className="log_data">{value}</div> </div></div>)
    elements.push(el2)
  })}catch {}
  let html = (
    <Tab.Pane className="p-1 logs" eventKey="logs">
      <Form.Group>
        <Form.Control as="select" onChange={onChangeLogsType}>
          <option value="status_e_s">STUDIES & ERROR/SUCCESS</option>
          <option value="all">ALL</option>
          <option value="studies">STUDIES</option>
          <option value="success">SUCCESS</option>
          <option value="error">ERROR</option>
          <option value="status">STATUS</option>
        </Form.Control>
        <style>{`.log_el{display:none};`}</style>
        <style>{`
        .log_type_0-studies {color: #595959;}
        .log_type_success {color: lime;display:revert}
        .log_type_error {color: red;display:revert}
        .log_type_studies {color: #ff6c00;display:revert}
        .log_type_status {color: #36bdff;}
        `}</style>
        <div className="log-box">
        {elements}
        </div>
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
