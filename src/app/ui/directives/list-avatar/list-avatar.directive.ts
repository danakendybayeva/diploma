import { Directive, HostBinding } from '@angular/core';

@Directive({
  selector: '[tcListAvatar], [tc-list-avatar]',
})
export class TCListAvatarDirective {
  @HostBinding('class.list-item-avatar') true;

  constructor() {}
}
