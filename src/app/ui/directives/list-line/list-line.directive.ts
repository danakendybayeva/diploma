import { Directive, HostBinding } from '@angular/core';

@Directive({
  selector: '[tcListLine], [tc-list-line]',
})
export class TCListLineDirective {
  @HostBinding('class.item-line') true;

  constructor() {}
}
