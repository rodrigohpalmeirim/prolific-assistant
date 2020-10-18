import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Form from 'react-bootstrap/Form';
import Tab from 'react-bootstrap/Tab';
import { selectFLogs, selectLogs } from '../store/session/selectors';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Tooltip from 'react-bootstrap/Tooltip';
import Button from 'react-bootstrap/Button';
import Nav from 'react-bootstrap/Nav';
import { app_container, set_app_container } from '../components/App';
import { noop } from '../store/settings/actions';
import { logUpdate } from '../store/session/actions';

export function LogsPane() {
  const dispatch = useDispatch();
  let logs = useSelector(selectLogs);
  return createLogsView(logs)
}

export function FLogsPane() {
  const dispatch = useDispatch();
  let logs = useSelector(selectFLogs);
  return createLogsView(logs)
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

function elements(logs:any,logsType:any,logsTypes:any){
  const elements: any = [];
  if(app_container=='logs'||location.href.includes('v=flogs')){

  }else {
    return elements;
  }
  try {
    logs.forEach((el: any, i: number) => {
        if (logsTypes.includes(el.type) || logsTypes.includes('all')) {
          let value = String(JSON.stringify(el.data));
          let timestamp = (el.timestamp);
          let date_f = formatDate(timestamp);
          let key = timestamp + '_log-' + Math.random();
          let desc = <div className="log_tooltip">TYPE: {el.type}<br />{el.desc}</div>;
          //console.log(desc);
          let el2 = (<div key={key}>
            <div className={`log_type_${el.type} log_el`}>
              <div>
                <div className="log_time">{date_f}</div>
                <OverlayTrigger placement="auto" overlay={<Tooltip id={`log_type_${el.type}_tooltip`}>{desc}</Tooltip>}>
                  <div className="log_data">{value}</div>
                </OverlayTrigger>
              </div>

            </div>
          </div>);
          elements.push(el2);
        }
      },
    );

  } catch {
  }
  return elements;
}

function createLogsView(logs:any[]){
  const dispatch = useDispatch();
  let logsTypes = ['success', 'error', 'studies'];
  let [logType, setLogType] = useState('status_e_s');

  if (logType == 'all') {
    logsTypes = ['all'];
  } else if (logType == 'status_e_s') {
    logsTypes = ['success', 'error', 'studies'];
  } else {
    logsTypes = [logType];
  }

  let html = (
    <Tab.Pane className="p-1 logs" eventKey="logs">
      <Form.Group>
        <Form.Control as="select" value={logType} onChange={event=>{setLogType(event.target.value)}}>
          <option value="status_e_s">{`STUDIES & ERROR/SUCCESS (${count(logs,'status_e_s')})`}</option>
          <option value="all">{`ALL (${count(logs,'all')})`}</option>
          <option value="studies">{`STUDIES (${count(logs,'studies')})`}</option>
          <option value="success">{`SUCCESS (${count(logs,'success')})`}</option>
          <option value="error">{`ERROR (${count(logs,'error')})`}</option>
          <option value="status">{`STATUS (${count(logs,'status')})`}</option>
        </Form.Control>
        <style>{`
        .log_type_0-studies {color: #595959;}
        .log_type_success {color: lime;}
        .log_type_error {color: red;}
        .log_type_studies {color: #ff6c00;}
        .log_type_status {color: #36bdff;}
        .clearlogs_btn{
        position: absolute;
        bottom: 100px;right: 20px;
        text-align: center;
        }
        `}</style>
        <div className="log-box">
          {elements(logs,logType,logsTypes)}
        </div>
        {location.href.includes('v=flogs')?<div/>:(<div className="clearlogs_btn">
            <Nav.Item>
              <Button onClick={() => {
                window.open(location.href+"?v=flogs");
              }}>
                ALL LOGS
              </Button>
            </Nav.Item>
          </div>)}
      </Form.Group>
    </Tab.Pane>
  );
  return html;
}

function count(logs:any,logType:string){
  let logsTypes = ['success', 'error', 'studies'];
  if (logType == 'all') {
    logsTypes = ['all'];
  } else if (logType == 'status_e_s') {
    logsTypes = ['success', 'error', 'studies'];
  } else {
    logsTypes = [logType];
  }
  let count = 0;
  logs.forEach((el: { type: string; })=>{
    if(logsTypes.includes(el.type)||logsTypes.includes('all')){
      count++;
    }
  })
  return count;
}