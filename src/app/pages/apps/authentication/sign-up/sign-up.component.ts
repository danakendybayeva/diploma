import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, AbstractControl, ValidatorFn } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

import { User } from '../../../../interfaces/services/user.service';

import { fadeIn } from 'src/app/animations/form-error';
import {AuthenticationService} from '../../../../user/_services/authentication.service';

@Component({
  selector: 'page-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.scss', '../sign-in/sign-in.component.scss'],
  animations: [fadeIn]
})
export class PageSignUpComponent implements OnInit {
  loginForm: FormGroup;

  constructor(private router: Router,
              private http: HttpClient,
              private authenticationService: AuthenticationService) {
    if (this.authenticationService.currentUserValue) {
      this.router.navigate(['/']);
    }
  }

  ngOnInit() {
    this.loginForm = new FormGroup({
      username: new FormControl('', [Validators.required, Validators.required]),
      firstName: new FormControl('', [Validators.required, Validators.required]),
      lastName: new FormControl('', [Validators.required, Validators.required]),
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.required, Validators.minLength(5)]),
      confirm: new FormControl('', [Validators.required, Validators.minLength(5)])
    }, { validators: this.MatchPassword, updateOn: 'blur' });
  }

  signUp() {
    // tslint:disable-next-line:label-position
    const newUser: User = {
      username:  this.username.toString(),
      firstName: this.firstName.toString(),
      lastName: this.lastName.toString(),
      email: this.email.toString(),
      password: this.password.toString()
    };
    // this.router.navigate(['']);
    this.http.post('http://localhost:8080/api/auth/signup', newUser)
        .subscribe({
          next: data => console.log(data),
          error: error => console.log(error)
        });
  }

  MatchPassword(ac: AbstractControl): ValidatorFn {
    const pass = ac.get('password').value;
    const confirmPass = ac.get('confirm').value;

    if (pass !== confirmPass) {
      ac.get('confirm').setErrors({ notMatch: true });
    }

    return null;
  }

  get username() {
    return this.loginForm.get('username');
  }

  get firstName() {
    return this.loginForm.get('firstName');
  }

  get lastName() {
    return this.loginForm.get('lastName');
  }

  get email() {
    return this.loginForm.get('email');
  }

  get password() {
    return this.loginForm.get('password');
  }

  get confirm() {
    return this.loginForm.get('confirm');
  }
}

