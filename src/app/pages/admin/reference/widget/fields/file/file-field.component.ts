import {AfterContentChecked, ChangeDetectorRef, Component, EventEmitter, Input, OnChanges, OnInit, Output} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {FieldService} from '../../../../../../interfaces/services/reference/field.service';
import {Status} from '../../../../../../interfaces/services/util.service';
import {environment} from '../../../../../../../environments/environment';
import {FileField} from '../../../../../../interfaces/services/reference/fields/file';

@Component({
  selector: 'file-field',
  templateUrl: './file-field.component.html',
  styleUrls: ['./file-field.component.scss']
})
export class FileFieldComponent implements OnInit, OnChanges, AfterContentChecked {
  labelForm: FormGroup;
  @Input() _value: FileField = {
    id: null,
    title: '',
    hint: null,
    isRequired: false,
    isSingle: false,
    isUnique: false,
    convertToPdf: false,
    enableProtection: false,
    enableScanning: false,
    extension: '',
    separator: ', ',
    filterName: '',
    type: 'file',
    maxSize: 0,
    maxCount: -1,
    maxTotalSize: 0,
    renameFile: '',
    defaultValue: []
  };
  @Input() referenceId = null;
  @Input() fieldId = null;
  @Output() public resultEvent: EventEmitter<Status> = new EventEmitter();
  loadingLabelForm: boolean;
  removeEnable = false;
  urlRequest = `${environment.apiUrl}/api/reference/${this.referenceId}/edit/field`;
  isSingle = 'true';

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
        isSingle: false,
        isUnique: false,
        enableScanning: false,
        convertToPdf: false,
        enableProtection: false,
        extension: '',
        separator: ', ',
        filterName: '',
        type: 'file',
        maxSize: 0,
        maxCount: -1,
        maxTotalSize: 0,
        renameFile: '',
        defaultValue: []
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
      isSingle: ['false'],
      enableScanning: [false],
      convertToPdf: [false],
      enableProtection: [false],
      separator: [', '],
      extension: [],
      filterName: [''],
      maxSize: [0],
      maxCount: [-1],
      maxTotalSize: [-1],
      renameFile: [''],
      defaultValue: [[]]
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

  changeValueSingle(event) {
    this._value.isSingle = (event === 'true');
    if (this._value.isSingle) {
      this._value.defaultValue = this._value.defaultValue.length ? [this._value.defaultValue[0]] : [];
    }
  }

}
