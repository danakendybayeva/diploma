import {AfterViewChecked, ChangeDetectorRef, Component, OnDestroy, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, ValidationErrors} from '@angular/forms';

import { Store } from '@ngrx/store';
import {BasePageComponent} from '../../../../base-page';
import { HttpService } from '../../../../../services/http/http.service';
import {IAppState} from '../../../../../interfaces/app-state';
import { ToastrService } from 'ngx-toastr';
import {IReference} from '../../../../../interfaces/services/reference/reference';
import {HttpClient} from '@angular/common/http';
import {ActivatedRoute, NavigationEnd, Router} from '@angular/router';
import {FieldService} from '../../../../../interfaces/services/reference/field.service';
import {environment} from '../../../../../../environments/environment';
import {Status} from '../../../../../interfaces/services/util.service';
import {map} from 'rxjs/operators';
import {TCModalService} from '../../../../../ui/services/modal/modal.service';

@Component({
  selector: 'edit-srecord',
  templateUrl: './edit-srecord.component.html',
  styleUrls: ['./edit-srecord.component.scss']
})
export class TCExternalEditRecordComponent extends BasePageComponent implements OnInit, OnDestroy, AfterViewChecked {
  labelForm: FormGroup;
  isNew = true;

  referenceId = '';
  createPost = `${environment.apiUrl}/api/reference/record/create/${this.referenceId}`;
  editPost = `${environment.apiUrl}/api/reference/record/edit/${this.referenceId}`;
  redirectUrl = '/vertical/profile';
  fieldsData = {};
  postImage = environment.apiUrl + '/api/media/file/request-file/image';
  getImageUrl = environment.apiUrl + '/api/media/file/';
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
  isEmpty = false;

  fieldsValue = {};
  _routeListener = null;
  urlPath = [];
  typePage = 'edit';
  loaded = false;

  constructor(store: Store<IAppState>, httpSv: HttpService,
              protected formBuilder: FormBuilder,
              protected http: HttpClient, protected router: Router,
              protected route: ActivatedRoute,
              protected fieldService: FieldService,
              protected readonly changeDetectorRef: ChangeDetectorRef,
              protected modal: TCModalService,
              protected toastr: ToastrService) {
    super(store, httpSv);
    this.pageData = {
      title: '',
      loaded: true
    };
    this.createForm();
  }

  ngOnInit() {
    super.ngOnInit();
    this.initRoute().then();
    this.onRouteChange();
    this.createForm();
  }

  superOnInit() {
    super.ngOnInit();
  }

  ngOnDestroy() {
    this._routeListener.unsubscribe();
  }

  ngAfterViewChecked() {
    this.changeDetectorRef.detectChanges();
  }

  createForm() {
    this.labelForm = new FormGroup({});
  }

  onRouteChange() {
    this._routeListener = this.router.events.subscribe((val) => {
      if (val instanceof NavigationEnd) {
        this.initRoute().then();
      }
    });
  }

  async initRoute() {
    this.loaded = false;
    this.urlPath = this.route.snapshot.url;
    if (Object.keys(this.fieldsData).length === 0 && this.referenceId) {
      this.fieldsData = await this.fieldService.getReferenceFields(this.referenceId, 'object');
    }
    if (this.route.snapshot.params['id']) {
      this.isNew = false;
      this.recordId = this.route.snapshot.params['id'];
      if (this.route.snapshot.params['isDublicate']) {
        this.isNew = true;
      }
      this.getRecordData('get-edit');
    } else {
      this.isNew = true;
      Object.entries(this.fieldsData).forEach(
          ([key, value]) => {
            this.fieldsData[key].value = this.fieldsData[key].defaultValue;
          }
      );
      this.loaded = true;
    }
    super.ngOnInit();
  }

  prepareValues() {
    const values = {};
    Object.entries(this.fieldsData).forEach(
        ([key, value]) => {
          values[key] = this.fieldsData[key].value;
        }
    );
    if (this.recordId.length) {
      values['id'] = this.recordId;
    }
    this.fieldsValue = values;
  }

  submitEvent(valid: boolean, edit: string = '') {
    // TODO valid
    if (valid) {
      this.prepareValues();
      let url = `${this.createPost}`;
      if (!this.isNew) {
        url = `${this.editPost}/${this.recordId}`;
      }
      if (edit === 'acc') {
        url = `${environment.apiUrl}/api/v2/profiles/acc/user/edit/all`;
      }
        return this.http.post<Status>(url, this.fieldsValue)
          .subscribe({
            next: data => {
              if (data.status === 1) {
                this.toastr.success(data.message, 'Success', { closeButton: true });
                if (edit === 'acc' && !this.recordId) {
                } else {
                  this.router.navigate([this.redirectUrl, data.value]).then();
                }
              } else {
                this.toastr.error(data.message, 'Error', { closeButton: true });
              }
            },
            error: error => {
              this.toastr.error('Not saved!', 'Error', { closeButton: true });
            }
          });
    } else {
      this.getFormValidationErrors();
    }
    this.getFormValidationErrors();
  }

  getFormValidationErrors() {
    this.labelForm.markAllAsTouched();
    Object.keys(this.labelForm.controls).forEach(key => {

      const controlErrors: ValidationErrors = this.labelForm.get(key).errors;
      if (controlErrors != null) {
        Object.entries(controlErrors).forEach(
            ([keyError, value]) => {
              console.log('Key control: ' + key + ', keyError: ' + keyError + ', err value: ', controlErrors[keyError]);
            }
        );
      }
    });
  }

  getRecordData(type: string = 'get-edit') {
    return this.http.get<IReference>(`${environment.apiUrl}/api/reference/record/${type}/${this.referenceId}/${this.recordId}`)
        .pipe(map(data => {
          return data;
        }))
        .subscribe(
            data => {
              if (Object.keys(data).length) {
                Object.entries(this.fieldsData).forEach(
                    ([key, value]) => {
                      this.fieldsData[key].value = data[key];
                      if (this.isNew && key === 'start_date') {
                        this.fieldsData[key].value = null;
                      }
                    }
                );
                this.loaded = true;
              } else {
                this.isEmpty = true;
              }
            },
            error => {
              this.isEmpty = true;
            });
  }

  prepareUrls() {
    this.createPost = `${environment.apiUrl}/api/reference/record/create/${this.referenceId}`;
    this.editPost = `${environment.apiUrl}/api/reference/record/edit/${this.referenceId}`;
  }

}
