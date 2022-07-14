import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Form from 'react-bootstrap/Form';
import Tab from 'react-bootstrap/Tab';
import { selectSettings } from '../../store/settings/selectors';
import Button from 'react-bootstrap/Button';
import { settingEasterEgg } from '../../store/settings/actions';
import { showOKPopup } from '../Popup_Info';

export function EasterEggPane() {
  const dispatch = useDispatch();
  const settings = useSelector(selectSettings);

  function onSubmitCode(code: string) {
    switch (code.toUpperCase()) {
      case 'GLOWA':
        toggleEasterEggValue('glowa');
        break;
      case 'TRIAL':
        toggleEasterEggValue('trial');
        break;
      case '2137':
        toggleEasterEggValue('2137');
        break;
      case 'ATOS':
        toggleEasterEggValue('atos');
        break;
      case 'RGB':
        toggleEasterEggValue('RGB');
        break;
      case 'UNLIMITED_THEMES':
        toggleEasterEggValue('UNLIMITED_THEMES');
        break;
    }
  }

  function toggleEasterEggValue(name: any) {
    if (!settings.easter_egg) settings.easter_egg = {};
    if (!settings.easter_egg[name]) settings.easter_egg[name] = false;
    settings.easter_egg[name] = !settings.easter_egg[name];
    dispatch(settingEasterEgg(settings.easter_egg));
    showOKPopup(settings.easter_egg[name] ? 'Activated' : 'Deactivated');
  }

  function returnCodes() {
    const easterEgg = settings.easter_egg;
    let codes = '';
    if (!settings.easter_egg) return;
    Object.keys(easterEgg).forEach(key => {
      if (settings.easter_egg[key])
        codes += `${key}\n`;
    });
    return codes;
  }

  return (
    <Tab.Pane className="p-1 easter-egg" eventKey="easter-egg">
      <Form.Group>
        <Form.Label>Code ???</Form.Label>
        <Form.Control id="code_box" type="text" />
      </Form.Group>
      <Form.Group>
        <Button onClick={() => {
          // @ts-ignore
          onSubmitCode(document.getElementById('code_box').value);
        }}>
          Submit Code
        </Button>
      </Form.Group>
      <Form.Group>
        <Form.Label>{returnCodes()}</Form.Label>
      </Form.Group>
    </Tab.Pane>
  );
}
