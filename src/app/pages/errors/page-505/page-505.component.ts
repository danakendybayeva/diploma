import { Component, OnDestroy, OnInit } from '@angular/core';

@Component({
  selector: 'page-505',
  templateUrl: './page-505.component.html',
  styleUrls: ['../error-base-page/error-base-page.component.scss'],
})
export class Page505Component implements OnInit {
  title: string;
  subTitle: string;
  errorMessage: string;

  constructor() { }

  ngOnInit() {
    this.title = '505 Forbidden';
    this.subTitle = 'Oopps. Something is broken.';
    this.errorMessage = 'We\'ve been automatically alerted of the issue and will work to fix it asap.';
  }
}
