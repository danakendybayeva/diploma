import {IField} from './field';

export interface FileField extends IField {
    defaultValue?: any[];
    isSingle: boolean;
    isUnique: boolean;
    convertToPdf: boolean;
    enableScanning: boolean;
    enableProtection: boolean;
    extension: string;
    separator: string;
    maxSize: number;
    maxCount: number;
    maxTotalSize: number;
    renameFile: string;
    filterName: string;
    value?: any[];
}
