import React, { useState } from 'react';
import Nav from 'react-bootstrap/Nav';
import Tab from 'react-bootstrap/Tab';

import { Header } from '../containers/Header';
import { StudiesPane } from '../containers/StudiesPane';
import { SettingsPane } from '../containers/SettingsPane';
import { AccountInfoPane } from '../containers/AccInfoPane';
import { LogsPane } from '../containers/LogsPane';

export function AppV(view:string) {
  let [key, setKey] = useState(view);
  function onSelect(k: string) {
    setKey(k);
  }
  let html = (
    <Tab.Container activeKey={key} onSelect={onSelect}>
      <Header />

      <Tab.Content>
        <StudiesPane />
        <AccountInfoPane />
        <SettingsPane />
        <LogsPane />
      </Tab.Content>

      <Nav className="w-100" variant="pills">
        <Nav.Item className="text-center w-50">
          <Nav.Link eventKey="studies">Studies</Nav.Link>
        </Nav.Item>
        <Nav.Item className="text-center w-50">
          <Nav.Link eventKey="settings">Settings</Nav.Link>
        </Nav.Item>
        <Nav.Item className="text-center w-50">
          <Nav.Link eventKey="accinfo">Account Info</Nav.Link>
        </Nav.Item>
        <Nav.Item className="text-center w-50">
          <Nav.Link eventKey="logs">LOGS</Nav.Link>
        </Nav.Item>
      </Nav>
    </Tab.Container>
  );
  //console.log(html);
  return html;
}

export function App() {
  let loc = location.hash;
  if(loc.includes('v=')){
    let part = loc.split('v=')[1];
    return AppV(part)
  }

  return AppV('studies')
}
