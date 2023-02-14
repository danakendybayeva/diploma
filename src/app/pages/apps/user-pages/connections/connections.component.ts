import { Component, OnDestroy, OnInit } from '@angular/core';
import { BasePageComponent } from '../../../base-page';
import { Store } from '@ngrx/store';
import { IAppState } from '../../../../interfaces/app-state';
import { HttpService } from '../../../../services/http/http.service';
import { IUser } from 'src/app/ui/interfaces/user';

@Component({
  selector: 'page-connections',
  templateUrl: './connections.component.html',
  styleUrls: ['./connections.component.scss'],
})
export class PageConnectionsComponent extends BasePageComponent implements OnInit, OnDestroy {
  users: IUser[];

  constructor(store: Store<IAppState>, httpSv: HttpService) {
    super(store, httpSv);

    this.users = [];

    this.pageData = {
      title: 'Connections',
      breadcrumbs: [
        {
          title: 'Apps',
          route: 'dashboard',
        },
        {
          title: 'Service pages',
          route: 'dashboard',
        },
        {
          title: 'Connections',
        },
      ],
    };
  }

  ngOnInit() {
    super.ngOnInit();
    this.getData('assets/data/connections.json', 'users', 'setLoaded');
  }

  ngOnDestroy() {
    super.ngOnDestroy();
  }
}
