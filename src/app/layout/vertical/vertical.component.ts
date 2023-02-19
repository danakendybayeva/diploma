import { Component, ElementRef, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { Store } from '@ngrx/store';

import { IAppState } from '../../interfaces/app-state';
import { BaseLayoutComponent } from '../base-layout/base-layout.component';
import { HttpService } from '../../services/http/http.service';
import { IOption } from '../../ui/interfaces/option';
import { TCModalService } from '../../ui/services/modal/modal.service';
import * as SettingsActions from '../../store/actions/app-settings.actions';
import {UserService} from '../../user/_services/user.service';
import {AuthenticationService} from '../../user/_services/authentication.service';
import {User} from '../../user/_models/user';
import {environment} from '../../../environments/environment';

@Component({
  selector: 'vertical-layout',
  templateUrl: './vertical.component.html',
  styleUrls: [
    '../base-layout/base-layout.component.scss',
    './vertical.component.scss'
  ]
})
export class VerticalLayoutComponent extends BaseLayoutComponent implements OnInit {
  gender: IOption[];
  currentAvatar: string | ArrayBuffer;
  defaultAvatar: string;

  editPencil = false;
  appMenu = environment.appMenu;
  logo = environment.logo;

  loading = false;
  currentUser: User;
  userFromApi: User;

  constructor(
    store: Store<IAppState>,
    fb: FormBuilder,
    httpSv: HttpService,
    router: Router,
    elRef: ElementRef,
    modal: TCModalService,
    private userService: UserService,
    private authenticationService: AuthenticationService
  ) {
    super(store, fb, httpSv, router, elRef, modal);
    this.currentUser = this.authenticationService.currentUserValue;
  }

  ngOnInit() {
    super.ngOnInit();

    this.store.dispatch(new SettingsActions.Update({ layout: 'vertical' }));

    this.loading = true;
    // this.userService.getById(this.currentUser.id).pipe(first()).subscribe(user => {
    //   this.loading = false;
    //   this.userFromApi = user;
    // });
  }

  getSidebarStyles(): any {
    return {
      'background-image': `linear-gradient(188deg, ${this.appSettings.sidebarBg}, ${this.appSettings.sidebarBg2} 65%)`,
      'color': this.appSettings.sidebarColor
    };
  }

  save() {

  }
}
