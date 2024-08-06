import {FormControlError} from "../interfaces/interfaces";

export const errors: FormControlError = {
  fromSecond: {
    required: 'Required',
    min: 'Value must be more than 0',
    max: 'Value must be less than 58',
    timeRangeConflict: 'Time range is invalid.',
    fromGreaterThanTo: '"From" value must be less than "To" value.'
  },
  toSecond: {
    required: 'Required',
    min: 'Value must be more than 1',
    max: 'Value must be less than 59',
    timeRangeConflict: 'Time range is invalid.',
    fromGreaterThanTo: '"From" value must be less than "To" value.'
  }
}
