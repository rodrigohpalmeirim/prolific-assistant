import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import Form from 'react-bootstrap/Form';
import Tab from 'react-bootstrap/Tab';

import { selectAcc_Info, selectProlificSubmissions } from '../store/prolific/selectors';
import Nav from 'react-bootstrap/Nav';
import { centsToGBP, centsToGBP_Submission, efficiency } from '../functions/centsToGBP';
import { StartSpammer } from './OtherModules/StartSpammerPane';
import { WebHookPane } from './OtherModules/WebHookPane';
import { EasterEggPane } from './OtherModules/EasterEggPane';
import { AutoStartPane } from './OtherModules/AutoStartPane';
import { CustomThemePane } from './OtherModules/CustomThemePane';
import { selectSettings } from '../store/settings/selectors';

export function OtherModulesPane() {
  const acc_info = useSelector(selectAcc_Info);
  const settings = useSelector(selectSettings);
  const elements: any = [];
  const s_elements: any = [];
  const f_elements: any = [];
  const submissions = useSelector(selectProlificSubmissions);

  let [key, setKey] = useState('short');

  function onSelect(k: string) {
    setKey(k);
  }

  return (
    <Tab.Pane className="p-1 other" eventKey="other">
      <Tab.Container activeKey={key} onSelect={onSelect}>
        <Nav className={'w-100 theme2'} variant="pills">
          <Nav.Item className="text-center w-25 nav_btn">
            <Nav.Link eventKey="autostart">AutoStart</Nav.Link>
          </Nav.Item>
          <Nav.Item className="text-center w-25 nav_btn">
            <Nav.Link eventKey="sspammer">StartSpammer</Nav.Link>
          </Nav.Item>
          <Nav.Item className="text-center w-25 nav_btn">
            <Nav.Link eventKey="webhook">DC WebHook</Nav.Link>
          </Nav.Item>
          {settings?(settings.easter_egg["UNLIMITED_THEMES"]? <Nav.Item className="text-center w-25 nav_btn">
            <Nav.Link eventKey="custom-theme">CustomTheme</Nav.Link>
          </Nav.Item>:<div/>):<div/>}
          <Nav.Item className="text-center w-25 nav_btn">
            <Nav.Link eventKey="easter-egg">???</Nav.Link>
          </Nav.Item>
        </Nav>
        <Tab.Content className={'theme1'}>
          <Tab.Pane className="p-1" eventKey="autostart">
            <Form.Group>
              <AutoStartPane/>
            </Form.Group>
          </Tab.Pane>
          <Tab.Pane className="p-1" eventKey="sspammer">
            <Form.Group>
              <StartSpammer/>
            </Form.Group>
          </Tab.Pane>
          <Tab.Pane className="p-1" eventKey="webhook">
            <Form.Group>
              <WebHookPane/>
            </Form.Group>
          </Tab.Pane>
          <Tab.Pane className="p-1" eventKey="custom-theme">
            <Form.Group>
              <CustomThemePane/>
            </Form.Group>
          </Tab.Pane>
          <Tab.Pane className="p-1" eventKey="easter-egg">
            <Form.Group>
              <EasterEggPane/>
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