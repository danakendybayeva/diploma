import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../../../environments/environment';
import {FormBuilder} from '@angular/forms';

@Injectable({providedIn: 'root'})
export class DashboardService {
    selected = 0;

    constructor(private http: HttpClient, private formBuilder: FormBuilder) {
    }

    getChartData(type: String = 'a'): Promise<any[]> {
        return  this.http.get<any[]>(`${environment.apiUrl}/api/dashboard/chart/${type}`)
            .toPromise()
            .then(response => {
                return response;
            })
            .catch();
    }

    getReadsCityStudents(week = false): Promise<any[]>  {
        return this.http.get<any[]>(`${environment.apiUrl}/api/dashboard/reads/city/student?week=${week}`)
            .toPromise()
            .then(response => {
                return response;
            })
            .catch();
    }

    getReadsMentor(week = false): Promise<any[]>  {
        return this.http.get<any[]>(`${environment.apiUrl}/api/dashboard/reads/city/mentors?week=${week}`)
            .toPromise()
            .then(response => {
                return response;
            })
            .catch();
    }

}
