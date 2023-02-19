import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'mapToString'
})
export class MapToStringPipe implements PipeTransform {
    transform(data): string {
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
}
