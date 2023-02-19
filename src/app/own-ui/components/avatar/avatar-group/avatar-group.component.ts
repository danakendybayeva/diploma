import {
  OnInit,
  Renderer2,
  Component,
  ElementRef,
  HostBinding,
  AfterViewInit
} from '@angular/core';

@Component({
  selector: 'tc-avatar-group',
  templateUrl: './avatar-group.component.html',
  styleUrls: ['./avatar-group.component.scss'],
})
export class TCAvatarGroupComponent implements OnInit, AfterViewInit {
  @HostBinding('class.tc-avatar-group') true;

  constructor(private el: ElementRef, private renderer: Renderer2) { }

  ngOnInit() {}

  ngAfterViewInit() {
    // let avatars = this.el.nativeElement.querySelector('.tc-avatar');
    // avatars = avatars.slice(1, -1);
    // console.log(avatars);

    // avatars.forEach(avatar => this.renderer.addClass(''))
  }
}
