import { Directive, HostBinding } from '@angular/core';

@Directive({
  selector: '[tcListIcon], [tc-list-icon]',
})
export class TCListIconDirective {
  @HostBinding('class.list-item-icon') true;

  constructor() {}
}
