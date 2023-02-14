import {AfterContentChecked, ChangeDetectorRef, Component, EventEmitter, Input, OnChanges, OnInit, Output} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {FieldService} from '../../../../../../interfaces/services/reference/field.service';
import {Status} from '../../../../../../interfaces/services/util.service';
import {environment} from '../../../../../../../environments/environment';
import {FloatField} from '../../../../../../interfaces/services/reference/fields/float';

@Component({
  selector: 'float-field',
  templateUrl: './float-field.component.html',
  styleUrls: ['./float-field.component.scss']
})
export class FloatFieldComponent implements OnInit, OnChanges, AfterContentChecked {
  labelForm: FormGroup;
  @Input() _value: FloatField = {
    id: null,
    title: '',
    hint: null,
    isRequired: false,
    type: 'float',
    isUnique: false,
    hasRange: false,
    rangeFrom: null,
    rangeTo: null,
    defaultValue: null
  };
  @Input() referenceId = null;
  @Input() fieldId = null;
  @Output() public resultEvent: EventEmitter<Status> = new EventEmitter();
  loadingLabelForm: boolean;
  removeEnable = false;
  urlRequest = `${environment.apiUrl}/api/reference/${this.referenceId}/edit/field`;

  constructor(
      private formBuilder: FormBuilder,
      private fieldService: FieldService,
      private ref: ChangeDetectorRef
  ) {
  }

  ngOnInit() {
    this.initLabelForm();
  }

  ngAfterContentChecked() {
    this.ref.detectChanges();
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
        type: 'float',
        isUnique: false,
        hasRange: false,
        rangeFrom: null,
        rangeTo: null,
        defaultValue: null
      };
    }
  }

  initLabelForm() {
    this.labelForm = this.formBuilder.group({
      title: ['', Validators.required],
      hint: [null],
      isRequired: [false],
      isUnique: [false],
      hasRange: [false],
      rangeFrom: [null],
      rangeTo: [null],
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

  formValidateChange() {
    this.fieldService.formValidateChange(this._value, this.labelForm);
  }

}
