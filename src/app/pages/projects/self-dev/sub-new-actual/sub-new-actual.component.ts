import {Component, OnDestroy, OnInit} from '@angular/core';

import {Store} from '@ngrx/store';
import {BasePageComponent} from '../../../base-page';
import {IAppState} from '../../../../interfaces/app-state';
import {HttpService} from '../../../../services/http/http.service';
import {environment} from '../../../../../environments/environment';
import {map} from 'rxjs/operators';
import {HttpClient} from '@angular/common/http';
import {Content} from '../../../../ui/interfaces/modal';
import {ActivatedRoute} from '@angular/router';
import {TCModalService} from '../../../../ui/services/modal/modal.service';
import {Actual} from '../../../../interfaces/services/projects/skills.service';
import {ToastrService} from 'ngx-toastr';
import {Status} from '../../../../interfaces/services/util.service';
import {formatDate} from '@angular/common';

@Component({
  selector: 'sub-new-actual',
  templateUrl: './sub-new-actual.component.html',
  styleUrls: ['./sub-new-actual.component.scss'],
})
export class SubNewActualComponent extends BasePageComponent implements OnInit, OnDestroy {
  id: string;
  actual: Actual = {
    id: '',
    title: '',
    dateStart: new Date(),
    dateEnd: new Date(),
    actual: false,
    dateSelect: new Date()
  };

  constructor(store: Store<IAppState>, httpSv: HttpService,
      private modal: TCModalService, private route: ActivatedRoute,
      private http: HttpClient, private toastr: ToastrService) {
    super(store, httpSv);

    this.pageData = {
      title: 'Skill Actual',
      loaded: true
    };

    this.id = this.route.snapshot.params['id'];
    if (this.id) {
      this.getGroup(this.id);
    }
  }

  ngOnInit() {
    super.ngOnInit();
    super.setLoaded();
    // this.getData('assets/data/groups.json', 'groups', 'getGroups');
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


  submitModalSave() {
    // this.saveGroup();
    const dateStart = formatDate(this.actual.dateStart, 'yyyy-MM-dd', 'en');
    const dateEnd = formatDate(this.actual.dateEnd, 'yyyy-MM-dd', 'en');
    const dateSelected = formatDate(this.actual.dateSelect, 'yyyy-MM-dd', 'en');
    if (dateSelected > dateEnd || dateSelected < dateStart) {
      this.toastr.error('Not Correct!', 'Error', {closeButton: true});
    } else {
      this.saveGroup();
    }
    this.modal.close();
  }

  saveGroup() {
    if (this.id) {
      this.http.put<Status>(`${environment.apiUrl}/api/project/skills-project/actual/edit`, this.actual)
          .subscribe({
            next: data => {
              if (data.status === 1) {
                this.toastr.success(data.message, 'Success', {closeButton: true});
              } else {
                this.toastr.error(data.message, 'Error', {closeButton: true});
              }
            },
            error: error => {
              this.toastr.error('Not saved!', 'Error', {closeButton: true});
            }
          });
    } else {
      this.http.post<Status>(`${environment.apiUrl}/api/project/skills-project/actual/new`, this.actual)
          .subscribe({
            next: data => {
              if (data.status === 1) {
                this.toastr.success(data.message, 'Success', {closeButton: true});
              } else {
                this.toastr.error(data.message, 'Error', {closeButton: true});
              }
            },
            error: error => {
              this.toastr.error('Not saved!', 'Error', {closeButton: true});
            }
          });
    }
  }

  getGroup(id: string) {
    return this.http.get<Actual>(`${environment.apiUrl}/api/project/skills-project/actual/${id}`)
        .pipe(map(data => {
          return data;
        }))
        .subscribe(data => {
          this.actual = data;
        });
  }
}
