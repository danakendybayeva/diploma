import {AfterViewChecked, ChangeDetectorRef, Component, OnDestroy, OnInit} from '@angular/core';
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

@Component({
  selector: 'edit-record',
  templateUrl: './edit-record.component.html',
  styleUrls: ['./edit-record.component.scss']
})
export class EditRecordComponent extends BasePageComponent implements OnInit, OnDestroy, AfterViewChecked {
  labelForm: FormGroup;
  isNew = true;

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
  typePage = 'view';
  loaded = false;

  constructor(store: Store<IAppState>, httpSv: HttpService,
              private formBuilder: FormBuilder,
              private http: HttpClient, private router: Router,
              private route: ActivatedRoute,
              private fieldService: FieldService,
              private readonly changeDetectorRef: ChangeDetectorRef,
              private toastr: ToastrService) {
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
        this.isNew = false;
        this.recordId = this.route.snapshot.params['recordId'];
        this.typePage = this.urlPath[0].path;
        this.getRecordData('get-edit');
      } else {
        this.isNew = true;
        this.pageData = {
          title: 'Создать запись',
          loaded: true
        };
        this.typePage = 'edit';
        this.fieldsData.forEach(item => {
          item.value = item.defaultValue;
        });
        this.loaded = true;
      }
      super.ngOnInit();
    }
  }

  prepareValues() {
    const values = {};
    this.fieldsData.forEach(item => {
      values[item.id] = item.value;
    });
    this.fieldsValue = values;
  }

  submitEvent(valid: boolean) {
    //TODO valid
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
                this.router.navigate(['/vertical/reference/record/view', this.referenceId, data.value.id]).then(r => {});
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
        Object.keys(controlErrors).forEach(keyError => {
          console.log('Key control: ' + key + ', keyError: ' + keyError + ', err value: ', controlErrors[keyError]);
        });
      }
    });
  }

  getRecordData(type: string = 'get') {
    return this.http.get<IReference>(`${environment.apiUrl}/api/reference/record/${type}/${this.referenceId}/${this.recordId}`)
        .pipe(map(data => {
          return data;
        }))
        .subscribe(data => {
          this.fieldsData.forEach(item => {
            item.value = data[item.id];
          });
          this.loaded = true;
        });
  }

  removeRecord(referenceId: string, recordId: string) {
    return this.http.post<Status>(`${environment.apiUrl}/api/reference/record/remove/${this.referenceId}/${this.recordId}`,
        this.fieldsValue)
        .subscribe({
          next: data => {
            if (data.status === 1) {
              this.toastr.success(data.message, 'Success', { closeButton: true });
              this.router.navigate(['/vertical/reference/record/list', this.referenceId]).then(r => {});
            } else {
              this.toastr.error(data.message, 'Error', { closeButton: true });
            }
          },
          error: error => {
            this.toastr.error('Not saved!', 'Error', { closeButton: true });
          }
        });
  }

}
