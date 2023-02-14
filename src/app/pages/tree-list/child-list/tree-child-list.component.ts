import {Component, OnInit, HostBinding, Input, forwardRef, HostListener, Injectable, Output, EventEmitter} from '@angular/core';
import {BehaviorSubject} from 'rxjs';
import {Store} from '@ngrx/store';

@Component({
  selector: 'tc-tree-child-list',
  templateUrl: './tree-child-list.component.html',
  styleUrls: ['./tree-child-list.component.scss']
})
@Injectable({ providedIn: 'root' })
export class TreeChildListComponent implements OnInit {
  @Input() item;
  @Input() value;

  private data = new BehaviorSubject<string>('');
  @Output() resultData: EventEmitter<any> = new EventEmitter();

  onChange: any = () => { };
  onTouched: any = () => { };

  constructor() {}

  ngOnInit() {
    // this.resultData.emit(this.value);
  }

  sendMessage(data: any) {
    this.data.next(data);
  }

  selectR(val) {
    this.value = val;
    this.resultData.emit(this.value);
  }

  // @HostListener('mouseenter') onMouseEnter() {
  //   if (!this.disabled) {
  //     this.setStyles(this.states[this.value ? 'focus' : 'hover']);
  //   }
  // }
  // @HostListener('mouseleave') onMouseLeave() {
  //   if (!this.disabled) {
  //     this.setStyles(this.states[this.value ? 'focus' : 'default']);
  //   }
  // }
}
