import {
  AfterContentChecked,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges
} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {FieldService} from '../../../../../../interfaces/services/reference/field.service';
import {Status} from '../../../../../../interfaces/services/util.service';
import {environment} from '../../../../../../../environments/environment';
import {DateField} from '../../../../../../interfaces/services/reference/fields/date';

@Component({
  selector: 'date-field',
  templateUrl: './date-field.component.html',
  styleUrls: ['./date-field.component.scss']
})
export class DateFieldComponent implements OnInit, OnChanges, AfterContentChecked {
  labelForm: FormGroup;
  @Input() _value: DateField = {
    id: null,
    title: '',
    hint: null,
    isRequired: false,
    type: 'date',
    isUnique: false,
    currentTimestamp: false,
    addDays: null,
    viewFormat: null,
    minDate: null,
    maxDate: null,
    defaultValue: null
  };
  @Input() referenceId = null;
  @Input() fieldId = null;
  @Output() public resultEvent: EventEmitter<Status> = new EventEmitter();
  loadingLabelForm: boolean;
  removeEnable = false;
  urlRequest = `${environment.apiUrl}/api/reference/${this.referenceId}/edit/field`;
  minDateCheck = false;
  maxDateCheck = false;

  //TODO mask
  mask_option: any[] = [
    {value: 'dd.MM.yyyy', label: 'дд.мм.гггг'},
    {value: 'dd/MM/yyyy', label: 'дд/мм/гггг'},
    {value: 'MM.dd.yyyy', label: 'мм.дд.гггг'},
    {value: 'MM/dd/yyyy', label: 'мм/дд/гггг'},
    {value: 'yyyy.MM.dd', label: 'гггг.мм.дд'},
    {value: 'yyyy/MM/dd', label: 'гггг/мм/дд'}
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
        type: 'date',
        isUnique: false,
        currentTimestamp: false,
        addDays: null,
        viewFormat: null,
        minDate: null,
        maxDate: null,
        defaultValue: null
      };
    }
    if (changes._value && this._value) {
      if (this._value.minDate) {
        this.minDateCheck = true;
      }
      if (this._value.maxDate) {
        this.maxDateCheck = true;
      }
    }
  }

  mmDate() {
    if (this.minDateCheck === false) {
      this._value.minDate = null;
    }
    if (this.maxDateCheck === false) {
      this._value.maxDate = null;
    }
  }

  initLabelForm() {
    this.labelForm = this.formBuilder.group({
      title: ['', Validators.required],
      hint: [null],
      isRequired: [false],
      isUnique: [false],
      currentTimestamp: [false],
      addDays: [null],
      viewFormat: [null],
      minDate: [null],
      maxDate: [null],
      minDateCheck: [false],
      maxDateCheck: [false],
      defaultValue: [null]
    });
  }

  async sendFieldForm(valid: boolean): Promise<Status> {
    let result: Status = {status: 0, message : '', value: null};
    this.loadingLabelForm = true;
    if (valid) {
      this.loadingLabelForm = false;
      this.mmDate();
      result = await this.fieldService.request(this.urlRequest, this._value);
      result.value = '/vertical/admin-panel/reference/edit-field/' + this.referenceId + '/' + this._value.type + '/' + result.value;
      this.resultEvent.emit(result);
      return result;
    }
    return result;
  }

  formValidateChange() {
    if (this.minDateCheck === false) {
      this._value.minDate = null;
    }
    if (this.maxDateCheck === false) {
      this._value.maxDate = null;
    }
    if (this._value.currentTimestamp) {
      this._value.defaultValue = null;
    } else {
      this._value.addDays = null;
    }
    this.fieldService.formValidateChange(this._value, this.labelForm, 'date');
  }

}
