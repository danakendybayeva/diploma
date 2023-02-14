import { Directive, OnInit, Input, HostBinding } from '@angular/core';

@Directive({
  selector: '[tcGradient]'
})
export class TCGradientDirective implements OnInit {
  @Input() tcGradient: string[];
  gradient: string;

  ngOnInit() {
    this.tcGradient.length >= 2 ? this.setGradient(this.tcGradient) : null;
  }

  @HostBinding('style.backgroundImage') get getGradient() {
    return this.gradient;
  }
  @HostBinding('class.custom-gradient') get getClass() {
    return true;
  }
  //
  setGradient(colors) {
    if (colors.length <= 2) {
      this.gradient = `linear-gradient(90deg, ${colors[0]}, ${colors[1]} 65%)`;
    } else {
     this.gradient = `linear-gradient(215deg, ${colors[0]}, ${colors[1]} 65%, ${colors[2]})`;
    }
  }
}
