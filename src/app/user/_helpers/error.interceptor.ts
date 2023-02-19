import { Injectable } from '@angular/core';
import {HttpRequest, HttpHandler, HttpEvent, HttpInterceptor, HttpClient} from '@angular/common/http';
import {from, Observable, throwError} from 'rxjs';
import {catchError, delay, first, map} from 'rxjs/operators';

import { AuthenticationService } from '../_services/authentication.service';
import {Router} from '@angular/router';
import {fromPromise} from 'rxjs/internal-compatibility';
import {environment} from '../../../environments/environment';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
    constructor(
        private authenticationService: AuthenticationService
    ) { }
    // TODO potom bitiru, poka bir baskanda refresh jasaidi, i kaitadan basu kerek boladi
    // next handle orindalu kerek refreshten kein, kazir refreshti kutpeidi
    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        return next.handle(request).pipe(catchError(err => {
            if (
                [401, 403].indexOf(err.status) !== -1
                && err.error.path !== '/api/auth/signin-auth'
            ) {
                // auto logout if 401 Unauthorized or 403 Forbidden response returned from api
                this.authenticationService.refreshTokenPost()
                    .subscribe(
                        data => {
                            if (data) {
                                if (data.status === 0) {
                                    this.authenticationService.logout();
                                }
                            } else {
                                this.authenticationService.logout();
                            }
                        },
                        error => {
                            this.authenticationService.logout();
                        }
                    );
                return next.handle(request).pipe(catchError(err2 => {
                    const error2 = err2.error.message || err.statusText;
                    return throwError(error2);
                }));
            }

            const error = err.error.message || err.statusText;
            return throwError(error);
        }));
    }

    private handleError(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        this.authenticationService.logout();
        if (this.authenticationService.isExpiring) {
        }
        const refresh = this.authenticationService.refreshTokenPost();
        if (refresh) {
            return next.handle(request);
        } else {
            this.authenticationService.logout();
            return;
        }
    }

}
