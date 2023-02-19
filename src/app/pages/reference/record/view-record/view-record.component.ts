import {AfterViewChecked, ChangeDetectorRef, Component, ElementRef, Input, OnDestroy, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, ValidationErrors} from '@angular/forms';

import { Store } from '@ngrx/store';
import {BasePageComponent} from '../../../base-page';
import { HttpService } from '../../../../services/http/http.service';
import {IAppState} from '../../../../interfaces/app-state';

import {HttpClient} from '@angular/common/http';
import {ActivatedRoute, NavigationEnd, Router} from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import {Status} from '../../../../interfaces/services/util.service';
import {environment} from '../../../../../environments/environment';
import {map} from 'rxjs/operators';
import {IReference} from '../../../../interfaces/services/reference/reference';
import {FieldService} from '../../../../interfaces/services/reference/field.service';
import {DomSanitizer} from '@angular/platform-browser';
import {UserService} from '../../../../user/_services/user.service';
import {Content} from '../../../../ui/interfaces/modal';
import {TCModalService} from '../../../../ui/services/modal/modal.service';
import {DatePipe} from '@angular/common';

@Component({
  selector: 'view-record',
  templateUrl: './view-record.component.html',
  styleUrls: ['./view-record.component.scss']
})
export class ViewRecordComponent extends BasePageComponent implements OnInit, OnDestroy, AfterViewChecked {
  referenceId = '';
  recordId = '';
  fieldId = null;
  fieldsTogether = [];
  valueRef: IReference = {
    id: null,
    title: '',
    hint: '',
    description: '',
    userFields: null,
    sysFields: null
  };

  fieldsData: any[] = [];
  fieldsValue = {};
  _routeListener = null;
  urlPath = [];
  loaded = false;
  isEmpty = false;
  canEdit = false;
  canDelete = false;
  redirectRemove = '';

  postImage = environment.apiUrl + '/api/media/file/request-file/image';
  getImageUrl = environment.apiUrl + '/api/media/file/';

  constructor(
      store: Store<IAppState>, httpSv: HttpService,
      protected formBuilder: FormBuilder,
      protected http: HttpClient,
      protected router: Router,
      protected route: ActivatedRoute,
      protected fieldService: FieldService,
      protected readonly changeDetectorRef: ChangeDetectorRef,
      protected toastr: ToastrService,
      protected modal: TCModalService,
      protected datepipe: DatePipe
  ) {
    super(store, httpSv);
    this.pageData = {
      title: 'Запись',
      loaded: true
    };
  }

  ngOnInit() {
    super.ngOnInit();
    this.initRoute().then(r => {});
    this.onRouteChange();
  }

  ngOnDestroy() {
    this._routeListener.unsubscribe();
  }

  ngAfterViewChecked() {
    this.changeDetectorRef.detectChanges();
  }

  onRouteChange() {
    this._routeListener = this.router.events.subscribe((val) => {
      if (val instanceof NavigationEnd) {
        this.initRoute().then(r => {});
      }
    });
  }

  async initRoute() {
    this.urlPath = this.route.snapshot.url;
    if (this.route.snapshot.params['referenceId']) {
      this.referenceId = this.route.snapshot.params['referenceId'];
      this.fieldsData = await this.fieldService.getReferenceFields(this.referenceId);
      if (this.route.snapshot.params['recordId']) {
        this.recordId = this.route.snapshot.params['recordId'];
        this.canEdit = await this.fieldService.mayAccessRecord('edit', this.referenceId, this.recordId);
        this.canDelete = await this.fieldService.mayAccessRecord('delete', this.referenceId, this.recordId);
        this.getRecordData('get');
      }
      super.ngOnInit();
    }
  }

  getRecordData(type: string = 'get') {
    return this.http.get<any>(`${environment.apiUrl}/api/reference/record/${type}/${this.referenceId}/${this.recordId}`)
        .pipe(map(data => {
          return data;
        }))
        .subscribe(data => {
          if (Object.keys(data).length) {
            this.fieldsData.forEach(item => {
              item.value = data[item.id];
            });
            this.fieldsValue = data;
            this.loaded = true;
          } else {
            this.isEmpty = true;
          }
        });
  }

  removeRecord(referenceId: string, recordId: string) {
    return this.http.post<Status>(`${environment.apiUrl}/api/reference/record/remove/${this.referenceId}/${this.recordId}`,
        {})
        .subscribe({
          next: data => {
            if (data.status === 1) {
              this.toastr.success(data.message, 'Success', { closeButton: true });
              if (this.redirectRemove) {
                this.router.navigate([this.redirectRemove]).then();
              } else {
                this.router.navigate(['/vertical/reference/record/section', this.referenceId, this.referenceId]).then();
              }
            } else {
              this.toastr.error(data.message, 'Error', { closeButton: true });
            }
            this.modal.close();
          },
          error: error => {
            this.toastr.error('Not saved!', 'Error', { closeButton: true });
            this.modal.close();
          }
        });
  }

  getEditUrl() {
    return ['/vertical/reference/record/edit', this.referenceId, this.recordId];
  }

  openModal<T>(
      body: Content<T>,
      header: Content<T> = null,
      footer: Content<T> = null,
      options: any = null
  ) {
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

}
