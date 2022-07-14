import { LogObject, LogType } from './types';

export function logObject(log:string,type:LogType,description:string):LogObject{
  return {log,type,description};
}

export function atob_node(data:string):any{
  return  Buffer.from(data, 'base64').toString()
}

export function btoa_node(data:any):string{
  return Buffer.from(data).toString('base64')
}