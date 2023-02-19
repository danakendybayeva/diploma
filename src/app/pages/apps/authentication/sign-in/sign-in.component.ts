import { Router, ActivatedRoute } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { first } from 'rxjs/operators';

import { AuthenticationService } from '../../../../user/_services/authentication.service';
import { fadeIn } from 'src/app/animations/form-error';
import {ToastrService} from 'ngx-toastr';

@Component({
  selector: 'page-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.scss'],
  animations: [fadeIn]
})
export class PageSignInComponent implements OnInit {
  loginForm: FormGroup;
  loading = false;
  submitted = false;
  returnUrl: string;
  error = '';

  constructor(
      private formBuilder: FormBuilder,
      private router: Router,
      private route: ActivatedRoute,
      private authenticationService: AuthenticationService,
      private toastr: ToastrService
  ) {
    if (this.authenticationService.currentUserValue) {
      this.router.navigate(['/']).then(r => {});
    }
  }

  ngOnInit() {
    this.loginForm = new FormGroup({
      login: new FormControl('', [Validators.required, Validators.minLength(4)]),
      password: new FormControl('', [Validators.required, Validators.minLength(1)])
    });

    // get return url from route parameters or default to '/'
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
  }

  get f() { return this.loginForm.controls; }

  Login(): void {
    this.submitted = true;

    // stop here if form is invalid
    if (this.loginForm.invalid && this.loading) {
      return;
    }

    this.loading = true;
    this.authenticationService.login(this.f.login.value, this.f.password.value)
        .pipe(first())
        .subscribe(
            data => {
              if (data.status) {
                this.toastr.success('Welcome!', 'Success', {closeButton: true});
                this.router.navigate([this.returnUrl]).then(r => {});
              } else {
                this.toastr.error(data.message, 'Error', { closeButton: true });
                this.error = data.message;
                this.loading = false;
              }
            },
            error => {
              this.toastr.error(error.message, 'Error', { closeButton: true });
              this.error = error;
              this.loading = false;
            });
  }

  get login() {
    return this.loginForm.get('login');
  }

  get password() {
    return this.loginForm.get('password');
  }

  loginWithGoogle(): void {
    this.loading = true;
    this.authenticationService.googleAuth()
        .then(result => {
          if (result['idToken']) {
            this.authenticationService.googleSignIn(result)
                .pipe(first())
                .subscribe(
                    data => {
                      this.loading = false;
                      if (data.status) {
                        this.toastr.success('Welcome!', 'Success', {closeButton: true});
                        this.router.navigate([this.returnUrl]).then(r => {});
                      } else {
                        this.toastr.error(data.message, 'Error', { closeButton: true });
                        this.error = data.message;
                      }
                    },
                    error => {
                      this.toastr.error(error.message, 'Error', { closeButton: true });
                      this.error = error;
                      this.loading = false;
                    });
          } else {
            this.toastr.error('Error', 'Error', { closeButton: true });
            this.loading = false;
          }
        })
        .catch((error) => {
          this.toastr.error(error, 'Error', { closeButton: true });
          this.loading = false;
        });
  }

}
