import {
  Component,
  OnInit,
  HostBinding,
  Input,
  ElementRef,
  AfterViewInit,
  Renderer2,
} from '@angular/core';

@Component({
  selector: 'tc-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss'],
})
export class TCListComponent implements OnInit, AfterViewInit {
  @HostBinding('class.tc-list') true;

  @Input() timeline: boolean;

  constructor(private el: ElementRef, private renderer: Renderer2) {
    this.timeline = false;
  }

  ngOnInit() {}

  ngAfterViewInit() {
    if (this.timeline) {
      const items: any[] = this.el.nativeElement.querySelectorAll(
        '.tc-list-item'
      );

      this.renderer.addClass(items[0], 'first');
      this.renderer.addClass(items[items.length - 1], 'last');

      items.forEach(item => this.renderer.addClass(item, 'timeline'));
    }
  }
}
