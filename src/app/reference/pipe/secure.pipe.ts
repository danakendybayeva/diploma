import { Pipe, PipeTransform } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {Observable} from 'rxjs';

@Pipe({
    name: 'secureFile'
})
export class SecurePipe implements PipeTransform {

    constructor(private http: HttpClient) { }

    transform(url: string) {

        return new Observable<string>((observer) => {
            // The next and error callbacks from the observer
            const {next, error} = observer;

            this.http.get(url, {responseType: 'blob'}).subscribe(response => {
                const reader = new FileReader();
                reader.readAsDataURL(response);
                reader.onloadend = function() {
                    observer.next(reader.result.toString());
                };
            });

            return {unsubscribe() {  }};
        });
    }
}
