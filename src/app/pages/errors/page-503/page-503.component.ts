import { Component, OnDestroy, OnInit } from '@angular/core';

@Component({
  selector: 'page-503',
  templateUrl: './page-503.component.html',
  styleUrls: ['../error-base-page/error-base-page.component.scss'],
})
export class Page503Component implements OnInit {
  title: string;
  subTitle: string;
  errorMessage: string;

  constructor() { }

  ngOnInit() {
    this.title = '503 Service unavailable';
    this.subTitle = 'Oopps. The service is temporarily unavailable.';
    this.errorMessage = 'The server is unable to service your request due to maintenance downtime or capacity problems.';
  }
}
