import {ReferenceField} from './reference';

export interface StructureField extends ReferenceField {
    isUnique: boolean;
    defaultValue: RefValues[];
    isSingle: boolean;
    isActive: boolean;
    separator: string;
    limit: number;
    disableLink: boolean;
    fields: string[];
    defaultGroup: any[];
    defaultSort: SortType;
    templateView: string;
    enableNumbered: boolean;
    enableSubdivision: boolean;
    enableGroup: boolean;
    hideAll: boolean;
    filters?: any[];
}

export interface SortType {
    field: string;
    type: string;
}

export interface RefValues {
    id: string;
    value: string;
}
