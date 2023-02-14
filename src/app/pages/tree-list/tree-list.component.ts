import {Component, OnInit, HostBinding, Input, forwardRef, HostListener, Injectable, Output, EventEmitter} from '@angular/core';
import {BehaviorSubject} from 'rxjs';
import {Store} from '@ngrx/store';

@Component({
  selector: 'tc-tree-list',
  templateUrl: './tree-list.component.html',
  styleUrls: ['./tree-list.component.scss']
})
@Injectable({ providedIn: 'root' })
export class TreeListComponent implements OnInit {
  @Input() lists;
  @Output() resultData: EventEmitter<any> = new EventEmitter();
  ansRadio = null;
  searchStr = '';

  private data = new BehaviorSubject<string>('');

  onChange: any = () => { };
  onTouched: any = () => { };

  constructor() {}

  ngOnInit() {
    this.resultData.emit(this.ansRadio);
  }

  sendMessage(data: any) {
    this.data.next(data);
  }
  check(ansRadio) {
    this.ansRadio = ansRadio;
    this.resultData.emit(this.ansRadio);
    // console.log(this.ansRadio);
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
