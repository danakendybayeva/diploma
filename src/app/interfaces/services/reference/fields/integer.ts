import {IField} from './field';

export interface IntegerField extends IField {
    isUnique: boolean;
    hasRange: boolean;
    rangeFrom?: number;
    rangeTo?: number;
    defaultValue?: number;
    prefix?: string;
    suffix?: string;
    prefixIcon?: string;
    suffixIcon?: string;
}
