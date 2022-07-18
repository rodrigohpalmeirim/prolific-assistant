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
    dispatch(settingWebhook({url:hook,ping:settings?.webhook?.ping,enabled:settings?.webhook?.enabled}));
  }

  function onChangeWebhookPings(pings: string) {
    dispatch(settingWebhook({url:settings?.webhook?.url,ping:pings,enabled:settings?.webhook?.enabled}));
  }
  function enableWebHook(enabled: boolean) {
    dispatch(settingWebhook({url:settings?.webhook?.url,ping:settings?.webhook?.ping,enabled:enabled}));
  }

  return (
    <Tab.Pane className="p-1 webhook" eventKey="webhook">
      <Form.Group>
        <Form.Check
          label="Enabled"
          type="checkbox"
          checked={settings?.webhook?.enabled}
          onChange={(event:any)=>enableWebHook(event.target.checked)}
        />
      </Form.Group>
      <Form.Group>
        <Form.Label>Discord Webhook</Form.Label>
        <Form.Control id="webhook_box" type="text" value={settings?.webhook?.url} onChange={() => {// @ts-ignore
          onChangeWebhook(document.getElementById('webhook_box').value);
        }} />
      </Form.Group>
      <Form.Group>
        <Form.Label>Roles/Users to ping</Form.Label>
        <Form.Control id="webhook_box_pings" type="text" value={settings?.webhook?.ping} onChange={() => {// @ts-ignore
          onChangeWebhookPings(document.getElementById('webhook_box_pings').value);
        }} />
      </Form.Group>
    </Tab.Pane>
  );
}