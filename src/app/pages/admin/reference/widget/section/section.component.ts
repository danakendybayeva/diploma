import {Component, EventEmitter, Input, OnChanges, OnInit, Output} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {FieldService} from '../../../../../interfaces/services/reference/field.service';
import {Status, Util} from '../../../../../interfaces/services/util.service';
import {environment} from '../../../../../../environments/environment';
import {ReferenceField} from '../../../../../interfaces/services/reference/fields/reference';
import {IReference, ISection} from '../../../../../interfaces/services/reference/reference';
import {HttpClient} from '@angular/common/http';
import {IOption} from '../../../../../ui/interfaces/option';

@Component({
  selector: 'tc-section',
  templateUrl: './section.component.html',
  styleUrls: ['./section.component.scss']
})
export class TCSectionComponent implements OnInit, OnChanges {
  labelForm: FormGroup;
  @Input() _value: ISection = {
    id: '',
    title: '',
    hint: null,
    access: [],
    fields: [],
    groupField: [],
    sortField: [],
    enableCustomFields: false,
    filterField: [],
    referenceId: '',
    showOrder: 99999
  };
  @Input() referenceId = null;
  @Input() fields: any[] = null;
  @Input() sectionId = null;
  @Output() public resultEvent: EventEmitter<Status> = new EventEmitter();
  loadingLabelForm: boolean;
  removeEnable = false;
  urlRequest = `${environment.apiUrl}/api/reference/${this.referenceId}/edit/field`;

  isSingle = 'true';
  sortType = 'asc';
  sortField = [];

  referenceOption: IOption[] = [];

  conditions: IOption[] = [
    {
      label: 'Содержить',
      value: 'like'
    },
    {
      label: 'Не содержить',
      value: 'not_like'
    },
  ];
  conditionsNumber = Util.getNumberConditions();
  conditionsString = Util.getStringConditions();

  accessStructure: ReferenceField = {
    id: 'access',
    title: 'Имеют доступ к представлению',
    hint: null,
    isRequired: false,
    type: 'reference',
    isUnique: false,
    defaultValue: [],
    referenceId: null,
    isSingle: false,
    separator: ', ',
    limit: -1,
    disableLink: false,
    fields: ['last_name', 'first_name'],
    defaultGroup: [],
    defaultSort: {field: '', type: 'asc'},
    templateView: '{Last Name} {First Name}',
    enableNumbered: false,
    value: []
  };

  constructor(
      private formBuilder: FormBuilder,
      private fieldService: FieldService,
      private http: HttpClient
  ) {
  }

  ngOnInit() {
    this.initLabelForm();
    if (this._value.id && this._value.id.length) {
      this.urlRequest = `${environment.apiUrl}/api/reference/${this._value.referenceId}/edit/field/${this._value.id}`;
      this.removeEnable = true;
      this._value.fields = JSON.parse(this._value.fields.toString());
      this._value.groupField = JSON.parse(this._value.groupField.toString());
      this._value.sortField = JSON.parse(this._value.sortField.toString());
      this._value.filterField = JSON.parse(this._value.filterField.toString());

      this._value.access = this.fieldService.convertRefArray(this._value.access);

    } else {
      this._value = {
        id: '',
        title: '',
        hint: null,
        access: [],
        fields: [],
        groupField: [],
        sortField: [],
        enableCustomFields: false,
        filterField: [],
        referenceId: this.referenceId,
        showOrder: 99999
      };
    }
    this.urlRequest = `${environment.apiUrl}/api/reference/section/create`;
  }

  ngOnChanges(changes) {
    setTimeout(() => {
      this.referenceOption = [];
      this.fields.forEach(ref => {
        this.referenceOption.push({value: ref.id, label: ref.title});
      });
    });
  }

  initLabelForm() {
    this.labelForm = this.formBuilder.group({
      title: ['', Validators.required],
      hint: [null],
      fields: [[], Validators.required],
      defaultGroup: [[]],
      defaultSort: [],
      enableCustomFields: [false],
      sort: [],
      filter: []
    });
  }

  async sendFieldForm(valid: boolean): Promise<Status> {
    let result: Status = {status: 0, message : '', value: null};
    this.loadingLabelForm = true;
    if (valid) {
      this.loadingLabelForm = false;
      const payload = this.cloneObject(this._value);
      payload['fields'] = JSON.stringify(payload['fields']);
      payload['groupField'] = JSON.stringify(payload['groupField']);
      payload['sortField'] = JSON.stringify(payload['sortField']);
      payload['filterField'] = JSON.stringify(payload['filterField']);
      result = await this.fieldService.request(this.urlRequest, payload);
      result.value = '/vertical/admin-panel/reference/edit/' + this.referenceId + '/section/' + result.value;
      this.resultEvent.emit(result);
      return result;
    }
    return result;
  }

  fieldSelect(event: any[]) {
    // When selected fields then do sort events
    this.sortPrepareFields(event);
  }

  sortPrepareFields(params: any[]) {
    let varAny = this.cloneObject(this.sortField);
    let isChanged = false;
    if (params.length >= varAny.length) {
      params.forEach(item => {
        if (!varAny.some(obj => obj.id === item.id)) {
          // Object not found.
          varAny.push(item);
          isChanged = true;
        } else {
          const indexSort = this._value.sortField.findIndex(obj => obj.id === item.id);
          const indexSortVar = varAny.findIndex(obj => obj.id === item.id);
          if (indexSort >= 0) {
            varAny[indexSortVar]['selected'] = true;
            varAny[indexSortVar]['sortingUp'] = this._value.sortField[indexSort]['sortBy'].toLowerCase() === 'asc';
          }
        }
      });
    } else {
      const objArr = [];
      varAny.forEach(item => {
        if (params.some(obj => obj.id === item.id)) {
          // Object not found.
          objArr.push(item);
          isChanged = true;
        }
      });
      varAny = objArr;
    }

    if (isChanged) {
      this.sortField = varAny;
    }
  }

  cloneObject(object): any[] {
    return (JSON.parse(JSON.stringify(object)));
  }

  filterAdd() {
    this._value.filterField.push([]);
  }

  filterSelectedField(param: any, i: number, filter: any[]) {
    const filterType = {
      fieldId: param.value,
      title: param.label,
      condition: this.getConditionByType(param.value) === 'number' ? 'equal' : 'like',
      value: ''
    };
    filter.push(filterType);
  }

  filterRemove(index: number, filter?: number) {
    if (filter >= 0) {
      this._value.filterField[index].splice(filter, 1);
    } else {
      this._value.filterField.splice(index, 1);
    }
  }

  prepareFields(data: any[]) {

  }

  getConditionByType(fieldId: string) {
    const index = this.fields.findIndex(obj => obj.id === fieldId);
    if (index >= 0) {
      return Util.getConditionByType(this.fields[index].type);
    }
    return 'number';
  }

  getTypeInput(fieldId: string): string {
    const index = this.fields.findIndex(obj => obj.id === fieldId);
    let type = '';
    if (index >= 0) {
      type = this.fields[index].type;
    }
    switch (type) {
      case 'date':
        return 'date';
      case 'timestamp':
        return 'datetime-local';
      case 'integer':
      case 'float':
        return 'number';
      default:
        return 'text';
    }
  }

}
