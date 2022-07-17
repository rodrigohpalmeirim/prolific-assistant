import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Form from 'react-bootstrap/Form';
import Tab from 'react-bootstrap/Tab';
import { selectSettings } from '../../store/settings/selectors';
import Button from 'react-bootstrap/Button';
import { settingCTheme } from '../../store/settings/actions';
import { getCombinedThemesS } from '../../components/App';
import { showOKPopup } from '../Popup_Info';
import { atob_node, btoa_node } from '../../helpers';

export function CustomThemePane() {
  const dispatch = useDispatch();
  const settings = useSelector(selectSettings);

  if (!settings.ctheme) resetTheme();

  function onChangeProp(prop: string, value: string) {
    let ctheme = settings.ctheme[0];
    ctheme[prop] = value;
    dispatch(settingCTheme([ctheme, settings.ctheme[1]]));
  }

  function Base64ToTheme(base64:string) {
    try{
    let ctheme = JSON.parse(atob_node(base64))
    dispatch(settingCTheme([ctheme, settings.ctheme[1]]));
      showOKPopup(`Theme applied successfully`)}catch {
      showOKPopup(`Theme is invalid. Base64 to JSON parsing error`)
    }
  }
  function ThemeToBase64() {
    let ctheme = settings.ctheme[0]
    return btoa_node(JSON.stringify(ctheme))
  }

  function getProp(prop: string): any {
    return settings.ctheme[0][prop];
  }

  function getThemeProps(){
    return ['theme1bg', 'theme1fg', 'theme2bg', 'theme2fg', 'theme3bg', 'theme3fg', 'navbar', 'hover', 'theme_bfg', 'theme_bfg_h', 'custom'];
  }

  function resetTheme() {
    let ctheme: any = {};
    if (!settings.ctheme) {
      dispatch(settingCTheme([{}, false]));
      return;
    }
    let allThemes = getCombinedThemesS(settings);
    const themeProps = getThemeProps()
    themeProps.forEach((prop: any) => {
      try {
        ctheme[prop] = allThemes[settings.theme][prop]?allThemes[settings.theme][prop]:"";
      } catch {
      }
    });
    dispatch(settingCTheme([ctheme, settings.ctheme[1]]));
  }

  return (
    <Tab.Pane className="p-1 custom-theme" eventKey="custom-theme">
      <Form.Group>
        <Button onClick={() => {
          // @ts-ignore
          resetTheme();
        }}>
          RESET TO CURRENT THEME
        </Button>
      </Form.Group>
      {generateColorBoxes()}
      <Form.Group>
        <Form.Label>{"EXPORT/IMPORT"}</Form.Label>
        <Form.Control className={"ThemeBase64Input"} type="text"/>
      </Form.Group>
      <Form.Group>
        <Button onClick={() => {
          // @ts-ignore
          document.querySelector('.ThemeBase64Input').value = ThemeToBase64();
        }}>
          GENERATE
        </Button>&nbsp;&nbsp;&nbsp;
        <Button onClick={() => {
          // @ts-ignore
          Base64ToTheme(document.querySelector('.ThemeBase64Input').value)
        }}>
          APPLY
        </Button>
      </Form.Group>
    </Tab.Pane>
  );

  function generateColorBoxes(): any {
    let boxes: any = [];
    const themeProps = getThemeProps()

    themeProps.forEach(prop => {
      let box = (<Form.Group style={{ display: 'inline-block', width: '50%' }} key={`theme_prop_${prop}`}>
        <Form.Label style={{ display: 'inline-block', width: '25%', textAlign: 'center' }}>{prop}</Form.Label>
        <Form.Control style={{ display: 'inline', width: '45%' }} type="text" onChange={(event: any) => {
          const value = (event.target.value);
          onChangeProp(prop, value);
        }} value={getProp(prop)} />
      </Form.Group>);
      boxes.push(box);
    });
    return boxes;
  }
}