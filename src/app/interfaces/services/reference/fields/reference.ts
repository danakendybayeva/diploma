import {IField} from './field';

export interface ReferenceField extends IField {
    isUnique: boolean;
    defaultValue: RefValues[];
    referenceId: string;
    isSingle: boolean;
    separator: string;
    limit: number;
    disableLink: boolean;
    fields: string[];
    defaultGroup: any[];
    defaultSort: SortType;
    templateView: string;
    enableNumbered: boolean;
    filters?: any[];

    isActive?: boolean;
    enableSubdivision?: boolean;
    enableGroup?: boolean;
    hideAll?: boolean;
}

export interface SortType {
    field: string;
    type: string;
}

export interface RefValues {
    id: string;
    value: string;
}
