import {IField} from './field';

export interface TableField extends IField {
    defaultValue: any[];
    width: string;
    cellPadding: number;
    border: number;
    canAddDelete: boolean;
    isNumbering: boolean;
    showTotal: boolean;
    separator: string;
    fields: any[];
}
