import { Component, OnDestroy, OnInit} from '@angular/core';

import {environment} from '../../../../../environments/environment';
import {IPageContent} from '../../../../interfaces/services/page/page-content';
import {map} from 'rxjs/operators';
import {TCFolderComponent} from '../../folder';

@Component({
  selector: 'folder-reference',
  templateUrl: '../folder/folder.component.html',
  styleUrls: ['./folder.component.scss', '../folder/folder.component.scss'],
})
export class FolderExtendComponent extends TCFolderComponent implements OnInit, OnDestroy {

  ngOnInit() {
    this.pageSize = 30;
    this.fastEditEnable = false;
    this.enableFilter = false;
    super.ngOnInit();
  }

  ngOnDestroy() {
    super.ngOnDestroy();
  }

  async initRoute() {
    this.editIndex = -1;
    this.fieldsValue = {};
    this.loading = true;
    this.isEmpty = false;
    this.enableCustomFields = false;
    this.canAdd = await this.fieldService.mayAccessRecord('add', this.referenceId);

    this.routeSnapshot = this.route.snapshot['_routerState'].url;
    const urlTree = this.router.parseUrl(this.routeSnapshot);
    this.routeSnapshot = urlTree.root.children['primary'].segments.map(it => it.path).join('/');

    this.route.queryParams.subscribe(param => {
      this.queryParams = param;
      if (this.queryParams['page'] && this.queryParams['page'] > 0) {
        this.pageIndex = this.queryParams['page'];
      }
      if (this.queryParams['sort']) {
        const sortList = this.queryParams['sort'].split(',');
        sortList.forEach((obj, index) => {
          const sT = obj.split(':');
          if (sT.length > 1) {
            this.sortData[sT[0]] = {
              key: sT[0],
              value: sT[1],
              order: index
            };
          }
        });
      }
    });
    // this.renderQueryParams(this.queryParams);

    this.getListRefRecord();
    this.hasCheck = true;
  }

  onChangePageIndex(param) {
    this.pageIndex = param;
    this.loading = true;
    this.renderQueryParams({page: this.pageIndex});
  }
}
