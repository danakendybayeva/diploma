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
import {TimestampField} from '../../../../../../interfaces/services/reference/fields/timestamp';

@Component({
  selector: 'timestamp-field',
  templateUrl: './timestamp-field.component.html',
  styleUrls: ['./timestamp-field.component.scss']
})
export class TimestampFieldComponent implements OnInit, OnChanges, AfterContentChecked  {
  labelForm: FormGroup;
  @Input() _value: TimestampField = {
    id: null,
    title: '',
    hint: null,
    isRequired: false,
    type: 'timestamp',
    isUnique: false,
    currentTimestamp: false,
    addDays: null,
    addTime: null,
    viewFormat: null,
    minDay: null,
    minTime: null,
    maxDay: null,
    maxTime: null,
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

  mask_option: any[] = [
    {value: 'dd.MM.yyyy HH:mm:ss', label: 'дд.мм.гггг чч:мм:сс'},
    {value: 'dd.MM.yyyy HH:mm', label: 'дд.мм.гггг чч:мм'},
    {value: 'dd/MM/yyyy HH:mm:ss', label: 'дд/мм/гггг чч:мм:сс'},
    {value: 'dd/MM/yyyy HH:mm', label: 'дд/мм/гггг чч:мм'},
    {value: 'dd.yyyy.MM HH:mm:ss', label: 'дд.гггг.мм чч:мм:сс'},
    {value: 'dd.yyyy.MM HH:mm', label: 'дд.гггг.мм чч:мм'},
    {value: 'dd/yyyy/MM HH:mm:ss', label: 'дд/гггг/мм чч:мм:сс'},
    {value: 'dd/yyyy/MM HH:mm', label: 'дд/гггг/мм чч:мм'},
    {value: 'MM.dd.yyyy HH:mm:ss', label: 'мм.дд.гггг чч:мм:сс'},
    {value: 'MM.dd.yyyy HH:mm', label: 'мм.дд.гггг чч:мм'},
    {value: 'MM/dd/yyyy HH:mm:ss', label: 'мм/дд/гггг чч:мм:сс'},
    {value: 'MM/dd/yyyy HH:mm', label: 'мм/дд/гггг чч:мм'},
    {value: 'MM.yyyy.dd HH:mm:ss', label: 'мм.гггг.дд чч:мм:сс'},
    {value: 'MM.yyyy.dd HH:mm', label: 'мм.гггг.дд чч:мм'},
    {value: 'MM/yyyy/dd HH:mm:ss', label: 'мм/гггг/дд чч:мм:сс'},
    {value: 'MM/yyyy/dd HH:mm', label: 'мм/гггг/дд чч:мм'},
    {value: 'yyyy.MM.dd HH:mm:ss', label: 'гггг.мм.дд чч:мм:сс'},
    {value: 'yyyy.MM.dd HH:mm', label: 'гггг.мм.дд чч:мм'},
    {value: 'yyyy/MM/dd HH:mm:ss', label: 'гггг/мм/дд чч:мм:сс'},
    {value: 'yyyy/MM/dd HH:mm', label: 'гггг/мм/дд чч:мм'},
    {value: 'yyyy.dd.MM HH:mm:ss', label: 'гггг.дд.мм чч:мм:сс'},
    {value: 'yyyy.dd.MM HH:mm', label: 'гггг.дд.мм чч:мм'},
    {value: 'yyyy/dd/MM HH:mm:ss', label: 'гггг/дд/мм чч:мм:сс'},
    {value: 'yyyy/dd/MM HH:mm', label: 'гггг/дд/мм чч:мм'},
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
        type: 'timestamp',
        isUnique: false,
        currentTimestamp: false,
        addDays: null,
        addTime: null,
        viewFormat: null,
        minDay: null,
        minTime: null,
        maxDay: null,
        maxTime: null,
        defaultValue: null
      };
    }
    if (changes._value && this._value) {
      if (this._value.minDay || this._value.minTime) {
        this.minDateCheck = true;
      }
      if (this._value.maxDay || this._value.maxTime) {
        this.maxDateCheck = true;
      }
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
      addTime: [null],
      viewFormat: [null],
      minDay: [null],
      minTime: [null],
      maxDay: [null],
      maxTime: [null],
      minDateCheck: [false],
      maxDateCheck: [false],
      defaultValue: [null],
    });
  }

  async sendFieldForm(valid: boolean): Promise<Status> {
    let result: Status = {status: 0, message : '', value: null};
    this.loadingLabelForm = true;
    if (valid) {
      this.loadingLabelForm = false;
      // this.mmDate();
      result = await this.fieldService.request(this.urlRequest, this._value);
      result.value = '/vertical/admin-panel/reference/edit-field/' + this.referenceId + '/' + this._value.type + '/' + result.value;
      this.resultEvent.emit(result);
      return result;
    }
    return result;
  }

  formValidateChange() {
    if (this.minDateCheck === false) {
      this._value.minDay = null;
      this._value.minTime = null;
    }
    if (this.maxDateCheck === false) {
      this._value.maxDay = null;
      this._value.maxTime = null;
    }
    if (this._value.currentTimestamp) {
      this._value.defaultValue = null;
    } else {
      this._value.addDays = null;
      this._value.addTime = null;
    }
    // this._value.defaultValue = null;
    // this.fieldService.formValidateChange(this._value, this.labelForm, 'timestamp');
  }

}
