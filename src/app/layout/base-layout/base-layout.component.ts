import { Component, ElementRef, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { NavigationEnd, Router } from '@angular/router';

import { Store } from '@ngrx/store';

import { IPageData } from '../../interfaces/page-data';
import { IAppState } from '../../interfaces/app-state';
import { HttpService } from '../../services/http/http.service';
import { IAppSettings } from '../../interfaces/settings';
import { IMenuItem } from '../../interfaces/main-menu';
import * as SettingsActions from '../../store/actions/app-settings.actions';
import { Content } from '../../ui/interfaces/modal';
import { TCModalService } from '../../ui/services/modal/modal.service';

@Component({
  selector: 'base-layout',
  templateUrl: './base-layout.component.html',
  styleUrls: ['./base-layout.component.scss']
})
export class BaseLayoutComponent implements OnInit {
  loaded: boolean;
  pageData: IPageData;
  appSettings: IAppSettings;
  searchForm: FormGroup;
  searchData: any[];

  constructor(
    public store: Store<IAppState>,
    public fb: FormBuilder,
    public httpSv: HttpService,
    public router: Router,
    public elRef: ElementRef,
    public modal: TCModalService
  ) {
    this.searchData = [];
  }

  ngOnInit() {
    this.store.select('pageData').subscribe(data => {
      setTimeout(() => {
        this.pageData = data ? data : null;
        data.loaded ? this.loaded = true : null;
      });
    });

    this.store.select('appSettings').subscribe(settings => {
      settings ? this.appSettings = settings : null;
    });

    this.getSearchData('assets/data/menu.json');
    this.initSearchForm();
    this.scrollToTop();
  }

  // get data
  // parameters:
  // * url - data url
  // * dataName - set data to 'dataName'
  // * callbackFnName run callback function with name 'callbackFnName'
  getData(url: string, dataName: string, callbackFnName?: string) {
    this.httpSv.getData(url).subscribe(
      data => {
        this[dataName] = data;
      },
      err => {
        console.log(err);
      },
      () => {
        (callbackFnName && typeof this[callbackFnName] === 'function') ? this[callbackFnName](this[dataName]) : null;
      }
    );
  }

  getSearchData(url: string) {
    this.httpSv.getData(url).subscribe(
      data => {
        this.getItemsRouters(data);
      },
      err => {
        console.log(err);
      }
    );
  }

  getItemsRouters(data: IMenuItem[]) {
    const links: any[] = [];

    data.forEach((item: IMenuItem) => {
      if (!item.groupTitle) {
        if (item.sub) {
          this.deploySubItems(item, links);
        } else {
          links.push(item);
        }
      }
    });

    this.searchData = links;
  }

  deploySubItems(item: any, links) {
    item.sub.forEach((subItem) => {
      if (subItem.sub) {
        this.deploySubItems(subItem, links);
      } else {
        subItem.title = `${item.title} > ${subItem.title}`;
        links.push(subItem);
      }
    });
  }

  initSearchForm() {
    this.searchForm = this.fb.group({
      search: ''
    });
  }

  toggleSidebar(value: boolean) {
    this.store.dispatch(new SettingsActions.SidebarState(value));
  }

  // scroll to page top
  scrollToTop() {
    this.router.events.subscribe((evt) => {
      if (!(evt instanceof NavigationEnd)) {
        return;
      }
      const CONTAINER = this.elRef.nativeElement.querySelector('.main-content') || window;

      setTimeout(() => {
        CONTAINER.scrollTo(0, 0);
      });
    });
  }

  // open modal window
  openModal<T>(body: Content<T>, header: Content<T> = null, footer: Content<T> = null, options: any = null) {
    this.modal.open({
      body: body,
      header: header,
      footer: footer,
      options: options
    });
  }
}
