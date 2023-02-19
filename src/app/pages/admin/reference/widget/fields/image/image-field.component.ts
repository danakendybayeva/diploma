import {AfterContentChecked, ChangeDetectorRef, Component, EventEmitter, Input, OnChanges, OnInit, Output} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {FieldService} from '../../../../../../interfaces/services/reference/field.service';
import {Status} from '../../../../../../interfaces/services/util.service';
import {environment} from '../../../../../../../environments/environment';
import {ImageField} from '../../../../../../interfaces/services/reference/fields/image';

@Component({
  selector: 'image-field',
  templateUrl: './image-field.component.html',
  styleUrls: ['./image-field.component.scss']
})
export class ImageFieldComponent implements OnInit, OnChanges, AfterContentChecked {
  labelForm: FormGroup;
  @Input() _value: ImageField = {
    id: null,
    title: '',
    hint: null,
    isRequired: false,
    isSingle: false,
    isAvatar: false,
    separator: ', ',
    filterName: '',
    type: 'image',
    maxSize: 0,
    maxCount: -1,
    thumbX: 0,
    thumbY: 0,
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
        isAvatar: false,
        separator: ', ',
        filterName: '',
        maxSize: 0,
        maxCount: -1,
        thumbX: 0,
        thumbY: 0,
        type: 'image',
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
      isAvatar: [false],
      separator: [', '],
      filterName: [''],
      maxSize: [0],
      thumbX: [0],
      thumbY: [0],
      maxCount: [-1],
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
