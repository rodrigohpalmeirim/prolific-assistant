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
import { InfoPopup } from '../containers/Popup_Info';

export let themes: any = {
  white: {
    hover:'#d4d4d4'
  },
  "Dark Blue": {
    theme1bg:'#282828',theme1fg:'white',
    theme2bg:'#151515',theme2fg:'white',
    theme3bg:'#131313',theme_bfg:'#007bff',
    hover:'#101010'
  },
  "Dark Red": {
    theme1bg:'#282828',theme1fg:'white',
    theme2bg:'#151515',theme2fg:'white',
    theme3bg:'#131313',theme_fg:'#ff0000',navbar:'var(--theme3bg)',
    hover:'#101010'   ,theme_bfg:'#750000',theme_bfg_h:'#b50000',
  },
};
export let themeApplyCSS = [
  '.form-control{background-color: var(--theme2bg);color: var(--theme2fg);}',
  '.form-control:focus{background-color: var(--theme2bg);color: var(--theme2fg);}',
  '.theme1{background-color: var(--theme1bg);color: var(--theme1fg);}',
  '.theme2{background-color: var(--theme2bg);color: var(--theme2fg);}',
  '.nav_btn:hover{background-color: var(--hover);opacity: 0.8;}',
  '.card {background-color: var(--theme3bg);}',
  '.btn-primary{background-color: var(--theme_bfg); border-color: var(--theme_bfg) !important;}',
  '.nav-link.active{background-color: var(--theme_bfg) !important; border-color: var(--theme_bfg) !important;}',
  '.nav-link{color: var(--theme_fg);}',
  '.btn-primary:hover{background-color: var(--theme_bfg_h); border-color: var(--theme_bfg) !important;}',
  '.navbar {background-color: var(--navbar) !important;}',
  'a:hover{color:var(--theme_fg)}',
  '.acc_property_h_s{background-color: var(--theme2bg);}',
  '.acc_property_h_f{background-color: var(--theme2bg);}',
  '.btn-primary:not(:disabled):not(.disabled):active {background-color: var(--theme_bfg)}',
  '.btn-primary:focus{background-color: var(--theme_bfg_h);}',
  '.btn-primary:not(:disabled):not(.disabled):active:focus{box-shadow: var(--theme_bfg);}',
  '.btn-primary:focus{box-shadow: var(--theme_bfg);}',
  '.i_popup,.i_popup_f{background-color: var(--theme3bg);color: var(--theme1fg);}',
  '.i_popup{border-color: var(--theme_bfg);}',
]


export function returnTheme(theme: string) {
  let css = ''
  try {
    Object.keys(themes[theme]).forEach(key=>{
      css += `--${key}: ${themes[theme][key]};`
    })
  } catch {}
  return `:root{${css}} ${prepareApplyCSS()}`;
  function prepareApplyCSS(){
    let css = themeApplyCSS;
    let keys = Object.keys(themes[theme])
    let csskeys = [];
    let regex = /var\(--([a-z0-9A-Z_]*)\)/gm;
    css.forEach(el=>{
      let m;
      while ((m = regex.exec(el)) !== null) {
        // This is necessary to avoid infinite loops with zero-width matches
        if (m.index === regex.lastIndex) {
          regex.lastIndex++;
        }

        // The result can be accessed through the `m`-variable.
        m.forEach((match, groupIndex) => {
          if(groupIndex==1){
            if(!keys.includes(match)){
              css[css.indexOf(el)] = '';
            }
          }
        });
      }
    })

    return css.join('\n');
  }
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
      <InfoPopup/>
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
