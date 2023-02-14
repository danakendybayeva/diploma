import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'page-500',
  templateUrl: './page-500.component.html',
  styleUrls: ['../error-base-page/error-base-page.component.scss'],
})
export class Page500Component implements OnInit {
  title: string;
  subTitle: string;
  errorMessage: string;

  constructor() { }

  ngOnInit() {
    this.title = '500 Internal server error';
    this.subTitle = 'Oopps. There was an error, please try again later.';
    this.errorMessage = 'The server encountered an internal server error and was unable to complete your request.';
  }
}
