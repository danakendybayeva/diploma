import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'trim'
})
export class TrimPipe implements PipeTransform {
    transform(todos: string): string {
        let res = todos.replace(/ /g, '');
        return res;
    }
}
