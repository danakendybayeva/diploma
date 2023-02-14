import {IField} from './field';

export interface TimestampField extends IField {
    isUnique: boolean;
    currentTimestamp: boolean;
    addDays?: number;
    addTime?: string;
    viewFormat?: string;
    minDay?: number;
    minTime?: string;
    maxDay?: number;
    maxTime?: string;
    defaultValue?: string;
}
