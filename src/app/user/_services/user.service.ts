import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { environment } from '../../../environments/environment';
import { User } from '../_models/user';
import {Status} from '../../interfaces/services/util.service';
import {map} from 'rxjs/operators';
import {Question} from '../../interfaces/services/projects/reads.service';

@Injectable({ providedIn: 'root' })
export class UserService {
    constructor(private http: HttpClient) { }

    getAll() {
        return this.http.get<User[]>(`${environment.apiUrl}/users`);
    }

    getById(id: number) {
        return this.http.get<User>(`${environment.apiUrl}/users/${id}`);
    }

    getAdmin(): Promise<Status> {
        return this.http.get(`${environment.apiUrl}/api/auth/user/role/super/admin`)
            .toPromise()
            .then(response => response as Status)
            .catch();
    }

    async isAdmin(): Promise<boolean> {
        const res = await this.getAdmin();
        return (res.status === 1) ? true : false;
    }

    async roleAccount(role: String[]): Promise<boolean> {
        if (role.length === 0) {
            return true;
        }
        const res = await this.http.post<Status>(`${environment.apiUrl}/api/auth/account/islogging`, role)
            .toPromise()
            .then(response => response as Status)
            .catch();
        return (res.status === 1) ? true : false;
    }

    async getRolesAccount(): Promise<string> {
        const roles = await this.http.get(`${environment.apiUrl}/api/auth/user/role`)
            .toPromise()
            .then(response => response as Status)
            .catch();
        return (roles.status === 1) ? roles.value : '';
    }
}
