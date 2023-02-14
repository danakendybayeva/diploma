import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { environment } from '../../../environments/environment';
import {AuthToken, User} from '../_models/user';
import {Status} from '../../interfaces/services/util.service';

@Injectable({ providedIn: 'root' })
export class AuthenticationService {
    private currentUserSubject: BehaviorSubject<User>;
    public currentUser: Observable<User>;
    private accessToken = '3u3mdeqbzesvbqbpenbo';
    private refreshToken = 'xssdhhn9wpwhmghx1swe';
    private language = environment.defaultLanguage;

    constructor(private http: HttpClient) {
        // this.currentUserSubject = new BehaviorSubject<User>(JSON.parse(localStorage.getItem('currentUser')));
        // this.currentUser = this.currentUserSubject.asObservable();
        if (localStorage.getItem(this.accessToken) && localStorage.getItem(this.refreshToken)) {
            this.currentUserSubject = new BehaviorSubject<User>({
                accessToken: localStorage.getItem(this.accessToken),
                refreshToken: localStorage.getItem(this.refreshToken)
            });
        } else {
            this.currentUserSubject = new BehaviorSubject<User>(null);
        }
        this.currentUser = this.currentUserSubject.asObservable();
    }

    public get currentUserValue(): User {
        return this.currentUserSubject.value;
    }

    public get currentUserAuth(): User {
        return this.currentUserSubject.value;
    }

    login(username: string, password: string) {
        return this.http.post<any>(`${environment.apiUrl}/api/auth/signin-auth`, { username, password })
            .pipe(map(user => {
                // login successful if there's a jwt token in the response
                if (user && user.xkw6bJ4rkXc) {
                    // store user details and jwt token in local storage to keep user logged in between page refreshes
                    localStorage.setItem(this.accessToken, user.xkw6bJ4rkXc);
                    localStorage.setItem(this.refreshToken, user.fxSU8uUwC64);
                    if (user.language !== null) {
                        this.language = user.language;
                    }
                    localStorage.setItem('language', this.language);
                    this.currentUserSubject.next({ accessToken: user.xkw6bJ4rkXc, refreshToken: user.fxSU8uUwC64 });
                }
                return user;
            }));
    }

    logout() {
        // remove user from local storage to log user out
        localStorage.removeItem(this.accessToken);
        localStorage.removeItem(this.refreshToken);
        this.currentUserSubject.next(null);
    }

    resetLink(email) {
        return this.http.post<Status>(`${environment.apiUrl}/api/auth/password/resetlink`, {email: email})
            .pipe(map(data => {
                return data;
            }));
    }

    resetPasswordByToken(password) {
        // this.router.navigate(['']);
        return this.http.post<Status>(`${environment.apiUrl}/api/auth/password/reset`, password)
            .pipe(map(data => {
                return data;
            }));
    }
}
