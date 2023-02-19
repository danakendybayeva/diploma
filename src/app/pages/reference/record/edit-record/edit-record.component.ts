import {AfterViewChecked, ChangeDetectorRef, Component, Input, OnDestroy, OnInit} from '@angular/core';
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
import {roleReference} from '../../../../interfaces/services/user.service';

@Component({
  selector: 'edit-record',
  templateUrl: './edit-record.component.html',
  styleUrls: ['./edit-record.component.scss']
})
export class EditRecordComponent extends BasePageComponent implements OnInit, OnDestroy, AfterViewChecked {
  labelForm: FormGroup;
  isNew = true;

  @Input() referenceId = '';
  @Input() isElement = false;
  @Input() submitUrl = '';
  @Input() postFile = '';
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

  fieldsData: any[] = [];
  fieldsValue = {};
  _routeListener = null;
  urlPath = [];
  typePage = 'view';
  loaded = false;
  isEmpty = false;
  canAdd = false;
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
    this.loaded = false;
    this.urlPath = this.route.snapshot.url;
    if (
        (this.isElement && this.referenceId)
        || this.route.snapshot.params['referenceId']
    ) {
      this.referenceId = this.isElement ? this.referenceId : this.route.snapshot.params['referenceId'];
      this.fieldsData = await this.fieldService.getReferenceFields(this.referenceId);
      if (this.referenceId === '00000000-0000-0000-0000-000000000017') {
        this.fieldsData.push(roleReference);
      }
      if (this.route.snapshot.params['recordId'] && await this.fieldService.mayAccessRecord('edit', this.referenceId, this.recordId)) {
        this.isNew = false;
        this.recordId = this.route.snapshot.params['recordId'];
        this.typePage = this.urlPath[0].path;
        this.getRecordData('get-edit');
      } else if (await this.fieldService.mayAccessRecord('add', this.referenceId)) {
        this.isNew = true;
        this.pageData = {
          title: 'Create record',
          loaded: true
        };
        this.typePage = 'edit';
        this.fieldsData.forEach(item => {
          item.value = item.defaultValue;
        });
        this.loaded = true;
      } else {
        this.isEmpty = true;
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
      if (this.submitUrl) {
        url = this.submitUrl;
      } else if (!this.isNew) {
          url = `${environment.apiUrl}/api/reference/record/edit/${this.referenceId}/${this.recordId}`;
      }
      return this.http.post<Status>(url, this.fieldsValue)
          .subscribe({
            next: data => {
              if (data.status === 1) {
                this.toastr.success(data.message, 'Success', { closeButton: true });
                this.router.navigate(['/vertical/reference/record/view', this.referenceId, data.value]).then(r => {});
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

}
