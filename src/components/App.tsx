import React, { useEffect, useState } from 'react';
import Nav from 'react-bootstrap/Nav';
import Tab from 'react-bootstrap/Tab';

import { Header } from '../containers/Header';
import { StudiesPane } from '../containers/StudiesPane';
import { SettingsPane } from '../containers/SettingsPane';
import { AccountInfoPane } from '../containers/AccInfoPane';
import { FLogsPane, LogsPane } from '../containers/LogsPane';
import { useDispatch, useSelector } from 'react-redux';
import { selectSettings } from '../store/settings/selectors';
import { SubmissionsPage } from '../containers/SubmissionsPane';
import { InfoPopup } from '../containers/Popup_Info';
import { StartSpammer } from '../containers/OtherModules/StartSpammerPane';
import { OtherModulesPane } from '../containers/OtherModulesPane';
import { settingTheme } from '../store/settings/actions';
import { selectSession } from '../store/session/selectors';
import { getUser, selectFirebase } from '../store/firebase/actions';

export let themes: any = {
  white: {
    hover: '#d4d4d4',
  },
  'Dark Blue': {
    theme1bg: '#282828', theme1fg: 'white',
    theme2bg: '#151515', theme2fg: 'white',
    theme3bg: '#131313', theme_bfg: '#007bff',
    hover: '#101010',
  },
  'Dark Red': {
    theme1bg: '#282828', theme1fg: 'white',
    theme2bg: '#151515', theme2fg: 'white',
    theme3bg: '#131313', theme_fg: '#ff0000', navbar: 'var(--theme3bg)',
    hover: '#101010', theme_bfg: '#750000', theme_bfg_h: '#b50000',
  },
};

export let hiddenThemes:any = {
  'RGB':{
    theme1bg: '#282828', theme1fg: 'white',
    theme2bg: '#151515', theme2fg: 'white',
    theme3bg: '#131313', theme_fg: 'var(--rgbRainbow)', navbar: 'var(--theme3bg)',
    hover: '#101010', theme_bfg: '#750000', theme_bfg_h: '#b50000',
    custom:[
      '@-webkit-keyframes rainbow_bg{0%{background-color: orange}10%{background-color: purple}20%{background-color: red}30%{background-color: CadetBlue}40%{background-color: yellow}50%{background-color: coral}60%{background-color: green}70%{background-color: cyan}80%{background-color: DeepPink}90%{background-color: DodgerBlue}100%{background-color: orange}}@-ms-keyframes rainbow_bg{0%{background-color: orange}10%{background-color: purple}20%{background-color: red}30%{background-color: CadetBlue}40%{background-color: yellow}50%{background-color: coral}60%{background-color: green}70%{background-color: cyan}80%{background-color: DeepPink}90%{background-color: DodgerBlue}100%{background-color: orange}}@keyframes rainbow_bg{0%{background-color: orange}10%{background-color: purple}20%{background-color: red}30%{background-color: CadetBlue}40%{background-color: yellow}50%{background-color: coral}60%{background-color: green}70%{background-color: cyan}80%{background-color: DeepPink}90%{background-color: DodgerBlue}100%{background-color: orange}}',
      '@-webkit-keyframes rainbow{0%{color: orange}10%{color: purple}20%{color: red}30%{color: CadetBlue}40%{color: yellow}50%{color: coral}60%{color: green}70%{color: cyan}80%{color: DeepPink}90%{color: DodgerBlue}100%{color: orange}}@-ms-keyframes rainbow{0%{color: orange}10%{color: purple}20%{color: red}30%{color: CadetBlue}40%{color: yellow}50%{color: coral}60%{color: green}70%{color: cyan}80%{color: DeepPink}90%{color: DodgerBlue}100%{color: orange}}@keyframes rainbow{0%{color: orange}10%{color: purple}20%{color: red}30%{color: CadetBlue}40%{color: yellow}50%{color: coral}60%{color: green}70%{color: cyan}80%{color: DeepPink}90%{color: DodgerBlue}100%{color: orange}}',
      'a:hover{-webkit-animation:rainbow 30s infinite;-ms-animation:rainbow 30s infinite;animation:rainbow 30s infinite;}',
      '.nav-link{-webkit-animation:rainbow 30s infinite;-ms-animation:rainbow 30s infinite;animation:rainbow 30s infinite;}',
      '.btn{-webkit-animation:rainbow_bg 30s infinite;-ms-animation:rainbow_bg 30s infinite;animation:rainbow_bg 30s infinite;}',

    ]
  },
}

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
  'body{background-color: var(--theme1bg)}',
];

export function getCombinedThemes(settings:any){
  return getCombinedThemesS(settings)
}

export function getCombinedThemesS(settings:any){
  let combined:any = {}
  Object.keys(themes).forEach((key:any)=>{
    combined[key] = themes[key];
  })
  Object.keys(hiddenThemes).forEach((key:any)=>{
    if(((settings.easter_egg&&settings.easter_egg[key])))
      combined[key] = hiddenThemes[key];
  })
  if(((settings.easter_egg&&settings.easter_egg["UNLIMITED_THEMES"])))
  combined["custom"] = settings.ctheme[0];
  return combined;
}

export function returnTheme(theme: string,settings:any):any {
  if(!settings)return "";
  let allThemes:any = getCombinedThemes(settings);
  if(!allThemes[theme]){useDispatch()(settingTheme('white'));location.reload();return returnTheme('white',settings);}
  let css = '';
  let css2 = '';

  try {
    if(allThemes[theme]){
      Object.keys(allThemes[theme]).forEach(key => {
        if(key==='custom'){
          allThemes[theme]['custom'].forEach((el:any)=>{
            css2+=el+" ";
          })

        }else {
          css += `--${key}: ${allThemes[theme][key]};`;
        }

      });
    }
  } catch {
  }
  return `:root{${css}} ${prepareApplyCSS()} ${css2}`;

  function prepareApplyCSS() {
    let css = themeApplyCSS;
    let keys = Object.keys(allThemes[theme]);
    let regex = /var\(--([a-z0-9A-Z_]*)\)/gm;
    css.forEach(el => {
      let m;
      while ((m = regex.exec(el)) !== null) {
        // This is necessary to avoid infinite loops with zero-width matches
        if (m.index === regex.lastIndex) {
          regex.lastIndex++;
        }

        // The result can be accessed through the `m`-variable.
        m.forEach((match, groupIndex) => {
          if (groupIndex == 1) {
            if (!keys.includes(match)) {
              css[css.indexOf(el)] = '';
            }
          }
        });
      }
    });

    return css.join(' ');
  }
}

export let app_container: any, set_app_container: any;

export function AppV({view}: {view:string}) {
  [app_container, set_app_container] = useState(view);
  const settings = useSelector(selectSettings);
  const firebase = useSelector(selectFirebase);
  const forceUpdate = useForceUpdate();

  useEffect(()=>{
    forceUpdate();
  },[firebase?.currentUser, firebase?.canUsePA])

  useEffect(()=>{
    forceUpdate();
  },[!!firebase])
  if(!firebase)return <></>;

  function onSelect(k: string) {
    set_app_container(k);
  }
  return (
    <Tab.Container activeKey={app_container} onSelect={onSelect}>
      <style>{`body{overflow:hidden;}`}</style>
      <InfoPopup />
      <style>
        {`${returnTheme(settings?settings.theme?settings.theme:"white":"white",settings)}`}
      </style>
      <Header />
      <Tab.Content className={'theme1'}>
        <StudiesPane />
        <AccountInfoPane />
        <SettingsPane />
        <LogsPane />
        <SubmissionsPage />
        <OtherModulesPane />
      </Tab.Content>

      <Nav className={'w-100 theme2'} variant="pills">
        <Nav.Item className="text-center w-25 nav_btn">
          <Nav.Link eventKey="studies">Studies</Nav.Link>
        </Nav.Item>
        <Nav.Item className="text-center w-25 nav_btn">
          <Nav.Link eventKey="submissions">Submissions</Nav.Link>
        </Nav.Item>

        {firebase.canUsePA===true?(<Nav.Item className="text-center w-25 nav_btn">
          <Nav.Link eventKey="other">Other Modules</Nav.Link>
        </Nav.Item>):""}
        <Nav.Item className="text-center w-25 nav_btn">
          <Nav.Link eventKey="settings">Settings</Nav.Link>
        </Nav.Item>
        {firebase.canUsePA===true?(<Nav.Item className="text-center w-50 nav_btn">
          <Nav.Link eventKey="accinfo">Account Info</Nav.Link>
        </Nav.Item>):""}
        <Nav.Item className={`text-center w-${firebase.canUsePA===true?"50":"25"} nav_btn`}>
          <Nav.Link eventKey="logs">LOGS</Nav.Link>
        </Nav.Item>
      </Nav>
    </Tab.Container>
  );
}
export function useForceUpdate() {
  const [value, setValue] = useState(0);
  return () => setValue(value => value + 1);
}

export function App() {
  let loc = location.href;
  const settings = useSelector(selectSettings);

  if (loc.includes('v=flogs')) {
    return <div>
      <style>
        {`${returnTheme(settings.theme,settings)}`}
      </style>
      <FLogsPane /></div>;
  }

  if (loc.includes('v=')) {
    let part = loc.split('v=')[1];
    return <AppV view={part}></AppV>;
  }

  return <AppV view={"studies"}></AppV>;
}
