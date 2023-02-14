import {IOption} from '../../ui/interfaces/option';

export interface Status {
    status: number;
    message: string;
    value: any;
}

export class Util {
    static getStringConditions(): IOption[] {
        return [
            {
                label: 'Содержит',
                value: 'like'
            },
            {
                label: 'Не содержит',
                value: 'not_like'
            }
        ];
    }

    static getNumberConditions(): IOption[] {
        return [
            {
                label: 'Равно',
                value: 'equal'
            },
            {
                label: 'Не равно',
                value: 'not_equal'
            },
            {
                label: 'Больше или равно',
                value: 'more_equal'
            },
            {
                label: 'Меньше или равно',
                value: 'less_equal'
            },
            {
                label: 'Больше',
                value: 'more'
            },
            {
                label: 'Меньше',
                value: 'less'
            }
        ];
    }

    static getConditionByType(type: string): string {
        switch (type) {
            case 'integer':
            case 'float':
            case 'date':
            case 'timestamp':
                // return this.getNumberConditions();
                return 'number';
            case 'string':
            case 'text':
            case 'reference':
            case 'boolean':
            case 'enumeration':
            case 'table':
            case 'structure':
                // return this.getStringConditions();
                return 'string';
        }
    }

    static getUnique(data, param): any[] {
        const arrayUniqueByKey = [...new Map(data.map(item =>
            [item[param], item])).values()];
        return arrayUniqueByKey;
    }
}
