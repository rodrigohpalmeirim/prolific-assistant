import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Form from 'react-bootstrap/Form';
import Tab from 'react-bootstrap/Tab';
import { selectSettings } from '../../store/settings/selectors';
import { selectSpammer } from '../../store/session/selectors';
import { settingAutoStart} from '../../store/settings/actions';
import { centsToGBP, getTimeString, priceRange, testTimeRange, timeRange } from '../../functions/centsToGBP';
import Button from 'react-bootstrap/Button';

export function AutoStartPane() {
  const dispatch = useDispatch();
  const settings = useSelector(selectSettings);
  useSelector(selectSpammer);

  function onChangeEnabled(enabled: boolean) {
    dispatch(settingAutoStart({type:"enabled",value:enabled}));
  }
  function onChangeTimeEnabled(enabled: boolean) {
    dispatch(settingAutoStart({type:"time-range-enabled",value:enabled}));
  }
  function onChangePriceEnabled(enabled: boolean) {
    dispatch(settingAutoStart({type:"price-range-enabled",value:enabled}));
  }
  function onResetFilters() {
    dispatch(settingAutoStart({type:"reset-filters"}));
  }

  function onChangePriceRange(min:number, max:number,min_per_hour:number) {
    dispatch(settingAutoStart({type:"price-range",value:{min,max,min_per_hour}}));
  }
  function onChangeMinPriceRange(minPrice:number) {
    onChangePriceRange(minPrice,settings?.autostart?.priceRange?.max,settings?.autostart?.priceRange?.min_per_hour);
  }
  function onChangeMinPricePerHRange(minPricePerH:number) {
    onChangePriceRange(settings?.autostart?.priceRange?.min,settings?.autostart?.priceRange?.max,minPricePerH);
  }
  function onChangeMaxPriceRange(maxPrice:number) {
    onChangePriceRange(settings?.autostart?.priceRange?.min,maxPrice,settings?.autostart?.priceRange?.min_per_hour);
  }

  function onChangeTimeRange(min:string, max:string) {
    dispatch(settingAutoStart({type:"time-range",value:{min,max}}));
  }
  function onChangeMinTimeRange(minTime:string) {
    onChangeTimeRange(minTime,settings?.autostart?.timeRange?.max);
  }
  function onChangeMaxTimeRange(maxTime:string) {
    onChangeTimeRange(settings?.autostart?.timeRange?.min,maxTime);
  }

  return (
    <Tab.Pane className="p-1 autostart" eventKey="autostart">
      <Form.Group>
        <Form.Check
          label="Enabled"
          type="checkbox"
          checked={(settings?.autostart?.enabled)}
          onChange={(event:any)=>onChangeEnabled(event.target.checked)}
        />
      </Form.Group>
      <Form.Label>Price Range: {centsToGBP(priceRange(settings?.autostart?.priceRange).min*100)+" - "+centsToGBP(priceRange(settings?.autostart?.priceRange).max*100)}</Form.Label><br/>
      <Form.Group>
        <Form.Check
          label="Price Range Enabled"
          type="checkbox"
          checked={(settings?.autostart?.priceRange?.enabled)}
          onChange={(event:any)=>onChangePriceEnabled(event.target.checked)}
        />
      </Form.Group>
      <Form.Group style={{display:"inline-block",width:"50%"}}>
        <Form.Label style={{display:"inline-block",width:"25%",textAlign: "center"}}>Minimum Price</Form.Label>
        <Form.Control className={"minPriceBox"} step={0.10} style={{display:"inline",width:"75%"}} type="number" onChange={(event:any)=>{const value = Number(event.target.value);onChangeMinPriceRange(value)}} value={settings?.autostart?.priceRange?.min} />
      </Form.Group>
      <Form.Group style={{display:"inline-block",width:"50%"}}>
        <Form.Label style={{display:"inline-block",width:"25%",textAlign: "center"}}>Minimum Price per hour</Form.Label>
        <Form.Control className={"minPricephBox"} step={0.10} style={{display:"inline",width:"75%"}} type="number" onChange={(event:any)=>{const value = Number(event.target.value);onChangeMinPricePerHRange(value)}} value={settings?.autostart?.priceRange?.min_per_hour} />
      </Form.Group>
      <Form.Group style={{display:"inline-block",width:"50%"}}>
        <Form.Label style={{display:"inline-block",width:"25%",textAlign: "center"}}>Maximum Price</Form.Label>
        <Form.Control className={"maxPriceBox"} step={0.10} style={{display:"inline",width:"75%"}} type="number" onChange={(event:any)=>{const value = Number(event.target.value);onChangeMaxPriceRange(value)}} value={settings?.autostart?.priceRange?.max} />
      </Form.Group>
      <Form.Label>Time Range: {timeRange(settings?.autostart?.timeRange).min+" - "+timeRange(settings?.autostart?.timeRange).max+`   NOW:${testTimeRange(settings?.autostart?.timeRange)} (${getTimeString()})`}</Form.Label><br/>
      <Form.Group>
        <Form.Check
          label="Time Range Enabled"
          type="checkbox"
          checked={(settings?.autostart?.timeRange?.enabled)}
          onChange={(event:any)=>onChangeTimeEnabled(event.target.checked)}
        />
      </Form.Group>
      <Form.Group style={{display:"inline-block",width:"50%"}}>
        <Form.Label style={{display:"inline-block",width:"25%",textAlign: "center"}}>From</Form.Label>
        <Form.Control className={"minTimeBox"} style={{display:"inline",width:"75%"}} type="time" onChange={(event:any)=>{const value = (event.target.value);onChangeMinTimeRange(value)}} value={settings?.autostart?.timeRange?.min} />
      </Form.Group>
      <Form.Group style={{display:"inline-block",width:"50%"}}>
        <Form.Label style={{display:"inline-block",width:"25%",textAlign: "center"}}>To</Form.Label>
        <Form.Control className={"maxTimeBox"} style={{display:"inline",width:"75%"}} type="time" onChange={(event:any)=>{const value = (event.target.value);onChangeMaxTimeRange(value)}} value={settings?.autostart?.timeRange?.max} />
      </Form.Group>
      <Form.Group>
        <Button className="mx-2" onClick={() => {
          onResetFilters();
        }}>
          RESET FILTERS
        </Button>
      </Form.Group>
    </Tab.Pane>
  );
}