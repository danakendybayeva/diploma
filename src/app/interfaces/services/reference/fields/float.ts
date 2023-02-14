import {IField} from './field';

export interface FloatField extends IField {
    isUnique: boolean;
    hasRange: boolean;
    rangeFrom?: number;
    rangeTo?: number;
    defaultValue?: number;
}
