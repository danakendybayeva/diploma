import { Component, OnDestroy, OnInit } from '@angular/core';
import { BasePageComponent } from '../../../base-page';
import { Store } from '@ngrx/store';
import { IAppState } from '../../../../interfaces/app-state';
import { HttpService } from '../../../../services/http/http.service';
import * as PageActions from '../../../../store/actions/page.actions';

@Component({
  selector: 'page-invoice',
  templateUrl: './invoice.component.html',
  styleUrls: ['./invoice.component.scss']
})
export class PageInvoiceComponent extends BasePageComponent implements OnInit, OnDestroy {
  invoice: any[];

  senderName: string;
  senderAddress: string;
  senderCity: string;
  senderFax: string;

  customerName: string;
  customerAddress: string;
  customerCity: string;
  customerFax: string;

  invoiceDate: string;
  dueTo: string;

  total: number;
  vat: number;

  constructor(
    store: Store<IAppState>,
    httpSv: HttpService
  ) {
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

    this.senderName = 'Forrest Ray';
    this.senderAddress = '191-103 Integer Rd.';
    this.senderCity = 'Corona New Mexico 08219';
    this.senderFax = '(404) 960-3807';

    this.customerName = 'Richard Knight';
    this.customerAddress = '711-2880 Nulla St.';
    this.customerCity = 'Mankato Mississippi 96522';
    this.customerFax = '(257) 563-7401';

    this.invoiceDate = 'May 15, 2019';
    this.dueTo = 'May 20, 2019';
    this.invoice = [];
  }

  ngOnInit() {
    super.ngOnInit();

    this.getData('assets/data/invoice.json', 'invoice', 'getTotal');
  }

  getTotal(): void {
    this.total = this.invoice.map(el => !isNaN(el.cost * el.quantity) ? el.cost * el.quantity : 0).reduce((cost, acc) => acc + cost);
    this.vat = Math.floor(this.total / 10);
    this.store.dispatch(new PageActions.Update({ loaded: true }));
  }

		  ngOnDestroy() {
    super.ngOnDestroy();
  }
}
