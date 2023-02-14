import {IField} from './field';

export interface DateField extends IField {
    isUnique: boolean;
    currentTimestamp: boolean;
    addDays?: number;
    viewFormat?: string;
    minDate?: number;
    maxDate?: number;
    defaultValue?: Date;
}
