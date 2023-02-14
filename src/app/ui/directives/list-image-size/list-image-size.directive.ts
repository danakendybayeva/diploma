import { Directive, HostBinding, Input } from '@angular/core';

@Directive({
  selector: '[tcImageSize]',
})
export class TCListImageSizeDirective {
  @HostBinding('class.custom-size') true;
  @HostBinding('style.height.px') @Input() tcImageSize: number;
  @HostBinding('style.min-width.px') get imgWidth() {
    return this.tcImageSize;
  }

  constructor() {}
}
