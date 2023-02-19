import {Component, OnDestroy, OnInit} from '@angular/core';
import {FolderExtendComponent} from '../../../../reference/external/folder';
import {FormGroup} from '@angular/forms';
import {IPageContent} from '../../../../../interfaces/services/page/page-content';
import {environment} from '../../../../../../environments/environment';
import {map} from 'rxjs/operators';
import {Status, Util} from '../../../../../interfaces/services/util.service';

@Component({
  selector: 'passport-grade-list',
  templateUrl: './grade-list.component.html',
  styleUrls: ['./grade-list.component.scss', '../../../../reference/folder/folder.component.scss']
})
export class PassportGradeListComponent extends FolderExtendComponent implements OnInit, OnDestroy  {
  labelForm: FormGroup;
  visibleDraw = false;
  dataDraw = {};
  titleOptionDraw = [];
  activeIndex = null;
  removeIndex = null;
  loadingGrade = false;
  filterMore = {};
  loadingOneGrade = [];

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
    await this.getListRefRecord();
    this.canAdd = await this.fieldService.mayAccessRecord('add', this.referenceId);
    this.pageData = {
      title: 'M Passport',
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
    return this.http.get<IPageContent>(`${environment.apiUrl}/api/project/passport/student-task/gradeList` +
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
    this.dataDraw['fio'] = this.dataRecord[index]['fio'];
    this.dataDraw['id'] = this.dataRecord[index]['id'];
    this.dataDraw['tasks'] = this.dataRecord[index]['tasks'];
    this.loadingOneGrade = new Array(this.dataDraw['tasks'].length).fill(false);
    for (let i = 0; i < this.dataDraw['tasks'].length; i++) {
      this.dataDraw['tasks'][i]['hidden'] = (this.dataDraw['tasks'][i]['status'] === 2);
      // if (this.dataDraw['tasks'][i]['grade'] === null) {
      //   this.dataDraw['tasks'][i]['nan'] = true;
      // }
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

  async addGrade() {
    let check = true;
    this.loadingGrade = true;
    this.dataDraw['tasks'].forEach(item => {
      // if ((item['grade'] === '' || item['grade'] === null) && item['nan'] === true) {
      //   item['grade'] = null;
      // }
      // if (
      //     item['grade'] !== null && item['grade'] && (item['grade'] > 100 || item['grade'] < 0)
      // ) {
      //   check = false;
      // }
      if ((!item['grade']  && item['grade'] !== 0) || (item['grade'] > 100 || item['grade'] < 0)) {
        check = false;
      }
    });
    if (check) {
      const result = await this.postRequest(`${environment.apiUrl}/api/project/passport/student-task/setGrade`, this.dataDraw['tasks']);
      if (result.status === 1) {
        this.toastr.success(result.message, 'Success', {closeButton: true});
        this.dataDraw['tasks'] = result.value;
        this.dataRecord[this.activeIndex]['tasks'] = this.dataDraw['tasks'];
        // for (let i = 0; i < this.dataDraw['tasks'].length; i++) {
        //   if (this.dataDraw['tasks'][i]['grade'] === null) {
        //     this.dataDraw['tasks'][i]['nan'] = true;
        //   }
        // }
      } else {
        this.toastr.error(result.message, 'Error', {closeButton: true});
      }
    } else {
      this.toastr.error('Grade is not valid!', 'Error', {closeButton: true});
    }
    this.loadingGrade = false;
  }

  async addOneGrade(index: number) {
    let check = true;
    this.loadingOneGrade[index] = true;
    const task = this.dataDraw['tasks'][index];
    // if ((task['grade'] === '' || task['grade'] === null) && task['nan'] === true) {
    //   task['grade'] = null;
    // }
    // if (
    //     task['grade'] !== null ||
    //     (task['grade'] && (task['grade'] > 100 || task['grade'] < 0))
    // ) {
    //   check = false;
    // }
    if (!task['grade'] || (task['grade'] > 100 || task['grade'] < 0)) {
      check = false;
    }
    if (check) {
      const result = await this.postRequest(`${environment.apiUrl}/api/project/passport/student-task/setGrade/${task['id']}`, task);
      if (result.status === 1) {
        this.toastr.success(result.message, 'Success', {closeButton: true});
        this.dataDraw['tasks'][index] = result.value;
        this.dataRecord[this.activeIndex]['tasks'] = this.dataDraw['tasks'];
        // for (let i = 0; i < this.dataDraw['tasks'].length; i++) {
        //   if (this.dataDraw['tasks'][i]['grade'] === null) {
        //     this.dataDraw['tasks'][i]['nan'] = true;
        //   }
        // }
      } else {
        this.toastr.error(result.message, 'Error', {closeButton: true});
      }
    } else {
      this.toastr.error('Grade is not valid!', 'Error', {closeButton: true});
    }
    this.loadingOneGrade[index] = false;
  }

  async removeGrade(index: number) {
    if (this.dataDraw['tasks'][index]['id']) {
      const result = await this.postRequest(`${environment.apiUrl}/api/project/passport/student-task/remove/${this.dataDraw['tasks'][index]['id']}`, {});
      if (result.status === 1) {
        this.toastr.success(result.message, 'Success', {closeButton: true});
        this.dataDraw['tasks'].splice(index, 1);
        this.modal.close();
      } else {
        this.toastr.error(result.message, 'Error', {closeButton: true});
      }
    } else {
      this.dataDraw['tasks'].splice(index, 1);
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

  // change(eduElement: any) {
  //   if (eduElement === '') {
  //     eduElement = null;
  //   }
  // }

  status(index: number) {
    const stuTask = this.dataRecord[index]['tasks'];
    for (let i = 0; i < stuTask.length; i++) {
      if (stuTask[i]['status'] === 1) {
        return false;
      }
    }
    return true;
  }
}

