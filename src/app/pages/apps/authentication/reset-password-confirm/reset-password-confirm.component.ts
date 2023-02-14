import {ActivatedRoute, Router} from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, AbstractControl, ValidatorFn } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

import { User } from '../../../../interfaces/services/user.service';

import { fadeIn } from 'src/app/animations/form-error';
import {AuthenticationService} from '../../../../user/_services/authentication.service';
import {ToastrService} from 'ngx-toastr';
import {environment} from '../../../../../environments/environment';
import {first} from 'rxjs/operators';

@Component({
  selector: 'page-reset-password-configm',
  templateUrl: './reset-password-confirm.component.html',
  styleUrls: ['./reset-password-confirm.component.scss', '../sign-in/sign-in.component.scss'],
  animations: [fadeIn]
})
export class PageResetPasswordConfirmComponent implements OnInit {
  loginForm: FormGroup;
  token = '';

  constructor(private router: Router,
              private http: HttpClient,
              private authenticationService: AuthenticationService,
              private toastr: ToastrService,
              private activatedRoute: ActivatedRoute) {
    if (this.authenticationService.currentUserValue) {
      this.router.navigate(['/']);
    }
    this.activatedRoute.queryParams.subscribe(params => {
      this.token = params['john-wick'];
      console.log(this.token);
    });
  }

  ngOnInit() {
    this.loginForm = new FormGroup({
      password: new FormControl('', [Validators.required, Validators.minLength(6)]),
      confirmPassword: new FormControl('', [Validators.required, Validators.minLength(6)]),
      token: new FormControl(this.token)
    }, { validators: this.MatchPassword, updateOn: 'blur' });
  }

  resetPass() {
    // this.router.navigate(['']);
    console.log(this.loginForm.value);
    this.authenticationService.resetPasswordByToken(this.loginForm.value)
        .pipe(first())
        .subscribe(
            data => {
              if (data.status === 1) {
                this.toastr.success(data.message, 'Success', { closeButton: true });
                setInterval(() => {
                  this.router.navigate(['']);
                }, 2000);
              } else {
                this.toastr.error(data.message, 'Error', { closeButton: true });
              }
            },
            error => {
              this.toastr.error(error, 'Error', { closeButton: true });
            });
  }

  MatchPassword(ac: AbstractControl): ValidatorFn {
    const pass = ac.get('password').value;
    const confirmPass = ac.get('confirmPassword').value;

    if (pass !== confirmPass) {
      ac.get('confirmPassword').setErrors({ notMatch: true });
    }

    return null;
  }

  get password() {
    return this.loginForm.get('password');
  }

  get confirmPassword() {
    return this.loginForm.get('confirmPassword');
  }
}

