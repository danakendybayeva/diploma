import {Component, HostBinding, Input, OnInit} from '@angular/core';

@Component({
  selector: 'tc-avatar-own',
  templateUrl: './avatar.component.html',
  styleUrls: ['./avatar.component.scss']
})
export class TCAvatarComponent implements OnInit {
  @HostBinding('class.tc-avatar') true;

  @Input() src: string;
  @Input() initials: string;
  @Input() size: number;
  @Input() alt: string;
  @Input() bgColor: string;
  @Input() icon: string;

  @HostBinding('style.height') get height() {
    return `${this.size}px`;
  }
  @HostBinding('style.width') get width() {
    return `${this.size}px`;
  }
  @HostBinding('style.min-width') get minWidth() {
    return `${this.size}px`;
  }
  @HostBinding('style.fontSize') get fontSize() {
    return `${this.size / 2.4}px`;
  }
  @HostBinding('class.avatar-loading') @Input() loading: boolean;

  @HostBinding('style.background-color') get backgroundColor() {
    // if (this.initials) {
      return this.bgColor || '#805aff';
    // }
  }

  loaded: boolean;

  constructor() {
    this.size = 36;
    this.loaded = false;
  }

  ngOnInit() { }

  imageLoaded() {
    this.initials = '';
    this.loaded = true;
  }
}
