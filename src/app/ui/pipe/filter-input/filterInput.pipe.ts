import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'todoFilter'
})
export class FilterInputPipe implements PipeTransform {
    transform(todos: any[], search: string = '', column: string = 'fio'): any {
        if (!search.trim()) {
            return todos;
        }

        return todos.filter(todo => {
            return todo[column].toLowerCase().indexOf(search.toLowerCase()) !== -1;
        });
    }
}
