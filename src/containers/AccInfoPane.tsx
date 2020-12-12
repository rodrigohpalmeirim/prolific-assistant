import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import Form from 'react-bootstrap/Form';
import Tab from 'react-bootstrap/Tab';

import { selectAcc_Info, selectProlificSubmissions } from '../store/prolific/selectors';
import Nav from 'react-bootstrap/Nav';
import { centsToGBP, centsToGBP_Submission, efficiency } from '../functions/centsToGBP';

export function AccountInfoPane() {
  const acc_info = useSelector(selectAcc_Info);
  const elements: any = [];
  const s_elements: any = [];
  const f_elements: any = [];
  const submissions = useSelector(selectProlificSubmissions);
  try {
    Object.keys(acc_info).forEach(key => {
      let value = String(JSON.stringify(acc_info[key]));
      //console.log(value)
      let el = (<div key={key}>
        <div className="acc_property_h">
          <div className="acc_property">{key}</div>
          :&nbsp;&nbsp;&nbsp;
          <div className="acc_value">{value}</div>
        </div>
      </div>);
      elements.push(el);
    });
  } catch {
  }

  try {
    let keys: any = {
      NAME: 'name',
      ID: 'id',
      EMAIL: 'email',
      STATUS: 'status',
      BALANCE: 'balance $M',
      PENDING: 'pending_balance $M',
    };
    Object.keys(keys).forEach((key2: any) => {
      let key = keys[key2];
      let isMoney = !!key.includes('$M');
      key = key.replace('$M', '').trim();
      let value = String(JSON.stringify(acc_info[key]));
      if (isMoney) {
        value = centsToGBP(Number(value));
      }
      s_elements.push((
        <div className="acc_property_h_s acc_short" key={key}>
          <div className="acc_property acc_f_s_i">{key2}</div>
          <div className="acc_value acc_f_s_i">{value.split('"').join('')}</div>
        </div>
      ));
    });

    s_elements.push((
      <div className="acc_property_h_s acc_short" key={"Efficiency"}>
        <div className="acc_property acc_f_s_i">{"Efficiency"}</div>
        <div className="acc_value acc_f_s_i">{createEfficiency(submissions).split('"').join('')}</div>
      </div>
    ));

  } catch {
  }

  try {
    Object.keys(acc_info).forEach((key: any) => {
      let value = String(JSON.stringify(acc_info[key]));
      f_elements.push((
        <div className="acc_property_h_f acc_full" key={key}>
          <div className="acc_property acc_f_f_i">{key}</div>
          <div className="acc_value acc_f_f_i">{value.split('"').join('')}</div>
        </div>
      ));
    });
  } catch {
  }

  let [key, setKey] = useState('short');

  function onSelect(k: string) {
    setKey(k);
  }

  return (
    <Tab.Pane className="p-1 logs" eventKey="accinfo">
      <Tab.Container activeKey={key} onSelect={onSelect}>
        <Nav className={'w-100 theme2'} variant="pills">
          <Nav.Item className="text-center w-25 nav_btn">
            <Nav.Link eventKey="short">SHORTENED</Nav.Link>
          </Nav.Item>
          <Nav.Item className="text-center w-25 nav_btn">
            <Nav.Link eventKey="full">FULL</Nav.Link>
          </Nav.Item>
          <Nav.Item className="text-center w-25 nav_btn">
            <Nav.Link eventKey="raw">RAW</Nav.Link>
          </Nav.Item>
        </Nav>
        <Tab.Content className={'theme1'}>
          <Tab.Pane className="p-1" eventKey="short">
            <Form.Group>
              {s_elements}
            </Form.Group>
          </Tab.Pane>
          <Tab.Pane className="p-1" eventKey="full">
            <Form.Group>
              {f_elements}
            </Form.Group>
          </Tab.Pane>
          <Tab.Pane className="p-1" eventKey="raw">
            <Form.Group>
              {elements}
            </Form.Group>
          </Tab.Pane>
        </Tab.Content>


      </Tab.Container></Tab.Pane>
  );
}

function createEfficiency(submissions: any) {
  let gbpph = '£---';
  try {

    let eff = efficiency(submissions);
    if (eff >= 0) gbpph = String(centsToGBP_Submission(eff));


  } catch {
  }
  return `${gbpph}/h`;
}