import {
  Input,
  OnInit,
  Output,
  Component,
  HostBinding,
  EventEmitter,
  ChangeDetectionStrategy
} from '@angular/core';

import { IUser } from '../../interfaces/user';

@Component({
  selector: 'tc-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TCUserComponent implements OnInit {
  @HostBinding('class.tc-user') true;

  @Input() user: IUser;

  @Output() followed: EventEmitter<IUser>;
  @Output() unfollowed: EventEmitter<IUser>;

  initials: string;

  constructor() {
    this.followed = new EventEmitter();
    this.unfollowed = new EventEmitter();
  }

  ngOnInit() {}

  followClick(user: IUser) {
    user.followed = true;
    this.followed.emit(user);
  }

  unfollowClick(user: IUser) {
    user.followed = false;
    this.unfollowed.emit(user);
  }
}
