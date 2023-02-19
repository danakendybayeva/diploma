import {IField} from './field';

export interface ImageField extends IField {
    defaultValue?: any[];
    isSingle: boolean;
    isAvatar: boolean;
    separator: string;
    maxSize: number;
    maxCount: number;
    thumbX: number;
    thumbY: number;
    renameFile: string;
    filterName: string;
    value?: any[];
}
