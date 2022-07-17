import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Form from 'react-bootstrap/Form';
import Tab from 'react-bootstrap/Tab';
import { selectSettings } from '../../store/settings/selectors';
import { settingWebhook } from '../../store/settings/actions';

export function WebHookPane() {
  const dispatch = useDispatch();
  const settings = useSelector(selectSettings);

  function onChangeWebhook(hook: string) {
    dispatch(settingWebhook([hook, settings.webhook[1],settings.webhook[2]]));
  }

  function onChangeWebhookPings(pings: string) {
    dispatch(settingWebhook([settings.webhook[0], pings,settings.webhook[2]]));
  }
  function enableWebHook(enabled: boolean) {
    dispatch(settingWebhook([settings.webhook[0], settings.webhook[1],enabled]));
  }

  return (
    <Tab.Pane className="p-1 webhook" eventKey="webhook">
      <Form.Group>
        <Form.Check
          label="Enabled"
          type="checkbox"
          checked={settings.webhook[2]}
          onChange={(event:any)=>enableWebHook(event.target.checked)}
        />
      </Form.Group>
      <Form.Group>
        <Form.Label>Discord Webhook</Form.Label>
        <Form.Control id="webhook_box" type="text" value={settings.webhook[0]} onChange={() => {// @ts-ignore
          onChangeWebhook(document.getElementById('webhook_box').value);
        }} />
      </Form.Group>
      <Form.Group>
        <Form.Label>Roles/Users to ping</Form.Label>
        <Form.Control id="webhook_box_pings" type="text" value={settings.webhook[1]} onChange={() => {// @ts-ignore
          onChangeWebhookPings(document.getElementById('webhook_box_pings').value);
        }} />
      </Form.Group>
    </Tab.Pane>
  );
}