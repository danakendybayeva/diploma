import { Component, OnDestroy, OnInit} from '@angular/core';

import {environment} from '../../../../../../environments/environment';
import {IPageContent} from '../../../../../interfaces/services/page/page-content';
import {map} from 'rxjs/operators';
import {FolderExtendComponent} from '../../../../reference/external/folder';
import {FormGroup} from '@angular/forms';
import {Status, Util} from '../../../../../interfaces/services/util.service';

@Component({
  selector: 'way-list',
  templateUrl: 'way-list.component.html',
  styleUrls: ['./way-list.component.scss', '../../../../reference/folder/folder.component.scss'],
})
export class WayListComponent extends FolderExtendComponent implements OnInit, OnDestroy {
  labelForm: FormGroup;
  visibleDraw = false;
  type = 'eduway';
  dataEduway = {};
  activeIndex = null;
  removeIndex = null;
  loadingGrade = false;
  filterMore = {};

  async initRoute() {
    this.labelForm = new FormGroup({});
    this.referenceId = 'd924aba7-a38b-4688-905d-694511177686';
    this.sectionId = 'e82e6607-6a0f-48e8-a822-8eacf3a8fb76';
    this.pageSize = 30;

    this.enableFilter = false;
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
    this.canAdd = await this.fieldService.mayAccessRecord('add', this.referenceId);
    this.pageData = {
      title: 'Eduway',
      loaded: true
    };
    this.superOnInit();
  }

  async getListRefRecord() {
    this.loading = true;
    this.isEmpty = false;
    this.initTable();
    this.headerRecord = [
      {
        id: 'subdivision',
        hint: null,
        mask: null,
        type: 'string',
        title: 'Group',
        isUnique: false,
        orderNum: 3,
        maxLength: null,
        minLength: null,
        isRequired: false,
        defaultValue: null,
        maxShowLength: null
      },
      {
        id: 'mentor',
        hint: null,
        mask: null,
        type: 'string',
        title: 'Mentor',
        isUnique: false,
        orderNum: 3,
        maxLength: null,
        minLength: null,
        isRequired: false,
        defaultValue: null,
        maxShowLength: null
      },
      {
        id: 'fio',
        hint: null,
        mask: null,
        type: 'string',
        title: 'Full Name',
        isUnique: false,
        orderNum: 3,
        maxLength: null,
        minLength: null,
        isRequired: false,
        defaultValue: null,
        maxShowLength: null
      }
    ];
    return this.http.get<IPageContent>(`${environment.apiUrl}/api/project/edugrade/eduway/list` +
        `?page=${this.pageIndex}&size=${this.pageSize}${this.prepareParamsFields()}&s=${this.searchValue}&${Util.prepareFilter(this.filterMore)}`)
        .pipe(map(data => {
          return data;
        }))
        .subscribe(data => {
          if (data.size) {
            this.dataRecord = data.content;
            this.totalData = data.totalElements;
            this.totalPages = data.totalPages;
            this.isLast = data.last;
            this.loading = false;
          } else {
            this.isEmpty = true;
          }
          this.loading = false;
        });
  }

  openDraw(index: number): void {
    this.visibleDraw = true;
    this.dataEduway['fio'] = this.dataRecord[index]['fio'];
    this.dataEduway['id'] = this.dataRecord[index]['id'];
    this.dataEduway['eduway'] = this.dataRecord[index]['eduway'];
    for (let i = 0; i < this.dataEduway['eduway'].length; i++) {
      this.dataEduway['eduway'][i]['hidden'] = false;
      if (this.dataEduway['eduway'][i]['grade'] === null) {
        this.dataEduway['eduway'][i]['nan'] = true;
      }
    }
    this.activeIndex = index;
  }

  closeDraw(): void {
    this.visibleDraw = false;
  }

  postRequest(url, postParam): Promise<Status> {
    return this.http.post<Status>(url, postParam)
        .toPromise()
        .then(response => response as Status)
        .catch();
  }

  addNewGrade() {
    const eduway = {
      id: null,
      type: this.type,
      title_lesson: '',
      set_date: null,
      grade: null,
      profile_id: this.dataEduway['id'],
      hidden: true,
      nan: false,
    };
    this.dataEduway['eduway'].push(eduway);
  }

  async addGrade() {
    this.loadingGrade = true;
    let check = true;
    this.dataEduway['eduway'].forEach(item => {
      if ((item['grade'] === '' || item['grade'] === null) && item['nan'] === true) {
        item['grade'] = null;
      }
      if (
          item['grade'] !== null && item['grade'] && (item['grade'] > 100 || item['grade'] < 0)
      ) {
        check = false;
      }
    });
    if (check) {
      const result = await this.postRequest(`${environment.apiUrl}/api/project/edugrade/eduway/setEdu`, this.dataEduway['eduway']);
      if (result.status === 1) {
        this.toastr.success(result.message, 'Success', {closeButton: true});
        this.dataEduway['eduway'] = result.value;
        this.dataRecord[this.activeIndex]['eduway'] = this.dataEduway['eduway'];
        for (let i = 0; i < this.dataEduway['eduway'].length; i++) {
          if (this.dataEduway['eduway'][i]['grade'] === null) {
            this.dataEduway['eduway'][i]['nan'] = true;
          }
        }
      } else {
        this.toastr.error(result.message, 'Error', {closeButton: true});
      }
    } else {
      this.toastr.error('Grade is not valid!', 'Error', {closeButton: true});
    }
    this.loadingGrade = false;
  }

  async removeGrade(index: number) {
    if (this.dataEduway['eduway'][index]['id']) {
      const result = await this.postRequest(`${environment.apiUrl}/api/project/edugrade/eduway/delete/${this.dataEduway['eduway'][index]['id']}`, {});
      if (result.status === 1) {
        this.toastr.success(result.message, 'Success', {closeButton: true});
        this.dataEduway['eduway'].splice(index, 1);
        this.modal.close();
      } else {
        this.toastr.error(result.message, 'Error', {closeButton: true});
      }
    } else {
      this.dataEduway['eduway'].splice(index, 1);
      this.modal.close();
    }
  }

  openModalRemove(
      body: any,
      header: any = null,
      footer: any = null,
      options: any = null,
      index: number = -1
  ) {
    this.removeIndex = index;
    this.modal.open({
      body: body,
      header: header,
      footer: footer,
      options: options
    });
  }

  closeModal() {
    this.modal.close();
  }

  change(eduElement: any) {
    if (eduElement === '') {
      eduElement = null;
    }
  }

}
