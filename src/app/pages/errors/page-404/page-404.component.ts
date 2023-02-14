import { Component, OnDestroy, OnInit } from '@angular/core';

@Component({
  selector: 'page-404',
  templateUrl: './page-404.component.html',
  styleUrls: ['../error-base-page/error-base-page.component.scss'],
})
export class Page404Component implements OnInit {
  title: string;
  subTitle: string;
  errorMessage: string;

  constructor() { }

  ngOnInit() {
    this.title = '404 Page not found';
    this.subTitle = 'Oopps. The page you were looking for doesn\'t exist.';
    this.errorMessage = 'You may have mistyped the address or the page may have moved.';
  }
}
