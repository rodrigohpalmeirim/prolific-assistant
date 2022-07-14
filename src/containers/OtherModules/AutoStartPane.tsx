import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Form from 'react-bootstrap/Form';
import Tab from 'react-bootstrap/Tab';
import { selectSettings } from '../../store/settings/selectors';
import { selectSpammer } from '../../store/session/selectors';
import { settingAutoStart} from '../../store/settings/actions';
import { getTimeString, priceRange, testTimeRange, timeRange } from '../../functions/centsToGBP';
import Button from 'react-bootstrap/Button';

export function AutoStartPane() {
  const dispatch = useDispatch();
  const settings = useSelector(selectSettings);
  useSelector(selectSpammer);

  function onChangeEnabled(enabled: boolean) {
    dispatch(settingAutoStart([enabled, settings.autostart[1],settings.autostart[2]]));
  }
  function onChangeTimeEnabled(enabled: boolean) {
    dispatch(settingAutoStart([settings.autostart[0], settings.autostart[1],[settings.autostart[2][0],settings.autostart[2][1],enabled]]));
  }
  function onResetFilters() {
    dispatch(settingAutoStart([settings.autostart[0],undefined,undefined]));
    dispatch(settingAutoStart([settings.autostart[0],[0,-1],[0,-1]]));
  }

  function onChangePriceRange(minPrice:number, maxPrice:number) {
    dispatch(settingAutoStart([settings.autostart[0], [minPrice,maxPrice],settings.autostart[2]]));
  }
  function onChangeMinPriceRange(minPrice:number) {
    if(!settings.autostart[1]){onChangePriceRange(0,-1);return;}
    if(minPrice<0)minPrice=0;
    if(minPrice>20)minPrice=20;
    if(settings.autostart[1][1]>=0&&minPrice>settings.autostart[1][1])minPrice = settings.autostart[1][1];
    dispatch(settingAutoStart([settings.autostart[0], [minPrice,settings.autostart[1][1]],settings.autostart[2]]));
  }
  function onChangeMaxPriceRange(maxPrice:number) {
    if(!settings.autostart[1]){onChangePriceRange(0,-1);return;}
    if(maxPrice<-1)maxPrice=-1;
    if(maxPrice>20)maxPrice=-1;
    if(maxPrice>-1&&settings.autostart[1][0]>maxPrice&&settings.autostart[1][1]<0)maxPrice=settings.autostart[1][0];
    if(settings.autostart[1][0]>maxPrice)maxPrice=-1;
    dispatch(settingAutoStart([settings.autostart[0], [settings.autostart[1][0],maxPrice],settings.autostart[2]]));
  }

  function onChangeTimeRange(minTime:string, maxTime:string,enabled:boolean) {
    dispatch(settingAutoStart([settings.autostart[0], settings.autostart[1],[minTime,maxTime,enabled]]));
  }
  function onChangeMinTimeRange(minTime:string) {
    if(!settings.autostart[2]){onChangeTimeRange("00:00","00:00",false);return;}
    dispatch(settingAutoStart([settings.autostart[0], settings.autostart[1],[minTime,settings.autostart[2][1],settings.autostart[2][2]]]));
  }
  function onChangeMaxTimeRange(maxTime:string) {
    if(!settings.autostart[2]){onChangeTimeRange("00:00","00:00",false);return;}
    dispatch(settingAutoStart([settings.autostart[0], settings.autostart[1],[settings.autostart[2][0],maxTime,settings.autostart[2][2]]]));
  }

  return (
    <Tab.Pane className="p-1 start-spammer" eventKey="start-spammer">
      <Form.Group>
        <Form.Check
          label="Enabled"
          type="checkbox"
          checked={(settings.autostart[0])}
          onChange={(event:any)=>onChangeEnabled(event.target.checked)}
        />
      </Form.Group>
      <Form.Label>Price Range: {priceRange(settings.autostart[1])[0]+" > "+priceRange(settings.autostart[1])[1]}</Form.Label><br/>
      <Form.Group style={{display:"inline-block",width:"50%"}}>
        <Form.Label style={{display:"inline-block",width:"25%",textAlign: "center"}}>Minimum Price</Form.Label>
        <Form.Control className={"minPriceBox"} step={0.10} style={{display:"inline",width:"75%"}} type="number" onChange={(event:any)=>{const value = Number(event.target.value);onChangeMinPriceRange(value)}} value={settings.autostart[1]?settings.autostart[1][0]:0} />
      </Form.Group>
      <Form.Group style={{display:"inline-block",width:"50%"}}>
        <Form.Label style={{display:"inline-block",width:"25%",textAlign: "center"}}>Maximum Price</Form.Label>
        <Form.Control className={"maxPriceBox"} step={0.10} style={{display:"inline",width:"75%"}} type="number" onChange={(event:any)=>{const value = Number(event.target.value);onChangeMaxPriceRange(value)}} value={settings.autostart[1]?settings.autostart[1][1]:-1} />
      </Form.Group>
      <Form.Label>Time Range: {timeRange(settings.autostart[2])[0]+" > "+timeRange(settings.autostart[2])[1]+`   NOW:${testTimeRange(settings.autostart[2])} (${getTimeString()})`}</Form.Label><br/>
      <Form.Group>
        <Form.Check
          label="Time Range Enabled"
          type="checkbox"
          checked={(settings.autostart[2][2])}
          onChange={(event:any)=>onChangeTimeEnabled(event.target.checked)}
        />
      </Form.Group>
      <Form.Group style={{display:"inline-block",width:"50%"}}>
        <Form.Label style={{display:"inline-block",width:"25%",textAlign: "center"}}>From</Form.Label>
        <Form.Control className={"minTimeBox"} style={{display:"inline",width:"75%"}} type="time" onChange={(event:any)=>{const value = (event.target.value);onChangeMinTimeRange(value)}} value={settings.autostart[2]?settings.autostart[2][0]: "00:00"} />
      </Form.Group>
      <Form.Group style={{display:"inline-block",width:"50%"}}>
        <Form.Label style={{display:"inline-block",width:"25%",textAlign: "center"}}>To</Form.Label>
        <Form.Control className={"maxTimeBox"} style={{display:"inline",width:"75%"}} type="time" onChange={(event:any)=>{const value = (event.target.value);onChangeMaxTimeRange(value)}} value={settings.autostart[2]?settings.autostart[2][1]: "00:00"} />
      </Form.Group>
      <Form.Group>
        <Button onClick={() => {
          onResetFilters();
        }}>
          RESET FILTERS
        </Button>
      </Form.Group>
    </Tab.Pane>
  );
}