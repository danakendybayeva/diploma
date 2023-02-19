import { Component, OnDestroy, OnInit} from '@angular/core';

import {TCFolderComponent} from '../../../../reference/folder';
import {CompanyFields} from '../../../../../interfaces/services/projects/courses.service';
import {environment} from '../../../../../../environments/environment';
import {IPageContent} from '../../../../../interfaces/services/page/page-content';
import {map} from 'rxjs/operators';

@Component({
  selector: 'company-list',
  templateUrl: '../../../../reference/folder/folder.component.html',
  styleUrls: ['./company-list.component.scss', '../../../../reference/folder/folder.component.scss'],
})
export class CompanyListComponent extends TCFolderComponent implements OnInit, OnDestroy {

  ngOnInit() {
    this.fastEditEnable = false;
    this.initRoute();
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
    //TODO dorabotat
    this.hasCheck = true;

    this.pageData = {
      title: 'Список компании',
      loaded: true
    };
  }

  async getListRefRecord() {
    this.headerRecord = [
        CompanyFields['display_name']
    ];
    this.loading = true;
    this.initTable();

    const url = `${environment.apiUrl}/api/project/course/company/list` +
        `?page=${this.pageIndex}&size=${this.pageSize}&customised=true&headerEnable=true`;
    return this.http.get<IPageContent>(url)
        .pipe(map(data => {
          return data;
        }))
        .subscribe(data => {
          if (data.size > 0 && !data.empty) {
            this.dataRecord = data.content;
            this.checkData = new Array(this.dataRecord.length).fill(false);
            this.totalData = data.totalElements;
            this.totalPages = data.totalPages;
            this.isLast = data.last;
            this.loading = false;
            if (this.isLast) {
              this.totalData++;
            }
            if (this.dataRecord.length
                && (this.dataRecord[0]['creator'] || this.dataRecord[0]['created_at'] || this.dataRecord[0]['updated_at'])
            ) {
              this.enableCustomFields = true;
            }
          } else {
            this.isEmpty = true;
          }
          this.loading = false;
        });
  }

  submitEvent(valid: boolean) {
    return null;
  }

  prepareNavigateLink(id) {
    return ['/vertical/courses/companies/view', id];
  }
}
