export interface GridData {
  fromSecond: number;
  toSecond: number;
  color: string;
}

export interface FormControlError {
  [key: string]: ErrorMessage;
}

interface ErrorMessage {
  required: string;
  min: string;
  max: string;
  timeRangeConflict: string;
  fromGreaterThanTo: string;
}
