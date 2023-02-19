import {IField} from './field';

export interface EnumerationField extends IField {
    defaultValue: EnumValues[];
    values: EnumValues[];
    isSingle: boolean;
    separator: string;
    value?: EnumValues[];
    isBadges: boolean;
}

export interface EnumValues {
    id: string;
    value: string;
    selected?: boolean;
    badges?: string;
}
