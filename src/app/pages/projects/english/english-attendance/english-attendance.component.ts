import { Component, OnDestroy, OnInit} from '@angular/core';

import {Store} from '@ngrx/store';
import {BasePageComponent} from '../../../base-page';
import {IAppState} from '../../../../interfaces/app-state';
import {HttpService} from '../../../../services/http/http.service';
import {IGroup} from 'src/app/ui/interfaces/group';
import {environment} from '../../../../../environments/environment';
import {map} from 'rxjs/operators';
import {HttpClient} from '@angular/common/http';
import {Content} from '../../../../ui/interfaces/modal';
import {ActivatedRoute, Router} from '@angular/router';
import {TCModalService} from '../../../../ui/services/modal/modal.service';
import {ToastrService} from 'ngx-toastr';
import {Status} from '../../../../interfaces/services/util.service';
import * as PageActions from '../../../../store/actions/page.actions';
import {EnglishDays, EnglishGroup, EnglishProfile} from '../../../../interfaces/services/projects/english.service';

@Component({
  selector: 'english-attendance',
  templateUrl: './english-attendance.component.html',
  styleUrls: ['./english-attendance.component.scss'],
})
export class EnglishAttendanceComponent extends BasePageComponent implements OnInit, OnDestroy {
  groups: IGroup[];
  tableData: EnglishProfile[];
  day: EnglishDays;
  id: string;
  days = [];

  constructor(store: Store<IAppState>, httpSv: HttpService, private http: HttpClient,
      private modal: TCModalService, private route: ActivatedRoute,
              private toastr: ToastrService, private router: Router) {
    super(store, httpSv);

    this.pageData = {
      title: 'English Report'
    };
  }

  ngOnInit() {
    super.ngOnInit();
    super.setLoaded();
    this.days = this.range(1, 31);
    this.id = this.route.snapshot.params['id'];
    this.getGroup();
    this.getListProfiles(this.id);
  }

  initTable(): void {
    setTimeout(
        () => this.store.dispatch(new PageActions.Update({ loaded: true })),
        0
    );
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
  }
  submitModalSave() {
    // this.saveGroup();
    this.modal.close();
  }

  range(start, end) {
    const foo = [];
    for (let i = start; i <= end; i++) {
      foo.push(i);
    }
    return foo;
  }

  getListProfiles(id: string) {
    return this.http.get<EnglishProfile[]>(`${environment.apiUrl}/api/project/english-project/group/list/${id}`)
        .pipe(map(data => {
          return data;
        }))
        .subscribe(data => {
          this.tableData = data;
          this.tableData.forEach(obj => {
            if (obj.status === 1) {
              obj.statusB = true;
            } else {
              obj.statusB = false;
            }
          });
          this.tableData.sort((a, b) => (a.fio > b.fio) ? 1 : -1);
        });
  }
  getGroup() {
    return this.http.get<EnglishDays>(`${environment.apiUrl}/api/project/english-project/day/${this.id}`)
        .pipe(map(data => {
          return data;
        }))
        .subscribe(data => {
          this.day = data;
        });
  }

  saveAttendance() {
    this.tableData.forEach(obj => {
      obj.status = obj.statusB ? 1 : 0;
    });
    this.http.put<Status>(`${environment.apiUrl}/api/project/english-project/attendance/list/${this.id}`, this.tableData)
        .subscribe({
          next: data => {
            if (data.status === 1) {
              this.toastr.success(data.message, 'Success', { closeButton: true });
            } else if (data.status === 2) {
              this.toastr.warning('Future date can\' save attendance!', 'Error', { closeButton: true });
            } else {
              this.toastr.error(data.message, 'Error', { closeButton: true });
            }
          },
          error: error => {
            this.toastr.error(error, 'Error', { closeButton: true });
          }
        });
  }
}
