import {Component, EventEmitter, Input, OnChanges, OnInit, Output} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {FieldService} from '../../../../../../interfaces/services/reference/field.service';
import {Status} from '../../../../../../interfaces/services/util.service';
import {environment} from '../../../../../../../environments/environment';
import {HttpClient} from '@angular/common/http';
import {IOption} from '../../../../../../ui/interfaces/option';
import {TCModalService} from '../../../../../../ui/services/modal/modal.service';
import {ReferenceField} from '../../../../../../interfaces/services/reference/fields/reference';

@Component({
  selector: 'structure-field',
  templateUrl: './structure-field.component.html',
  styleUrls: ['./structure-field.component.scss']
})
export class StructureFieldComponent implements OnInit, OnChanges {
  labelForm: FormGroup;
  formIsLoaded = false;
  @Input() _value: ReferenceField = {
    id: null,
    title: '',
    hint: null,
    isRequired: false,
    type: 'structure',
    isUnique: false,
    defaultValue: [],
    isSingle: true,
    isActive: true,
    separator: ', ',
    limit: -1,
    disableLink: false,
    fields: [],
    defaultGroup: [],
    defaultSort: {field: '', type: 'asc'},
    templateView: null,
    enableNumbered: false,
    enableSubdivision: false,
    enableGroup: false,
    hideAll: false,
    referenceId: '00000000-0000-0000-0000-000000000017'
  };
  @Input() fieldId = null;
  @Input() referenceId = null;
  @Output() public resultEvent: EventEmitter<Status> = new EventEmitter();
  loadingLabelForm: boolean;
  loadingRef = false;
  loadingFields = false;
  removeEnable = false;
  referenceIdStat = '00000000-0000-0000-0000-000000000017';
  urlRequest = `${environment.apiUrl}/api/reference/${this.referenceId}/edit/field`;

  isSingle = 'true';
  sortType = 'asc';
  sortField = '';
  referenceFieldsOption: IOption[] = [];
  referenceIdSelectedBefore = '';
  referenceFieldsSelectedBefore = [];

  referenceSelectedTitle = '';

  constructor(
      private formBuilder: FormBuilder,
      private fieldService: FieldService
  ) {
  }

  ngOnInit() {
    this.labelForm = this.formBuilder.group({});
    this.initLabelForm();
    this.changeReferenceSelected(this.referenceIdStat, true).then();
  }

  ngOnChanges(changes) {
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
        type: 'structure',
        isUnique: false,
        defaultValue: [],
        isSingle: true,
        isActive: true,
        separator: ', ',
        limit: -1,
        disableLink: false,
        fields: [],
        defaultGroup: [],
        defaultSort: {field: '', type: 'asc'},
        templateView: null,
        enableNumbered: false,
        enableSubdivision: false,
        enableGroup: false,
        hideAll: false,
        referenceId: '00000000-0000-0000-0000-000000000017'
      };
    }
    if (changes._value && this._value) {
      this.isSingle = this._value.isSingle.toString();

      this.referenceIdSelectedBefore = this.referenceIdStat;
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
      separator: [', '],
      isSingle: [true],
      isActive: [true],
      sortType: ['asc'],
      limit: [0],
      disableLink: [false],
      fields: [[], Validators.required],
      defaultGroup: [[]],
      defaultSort: {field: '', type: 'asc'},
      templateView: [null, Validators.required],
      enableNumbered: [false],
      enableSubdivision: [false],
      enableGroup: [false],
      hideAll: [false],
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

  async changeReferenceSelected(event, isRefresh = false) {
    if (event) {
      const referenceB = await this.fieldService.getReferenceById(event);
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
