import {AfterViewChecked, ChangeDetectorRef, Component, OnDestroy, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, ValidationErrors} from '@angular/forms';

import { Store } from '@ngrx/store';
import {BasePageComponent} from '../../../base-page';
import { HttpService } from '../../../../services/http/http.service';
import {IAppState} from '../../../../interfaces/app-state';
import { ToastrService } from 'ngx-toastr';
import {IReference} from '../../../../interfaces/services/reference/reference';
import {HttpClient} from '@angular/common/http';
import {ActivatedRoute, NavigationEnd, Router} from '@angular/router';
import {FieldService} from '../../../../interfaces/services/reference/field.service';
import {environment} from '../../../../../environments/environment';
import {Status} from '../../../../interfaces/services/util.service';
import {map} from 'rxjs/operators';
import {roleReference} from '../../../../interfaces/services/user.service';

@Component({
  selector: 'profile-edit',
  templateUrl: './edit-profile.component.html',
  styleUrls: ['./edit-profile.component.scss']
})
export class PageEditProfileComponent extends BasePageComponent implements OnInit, OnDestroy, AfterViewChecked {
  labelForm: FormGroup;
  isNew = true;

  referenceId = '00000000-0000-0000-0000-000000000017';
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

  fieldsData = {};
  fieldsValue = {};
  _routeListener = null;
  urlPath = [];
  typePage = 'view';
  loaded = false;
  canEdit = false;

  constructor(store: Store<IAppState>, httpSv: HttpService,
              private formBuilder: FormBuilder,
              private http: HttpClient, private router: Router,
              private route: ActivatedRoute,
              private fieldService: FieldService,
              private readonly changeDetectorRef: ChangeDetectorRef,
              private toastr: ToastrService) {
    super(store, httpSv);
    this.pageData = {
      title: 'Редактирование пользователя',
      loaded: true
    };
    this.createForm();
  }

  ngOnInit() {
    super.ngOnInit();
    this.initRoute().then(r => {});
    this.onRouteChange();
    this.createForm();
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
    this.fieldsData = await this.fieldService.getReferenceFields(this.referenceId, 'object');
    this.fieldsData[roleReference['id']] = roleReference;
    if (this.route.snapshot.params['id'] && await this.fieldService.mayAccessRecord('edit', this.referenceId, this.recordId)) {
      this.isNew = false;
      this.recordId = this.route.snapshot.params['id'];
      this.getRecordData('get-edit');
    } else if (await this.fieldService.mayAccessRecord('add', this.referenceId)) {
      this.isNew = true;
      this.pageData = {
        title: 'Create Profile',
        loaded: true
      };
      Object.entries(this.fieldsData).forEach(
          ([key, value]) => {
            this.fieldsData[key].value = this.fieldsData[key].defaultValue;
          }
      );
      this.loaded = true;
    } else {
      this.isEmpty = true;
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
    this.fieldsValue = values;
  }

  submitEvent(valid: boolean) {
    // TODO valid
    if (valid) {
      this.prepareValues();
      let url = `${environment.apiUrl}/api/reference/record/create/${this.referenceId}`;
      if (!this.isNew) {
        url = `${environment.apiUrl}/api/reference/record/edit/${this.referenceId}/${this.recordId}`;
      }
      return this.http.post<Status>(url, this.fieldsValue)
          .subscribe({
            next: data => {
              if (data.status === 1) {
                this.toastr.success(data.message, 'Success', { closeButton: true });
                this.router.navigate(['/vertical/profile', data.value]).then();
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

  getRecordData(type: string = 'get') {
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

}
