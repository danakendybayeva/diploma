import {Component, EventEmitter, Input, OnChanges, OnInit, Output} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {FieldService} from '../../../../../../interfaces/services/reference/field.service';
import {Status} from '../../../../../../interfaces/services/util.service';
import {environment} from '../../../../../../../environments/environment';
import {TableField} from '../../../../../../interfaces/services/reference/fields/table';

@Component({
  selector: 'table-field',
  templateUrl: './table-field.component.html',
  styleUrls: ['./table-field.component.scss']
})
export class TableFieldComponent implements OnInit, OnChanges {
  labelForm: FormGroup;
  @Input() _value: TableField = {
    id: null,
    title: '',
    hint: null,
    isRequired: false,
    type: 'table',
    width: '100%',
    cellPadding: 0,
    border: 1,
    isNumbering: false,
    showTotal: false,
    canAddDelete: false,
    separator: ', ',
    fields: [],
    defaultValue: null
  };
  @Input() referenceId = null;
  @Input() fieldId = null;
  @Output() public resultEvent: EventEmitter<Status> = new EventEmitter();
  loadingLabelForm: boolean;
  removeEnable = false;
  urlRequest = `${environment.apiUrl}/api/reference/${this.referenceId}/edit/field`;

  //TODO mask
  mask_option: any[] = [
    {value: 'phone', label: 'Телефон'},
    {value: 'email', label: 'E-mail'},
    {value: 'iin', label: 'ИИН'},
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
        type: 'table',
        width: '100%',
        cellPadding: 0,
        border: 1,
        isNumbering: false,
        showTotal: false,
        canAddDelete: false,
        separator: ', ',
        fields: [],
        defaultValue: null
      };
    }
  }

  initLabelForm() {
    this.labelForm = this.formBuilder.group({
      title: ['', Validators.required],
      hint: [null],
      isRequired: [false],
      isNumbering: [false],
      showTotal: [null],
      canAddDelete: [null],
      width: [''],
      cellPadding: [0],
      border: [0],
      separator: [''],
      defaultValue: [null]
    });
  }

  async sendFieldForm(valid: boolean): Promise<Status> {
    let result: Status = {status: 0, message : '', value: null};
    this.loadingLabelForm = true;
    if (valid) {
      this.loadingLabelForm = false;
      result = await this.fieldService.request(this.urlRequest, this._value);
      result.value = '/vertical/admin-panel/reference/edit-field/' + this.referenceId + '/' + this._value.type + '/' + result.value;
      this.resultEvent.emit(result);
      return result;
    }
    return result;
  }

}
