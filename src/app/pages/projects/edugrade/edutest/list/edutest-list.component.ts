import { Component, OnDestroy, OnInit} from '@angular/core';

import {environment} from '../../../../../../environments/environment';
import {IPageContent} from '../../../../../interfaces/services/page/page-content';
import {map} from 'rxjs/operators';
import {FolderExtendComponent} from '../../../../reference/external/folder';
import {FormGroup} from '@angular/forms';
import {Status, Util} from '../../../../../interfaces/services/util.service';

@Component({
  selector: 'edutest-list',
  templateUrl: 'edutest-list.component.html',
  styleUrls: ['./edutest-list.component.scss', '../../../../reference/folder/folder.component.scss'],
})
export class EdutestListComponent extends FolderExtendComponent implements OnInit, OnDestroy {
  labelForm: FormGroup;
  visibleDraw = false;
  dataEduway = {};
  titleOption = [
    {
      label: 'Edutest 1',
      value: 'Edutest 1'
    },
    {
      label: 'Edutest 2',
      value: 'Edutest 2'
    },
    {
      label: 'Edutest 3',
      value: 'Edutest 3'
    },
    {
      label: 'Edutest 4(Final)',
      value: 'Edutest 4(Final)'
    },
    {
      label: 'Edutest 5',
      value: 'Edutest 5'
    },
    {
      label: 'Edutest 6',
      value: 'Edutest 6'
    },
    {
      label: 'Edutest 7',
      value: 'Edutest 7'
    },
    {
      label: 'Edutest 8(Final)',
      value: 'Edutest 8(Final)'
    },
    {
      label: 'Diagnostic Test',
      value: 'Diagnostic Test'
    },
  ];
  titleOptionDraw = [];
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
      title: 'Edutest',
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
    return this.http.get<IPageContent>(`${environment.apiUrl}/api/project/edugrade/edutest/list` +
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
    this.titleOptionDraw = [];
    this.visibleDraw = true;
    this.dataEduway['fio'] = this.dataRecord[index]['fio'];
    this.dataEduway['id'] = this.dataRecord[index]['id'];
    this.dataEduway['edutest'] = this.dataRecord[index]['edutest'];
    for (let i = 0; i < this.titleOption.length; i++) {
      this.titleOptionDraw.push(this.titleOption[i]);
    }
    for (let i = 0; i < this.dataEduway['edutest'].length; i++) {
      this.dataEduway['edutest'][i]['hidden'] = false;
      if (this.dataEduway['edutest'][i]['grade'] === null) {
        this.dataEduway['edutest'][i]['nan'] = true;
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
    const edutest = {
      id: null,
      title_lesson: '',
      set_date: null,
      grade: null,
      profile_id: this.dataEduway['id'],
      hidden: true,
      nan: false,
    };
    this.dataEduway['edutest'].push(edutest);
  }

  async addGrade() {
    let check = true;
    this.loadingGrade = true;
    this.dataEduway['edutest'].forEach(item => {
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
      const result = await this.postRequest(`${environment.apiUrl}/api/project/edugrade/edutest/setEdu`, this.dataEduway['edutest']);
      if (result.status === 1) {
        this.toastr.success(result.message, 'Success', {closeButton: true});
        this.dataEduway['edutest'] = result.value;
        this.dataRecord[this.activeIndex]['edutest'] = this.dataEduway['edutest'];
        for (let i = 0; i < this.dataEduway['edutest'].length; i++) {
          if (this.dataEduway['edutest'][i]['grade'] === null) {
            this.dataEduway['edutest'][i]['nan'] = true;
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
    if (this.dataEduway['edutest'][index]['id']) {
      const result = await this.postRequest(`${environment.apiUrl}/api/project/edugrade/edutest/delete/${this.dataEduway['edutest'][index]['id']}`, {});
      if (result.status === 1) {
        this.toastr.success(result.message, 'Success', {closeButton: true});
        this.dataEduway['edutest'].splice(index, 1);
        this.modal.close();
      } else {
        this.toastr.error(result.message, 'Error', {closeButton: true});
      }
    } else {
      this.dataEduway['edutest'].splice(index, 1);
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
