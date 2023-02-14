import { Component, OnDestroy, OnInit} from '@angular/core';

import {Store} from '@ngrx/store';
import {BasePageComponent} from '../../base-page';
import {IAppState} from '../../../interfaces/app-state';
import {HttpService} from '../../../services/http/http.service';
import {IGroup} from 'src/app/ui/interfaces/group';

@Component({
  selector: 'page-soon',
  templateUrl: './soon.component.html',
  styleUrls: ['./soon.component.scss'],
})
export class SoonComponent extends BasePageComponent implements OnInit, OnDestroy {

  constructor(store: Store<IAppState>, httpSv: HttpService) {
    super(store, httpSv);

    this.pageData = {
      title: ''
    };
  }

  ngOnInit() {
    super.ngOnInit();
    this.setLoaded();
  }

  ngOnDestroy() {
    super.ngOnDestroy();
  }
}
