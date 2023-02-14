import { Directive, OnInit, Input, HostBinding, HostListener, OnChanges } from '@angular/core';

@Directive({
  selector: '[tcBgColor]'
})
export class TCBgColorDirective implements OnInit, OnChanges {
  @HostBinding('style.background-color') get getStyle() {
    return this.currentBg;
  }
  @HostBinding('class.custom-bg-color') true;

  @Input() tcBgColor: string | string[];

  currentBg: string;
  defaultBg: string;
  hoveredBg: string;

  @HostListener('mouseenter') onMouseEnter() {
    this.currentBg = this.hoveredBg;
  }
  @HostListener('mouseleave') onMouseLeave() {
    this.currentBg = this.defaultBg;
  }

  ngOnInit() {
    this.setColors();
  }

  ngOnChanges() {
    this.setColors();
  }

  setColors() {
    const BG_COLOR = this.tcBgColor;

    if (!BG_COLOR) { return null; }

    this.defaultBg = (typeof BG_COLOR === 'string') ? BG_COLOR : BG_COLOR[0];
    this.hoveredBg = (typeof BG_COLOR === 'string') ? BG_COLOR : BG_COLOR[1];
    this.currentBg = this.defaultBg;
  }
}
