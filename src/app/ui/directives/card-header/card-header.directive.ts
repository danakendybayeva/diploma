import { Directive, HostBinding } from '@angular/core';

@Directive({
  selector: '[tcCardHeader], [tc-card-header]'
})
export class TCCardHeaderDirective {
  @HostBinding('class.custom-card-header') true;

  constructor() { }
}
