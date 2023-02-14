import {Component, EventEmitter, Input, OnChanges, OnInit, Output} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {FieldService} from '../../../../../../interfaces/services/reference/field.service';
import {Status} from '../../../../../../interfaces/services/util.service';
import {environment} from '../../../../../../../environments/environment';
import {EnumerationField} from '../../../../../../interfaces/services/reference/fields/enumeration';

@Component({
  selector: 'enumeration-field',
  templateUrl: './enumeration-field.component.html',
  styleUrls: ['./enumeration-field.component.scss']
})
export class EnumerationFieldComponent implements OnInit, OnChanges {
  labelForm: FormGroup;
  @Input() _value: EnumerationField = {
    id: null,
    title: '',
    hint: null,
    isRequired: false,
    type: 'enumeration',
    defaultValue: null,
    values: [{id: '1', value: 'New value', selected: false}],
    isSingle: true,
    separator: ', '
  };
  @Input() referenceId = null;
  @Input() fieldId = null;
  @Output() public resultEvent: EventEmitter<Status> = new EventEmitter();
  loadingLabelForm: boolean;
  removeEnable = false;
  urlRequest = `${environment.apiUrl}/api/reference/${this.referenceId}/edit/field`;

  isSingle = 'true';
  booleanValue = [
    { value: 'true', text: 'Одиночный' },
    { value: 'false', text: 'Множественный' }
  ];

  constructor(
      private formBuilder: FormBuilder,
      private fieldService: FieldService
  ) {
  }

  ngOnInit() {
    this.initLabelForm();
  }

  ngOnChanges(changes) {
    if (this.fieldId != null && this.fieldId.length > 0) {
      this.urlRequest = `${environment.apiUrl}/api/reference/${this.referenceId}/edit/field/${this.fieldId}`;
      this.removeEnable = true;
    } else {
      this.urlRequest = `${environment.apiUrl}/api/reference/${this.referenceId}/edit/field/new`;
      this._value = {
        id: null,
        title: '',
        hint: null,
        isRequired: false,
        type: 'enumeration',
        defaultValue: null,
        values: [{id: '1', value: 'New value', selected: false}],
        isSingle: true,
        separator: ', '
      };
    }
    if (changes._value && this._value) {
      this.isSingle = this._value.isSingle.toString();
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
      isSingle: ['true'],
      values: [[{id: '1', value: 'New value', selected: false}]],
    });
  }

  async sendFieldForm(valid: boolean): Promise<Status> {
    let result: Status = {status: 0, message : '', value: null};
    this.loadingLabelForm = true;
    if (valid) {
      this.loadingLabelForm = false;
      this.selectedDefVal();
      result = await this.fieldService.request(this.urlRequest, this._value);
      result.value = '/vertical/admin-panel/reference/edit-field/' + this.referenceId + '/' + this._value.type + '/' + result.value;
      this.resultEvent.emit(result);
      return result;
    }
    return result;
  }

  addValues() {
    this._value.values.push({id: (this._value.values.length + 1).toString(), value: 'New value', selected: false});
  }

  changeValueSelected(event, id: string) {
    this._value.defaultValue = [];
    if (this._value.isSingle) {
      this._value.values.forEach(item => {
        if (item.id !== id) {
          item.selected = false;
        }
        if (item.id === id && item.selected) {
          this._value.defaultValue.push({id: item.id, value: item.value});
        }
      });
    } else {
      this._value.values.forEach(item => {
        if (item.selected) {
          this._value.defaultValue.push({id: item.id, value: item.value});
        }
      });
    }
  }

  changeValueSingle(event) {
    this._value.isSingle = (event === 'true');
    if (this._value.isSingle) {
      let i = 0;
      this._value.values.forEach(item => {
        if (item.selected && i === 0) {
          i++;
        } else {
          item.selected = false;
        }
      });
    }
  }

  selectedDefVal() {
    this._value.defaultValue = [];
    this._value.values.forEach(item => {
      if (item.selected) {
        this._value.defaultValue.push({id: item.id, value: item.value});
      }
    });
  }

}
