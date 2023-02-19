import { Component, OnDestroy, OnInit} from '@angular/core';

import {Store} from '@ngrx/store';
import {IAppState} from '../../../interfaces/app-state';
import {HttpService} from '../../../services/http/http.service';
import {IGroup} from 'src/app/ui/interfaces/group';
import {BasePageComponent} from '../../../pages/base-page';

@Component({
  selector: 'tc-report-table',
  templateUrl: './report-table.component.html',
  styleUrls: ['./report-table.component.scss'],
})
export class ReportTableComponent extends BasePageComponent implements OnInit, OnDestroy {
  listOfData: any[] = [];

  constructor(store: Store<IAppState>, httpSv: HttpService) {
    super(store, httpSv);

    this.pageData = {
      title: ''
    };
  }

  ngOnInit() {
    super.ngOnInit();
    this.setLoaded();
    for (let i = 0; i < 100; i++) {
      this.listOfData.push({
        name: `Edward King ${i}`,
        age: 32,
        address: `London`
      });
    }
  }

  ngOnDestroy() {
    super.ngOnDestroy();
  }
}
