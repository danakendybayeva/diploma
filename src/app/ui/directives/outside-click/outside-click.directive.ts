import {
  Directive,
  ElementRef,
  EventEmitter,
  HostListener,
  Output
} from '@angular/core';

@Directive({
  selector: '[tcOutsideClick]'
})
export class OutsideClickDirective {
  @Output('tcOutsideClick') clickedOutside = new EventEmitter<void>();

  private isOpen = false;

  constructor(private elRef: ElementRef) {}

  @HostListener('document:click', ['$event'])
  public handleClick(event) {
    if (!this.isOpen) {
      this.isOpen = true;
    } else if (!this.elRef.nativeElement.contains(event.target)) {
      this.clickedOutside.emit();
    }
  }
}
