import {AfterContentChecked, ChangeDetectorRef, Component, EventEmitter, Input, OnChanges, OnInit, Output} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {FieldService} from '../../../../../../interfaces/services/reference/field.service';
import {Status} from '../../../../../../interfaces/services/util.service';
import {environment} from '../../../../../../../environments/environment';
import {StringField} from '../../../../../../interfaces/services/reference/fields/string';

@Component({
  selector: 'string-field',
  templateUrl: './string-field.component.html',
  styleUrls: ['./string-field.component.scss']
})
export class StringFieldComponent implements OnInit, OnChanges, AfterContentChecked {
  labelForm: FormGroup;
  @Input() _value: StringField = {
    id: null,
    title: '',
    hint: null,
    isRequired: false,
    type: 'string',
    isUnique: false,
    minLength: null,
    maxLength: null,
    maxShowLength: null,
    mask: null,
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
      private fieldService: FieldService,
      private ref: ChangeDetectorRef
  ) {
  }

  ngOnInit() {
    this.initLabelForm();
  }

  ngOnChanges(changes) {
    setTimeout(() => {
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
          type: 'string',
          isUnique: false,
          minLength: null,
          maxLength: null,
          maxShowLength: null,
          mask: null,
          defaultValue: null
        };
      }
    });
  }

  ngAfterContentChecked() {
    this.ref.detectChanges();
  }

  initLabelForm() {
    setTimeout(() => {
      this.labelForm = this.formBuilder.group({
        title: ['', Validators.required],
        hint: [null],
        isRequired: [false],
        isUnique: [false],
        minLength: [null],
        maxLength: [null],
        maxShowLength: [null],
        mask: [null],
        defaultValue: [null]
      });
    }, 0);
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
