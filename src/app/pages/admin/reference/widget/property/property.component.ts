import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {IReference} from '../../../../../interfaces/services/reference/reference';
import {Status} from '../../../../../interfaces/services/util.service';
import {environment} from '../../../../../../environments/environment';
import {FieldService} from '../../../../../interfaces/services/reference/field.service';

@Component({
  selector: 'reference-property',
  templateUrl: './property.component.html',
  styleUrls: ['./property.component.scss']
})
export class PropertyComponent implements OnInit {
  labelForm: FormGroup;
  @Input() referenceId = '';
  @Input() isNew = true;
  @Input() valueRef: IReference = {
    id: null,
    title: '',
    hint: '',
    description: '',
    userFields: null,
    sysFields: null
  };
  @Output() public resultEvent: EventEmitter<Status> = new EventEmitter();
  loadingLabelForm: boolean;
  urlRequest = `${environment.apiUrl}/api/reference/create`;

  constructor(
      private formBuilder: FormBuilder,
      private fieldService: FieldService
  ) { }

  ngOnInit() {
    this.initLabelForm();
    if (this.isNew) {
      this.urlRequest = `${environment.apiUrl}/api/reference/create`;
    } else {
      this.urlRequest = `${environment.apiUrl}/api/reference/edit`;
    }
  }

  initLabelForm() {
    this.labelForm = this.formBuilder.group({
      title: ['', Validators.required],
      hint: [''],
      description: [''],
    });
  }

  async sendFieldForm(valid: boolean): Promise<Status> {
    let result: Status = {status: 0, message : '', value: null};
    this.loadingLabelForm = true;
    if (valid) {
      this.loadingLabelForm = false;
      console.log(this.valueRef);
      result = await this.fieldService.request(this.urlRequest, this.valueRef);
      result.value = '/vertical/admin-panel/reference/edit/' + result.value;
      this.resultEvent.emit(result);
      return result;
    }
    return result;
  }

  delete() {
  }

}
