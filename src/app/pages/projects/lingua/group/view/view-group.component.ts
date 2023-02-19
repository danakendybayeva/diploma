import {AfterViewChecked, Component, EventEmitter, HostListener, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {map} from 'rxjs/operators';
import {ViewRecordComponent} from '../../../../reference/record/view-record';
import {CompanyFields, TeacherFields} from '../../../../../interfaces/services/projects/courses.service';
import {environment} from '../../../../../../environments/environment';
import {TCExternalViewRecordComponent} from '../../../../reference/external/record/view-record';
import {FormGroup} from '@angular/forms';
import {Content} from '../../../../../ui/interfaces/modal';
import {formatDate} from '@angular/common';
import {Status} from '../../../../../interfaces/services/util.service';
import {IReference} from '../../../../../interfaces/services/reference/reference';
import {LinguaPeriod} from '../../../../../interfaces/services/projects/lingua.service';
import {Subject, Subscription} from 'rxjs';

@Component({
  selector: 'lg-view-group',
  templateUrl: './view-group.component.html',
  styleUrls: ['./view-group.component.scss', '../../../../reference/record/view-record/view-record.component.scss']
})
export class LGViewGroupComponent extends TCExternalViewRecordComponent implements OnInit, OnDestroy, AfterViewChecked {
  labelForm: FormGroup;
  periodForm: FormGroup;
  styleType = 'standard';
  canAddDate = false;
  today = new Date();

  months: any = {Sept: 12, Oct: 11, Nov: 10, Dec: 9, Jan: 8, Feb: 7, Mar: 6, Apr: 5, May: 4, Jun: 3, Jul: 2, Aug: 1};

  addDate = {
      id: 'add_date',
      hint: null,
      type: 'date',
      title: 'Begin',
      addDays: 0,
      maxDate: null,
      minDate: null,
      isUnique: false,
      orderNum: 3,
      isRequired: true,
      viewFormat: 'dd.MM.yyyy',
      currentTimestamp: true,
      value: null
  };
  selectedDate = null;
  loadingAttendance = true;
  loadingAttendanceBtn = false;
  attendance = [];
  allAttendance = [];
  fieldPeriod = LinguaPeriod;
  headerOfAttendanceTable = [];
  checkDataFinal = {};

  ngOnInit() {
    this.referenceId = 'd924aba7-a38b-4688-905d-694511177686';
    this.canAddDate = true;
    this.labelForm = new FormGroup({});
    this.periodForm = new FormGroup({});
    this.redirectRemove = '/vertical/lingua/group/list';
    super.ngOnInit();
  }

  ngOnDestroy() {
    super.ngOnDestroy();
  }

  ngAfterViewChecked() {
    super.ngAfterViewChecked();
  }

  async initRoute() {
    await super.initRoute();
    this.canEdit = await this.mayAccessRecord();
  }

  getRecordData(type: string = 'get') {
    return this.http.get<any>(this.responseUrl)
        .pipe(map(data => {
          return data;
        }))
        .subscribe(data => {
          if (Object.keys(data).length) {
            Object.entries(this.fieldsData).forEach(
                ([key, value]) => {
                  this.fieldsData[key].value = data[key];
                }
            );
            this.fieldsValue = data;
            Object.entries(this.fieldsValue['final_grades']).forEach(
                ([key, value]) => {
                  this.checkDataFinal[key] = (value['value'] === '0');
                }
            );
            // console.log(this.fieldsValue);
            // console.log(this.checkDataFinal);
            this.loaded = true;
          } else {
            this.isEmpty = true;
          }
        });
  }

  getEditUrl() {
    return ['/vertical/lingua/group/edit', this.recordId];
  }

  getDublicateUrl() {
    return `/vertical/lingua/group/edit/${this.recordId}/dublicate`;
  }

  async addDateEvent() {
    const result = await this.postRequest(`${environment.apiUrl}/api/project/lingua/day/add`, {
      id: this.selectedDate,
      group_id: this.recordId,
      day: this.addDate.value
    });
    if (result.status === 1) {
      this.toastr.success(result.message, 'Success', { closeButton: true });
      if (this.selectedDate !== null) {
        const index = this.fieldsValue['days'].findIndex(object => object.id === this.selectedDate);
        if (index >= 0) {
          this.fieldsValue['days'][index].day = this.addDate.value;
        }
      } else {
        this.fieldsValue['days'].push(
            {
              id: result.value,
              day: this.addDate.value,
              group_id: this.recordId,
            }
        );
      }
      this.fieldsValue['days'].sort((prev, curr) => {
        const prevDate = new Date(prev.day);
        const currDate = new Date(curr.day);
        return currDate.getTime() < prevDate.getTime() ? 1 : -1;
      });

    } else {
      this.toastr.error(result.message, 'Error', { closeButton: true });
    }
    this.closeModal();
  }

  async addPeriodEvent() {
    const params = this.prepareValues(this.fieldPeriod);
    params['group_id'] = this.recordId;
    const result = await this.postRequest(`${environment.apiUrl}/api/project/lingua/report/period/add`, params);
    if (result.status === 1) {
      this.toastr.success(result.message, 'Success', { closeButton: true });
      this.getRecordData('get');
    } else {
      this.toastr.error(result.message, 'Error', { closeButton: true });
    }
    this.closeModal();
  }

  async removeDate() {
    if (this.selectedDate) {
      const result = await this.postRequest(`${environment.apiUrl}/api/project/lingua/day/remove`, {
        id: this.selectedDate,
        group_id: this.recordId
      });
      if (result.status === 1) {
        this.toastr.success(result.message, 'Success', { closeButton: true });
        if (this.selectedDate !== null) {
          const index = this.fieldsValue['days'].findIndex(object => object.id === this.selectedDate);
          if (index >= 0) {
            this.fieldsValue['days'].splice(index, 1);
          }
        }
      } else {
        this.toastr.error(result.message, 'Error', { closeButton: true });
      }
    }
    this.closeModal();
  }

  editDateEvent(
      body: any,
      header: any = null,
      footer: any = null,
      options: any = null,
      index: number = -1
  ) {
    if (index > -1) {
      this.addDate.value = this.fieldsValue['days'][index].day;
      this.selectedDate = this.fieldsValue['days'][index].id;
    } else {
      this.addDate.value = null;
      this.selectedDate = null;
    }
    this.openModal(body, header, footer, options);
  }

  removeDateEvent(
      body: any,
      header: any = null,
      footer: any = null,
      options: any = null,
      id: any = null
  ) {
    this.selectedDate = id;
    this.openModal(body, header, footer, options);
  }

  async getAttendanceList(
      body: any,
      header: any = null,
      footer: any = null,
      options: any = null,
      index: any = null
  ) {
    this.loadingAttendance = true;
    const attendanceList = await this.getRequest(index);
    this.loadingAttendance = false;
    this.attendance = [];
    this.fieldsData['students'].value.forEach(item => {
      const indexFind = attendanceList.findIndex(object => object['profile_id'].toString() === item.id.toString());
      let attendanceCheck = false;
      let idAt = null;
      if (indexFind >= 0) {
        attendanceCheck = attendanceList[indexFind]['is_attendance'];
        idAt = attendanceList[indexFind]['id'];
      }
      this.attendance.push({
        id: idAt,
        profile_id: item.id,
        day_id: index,
        value: item.value,
        is_attendance: attendanceCheck
      });
    });
    this.openModal(body, header, footer, options);
  }

  async setAttendance() {
    if (this.attendance.length) {
      const result = await this.postRequest(`${environment.apiUrl}/api/project/lingua/attendance/set`, this.attendance);
      if (result.status === 1) {
        this.toastr.success(result.message, 'Success', { closeButton: true });
      } else {
        this.toastr.error(result.message, 'Error', { closeButton: true });
      }
    }
    this.closeModal();
  }

  editPeriodEvent(
      body: any,
      header: any = null,
      footer: any = null,
      options: any = null,
      index: number = -1
  ) {
    this.fieldPeriod.start_date.values = [];
    this.fieldPeriod.end_date.values = [];
    this.fieldsValue['days'].forEach((item, i) => {
      const prevDate = new Date(item.day);
      const dateP = {
        id: item.id,
        value: formatDate(prevDate, 'dd.MM.yyyy', 'en'),
        selected: false
      };
      this.fieldPeriod.start_date.values.push(dateP);
      this.fieldPeriod.end_date.values.push(dateP);
    });
    this.openModal(body, header, footer, options);
  }

  isTodayDate(day: Date) {
    return formatDate(day, 'dd.MM.yyyy', 'en') === formatDate(this.today, 'dd.MM.yyyy', 'en');
  }

  prepareResponseUrl(): string {
    return `${environment.apiUrl}/api/project/lingua/group/${this.recordId}`;
  }

  postRequest(url, postParam): Promise<Status> {
    return this.http.post<Status>(url, postParam)
        .toPromise()
        .then(response => response as Status)
        .catch();
  }

  getRequest(id): Promise<any[]> {
    return this.http.get<any[]>(`${environment.apiUrl}/api/project/lingua/attendance/list/${id}`)
        .toPromise()
        .then(response => response)
        .catch();
  }

  prepareValues(fieldsData: {}): {} {
    const values = {};
    Object.entries(fieldsData).forEach(
        ([key, value]) => {
          values[fieldsData[key].id] = fieldsData[key].value;
        }
    );
    return values;
  }

  dateString(day: Date, format: string = 'dd.MM.yyyy') {
    return this.datepipe.transform(day, format);
  }

  mayAccessRecord(): Promise<boolean> {
    return this.http.post<boolean>(`${environment.apiUrl}/api/project/lingua/group/may/edit/${this.recordId}`, {})
        .toPromise()
        .then(response => response as boolean)
        .catch();
  }

  async saveFinal() {
    const finalGrades = [];
    // tslint:disable-next-line:forin
    // for (const key in this.fieldsValue['final_grades']) {
    //   if (this.checkDataFinal[key]) {
    //     this.fieldsValue['final_grades'][key]['value'] = 0;
    //   } else if (!this.fieldsValue['final_grades'][key]['value'] ||
    //       (this.fieldsValue['final_grades'][key]['value'] > 100 ||
    //           0 > this.fieldsValue['final_grades'][key]['value'])) {
    //     this.toastr.error('Grade is not valid!', 'Error', { closeButton: true });
    //   }
    // }
    // tslint:disable-next-line:forin
    for (const key in this.fieldsValue['final_grades']) {
      finalGrades.push(this.fieldsValue['final_grades'][key]);
    }
    return this.http.post<Status>(`${environment.apiUrl}/api/project/lingua/group/${this.recordId}/final`, finalGrades)
        .subscribe({
          next: data => {
            if (data.status === 1) {
              this.toastr.success('Saved!', 'Success', { closeButton: true });
            } else {
              this.toastr.error(data.message, 'Error', { closeButton: true });
            }
          },
          error: error => {
            this.toastr.error('Not saved!', 'Error', { closeButton: true });
          }
        });
  }

  sort(reports: any) {
    return reports.sort((a, b) => this.months[a.title] > this.months[b.title] ? -1 : this.months[a.title] < this.months[b.title] ? 1 : 0);
  }

  async downloadExcell() {
      this.loadingAttendanceBtn = true;
      await this.http.post<any[]>(`${environment.apiUrl}/api/media/file/excel/lingua-attendance`, this.recordId)
          .toPromise()
          .then(response => response)
          .catch();
      const groupName = (this.fieldsData['display_name'].value.toString()).replaceAll(' ', '-');
      const groupCity = (this.fieldsData['city'].value[0].value.toString()).replaceAll(' ', '-');
      const fileName = `Lingua-attendance-${groupName}-${groupCity}`;
      await this.http.get(`${environment.apiUrl}/api/media/file/excel/download`,
          {responseType: 'blob' as 'json'}).subscribe(
          (response: any) => {
            const dataType = response.type;
            const binaryData = [];
            binaryData.push(response);
            const downloadLink = document.createElement('a');
            downloadLink.href = window.URL.createObjectURL(new Blob(binaryData, {type: dataType}));
            downloadLink.setAttribute('download', `${fileName}.xlsx`);
            document.body.appendChild(downloadLink);
            downloadLink.click();
          }
      );
      this.loadingAttendanceBtn = false;
      return this.http.post<any[]>(`${environment.apiUrl}/api/media/file/excel/delete`, 'temp.xlsx')
          .toPromise()
          .then(response => response)
          .catch();
  }

  getAllAttendance() {
    this.loadingAttendance = true;
    this.http.get<any>(`${environment.apiUrl}/api/project/lingua/attendance/list/group/${this.recordId}`)
        .subscribe(data => {
              this.allAttendance = data.value['data'];
              this.headerOfAttendanceTable = data.value['keys'];
              this.loadingAttendance = false;
            },
            err => console.log(err));
  }

  changeFinal(id: string) {
    this.fieldsValue['final_grades'][id]['value'] = (this.checkDataFinal[id]) ? 0 : 1;
  }
}
