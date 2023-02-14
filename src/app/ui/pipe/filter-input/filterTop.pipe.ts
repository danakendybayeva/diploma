import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'filterTop'
})
export class FilterTopPipe implements PipeTransform {
    transform(todos: any[], search: any = null, column: string, condition: string = 'equal'): any {
        const equal = condition === 'equal';
        if ((typeof search === 'string' && search.trim() !== '')
            || (typeof search !== 'boolean' && !search)) {
            return todos;
        }

        return todos.filter(todo => {
            if ((equal && typeof search !== 'string' && todo[column] === search)
                || (!equal && typeof search !== 'string' && todo[column] !== search)) {
                return true;
            }
            if (typeof search === 'string') {
                return (equal && todo[column].indexOf(search) !== -1) || (!equal && todo[column].indexOf(search) === -1);
            }
        });
    }
}
