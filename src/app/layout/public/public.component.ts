import { Component, OnInit } from '@angular/core';
import {environment} from '../../../environments/environment';

@Component({
  selector: 'public-layout',
  templateUrl: './public.component.html',
  styleUrls: ['./public.component.scss']
})
export class PublicLayoutComponent implements OnInit {
  logo = environment.logoSign;
  constructor() { }

  ngOnInit() { }
}
