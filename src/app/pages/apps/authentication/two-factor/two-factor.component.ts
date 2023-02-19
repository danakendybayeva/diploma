import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import {AuthenticationService} from '../../../../user/_services/authentication.service';
import {FormControl, FormGroup, Validators} from '@angular/forms';

@Component({
  selector: 'page-two-factor',
  templateUrl: './two-factor.component.html',
  styleUrls: ['./two-factor.component.scss']
})
export class PageTwoFactorComponent implements OnInit {
  loginForm: FormGroup;
  loading = false;

  constructor(private router: Router,
              private authenticationService: AuthenticationService) {
    if (this.authenticationService.currentUserValue) {
      this.router.navigate(['/']);
    }
  }

  ngOnInit() {
    this.loginForm = new FormGroup({
      t2fa: new FormControl('', [Validators.required, Validators.minLength(4)])
    });
  }

  get t2fa() {
    return this.loginForm.get('t2fa');
  }
}
