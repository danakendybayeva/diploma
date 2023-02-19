import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'not-found-page',
  templateUrl: './not-found-page.component.html',
  styleUrls: ['./not-found-page.component.scss']
})
export class NotFoundPageComponent implements OnInit {

  @Input() title: string;
  @Input() subTitle: string;
  @Input() errorMessage: string;

  constructor() { }

  ngOnInit() {
  }
}
