import { Directive, OnInit, Input, HostBinding, HostListener, OnChanges } from '@angular/core';

@Directive({
  selector: '[tcColor]'
})
export class TCColorDirective implements OnInit, OnChanges {

  @HostBinding('style.color') get getStyle() {
    return this.currentColor;
  }
  @HostBinding('class.custom-color') true;

  @Input() tcColor: string | string[];

  currentColor: string;
  defaultColor: string;
  hoveredColor: string;

  @HostListener('mouseenter') onMouseEnter() {
    this.currentColor = this.hoveredColor;
  }
  @HostListener('mouseleave') onMouseLeave() {
    this.currentColor = this.defaultColor;
  }

  ngOnInit() {
    this.setColors();
  }

  ngOnChanges() {
    this.setColors();
  }

  setColors() {
    const COLOR = this.tcColor;

    if (!COLOR) { return null; }

    this.defaultColor = (typeof COLOR === 'string') ? COLOR : COLOR[0];
    this.hoveredColor = (typeof COLOR === 'string') ? COLOR : COLOR[1];
    this.currentColor = this.defaultColor;
  }
}
