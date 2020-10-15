import { useDispatch, useSelector } from 'react-redux';
import { selectSettings } from '../store/settings/selectors';
import { selectAcc_Info, selectProlific, selectProlificError } from '../store/prolific/selectors';
import React, { useState } from 'react';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Tooltip from 'react-bootstrap/Tooltip';
import { Nav, Popover } from 'react-bootstrap';
import { setKey } from '../components/App';
import { browser } from 'webextension-scripts/polyfill';
import Button from 'react-bootstrap/Button';
import { logUpdate, popup } from '../store/session/actions';
import { selectPopup } from '../store/session/selectors';
import { Dispatch } from 'redux';

let dispatch: Dispatch<any>;
export function InfoPopup() {
  dispatch = useDispatch();
  const settings = useSelector(selectSettings);
  const acc_info = useSelector(selectAcc_Info);
  const error = useSelector(selectProlificError);
  const popup = useSelector(selectPopup);

  if(!popup.text||!popup.type)return <div/>
  return <div><div className="i_popup_f"></div>{createPopup(popup.type,popup.text)}</div>

}

function createPopup(type:string,text:string){
  if(type==='ok'){
    return (<div className="i_popup">
      <div className="i_popup_txt raw">{text}</div><div className="i_popup_btn">
      <Nav.Item>
        <Button onClick={() => {
          closePopup();
        }}>
          OK
        </Button>
      </Nav.Item>
    </div></div>)
  }
}

function closePopup(){
  dispatch(popup({}));
}