import { Component, HostBinding, Input, OnInit } from '@angular/core';

import { IPageData } from '../../../interfaces/page-data';

@Component({
  selector: 'footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent implements OnInit {
  @HostBinding('class.footer') true;
  @HostBinding('class.loaded') @Input() loaded: boolean;
  @HostBinding('class.boxed') @Input() boxed: boolean;

  @Input() pageData: IPageData;

  constructor() { }

  ngOnInit() { }
}
