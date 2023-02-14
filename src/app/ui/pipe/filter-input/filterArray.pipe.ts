import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'FilterArray'
})
export class FilterArrayPipe implements PipeTransform {
    transform(todos: any, search: any[]): any {
        if (search.length === 0) {
            return todos;
        }
        return todos.filter(todo => {
            if (search.indexOf(todo.address) !== -1) {
                return todo;
            }
        });
    }
}
