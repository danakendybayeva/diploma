import {
  Component,
  OnInit,
  HostBinding,
  ElementRef,
  Renderer2,
  AfterViewInit,
} from '@angular/core';

@Component({
  selector: 'tc-list-item',
  templateUrl: './list-item.component.html',
  styleUrls: ['./list-item.component.scss'],
})
export class TCListItemComponent implements OnInit, AfterViewInit {
  @HostBinding('class.tc-list-item') true;

  constructor(private el: ElementRef, private renderer: Renderer2) {}

  ngOnInit() {}

  ngAfterViewInit() {
    const LINES = this.el.nativeElement.querySelectorAll('.item-line');

    const AVATAR = this.el.nativeElement.querySelector('.list-item-avatar');

    const ICON = this.el.nativeElement.querySelector('.list-item-icon');

    if (AVATAR) {
      this.renderer.addClass(this.el.nativeElement, 'with-avatar');
    }

    if (AVATAR && AVATAR.classList.contains('custom-size')) {
      this.renderer.addClass(this.el.nativeElement, 'custom-image-size');
    }

    if (ICON) {
      this.renderer.addClass(this.el.nativeElement, 'with-icon');
    }

    if (LINES.length === 2) {
      this.renderer.addClass(this.el.nativeElement, 'two-lines');
    }

    if (LINES.length === 3) {
      this.renderer.addClass(this.el.nativeElement, 'three-lines');
    }
  }
}
