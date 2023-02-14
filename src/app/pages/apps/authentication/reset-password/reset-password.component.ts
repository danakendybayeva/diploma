import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';

import { fadeIn } from 'src/app/animations/form-error';
import {AuthenticationService} from '../../../../user/_services/authentication.service';
import {ToastrService} from 'ngx-toastr';
import {first} from 'rxjs/operators';

@Component({
  selector: 'page-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss'],
  animations: [fadeIn]
})
export class PageResetPasswordComponent implements OnInit {
  email: FormControl;

  constructor(private router: Router,
              private authenticationService: AuthenticationService,
              private toastr: ToastrService) {
    this.email = new FormControl('', [Validators.required, Validators.email]);
    if (this.authenticationService.currentUserValue) {
      this.router.navigate(['/']);
    }
  }

  ngOnInit() {
  }

  reset() {
    this.authenticationService.resetLink(this.email.value)
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
}
