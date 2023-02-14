import {IField} from './field';

export interface EnumerationField extends IField {
    defaultValue: EnumValues[];
    values: EnumValues[];
    isSingle: boolean;
    separator: string;
}

export interface EnumValues {
    id: string;
    value: string;
    selected?: boolean;
}
