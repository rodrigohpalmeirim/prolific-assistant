import React, { useState } from 'react';
import Nav from 'react-bootstrap/Nav';
import Tab from 'react-bootstrap/Tab';

import { Header } from '../containers/Header';
import { StudiesPane } from '../containers/StudiesPane';
import { SettingsPane } from '../containers/SettingsPane';
import { AccountInfoPane } from '../containers/AccInfoPane';
import { LogsPane } from '../containers/LogsPane';
import { useSelector } from 'react-redux';
import { selectSettings } from '../store/settings/selectors';
import { SubmissionsPage } from '../containers/SubmissionsPane';
import { WarnMsg } from '../containers/WarnMsg';

export let themes: any = {
  white: {
    hover:'#d4d4d4'
  },
  dark: {
    theme1bg:'#282828',theme1fg:'white',
    theme2bg:'#151515',theme2fg:'white',
    theme3bg:'#131313',
    hover:'#101010'
  },
};
export let themeApplyCSS = [
  '.form-control{background-color: var(--theme2bg);color: var(--theme2fg);}',
  '.form-control:focus{background-color: var(--theme2bg);color: var(--theme2fg);}',
  '.theme1{background-color: var(--theme1bg);color: var(--theme1fg);}',
  '.theme2{background-color: var(--theme2bg);color: var(--theme2fg);}',
  '.nav_btn:hover{background-color: var(--hover);opacity: 0.8;}',
  '.card {background-color: var(--theme3bg);}'
]


export function returnTheme(theme: string) {
  let css = ''
  try {
    Object.keys(themes[theme]).forEach(key=>{
      css += `--${key}: ${themes[theme][key]};`
    })
  } catch {}
  return `:root{${css}} ${themeApplyCSS.join('\n')}`;
}

export let key: any, setKey:any

export function AppV(view: string) {
  [key, setKey] = useState(view);
  const settings = useSelector(selectSettings);


  function onSelect(k: string) {
    setKey(k);
  }

  let html = (
    <Tab.Container activeKey={key} onSelect={onSelect}>
      <style>
        {`${returnTheme(settings.theme)}`}
      </style>
      <Header />
      <Tab.Content className={'theme1'}>
        <StudiesPane />
        <AccountInfoPane />
        <SettingsPane />
        <LogsPane />
        <SubmissionsPage/>
      </Tab.Content>

      <Nav className={'w-100 theme2'} variant="pills">
        <Nav.Item className="text-center w-25 nav_btn">
          <Nav.Link eventKey="studies">Studies</Nav.Link>
        </Nav.Item>
        <Nav.Item className="text-center w-25 nav_btn">
        <Nav.Link eventKey="submissions">Submissions</Nav.Link>
        </Nav.Item>

        <Nav.Item className="text-center w-50 nav_btn">
          <Nav.Link eventKey="settings">Settings</Nav.Link>
        </Nav.Item>
        <Nav.Item className="text-center w-50 nav_btn">
          <Nav.Link eventKey="accinfo">Account Info</Nav.Link>
        </Nav.Item>
        <Nav.Item className="text-center w-50 nav_btn">
          <Nav.Link eventKey="logs">LOGS</Nav.Link>
        </Nav.Item>
      </Nav>
    </Tab.Container>
  );
  //console.log(html);
  return html;
}

export function App() {
  let loc = location.href;
  if (loc.includes('v=')) {
    let part = loc.split('v=')[1];
    return AppV(part);
  }

  return AppV('studies');
}
