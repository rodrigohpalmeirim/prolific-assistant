import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Form from 'react-bootstrap/Form';
import Tab from 'react-bootstrap/Tab';
import Button from 'react-bootstrap/Button';
import { spammerAction } from '../../store/session/actions';
import { selectSpammer, selectSpammerConfig } from '../../store/session/selectors';

export function StartSpammer() {
  const dispatch = useDispatch();
  const spammer = useSelector(selectSpammer);
  const spammerConfig = useSelector(selectSpammerConfig);

  function onToggleStudySpammer(studyID:string) {
    if(studyID.length<1){
      return;
    }
    let enabled = spammerConfig.studies[studyID].enabled;

    if(enabled){
      dispatch(spammerAction({type:"config",studyID,data:{enabled:!enabled}}));
    }else {
      dispatch(spammerAction({type:"output",studyID,data:{success:false,iterations:0,error:undefined}}))
      dispatch(spammerAction({type:"config",studyID,data:{enabled:!enabled}}));
    }
  }

  function addStudy(studyID:string, start:boolean){
    if(studyID.length<1){
      return;
    }
    dispatch(spammerAction({type:"config",studyID,data:{enabled:start}}));
  }

  function removeStudy(studyID:string){
    if(studyID.length<1){
      return;
    }
    dispatch(spammerAction({type:"delete",studyID}));
  }

  function clearStudies(){
    dispatch(spammerAction({type:"clear"}));
  }

  if(!spammer || !spammerConfig)return <></>

  let active_studies = Object.keys(spammerConfig.studies).reduce((prev,curr)=>{
    if(spammerConfig.studies[curr].enabled) prev.push(curr);
    return prev;
  },[])

  return (
    <Tab.Pane className="p-1 start-spammer" eventKey="start-spammer">
      <Form.Group>
        <Form.Label>Status: {active_studies.length>0 ? 'ACTIVE' : 'INACTIVE'}</Form.Label><br />
        <Form.Label>IDs: {JSON.stringify(active_studies)}</Form.Label>
      </Form.Group>
      <Form.Group>
        <Form.Label>Study ID</Form.Label>
        <Form.Control id="study_id_box" type="text" />
      </Form.Group>
      <Form.Group>
        <Button className="mx-2" onClick={() => {
          // @ts-ignore
          addStudy(document.getElementById('study_id_box').value, true);
        }}>
          Add & Start
        </Button>
        <Button className="mx-2" onClick={() => {
          // @ts-ignore
          addStudy(document.getElementById('study_id_box').value,false);
        }}>
          Add
        </Button>
        <Button className="mx-2" onClick={() => {
          // @ts-ignore
          clearStudies();
        }}>
          Clear All
        </Button>
      </Form.Group>
      <Form.Group>
        {Object.keys(spammerConfig.studies).map(studyID=>{
          let studyConfig = spammerConfig.studies[studyID];
          let studyOutput = spammer.studies?spammer.studies[studyID]:undefined;
          if(!studyConfig)return <></>;

          return <Form.Group>
            <Form.Label>Study ID: {studyID}</Form.Label><br/>
            <Form.Label>Active: {studyConfig?.enabled? "true" : "false"}</Form.Label><br/>
            <Form.Label>Success: {studyOutput?.success? "true" : "false"}</Form.Label><br/>
            <Form.Label>Iterations: {studyOutput?.iterations || "0"}</Form.Label><br/>

            <Form.Label>ERR TITLE :{JSON.stringify(studyOutput?.error?.title)}</Form.Label><br />
            <Form.Label>ERR DETAIL:{JSON.stringify(studyOutput?.error?.detail)}</Form.Label><br />
            <Form.Label>FULL LOG:{JSON.stringify(studyOutput?.error)}</Form.Label><br />

            <Button className="mx-2" onClick={() => {
              // @ts-ignore
              onToggleStudySpammer(studyID);
            }}>
              {studyConfig?.enabled?"STOP":"START"}
            </Button>
            <Button className="mx-2" onClick={() => {
              // @ts-ignore
              removeStudy(studyID);
            }}>
              REMOVE
            </Button>
          </Form.Group>
        })}
      </Form.Group>
    </Tab.Pane>
  );
}