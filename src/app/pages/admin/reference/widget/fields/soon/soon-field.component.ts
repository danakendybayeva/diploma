import {Component, OnChanges, OnInit} from '@angular/core';

@Component({
  selector: 'soon-field',
  templateUrl: './soon-field.component.html',
  styleUrls: ['./soon-field.component.scss']
})
export class SoonFieldComponent implements OnInit, OnChanges {

  constructor() {
  }

  ngOnInit() {
    this.initLabelForm();
  }

  ngOnChanges(changes) {
  }

  initLabelForm() {
  }

}
