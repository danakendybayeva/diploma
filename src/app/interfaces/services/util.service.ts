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

    static getFromArrObjectFilter(array: any[], search: string = '', column: string = 'id'): any {
        if (!search.trim()) {
            return array;
        }

        return array.filter(item => {
            return item[column].toLowerCase().indexOf(search.toLowerCase()) !== -1;
        });
    }

    static mapToString(data: any[]): string {
        const result = [];
        if (data && data.length) {
            data.forEach(item => {
                if (item['value']) {
                    result.push(item['value'].toString());
                }
            });
        }
        return result.join(', ');
    }

    static prepareFilter(filter: any): string {
        const result = [];
        if (filter.semester) {
            result.push('st=' + filter.semester);
        }
        if (filter.month && filter.semester == null) {
            result.push('mm=' + filter.month);
        }
        if (filter.gender) {
            result.push('gn=' + filter.gender);
        }
        if (filter.mentors && filter.mentors.length) {
            result.push('mt=' + filter.mentors.join(','));
        }
        if (filter.university && filter.university.length) {
            result.push('u=' + filter.university.join(','));
        }
        if (filter.speciality && filter.speciality.length) {
            result.push('sp=' + filter.speciality.join(','));
        }
        return result.join('&');
    }
}
