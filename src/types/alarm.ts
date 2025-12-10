export interface Alarm {
  id: string;
  time: string;
  periodicity: string;
  medicationName: string;
  dosage: string;
  status: 'critical' | 'ok' | 'neutral';
  enabled: boolean;
}

export interface Person {
  id: string;
  name: string;
  avatar: string;
  alarms: Alarm[];
}
