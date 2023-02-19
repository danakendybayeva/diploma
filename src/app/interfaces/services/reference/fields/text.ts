import {IField} from './field';

export interface TextField extends IField {
    isUnique: boolean;
    maxShowLength?: number;
    defaultValue?: string;
}
