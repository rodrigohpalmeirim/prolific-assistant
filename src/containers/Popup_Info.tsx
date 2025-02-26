import { useDispatch, useSelector } from 'react-redux';
import React from 'react';
import { Nav } from 'react-bootstrap';
import Button from 'react-bootstrap/Button';
import { popup } from '../store/session/actions';
import { selectPopup } from '../store/session/selectors';
import { Dispatch } from 'redux';

let dispatch: Dispatch<any>;

export function InfoPopup() {
  dispatch = useDispatch();
  const popup = useSelector(selectPopup);

  if (!popup.text || !popup.type) return <div />;
  return returnPopup(popup.type,popup.text)

}

function returnPopup(type:any,text:any){
  return <div>
    <div className="i_popup_f" />
    {createPopup(type, text)}</div>;
}

export function showOKPopup(text:string){
  dispatch(popup({ type: 'ok', text: text}));
}

function createPopup(type: string, text: string) {
  if (type === 'ok') {
    return (<div className="i_popup">
      <div className="i_popup_txt raw">{text}</div>
      <div className="i_popup_btn">
        <Nav.Item>
          <Button onClick={() => {
            closePopup();
          }}>
            OK
          </Button>
        </Nav.Item>
      </div>
    </div>);
  }
}

function closePopup() {
  dispatch(popup({}));
}