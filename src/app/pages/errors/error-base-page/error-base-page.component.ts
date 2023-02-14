import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-error-base-page',
  templateUrl: './error-base-page.component.html',
  styleUrls: ['./error-base-page.component.scss']
})
export class ErrorBasePageComponent implements OnInit {

  title: string;
  subTitle: string;
  errorMessage: string;

  constructor() { }

  ngOnInit() {
  }
}
