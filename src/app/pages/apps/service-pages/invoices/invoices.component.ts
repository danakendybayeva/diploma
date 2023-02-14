import { Component, OnDestroy, OnInit } from '@angular/core';
import { BasePageComponent } from '../../../base-page';
import { Store } from '@ngrx/store';
import { IAppState } from '../../../../interfaces/app-state';
import { HttpService } from '../../../../services/http/http.service';

@Component({
  selector: 'page-invoices',
  templateUrl: './invoices.component.html',
  styleUrls: ['./invoices.component.scss']
})
export class PageInvoicesComponent extends BasePageComponent
  implements OnInit, OnDestroy {
  invoices: any[];

  constructor(store: Store<IAppState>, httpSv: HttpService) {
    super(store, httpSv);

    this.pageData = {
      title: 'Invoices',
      breadcrumbs: [
        {
          title: 'Apps',
          route: 'dashboard'
        },
        {
          title: 'Service pages',
          route: 'dashboard'
        },
        {
          title: 'Invoices'
        }
      ]
    };
  }

  ngOnInit() {
    super.ngOnInit();

    this.getData('assets/data/invoices.json', 'invoices', 'setLoaded');
  }

  ngOnDestroy() {
    super.ngOnDestroy();
  }

  sort({ key, value }) {
    const direction = value === 'ascend' ? 1 : -1;
    const sortFn = (prev, cur) => (prev[key] > cur[key] ? 1 : -1) * direction;
    this.invoices = this.invoices.sort(sortFn);
  }
}
