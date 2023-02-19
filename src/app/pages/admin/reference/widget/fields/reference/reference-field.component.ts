import {ChangeDetectorRef, Component, EventEmitter, Input, OnChanges, OnInit, Output} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {FieldService} from '../../../../../../interfaces/services/reference/field.service';
import {Status} from '../../../../../../interfaces/services/util.service';
import {environment} from '../../../../../../../environments/environment';
import {ReferenceField, SortType} from '../../../../../../interfaces/services/reference/fields/reference';
import {IReference} from '../../../../../../interfaces/services/reference/reference';
import {map} from 'rxjs/operators';
import {HttpClient, HttpParams} from '@angular/common/http';
import {IFieldSB} from '../../../../../../interfaces/services/reference/fields/field-sidebar';
import {moveItemInArray} from '@angular/cdk/drag-drop';
import {IOption} from '../../../../../../ui/interfaces/option';
import {IPageContent} from '../../../../../../interfaces/services/page/page-content';
import {Content} from '../../../../../../ui/interfaces/modal';
import {TCModalService} from '../../../../../../ui/services/modal/modal.service';
import * as PageActions from '../../../../../../store/actions/page.actions';

@Component({
  selector: 'reference-field',
  templateUrl: './reference-field.component.html',
  styleUrls: ['./reference-field.component.scss']
})
export class ReferenceFieldComponent implements OnInit, OnChanges {
  labelForm: FormGroup;
  formIsLoaded = false;
  @Input() _value: ReferenceField = {
    id: null,
    title: '',
    hint: null,
    isRequired: false,
    type: 'reference',
    isUnique: false,
    defaultValue: [],
    referenceId: null,
    isSingle: true,
    separator: ', ',
    limit: 0,
    disableLink: false,
    fields: [],
    defaultGroup: [],
    defaultSort: {field: '', type: 'asc'},
    templateView: null,
    enableNumbered: false
  };
  @Input() referenceId = null;
  @Input() fieldId = null;
  @Output() public resultEvent: EventEmitter<Status> = new EventEmitter();
  loadingLabelForm: boolean;
  loadingRef = false;
  loadingFields = false;
  removeEnable = false;
  urlRequest = `${environment.apiUrl}/api/reference/${this.referenceId}/edit/field`;

  isSingle = 'true';
  sortType = 'asc';
  sortField = '';
  referenceOption: IOption[] = [];
  referenceFieldsOption: IOption[] = [];
  referenceIdSelectedBefore = '';
  referenceFieldsSelectedBefore = [];

  referenceSelectedTitle = '';

  constructor(
      private formBuilder: FormBuilder,
      private fieldService: FieldService,
      private http: HttpClient,
      private modal: TCModalService
  ) {
  }

  ngOnInit() {
    this.labelForm = this.formBuilder.group({});
    this.initLabelForm();
    this.getAllReference().then(r => {});
  }

  ngOnChanges(changes) {
    this.getAllReference().then(r => {});
    if (this.fieldId != null && this.fieldId.length > 0) {
      this.urlRequest = `${environment.apiUrl}/api/reference/${this.referenceId}/edit/field/${this.fieldId}`;
      this.removeEnable = true;
      this.loadingFields = false;
    } else {
      this.urlRequest = `${environment.apiUrl}/api/reference/${this.referenceId}/edit/field/new`;
      this._value = {
        id: null,
        title: '',
        hint: null,
        isRequired: false,
        type: 'reference',
        isUnique: false,
        defaultValue: [],
        referenceId: null,
        isSingle: true,
        separator: ', ',
        limit: 0,
        disableLink: false,
        fields: [],
        defaultGroup: [],
        defaultSort: {field: '', type: 'asc'},
        templateView: null,
        enableNumbered: false
      };
    }
    if (changes._value && this._value) {
      this.isSingle = this._value.isSingle.toString();
      this.changeReferenceSelected(this._value.referenceId, true).then(r => {});
      this.referenceIdSelectedBefore = this._value.referenceId;
      this.sortField = this._value.defaultSort.field;
      this.loadingFields = true;
    }
  }

  initLabelForm() {
    this.labelForm = this.formBuilder.group({
      title: ['', Validators.required],
      hint: [null],
      isRequired: [false],
      isUnique: [false],
      defaultValue: [null],
      referenceId: [null, Validators.required],
      separator: [', '],
      isSingle: ['true'],
      sortType: ['asc'],
      limit: [0],
      disableLink: [false],
      fields: [[], Validators.required],
      defaultGroup: [[]],
      defaultSort: {field: '', type: 'asc'},
      templateView: [null, Validators.required],
      enableNumbered: [false],
      sortField: [false]
    });
    this.formIsLoaded = true;
  }

  async sendFieldForm(valid: boolean): Promise<Status> {
    let result: Status = {status: 0, message : '', value: null};
    this.loadingLabelForm = true;
    if (valid) {
      this.loadingLabelForm = false;
      this._value.defaultSort = { field: this.sortField, type: this.sortType };
      result = await this.fieldService.request(this.urlRequest, this._value);
      result.value = '/vertical/admin-panel/reference/edit-field/' + this.referenceId + '/' + this._value.type + '/' + result.value;
      this.resultEvent.emit(result);
      return result;
    }
    return result;
  }

  async getAllReference() {
    const result = await this.fieldService.getAllReference();
    this.referenceOption = [];
    result.forEach(ref => {
      this.referenceOption.push({value: ref.id, label: ref.title});
    });
  }

  async changeReferenceSelected(event, isRefresh = false) {
    if (
        event
        && this._value.referenceId !== null
        && this._value.referenceId.length > 0
        && this.referenceIdSelectedBefore !== event
    ) {
      if (this.referenceIdSelectedBefore && !isRefresh) {
        this._value.fields = [];
        this.sortField = '';
      }

      this.referenceIdSelectedBefore = event;
      const referenceB = await this.fieldService.getReferenceById(this._value.referenceId);
      this.referenceSelectedTitle = referenceB.title;
      let fieldsTogether = null;
      if (referenceB.userFields && referenceB.sysFields) {
        fieldsTogether = Object.assign(JSON.parse(referenceB.userFields), JSON.parse(referenceB.sysFields));
      } else if (referenceB.userFields) {
        fieldsTogether = JSON.parse(referenceB.userFields);
      } else if (referenceB.sysFields) {
        fieldsTogether = JSON.parse(referenceB.sysFields);
      }
      const resultOption = [];
      Object.keys(fieldsTogether).map(function (key) {
        const res = {
          value: key,
          label: fieldsTogether[key]['title']
        };
        resultOption[fieldsTogether[key]['orderNum']] = res;
      });
      this.referenceFieldsOption = resultOption;
    }

  }

  changeValueField(event) {
    if (this.referenceFieldsSelectedBefore !== event) {
      const fieldArray = [];
      let isNew = false;
      this.referenceFieldsOption.forEach(item => {
        if (this._value.fields.indexOf(item.value) >= 0) {
          fieldArray.push(item.label);
          if (this._value.templateView === null) {
            isNew = true;
          }
        }
      });
      if (fieldArray.length > 0 && isNew) {
        this._value.templateView = '{' + fieldArray.join('}, {') + '}';
      }
      this.referenceFieldsSelectedBefore = this._value.fields;
    }
  }

  changeValueSingle(event) {
    this._value.isSingle = (event === 'true');
    if (this._value.isSingle) {
      this._value.defaultValue = this._value.defaultValue.length ? [this._value.defaultValue[0]] : [];
    }
  }

}
