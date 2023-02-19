import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

import { AuthenticationService } from '../_services/authentication.service';
import {SkillsListProfiles} from '../../interfaces/services/projects/skills.service';
import {environment} from '../../../environments/environment';
import {map} from 'rxjs/operators';
import {HttpClient} from '@angular/common/http';
import {Status} from '../../interfaces/services/util.service';
import {Observable} from 'rxjs';
import { switchMap } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
    private aCurrRoles = [];
    private aAccount: any;
    constructor(
        private router: Router,
        private authenticationService: AuthenticationService,
        private http: HttpClient
    ) { }

    async canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<boolean> {
        // return this.checkAccount(route.data.roles);
        // console.log(this.checkAccount(route.data.roles).map());
        // this.router.navigate(['/public/sign-in'], { queryParams: { returnUrl: state.url } });
        const currentUser = this.authenticationService.currentUserAuth;
        if (!currentUser) {
            this.router.navigate(['/public/sign-in'], { queryParams: { returnUrl: state.url } }).then(r => {});
        }
        const res = await this.checkAccount(route.data.roles);
        if (res.status === 0) {
            // this.authenticationService.logout();
            this.router.navigate(['/error/404']).then();
        }
        return (res.status === 1);
    }

    checkAccount(role: String[]): Promise<Status> {
        return this.http.post<Status>(`${environment.apiUrl}/api/auth/account/islogging`, role)
            .toPromise()
            .then(response => response as Status)
            .catch();
    }
}
