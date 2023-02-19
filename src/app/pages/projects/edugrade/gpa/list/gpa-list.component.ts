import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormGroup} from '@angular/forms';
import {IPageContent} from '../../../../../interfaces/services/page/page-content';
import {environment} from '../../../../../../environments/environment';
import {map} from 'rxjs/operators';
import {Status, Util} from '../../../../../interfaces/services/util.service';
import {FolderExtendComponent} from '../../../../reference/external/folder';

@Component({
  selector: 'gpa-list',
  templateUrl: './gpa-list.component.html',
  styleUrls: ['./gpa-list.component.scss', '../../../../reference/folder/folder.component.scss']
})
export class GpaListComponent extends FolderExtendComponent implements OnInit, OnDestroy {

  labelForm: FormGroup;
  visibleDraw = false;
  dataEduway = {};
  titleOption = [
    {
      label: 'Semester 1',
      value: 'Semester 1'
    },
    {
      label: 'Semester 2',
      value: 'Semester 2'
    }
  ];
  titleOptionDraw = [];
  gpaFields = {
    grade: {
      id: 'grade',
      hint: null,
      type: 'integer',
      title: 'Grade',
      rangeTo: 100,
      hasRange: true,
      isUnique: false,
      orderNum: 1,
      rangeFrom: 0,
      isRequired: true,
      defaultValue: 0
    },
    set_date: {
      id: 'set_date',
      hint: null,
      type: 'date',
      title: 'Date',
      addDays: null,
      maxDate: null,
      minDate: null,
      isUnique: false,
      orderNum: 2,
      isRequired: true,
      viewFormat: 'dd.MM.yyyy',
      currentTimestamp: false
    },
    title_lesson: {
      id: 'title_lesson',
      hint: null,
      mask: null,
      type: 'string',
      title: 'Lesson topic',
      isUnique: false,
      orderNum: 0,
      maxLength: null,
      minLength: null,
      isRequired: true,
      defaultValue: null,
      maxShowLength: null
    }
  };
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
      title: 'GPA',
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
    return this.http.get<IPageContent>(`${environment.apiUrl}/api/project/edugrade/gpa/list` +
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
          } else {
            this.isEmpty = true;
          }
          this.loading = false;
        });
  }

  prepareNavigateLink(id) {
    return ['/vertical/lingua/group/view', id];
  }

  openDraw(index: number): void {
    this.titleOptionDraw = [];
    this.visibleDraw = true;
    this.dataEduway['fio'] = this.dataRecord[index]['fio'];
    this.dataEduway['id'] = this.dataRecord[index]['id'];
    this.dataEduway['gpa'] = this.dataRecord[index]['gpa'];
    this.gpaConvert(this.dataEduway['gpa']);
    for (let i = 0; i < this.titleOption.length; i++) {
      this.titleOptionDraw.push(this.titleOption[i]);
    }
    for (let i = 0; i < this.dataEduway['gpa'].length; i++) {
      this.dataEduway['gpa'][i]['hidden'] = false;
      if (this.dataEduway['gpa'][i]['grade'] === null) {
        this.dataEduway['gpa'][i]['nan'] = true;
      }
    }
    this.activeIndex = index;
  }

  closeDraw(): void {
    this.visibleDraw = false;
    this.gpaConvert(this.dataEduway['gpa'], true);
  }

  postRequest(url, postParam): Promise<Status> {
    return this.http.post<Status>(url, postParam)
        .toPromise()
        .then(response => response as Status)
        .catch();
  }

  addNewGrade() {
    const gpa = {
      id: null,
      title_lesson: '',
      set_date: null,
      grade: null,
      profile_id: this.dataEduway['id'],
      hidden: true,
      nan: false,
    };
    this.dataEduway['gpa'].push(gpa);
  }

  async addGrade() {
    this.loadingGrade = true;
    let check = true;
    this.dataEduway['gpa'].forEach(item => {
      if ((item['grade'] === '' || item['grade'] === null) && item['nan'] === true) {
        item['grade'] = null;
      }
      if (
          item['grade'] !== null && item['grade'] && (item['grade'] > 4.0 || item['grade'] < 0)
      ) {
        check = false;
      }
    });
    if (check) {
      this.gpaConvert(this.dataEduway['gpa'], true);
      const result = await this.postRequest(`${environment.apiUrl}/api/project/edugrade/gpa/setEdu`, this.dataEduway['gpa']);
      if (result.status === 1) {
        this.toastr.success(result.message, 'Success', {closeButton: true});
        this.dataEduway['gpa'] = result.value;
        this.gpaConvert(this.dataEduway['gpa']);
        this.dataRecord[this.activeIndex]['gpa'] = this.dataEduway['gpa'];
        for (let i = 0; i < this.dataEduway['gpa'].length; i++) {
          if (this.dataEduway['gpa'][i]['grade'] === null) {
            this.dataEduway['gpa'][i]['nan'] = true;
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
    if (this.dataEduway['gpa'][index]['id']) {
      const result = await this.postRequest(`${environment.apiUrl}/api/project/edugrade/gpa/delete/${this.dataEduway['gpa'][index]['id']}`, {});
      if (result.status === 1) {
        this.toastr.success(result.message, 'Success', {closeButton: true});
        this.dataEduway['gpa'].splice(index, 1);
        this.modal.close();
      } else {
        this.toastr.error(result.message, 'Error', {closeButton: true});
      }
    } else {
      this.dataEduway['gpa'].splice(index, 1);
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

  private gpaConvert(dataEduway: any, inverse: boolean = false) {
    if (inverse) {
      for (let i = 0; i < dataEduway.length; i++) {
        if (dataEduway[i]['grade'] !== null) {
          dataEduway[i]['grade'] = dataEduway[i]['grade'] * 1000 / 4;
        }
      }
    } else {
      for (let i = 0; i < dataEduway.length; i++) {
        if (dataEduway[i]['grade'] !== null) {
          dataEduway[i]['grade'] = dataEduway[i]['grade'] / 1000 * 4.0;
        }
      }
    }
  }

  change(eduElement: any) {
    if (eduElement === '') {
      eduElement = null;
    }
  }
}
