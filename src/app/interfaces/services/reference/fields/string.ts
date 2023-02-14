import {IField} from './field';

export interface StringField extends IField {
    isUnique: boolean;
    minLength?: number;
    maxLength?: number;
    maxShowLength?: number;
    mask?: string;
    defaultValue?: string;
}
