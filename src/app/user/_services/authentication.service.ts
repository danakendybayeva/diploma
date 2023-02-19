import {Injectable, NgZone} from '@angular/core';
import {HttpClient, HttpEvent, HttpHandler, HttpRequest} from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import {first, map} from 'rxjs/operators';

import { environment } from '../../../environments/environment';
import {AuthToken, User} from '../_models/user';
import {Status} from '../../interfaces/services/util.service';
import {Router} from '@angular/router';
import {AngularFireAuth} from '@angular/fire/auth';
import firebase from 'firebase/app';
import {UserPayload} from '../_models/payload/user.payload';

@Injectable({ providedIn: 'root' })
export class AuthenticationService {
    private currentUserSubject: BehaviorSubject<User>;
    private currentUserSwitch: User;
    public currentUser: Observable<User>;
    private onSwitched = false;
    private accessTokenSwitched = 'B1pBuwGh7Iq0UhMeo0lB';
    private refreshTokenSwitched = 'lwwvJiWgLHzUjS5yqact';
    private accessToken = '3u3mdeqbzesvbqbpenbo';
    private refreshToken = 'xssdhhn9wpwhmghx1swe';
    private language = environment.defaultLanguage;

    constructor(
        public http: HttpClient,
        private router: Router,
        public afAuth: AngularFireAuth,
        public ngZone: NgZone
    ) {
        // this.currentUserSubject = new BehaviorSubject<User>(JSON.parse(localStorage.getItem('currentUser')));
        // this.currentUser = this.currentUserSubject.asObservable();
        if (localStorage.getItem(this.accessToken) && localStorage.getItem(this.refreshToken)) {
            const expiryDate = new Date(localStorage.getItem('expiry'));
            this.currentUserSubject = new BehaviorSubject<User>({
                accessToken: localStorage.getItem(this.accessToken),
                refreshToken: localStorage.getItem(this.refreshToken),
                expiryDuration: expiryDate
            });
        } else {
            this.currentUserSubject = new BehaviorSubject<User>(null);
        }
        this.currentUser = this.currentUserSubject.asObservable();
        this.currentUserSwitch = this.currentUserSubject.value;
        let isAdmin = false;
        this.getAdmin().then(r => isAdmin = r.status === 1).catch();
        if (localStorage.getItem(this.accessTokenSwitched) && localStorage.getItem(this.refreshTokenSwitched) && isAdmin) {
            this.onSwitched = true;
            const expiryDate = new Date(localStorage.getItem('expiry'));
            const currentUserSubjectSwitched = new BehaviorSubject<User>({
                accessToken: localStorage.getItem(this.accessTokenSwitched),
                refreshToken: localStorage.getItem(this.refreshTokenSwitched),
                expiryDuration: expiryDate
            });
            this.currentUserSwitch = currentUserSubjectSwitched.value;
        }
    }

    getAdmin(): Promise<Status> {
        return this.http.get(`${environment.apiUrl}/api/auth/user/role/super/admin`)
            .toPromise()
            .then(response => response as Status)
            .catch();
    }

    public get isSwitched(): boolean {
        return this.onSwitched;
    }

    public get currentUserSwitchValue(): User {
        return this.currentUserSwitch;
    }

    public get currentUserValue(): User {
        return this.currentUserSubject.value;
    }

    public get currentUserAuth(): User {
        return this.currentUserSubject.value;
    }

    setCurrentUserValue(accessToken, refreshToken, expiryDate) {
        const expires = new Date();
        expires.setSeconds(expires.getSeconds() + expiryDate);

        localStorage.setItem(this.accessToken, accessToken);
        localStorage.setItem(this.refreshToken, refreshToken);
        localStorage.setItem('expiry', expires.getTime().toString());
        this.currentUserSubject.next({
            accessToken: accessToken,
            refreshToken: refreshToken,
            expiryDuration: expires
        });
    }

    public get isExpiring(): boolean {
        const expiryDate = new Date(Number(localStorage.getItem('expiry')));
        const now = new Date();
        const arr = new Date(expiryDate.getTime() - now.getTime());
        if ((arr.getTime() / 1000 / 60) <= 30) {
            return true;
        }
        return false;
    }

    // public get isSwitchExpiring(): boolean {
    //     const expiryDate = new Date(Number(localStorage.getItem('expirySwitched')));
    //     const now = new Date();
    //     const arr = new Date(expiryDate.getTime() - now.getTime());
    //     if ((arr.getTime() / 1000 / 60) <= 30) {
    //         return true;
    //     }
    //     return false;
    // }

    login(username: string, password: string) {
        return this.http.post<Status>(`${environment.apiUrl}/api/auth/signin-auth`, { username, password })
            .pipe(map(data => {
                this.saveTokensStorage(data);
                return data;
            }));
    }

    logout() {
        // remove user from local storage to log user out
        localStorage.removeItem(this.accessTokenSwitched);
        localStorage.removeItem(this.refreshTokenSwitched);
        // localStorage.removeItem('expirySwitched');
        this.onSwitched = false;
        localStorage.removeItem(this.accessToken);
        localStorage.removeItem(this.refreshToken);
        localStorage.removeItem('expiry');
        this.currentUserSubject.next(null);
        this.router.navigate(['/public/sign-in'], { queryParams: { returnUrl: this.router.url } }).then(r => {});
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

    refreshTokenPost(): any {
        const refresh = localStorage.getItem(this.refreshToken);
        // localStorage.removeItem(this.accessToken);
        // localStorage.removeItem(this.refreshToken);
        // localStorage.removeItem('expiry');
        this.currentUserSubject.next(null);
        if (refresh) {
            return this.http.post<any>(`${environment.apiUrl}/api/auth/refresh-auth`, { refreshToken: refresh })
                .pipe(map(user => {
                    // login successful if there's a jwt token in the response
                    if (user && user.xkw6bJ4rkXc) {
                        // store user details and jwt token in local storage to keep user logged in between page refreshes
                        const expires = new Date();
                        expires.setSeconds(expires.getSeconds() + user.expiryDuration);

                        localStorage.setItem(this.accessToken, user.xkw6bJ4rkXc);
                        localStorage.setItem(this.refreshToken, user.fxSU8uUwC64);
                        localStorage.setItem('expiry', expires.getTime().toString());
                        this.currentUserSubject.next({
                            accessToken: user.xkw6bJ4rkXc,
                            refreshToken: user.fxSU8uUwC64,
                            expiryDuration: expires
                        });
                        window.location.reload();
                        return true;
                    }
                    return false;
                }));
        }
        return false;
    }

    // Sign in with Google
    googleAuth() {
        const googleAuthProvider = new firebase.auth.GoogleAuthProvider();
        return this.afAuth.signInWithPopup(googleAuthProvider)
            .then((result) => {
                const userPayload: UserPayload = {
                    username: '',
                    password: '',
                    idToken: result.credential.toJSON()['oauthIdToken']
                };
                return userPayload;
            }).catch((error) => {
                return error;
            });
    }

    googleSignIn(userPayload) {
        return this.http.post<Status>(`${environment.apiUrl}/api/auth/signin-auth/google/oauth2`, userPayload)
            .pipe(map(data => {
                this.saveTokensStorage(data);
                return data;
            }));
    }

    saveTokensStorage(data: Status) {
        if (data.status) {
            const user = data.value;
            // login successful if there's a jwt token in the response
            if (user && user.xkw6bJ4rkXc) {
                // store user details and jwt token in local storage to keep user logged in between page refreshes
                const expires = new Date();
                expires.setSeconds(expires.getSeconds() + user.expiryDuration);
                localStorage.setItem(this.accessToken, user.xkw6bJ4rkXc);
                localStorage.setItem(this.refreshToken, user.fxSU8uUwC64);
                localStorage.setItem('expiry', expires.getTime().toString());
                if (user.language !== null) {
                    this.language = user.language;
                }
                localStorage.setItem('language', this.language);
                this.currentUserSubject.next({
                    accessToken: user.xkw6bJ4rkXc,
                    refreshToken: user.fxSU8uUwC64,
                    expiryDuration: expires
                });
                this.currentUserSwitch = this.currentUserSubject.value;
            }
        }
    }

    switchLog(id: string) {
        return this.http.get<Status>(`${environment.apiUrl}/api/auth/switch/${id}`)
            .pipe(map(data => {
                return data;
            }))
            .subscribe(data => {
                this.saveSwitchedTokensStorage(data);
            });
    }

    saveSwitchedTokensStorage(data: Status) {
        if (data.status) {
            const user = data.value;
            // login successful if there's a jwt token in the response
            if (user && user.xkw6bJ4rkXc) {
                // store user details and jwt token in local storage to keep user logged in between page refreshes
                const expires = new Date();
                expires.setSeconds(expires.getSeconds() + user.expiryDuration);
                localStorage.setItem(this.accessTokenSwitched, user.xkw6bJ4rkXc);
                localStorage.setItem(this.refreshTokenSwitched, user.fxSU8uUwC64);
                // localStorage.setItem('expirySwitched', expires.getTime().toString());
                if (user.language !== null) {
                    this.language = user.language;
                }
                localStorage.setItem('language', this.language);
                const currentUserSubjectSwitched = new BehaviorSubject<User>({
                    accessToken: localStorage.getItem(this.accessTokenSwitched),
                    refreshToken: localStorage.getItem(this.refreshTokenSwitched),
                    expiryDuration: expires
                });
                this.currentUser = currentUserSubjectSwitched.asObservable();
                this.currentUserSwitch = currentUserSubjectSwitched.value;
                this.onSwitched = true;
            }
            this.router.navigate(['/public/sign-in'], { queryParams: { returnUrl: this.router.url } }).then(r => {});
        }
    }

    switchBack() {
        localStorage.removeItem(this.accessTokenSwitched);
        localStorage.removeItem(this.refreshTokenSwitched);
        this.currentUserSwitch = this.currentUserSubject.value;
        // localStorage.removeItem('expirySwitched');
        this.onSwitched = false;
        this.router.navigate(['/public/sign-in'], { queryParams: { returnUrl: this.router.url } }).then(r => {});
    }
}
