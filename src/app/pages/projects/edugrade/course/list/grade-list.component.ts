import {Component, OnDestroy, OnInit} from '@angular/core';
import {FolderExtendComponent} from '../../../../reference/external/folder';
import {FormGroup} from '@angular/forms';
import {IPageContent} from '../../../../../interfaces/services/page/page-content';
import {environment} from '../../../../../../environments/environment';
import {map} from 'rxjs/operators';
import {Status, Util} from '../../../../../interfaces/services/util.service';

@Component({
  selector: 'grade-list',
  templateUrl: './grade-list.component.html',
  styleUrls: ['./grade-list.component.scss', '../../../../reference/folder/folder.component.scss']
})
export class GradeListComponent extends FolderExtendComponent implements OnInit, OnDestroy  {
  labelForm: FormGroup;
  visibleDraw = false;
  dataEduway = {};
  titleOptionDraw = [];
  courseGradeFields = {
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
      title: 'Course Grades',
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
    return this.http.get<IPageContent>(`${environment.apiUrl}/api/project/edugrade/course/list` +
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

  prepareNavigateLink(id) {
    return ['/vertical/lingua/group/view', id];
  }

  openDraw(index: number): void {
    this.titleOptionDraw = [];
    this.visibleDraw = true;
    this.dataEduway['fio'] = this.dataRecord[index]['fio'];
    this.dataEduway['id'] = this.dataRecord[index]['id'];
    this.dataEduway['course'] = this.dataRecord[index]['course'];
    const titleOption = this.dataRecord[index]['titleOption'];
    for (let i = 0; i < titleOption.length; i++) {
      this.titleOptionDraw.push({
        label: titleOption[i].display_name,
        value: titleOption[i].id
      });
    }

    for (let i = 0; i < this.dataEduway['course'].length; i++) {
      this.dataEduway['course'][i]['hidden'] = false;
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
    const course = {
      id: null,
      title_lesson: [[''], ['']],
      set_date: null,
      grade: 0,
      profile_id: this.dataEduway['id'],
      hidden: true,
    };
    this.dataEduway['course'].push(course);
  }

  async addGrade() {
    let check = true;
    this.loadingGrade = true;
    this.dataEduway['course'].forEach(item => {
      if ((!item['grade'] && item['grade'] !== 0) || (item['grade'] > 100 || item['grade'] < 0)) {
        check = false;
      }
    });
    if (check) {
      const result = await this.postRequest(`${environment.apiUrl}/api/project/edugrade/course/setCourse`, this.dataEduway['course']);
      if (result.status === 1) {
        this.toastr.success(result.message, 'Success', {closeButton: true});
        this.dataEduway['course'] = result.value;
        this.dataRecord[this.activeIndex]['course'] = this.dataEduway['course'];
      } else {
        this.toastr.error(result.message, 'Error', {closeButton: true});
      }
    } else {
      this.toastr.error('Grade is not valid!', 'Error', {closeButton: true});
    }
    this.loadingGrade = false;
  }

  async removeGrade(index: number) {
    if (this.dataEduway['course'][index]['id']) {
      const result = await this.postRequest(`${environment.apiUrl}/api/project/edugrade/course/delete/${this.dataEduway['course'][index]['id']}`, {});
      if (result.status === 1) {
        this.toastr.success(result.message, 'Success', {closeButton: true});
        this.dataEduway['course'].splice(index, 1);
        this.modal.close();
      } else {
        this.toastr.error(result.message, 'Error', {closeButton: true});
      }
    } else {
      this.dataEduway['course'].splice(index, 1);
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

  onTitleChange(eduElement: any) {
    for (let i = 0; i < this.titleOptionDraw.length; i++) {
      if (this.titleOptionDraw[i]['value'] === eduElement[0][0]) {
        eduElement[1][0] = this.titleOptionDraw[i]['label'];
      }
    }
  }

}
