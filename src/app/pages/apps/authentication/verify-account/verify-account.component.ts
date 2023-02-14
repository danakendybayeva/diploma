import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import {AuthenticationService} from '../../../../user/_services/authentication.service';

@Component({
  selector: 'page-verify-account',
  templateUrl: './verify-account.component.html',
  styleUrls: ['./verify-account.component.scss']
})
export class PageVerifyAccountComponent implements OnInit {

  constructor(private router: Router,
              private authenticationService: AuthenticationService) {
    if (this.authenticationService.currentUserValue) {
      this.router.navigate(['/']);
    }
  }

  ngOnInit() {
  }

  resend() {
    this.router.navigate(['']);
  }

  contactSupport() {
    this.router.navigate(['']);
  }
}
