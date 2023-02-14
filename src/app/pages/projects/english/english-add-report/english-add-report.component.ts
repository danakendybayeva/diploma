import {Component, Input, OnDestroy, OnInit} from '@angular/core';

import {Store} from '@ngrx/store';
import {BasePageComponent} from '../../../base-page';
import {IAppState} from '../../../../interfaces/app-state';
import {HttpService} from '../../../../services/http/http.service';
import {IGroup} from 'src/app/ui/interfaces/group';
import {environment} from '../../../../../environments/environment';
import {map} from 'rxjs/operators';
import {HttpClient} from '@angular/common/http';
import {SelfDev} from '../../../../interfaces/services/self-dev.service';
import {Content} from '../../../../ui/interfaces/modal';
import {ActivatedRoute, Router} from '@angular/router';
import {TCModalService} from '../../../../ui/services/modal/modal.service';
import {Skills, SkillsProfile} from '../../../../interfaces/services/projects/skills.service';
import {ToastrService} from 'ngx-toastr';
import {MiniListComponent} from '../../../lists/mini-list';
import {StudentMiniList} from '../../../../interfaces/services/studentList.service';
import {StudentService} from '../../../../interfaces/services/student.service';
import {Status} from '../../../../interfaces/services/util.service';
import {EnglishGroup, EnglishProfile, EnglishReport, EnglishStudentReport} from '../../../../interfaces/services/projects/english.service';
import {formatDate} from '@angular/common';

@Component({
  selector: 'english-add-report',
  templateUrl: './english-add-report.component.html',
  styleUrls: ['./english-add-report.component.scss'],
})
export class EnglishAddReportComponent extends BasePageComponent implements OnInit, OnDestroy {
  groups: IGroup[];
  tableData: EnglishProfile[];
  groupData: EnglishGroup;
  reportData: EnglishReport = {
    id: '',
    englishId: '',
    englishGroup: null,
    period: '',
    orderNum: 1,
    mocksCount: 1,
    ceptsCount: 1,
    datesReport: []
  };
  mocksCount = 1;
  ceptsCount = 1;
  id: string;
  reportId: string;
  dateOption: any[] = [];

  constructor(store: Store<IAppState>, httpSv: HttpService, private http: HttpClient,
      private modal: TCModalService, private route: ActivatedRoute,
              private toastr: ToastrService, private mini: MiniListComponent,
              private studentService: StudentService) {
    super(store, httpSv);

    this.pageData = {
      title: 'English Edit Group',
      loaded: true
    };
  }

  ngOnInit() {
    super.ngOnInit();
    super.setLoaded();
    this.id = this.route.snapshot.params['groupId'];
    this.reportId = this.route.snapshot.params['reportId'];
    if (this.id && this.id !== '') {
      this.getGroup(this.id);
      if (this.reportId) {
        this.getReport();
      }
    }
  }

  ngOnDestroy() {
    super.ngOnDestroy();
  }

  openModal<T>(body: Content<T>, header: Content<T> = null, footer: Content<T> = null, options: any = null) {
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

  submitModal() {
    this.modal.close();
  }

  submitModalSave() {
    this.saveReports();
    this.modal.close();
  }

  saveReports() {
    this.reportData.englishGroup.wdays = [];
    const payload: EnglishReport = this.getCopy(this.reportData);
    delete payload.englishGroup;
    this.http.post<Status>(`${environment.apiUrl}/api/project/english-project/create-reports/${this.id}`, payload)
        .subscribe({
          next: data => {
            console.log(data);
            if (data.status === 1) {
              this.toastr.success(data.message, 'Success', { closeButton: true });
            } else {
              this.toastr.error(data.message, 'Error', { closeButton: true });
            }
          },
          error: error => {
            this.toastr.error(error, 'Error', { closeButton: true });
          }
        });
  }

  getGroup(id: string) {
    return this.http.get<EnglishGroup>(`${environment.apiUrl}/api/project/english-project/group/${id}`)
        .pipe(map(data => {
          return data;
        }))
        .subscribe(data => {
          this.groupData = data;
          this.reportData.englishGroup = this.groupData;
          this.reportData.englishId = this.groupData.id;
          this.groupData.listDays.forEach(obj => {
            this.dateOption.push({value: obj.id, label: formatDate(obj.day, 'dd.MM.yyyy', 'en')});
          });
        });
  }

  getReport() {
    return this.http.get<EnglishReport>(`${environment.apiUrl}/api/project/english-project/report/${this.reportId}`)
        .pipe(map(data => {
          return data;
        }))
        .subscribe(data => {
          this.reportData = data;
          this.reportData.dateStartId = data.datesReport[0];
          this.reportData.dateEndId = data.datesReport[data.datesReport.length - 1];
        });
  }

  getCopy(object): EnglishReport {
    return (JSON.parse(JSON.stringify(object)));
  }
}
