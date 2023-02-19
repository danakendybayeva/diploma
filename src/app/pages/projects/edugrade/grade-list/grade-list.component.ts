import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormGroup} from '@angular/forms';
import {map} from 'rxjs/operators';
import { FolderExtendComponent } from 'src/app/pages/reference/external/folder';
import {IPageContent} from '../../../../interfaces/services/page/page-content';
import {environment} from '../../../../../environments/environment';
import {Status, Util} from '../../../../interfaces/services/util.service';

@Component({
  selector: 'tc-all-grade-list',
  templateUrl: './grade-list.component.html',
  styleUrls: ['./grade-list.component.scss', '../../../reference/folder/folder.component.scss']
})
export class AllGradeListComponent extends FolderExtendComponent implements OnInit, OnDestroy {

  eduType = {
    type: 'eduway',
    title: 'Eduway',
    addGrade: true,
    saveOneGrade: false,
    saveGrades: true,
  };
  eduTypes = {
    course: {
      type: 'course',
      title: 'Course Grades',
      addGrade: true,
      saveOneGrade: false,
      saveGrades: true,
    },
    edutest: {
      type: 'edutest',
      title: 'Edutest',
      addGrade: true,
      saveOneGrade: false,
      saveGrades: true,
    },
    eduway: {
      type: 'eduway',
      title: 'Eduway',
      addGrade: true,
      saveOneGrade: false,
      saveGrades: true,
    },
    gpa: {
      type: 'gpa',
      title: 'GPA',
      addGrade: true,
      saveOneGrade: false,
      saveGrades: true,
    },
    passport: {
      type: 'passport',
      title: 'M Passport',
      addGrade: false,
      saveOneGrade: true,
      saveGrades: false,
    },
    practice: {
      type: 'practice',
      title: 'Practice',
      addGrade: true,
      saveOneGrade: false,
      saveGrades: true,
    },
    seminar: {
      type: 'seminar',
      title: 'Seminar',
      addGrade: true,
      saveOneGrade: false,
      saveGrades: true,
    }
  };
  placeholderTypes = {
    course: {
      title: 'Course topic'
    },
    edutest: {
      title: 'Test topic'
    },
    eduway: {
      title: 'Semester'
    },
    gpa: {
      title: 'Semester'
    },
    passport: {
      title: 'Task link'
    },
    practice: {
      title: 'Practice topic'
    },
    seminar: {
      title: 'Seminar topic'
    }
  };
  gradeFields = {
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

  labelForm: FormGroup;
  filterMore = {};
  maxGrade = 100;

  dataDraw = {};
  visibleDraw = false;
  titleOptionDraw = [];
  titleOption = [];
  canAddGrade = false;
  activeIndex = null;
  removeIndex = null;
  loadingGrade = false;
  loadingOneGrade = [];

  ngOnInit() {
    super.ngOnInit();
  }

  async initRoute() {

    const t = this.route.snapshot.params['edutype'];
    if (t && this.eduTypes.hasOwnProperty(t)) {
      this.eduType = this.eduTypes[t];
    } else {
      setTimeout(() => {
        this.router.navigate(['/vertical/user-profile']).then();
      });
    }

    if (this.eduType.type === 'gpa') {
      this.maxGrade = 4.0;
    }

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
      title: this.eduType.title,
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
    return this.http.get<IPageContent>(`${environment.apiUrl}/api/project/grade/${this.eduType.type}/list` +
        `?page=${this.pageIndex}&size=${this.pageSize}${this.prepareParamsFields()}` +
        `&s=${this.searchValue}&${Util.prepareFilter(this.filterMore)}`)
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
    this.dataDraw['grades'] = this.dataRecord[index]['grades'];

    this.gradeConvert(this.dataDraw['grades']);

    this.loadingOneGrade = new Array(this.dataDraw['grades'].length).fill(false);
    // preparing page Grade Titles
    this.setTitleOption(index);
    for (let i = 0; i < this.titleOption.length; i++) {
      this.titleOptionDraw.push(this.titleOption[i]);
    }
    for (let i = 0; i < this.dataDraw['grades'].length; i++) {
      this.dataDraw['grades'][i]['hidden'] = false;
      if (!this.dataDraw['grades'][i]['grade'] && this.eduType.type !== 'eduway') {
        this.dataDraw['grades'][i]['nan'] = true;
      }
    }
    this.activeIndex = index;
  }

  closeDraw(): void {
    this.visibleDraw = false;
    this.gradeConvert(this.dataDraw['grades'], true);
  }

  postRequest(url, postParam): Promise<Status> {
    return this.http.post<Status>(url, postParam)
        .toPromise()
        .then(response => response as Status)
        .catch();
  }

  addNewGrade() {
    const grade = {
      id: null,
      title_lesson: [[''], ['']],
      set_date: null,
      grade: null,
      profile_id: this.dataDraw['id'],
      hidden: true,
      nan: false,
    };
    this.dataDraw['grades'].push(grade);
  }

  async saveGrade(index: number) {
    let check = true;
    this.loadingOneGrade[index] = true;
    const grade = this.dataDraw['grades'][index];
    if (grade['nan'] === true) {
      grade['grade'] = 0;
    } else if (!grade['grade'] || (grade['grade'] > this.maxGrade || grade['grade'] < 0)) {
      check = false;
    }
    if (check) {
      const result = await this.postRequest(`${environment.apiUrl}/api/project/grade/${this.eduType.type}/setGrade/${grade['id']}`, grade);
      if (result.status === 1) {
        this.toastr.success(result.message, 'Success', {closeButton: true});
        this.dataDraw['grades'][index] = result.value;
        this.dataRecord[this.activeIndex]['grades'] = this.dataDraw['grades'];
        for (let i = 0; i < this.dataDraw['grades'].length; i++) {
          this.dataDraw['grades'][i]['hidden'] = false;
          if (!this.dataDraw['grades'][i]['grade'] && this.eduType.type !== 'eduway') {
            this.dataDraw['grades'][i]['nan'] = true;
          }
        }
      } else {
        this.toastr.error(result.message, 'Error', {closeButton: true});
      }
    } else {
      this.toastr.error('Grade is not valid!', 'Error', {closeButton: true});
    }
    this.loadingOneGrade[index] = false;
  }

  async saveGrades() {
    this.loadingGrade = true;
    let check = true;
    this.dataDraw['grades'].forEach(item => {
      if (item['nan'] === true) {
        item['grade'] = 0;
      } else if (!item['grade'] && this.eduType.type === 'eduway') {
        item['grade'] = 0;
      } else if (!item['grade'] || (item['grade'] > this.maxGrade || item['grade'] < 0)) {
        this.toastr.error('Grade is not valid!', 'Error', {closeButton: true});
        this.loadingGrade = false;
        check = false;
      }
    });
    this.dataDraw['grades'].forEach(item => {
      if (!item['set_date'] && this.eduType.type !== 'passport') {
        this.toastr.error('Set date!', 'Error', {closeButton: true});
        this.loadingGrade = false;
        check = false;
        return;
      }
    });
    if (check) {
      this.gradeConvert(this.dataDraw['grades'], true);
      const result = await this.postRequest(`${environment.apiUrl}/api/project/grade/${this.eduType.type}/setGrades`,
          this.dataDraw['grades']);
      if (result.status === 1) {
        this.toastr.success(result.message, 'Success', {closeButton: true});
        this.dataDraw['grades'] = result.value;

        this.gradeConvert(this.dataDraw['grades']);

        this.dataRecord[this.activeIndex]['grades'] = this.dataDraw['grades'];
        for (let i = 0; i < this.dataDraw['grades'].length; i++) {
          this.dataDraw['grades'][i]['hidden'] = false;
          if (!this.dataDraw['grades'][i]['grade'] && this.eduType.type !== 'eduway') {
            this.dataDraw['grades'][i]['nan'] = true;
          }
        }
      } else {
        this.toastr.error(result.message, 'Error', {closeButton: true});
      }
    }

    this.loadingGrade = false;
  }

  async removeGrade(index: number) {
    if (this.dataDraw['grades'][index]['id']) {
      const result = await this.postRequest(`${environment.apiUrl}/api/project/grade/${this.eduType.type}/remove` +
          `/${this.dataDraw['grades'][index]['id']}`, {});
      if (result.status === 1) {
        this.toastr.success(result.message, 'Success', {closeButton: true});
        this.dataDraw['grades'].splice(index, 1);
        this.modal.close();
      } else {
        this.toastr.error(result.message, 'Error', {closeButton: true});
      }
    } else {
      this.dataDraw['grades'].splice(index, 1);
      this.modal.close();
    }
  }

  openModalRemove(body: any, header: any = null, footer: any = null, options: any = null, index: number = -1) {
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

  // Additional function
  gradeConvert(dataDraw: any, inverse: boolean = false) {
    if (this.eduType.type === 'gpa') {
      if (inverse) {
        for (let i = 0; i < dataDraw.length; i++) {
          if (dataDraw[i]['grade'] !== null) {
            dataDraw[i]['grade'] = dataDraw[i]['grade'] * 1000 / 4;
          }
        }
      } else {
        for (let i = 0; i < dataDraw.length; i++) {
          if (dataDraw[i]['grade'] !== null) {
            dataDraw[i]['grade'] = dataDraw[i]['grade'] / 1000 * 4.0;
          }
        }
      }
    }
    if (this.eduType.type === 'eduway') {
      for (let i = 0; i < dataDraw.length; i++) {
        if (dataDraw[i]['grade']) {
          dataDraw[i]['grade'] = 1;
        } else {
          dataDraw[i]['grade'] = 0;
        }
      }
    }
  }

  setTitleOption(index: number = 0) {
    switch (this.eduType.type) {
      case 'edutest':
        this.titleOption = [
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
        break;
      case 'gpa':
      case 'eduway':
        this.titleOption = [
          {
            label: 'Semester 1',
            value: 'Semester 1'
          },
          {
            label: 'Semester 2',
            value: 'Semester 2'
          }
        ];
        break;
      case 'seminar':
        this.titleOption = [
            {
              label: 'Seminar 1 (Orient.days)',
              value: 'Seminar 1 (Orient.days)'
            },
            {
              label: 'Seminar 2',
              value: 'Seminar 2'
            },
            {
              label: 'Seminar 3 (Winter Camp)',
              value: 'Seminar 3 (Winter Camp)'
            },
            {
              label: 'Seminar 4',
              value: 'Seminar 4'
            },
            {
              label: 'Seminar 5',
              value: 'Seminar 5'
            },
            {
              label: 'Seminar 6 (Summer Camp)',
              value: 'Seminar 6 (Summer Camp)'
            },
          ];
        break;
      case 'course':
        for (let i = 0; i < this.dataRecord[index]['titleOption'].length; i++) {
          this.titleOption.push({
            label: this.dataRecord[index]['titleOption'][i].display_name,
            value: this.dataRecord[index]['titleOption'][i].id
          });
        }
        break;
      default:
        this.titleOption = [];
    }
  }

  onTitleChange(eduElement: any) {
    if (this.eduType.type === 'course') {
      for (let i = 0; i < this.titleOptionDraw.length; i++) {
        if (this.titleOptionDraw[i]['value'] === eduElement[0][0]) {
          eduElement[1][0] = this.titleOptionDraw[i]['label'];
        }
      }
    }
  }

  status(index: number) {
    if (this.eduType.type === 'passport') {
      const stuTask = this.dataRecord[index]['grades'];
      for (let i = 0; i < stuTask.length; i++) {
        if (stuTask[i]['status'] === 1) {
          return false;
        }
      }
      return true;
    }
    return true;
  }

  change(eduElement: any) {
  }
}
