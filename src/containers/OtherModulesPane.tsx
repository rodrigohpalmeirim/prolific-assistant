import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import Tab from 'react-bootstrap/Tab';

import Nav from 'react-bootstrap/Nav';
import { StartSpammer } from './OtherModules/StartSpammerPane';
import { WebHookPane } from './OtherModules/WebHookPane';
import { EasterEggPane } from './OtherModules/EasterEggPane';
import { AutoStartPane } from './OtherModules/AutoStartPane';
import { CustomThemePane } from './OtherModules/CustomThemePane';
import { selectSettings } from '../store/settings/selectors';

export function OtherModulesPane() {
  const settings = useSelector(selectSettings);

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
            <Nav.Link eventKey="start-spammer">StartSpammer</Nav.Link>
          </Nav.Item>
          <Nav.Item className="text-center w-25 nav_btn">
            <Nav.Link eventKey="webhook">DC WebHook</Nav.Link>
          </Nav.Item>
          {settings ? (settings.easter_egg['UNLIMITED_THEMES'] ? <Nav.Item className="text-center w-25 nav_btn">
            <Nav.Link eventKey="custom-theme">CustomTheme</Nav.Link>
          </Nav.Item> : <div />) : <div />}
          <Nav.Item className="text-center w-25 nav_btn">
            <Nav.Link eventKey="easter-egg">???</Nav.Link>
          </Nav.Item>
        </Nav>
        <Tab.Content className={'theme1'}>
          <AutoStartPane />
          <StartSpammer />
          <WebHookPane />
          <CustomThemePane />
          <EasterEggPane />
        </Tab.Content>
      </Tab.Container></Tab.Pane>
  );
}