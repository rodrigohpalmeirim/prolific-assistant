interface ProlificStudy {
  average_completion_time: number;
  average_reward_per_hour: number;
  date_created: string;
  description: string;
  estimated_completion_time: number;
  estimated_reward_per_hour: number;
  id: string;
  is_desktop_compatible: boolean;
  is_mobile_compatible: boolean;
  is_tablet_compatible: boolean;
  maximum_allowed_time: number;
  name: string;
  places_taken: number;
  published_at: string;
  researcher: {
    id: string;
    name: string;
    institution?: {
      name: string | null;
      logo: string | null;
      link: string;
    };
  };
  reward: number;
  study_type: 'SINGLE';
  total_available_places: number;
}

interface FullProlificStudy extends ProlificStudy{
  external_study_url:string;
  submission:StudyProlificSubmission;
}

interface SharedProlificStudy extends FullProlificStudy{
  claimed:boolean;
  claimed_by:string;
  submission:SharedStudyProlificSubmission;
}

interface ProlificSubmission{
  study:ProlificStudy,
  id:string,
  participant_id:string,
  started_at:string,
  completed_at:string,
  is_complete:boolean,
  time_taken:number,
  reward:number,
  status:"APPROVED"|"RETURNED"|"REJECTED"|"TIMED-OUT"|"AWAITING REVIEW"|"ACTIVE",
  study_code:string,
  star_awarded:boolean,
  bonus_payments:number[],
  adjustment_payments:number[]
}

interface StudyProlificSubmission{
  id:string,
  status:string,
  study_url:string,
  time_remaining:number
}

interface SharedStudyProlificSubmission extends StudyProlificSubmission{
  end_time:number,
}

interface ProlificApiStudies {
  error: {
    additional_information: '/api/v1/errors/';
    detail: string;
    error_code: number;
    status: number;
    title: string;
  };
  meta?: {
    count: number;
  };
  results?: ProlificStudy[];
}

export type LogType = '0-studies' | 'studies' | 'error' | 'status' | 'success'
export type Statistic = { value: number, isMoney: boolean, lastUpdated?: number };
export type _Statistics = {
  refreshes?: Statistic,
  found?: Statistic,
  started?: Statistic,
  spammer_count?: Statistic,
  total_start_amount?: Statistic,
  submissions?: Statistic,
  earned?: Statistic,
  approved?: Statistic,
  found_amount?:Statistic,
  launches?:Statistic,
}
export type Statistics = {
  statistics: _Statistics,
  _lastUpdated?: number,
  accounts_count?: number,
};
export type StatField = keyof _Statistics;

export type FullStatistics = {
  this_user: { [key: string]: Statistics },
  bulk: { default: Statistics }
}
export type LogObject = {log: string, type: LogType, description: string};