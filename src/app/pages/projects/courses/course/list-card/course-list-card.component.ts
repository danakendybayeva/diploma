import { Component, OnDestroy, OnInit} from '@angular/core';

import {TCFolderComponent} from '../../../../reference/folder';
import {CourseFields} from '../../../../../interfaces/services/projects/courses.service';
import {environment} from '../../../../../../environments/environment';
import {IPageContent} from '../../../../../interfaces/services/page/page-content';
import {map} from 'rxjs/operators';
import * as SettingsActions from '../../../../../store/actions/app-settings.actions';

@Component({
  selector: 'course-card-list',
  templateUrl: 'course-list-card.component.html',
  styleUrls: ['./course-list-card.component.scss', '../../../../reference/folder/folder.component.scss'],
})
export class CourseListCardComponent extends TCFolderComponent implements OnInit, OnDestroy {
  tabShow = 0;
  myCourseData = [];
  myCourseTotal = -1;
  myCoursePages = 0;
  isMyCourseLoaded = false;

  ngOnInit() {
    this.pageSize = 30;
    this.fastEditEnable = false;
    this.enableFilter = false;
    this.pageData = {
      title: '',
      loaded: true
    };
    // this.store.dispatch(new SettingsActions.Update({ boxed: true }));
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

  async getListRefRecord() {
    this.loading = true;
    this.initTable();

    const url = `${environment.apiUrl}/api/project/course/list/client/current` +
        `?page=${this.pageIndex}&size=${this.pageSize}${this.prepareParamsFields()}&customised=true&headerEnable=true`;
    return this.http.get<IPageContent>(url)
        .pipe(map(data => {
          return data;
        }))
        .subscribe(data => {
          if (data.size > 0 && !data.empty) {
            this.dataRecord = data.content;
            this.totalData = data.totalElements;
            this.totalPages = data.totalPages;
            this.isLast = data.last;
            this.loading = false;
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

  getMyListRefRecord() {
    this.isMyCourseLoaded = false;
    this.initTable();

    const url = `${environment.apiUrl}/api/project/course/my/list` +
        `?page=${this.pageIndex}&size=${this.pageSize}${this.prepareParamsFields()}&customised=true&headerEnable=true`;
    return this.http.get<IPageContent>(url)
        .pipe(map(data => {
          return data;
        }))
        .subscribe(data => {
          if (data.size > 0 && !data.empty) {
            this.myCourseData = data.content;
            this.myCourseTotal = data.totalElements;
            this.myCoursePages = data.totalPages;
            this.isLast = data.last;
            if (this.dataRecord.length
                && (this.dataRecord[0]['creator'] || this.dataRecord[0]['created_at'] || this.dataRecord[0]['updated_at'])
            ) {
              this.enableCustomFields = true;
            }
          } else {
            this.isEmpty = true;
          }
          this.isMyCourseLoaded = true;
        });
  }

  submitEvent(valid: boolean) {
    return null;
  }

  prepareNavigateLink(id) {
    return ['/vertical/courses/admin/course/edit', id];
  }

  onChangePageIndex(param) {
    this.pageIndex = param;
    this.loading = true;
    this.renderQueryParams({page: this.pageIndex});
  }

  nzTabIndexChange(params) {
    this.tabShow = params;
    if (this.tabShow === 1 && !this.isMyCourseLoaded) {
      this.getMyListRefRecord();
    }
  }
}
