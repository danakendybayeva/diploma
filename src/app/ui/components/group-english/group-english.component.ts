import {
  Input,
  OnInit,
  Output,
  Component,
  HostBinding,
  EventEmitter
} from '@angular/core';

import {Group} from '../../../interfaces/services/group.service';

@Component({
  selector: 'tc-group-english',
  templateUrl: './group-english.component.html',
  styleUrls: ['./group-english.component.scss']
})
export class TCGroupEnglishComponent implements OnInit {
  @HostBinding('class.tc-group') true;

  @Input() group: Group;

  @Output() joined: EventEmitter<Group>;
  @Output() leaved: EventEmitter<Group>;

  constructor() {
    this.joined = new EventEmitter();
    this.leaved = new EventEmitter();
  }

  ngOnInit(): void {  }

  joinGroupHandler(group: Group): void {
    // if (group.joined) {
    //   group.joined = false;
    //   this.leaved.emit(group);
    // } else {
    //   group.joined = true;
    //   this.joined.emit(group);
    // }
  }

  getGroupInitials(group: Group): string {
    const TITLE_ARR = group.title.split(' ');

    if (TITLE_ARR.length > 1) {
      return TITLE_ARR[0][0] + TITLE_ARR[1][0];
    }

    return TITLE_ARR[0][0];
  }

  getGroupConnections(): string[] {
    return this.group.connections ? this.group.connections.slice(0, 5) : [];
  }

  getBgImage(): any {
    return {
      'background-image': 'url(' + this.group.image + ')'
    };
  }
}
