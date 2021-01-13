import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Form from 'react-bootstrap/Form';
import Tab from 'react-bootstrap/Tab';
import { selectSettings } from '../../store/settings/selectors';
import Button from 'react-bootstrap/Button';
import { spammerAction } from '../../store/session/actions';
import { selectSpammer } from '../../store/session/selectors';

export function StartSpammer() {
  const dispatch = useDispatch();
  const settings = useSelector(selectSettings);
  const spammer = useSelector(selectSpammer);

  function onToggleSpammer() {
    let enabled = (spammer[1]);
    let obj = document.getElementById('study_id_box');
    // @ts-ignore
    let studyid = obj.value;
    // @ts-ignore
    obj.disabled = !enabled;
    if(studyid.length<1){
      // @ts-ignore
      obj.value = spammer[0];
      studyid = spammer[0];
    }
    if(enabled){
      dispatch(spammerAction([studyid, !enabled,spammer[2],spammer[3],spammer[4]]));
    }else {
      dispatch(spammerAction([studyid, !enabled,"",false,0]));
    }

  }

  return (
    <Tab.Pane className="p-1 start-spammer" eventKey="start-spammer">
      <Form.Group>
        <Form.Label>Study ID</Form.Label>
        <Form.Control id="study_id_box" type="text" />
      </Form.Group>
      <Form.Group>
        <Form.Label>Status: {spammer[1] ? 'ACTIVE' : 'INACTIVE'}</Form.Label><br />
        <Form.Label>ID: {spammer[0]}</Form.Label>
      </Form.Group>
      <Form.Group>
        <Button onClick={() => {
          onToggleSpammer();
        }}>
          {spammer[1] ? 'STOP' : 'START'}
        </Button>
      </Form.Group>
      <Form.Group>
        <Form.Label>ERR TITLE :{spammer[2]?(spammer[2].title):""}</Form.Label><br />
        <Form.Label>ERR DETAIL:{spammer[2]?(spammer[2].detail):""}</Form.Label><br />

        <Form.Label>SUCCESS: {spammer[3]?"true":"false"}</Form.Label><br />
        <Form.Label>ITERATIONS: {spammer[4]}</Form.Label><br />

        <Form.Label>FULL LOG:{JSON.stringify(spammer[2])}</Form.Label><br />
      </Form.Group>
    </Tab.Pane>
  );
}