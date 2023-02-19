import {AfterContentChecked, ChangeDetectorRef, Component, Input, OnChanges, OnInit} from '@angular/core';
import {FormBuilder} from '@angular/forms';
import {FieldService} from '../../../../../interfaces/services/reference/field.service';
import {IAccess} from '../../../../../interfaces/services/reference/reference';
import {HttpClient} from '@angular/common/http';
import {Content} from '../../../../../ui/interfaces/modal';
import {TCModalService} from '../../../../../ui/services/modal/modal.service';
import {environment} from '../../../../../../environments/environment';
import {map} from 'rxjs/operators';
import {Status} from '../../../../../interfaces/services/util.service';
import {ToastrService} from 'ngx-toastr';
import {ReferenceField} from '../../../../../interfaces/services/reference/fields/reference';

@Component({
  selector: 'tc-access',
  templateUrl: './access.component.html',
  styleUrls: ['./access.component.scss']
})
export class TCAccessComponent implements OnInit, OnChanges, AfterContentChecked {
  @Input() referenceId = null;
  loading = false;
  accessValue: IAccess[] = [];

  subjectActiveId = '';
  subjectActiveIndex = -1;
  objectActiveId = '';
  selectedItem = [];

  accessStructure: ReferenceField = {
    id: 'access',
    hint: null,
    type: 'structure',
    limit: -1,
    title: '',
    fields: [
      'fio'
    ],
    hideAll: false,
    isActive: true,
    isSingle: true,
    isUnique: false,
    orderNum: 2,
    separator: ', ',
    isRequired: false,
    defaultSort: {
      type: 'asc',
      field: ''
    },
    disableLink: false,
    enableGroup: true,
    defaultGroup: [],
    defaultValue: [],
    templateView: '{ФИО}',
    enableNumbered: false,
    enableSubdivision: true,
    referenceId: '00000000-0000-0000-0000-000000000017'
  };

  constructor(
      private formBuilder: FormBuilder,
      private fieldService: FieldService,
      private http: HttpClient,
      private ref: ChangeDetectorRef,
      private modal: TCModalService,
      private toastr: ToastrService
  ) {
  }

  ngOnInit() {
    this.initLabelForm();
    this.getListRefRecord();
  }

  ngOnChanges(changes) {
    setTimeout(() => {

    });
  }

  ngAfterContentChecked() {
    this.ref.detectChanges();
  }

  initLabelForm() {

  }

  openModal<T>(body: Content<T>, header: Content<T> = null, footer: Content<T> = null, options: any = null) {
    this.modal.open({
      body: body,
      header: null,
      footer: footer,
      options: options
    });
  }

  closeModal() {
    this.modal.close();
  }

  selectedDefaultValue(event) {
    this.selectedItem = event;
  }

  selectRecordRef(type = 'subject') {
    this.modal.close();
    if (type === 'subject') {
      if (this.selectedItem.length) {
        const hasDuplicate = this.accessValue.filter(item => {
          return item.subject_id === this.selectedItem[0]['id'];
        });
        if (hasDuplicate.length === 0) {
          this.accessValue.push({
            subject_id: this.selectedItem[0]['id'],
            title: this.selectedItem[0]['fio'],
            view_menu: false,
            may_view: false,
            may_add: false,
            objects: []
          });
        }
      }
    } else if (type === 'object' && this.subjectActiveId.length) {
      for (let i = 0; i < this.accessValue.length; i++) {
        if (this.accessValue[i].subject_id === this.subjectActiveId) {
          const hasDuplicate = this.accessValue[i].objects.filter(item => {
            return item.id === this.selectedItem[0]['id'];
          });
          if (hasDuplicate.length === 0) {
            this.accessValue[i].objects.push({
              id: this.selectedItem[0]['id'],
              title: this.selectedItem[0]['fio'],
              may_view: false,
              may_edit: false,
              may_delete: false
            });
          }
          break;
        }
      }
    }
  }

  selectSubject(id) {
    this.subjectActiveId = id;
    for (let i = 0; i < this.accessValue.length; i++) {
      if (this.accessValue[i].subject_id === this.subjectActiveId) {
        this.subjectActiveIndex = i;
        break;
      }
    }
  }

  removeSO(type: string, subjectIndex: number, objectIndex: number = -1) {
    if (type === 'subject') {
      this.accessValue.splice(subjectIndex, 1);
      this.subjectActiveIndex = -1;
    } else if (type === 'object' && objectIndex > -1) {
      this.accessValue[subjectIndex].objects.splice(objectIndex, 1);
    }
  }

  getListRefRecord() {
    return this.http.get<IAccess[]>(`${environment.apiUrl}/api/reference/access/get/${this.referenceId}`)
        .pipe(map(data => {
          return data;
        }))
        .subscribe(data => {
          this.accessValue = data;
        });
  }

  createAccess() {
    this.loading = true;
    return this.http.post<Status>(`${environment.apiUrl}/api/reference/access/${this.referenceId}/create`, this.accessValue)
        .subscribe({
          next: data => {
            if (data.status === 1) {
              this.toastr.success(data.message, 'Success', { closeButton: true });
            } else {
              this.toastr.error(data.message, 'Error', { closeButton: true });
            }
            this.loading = false;
          },
          error: error => {
            this.toastr.error('Not saved!', 'Error', { closeButton: true });
            this.loading = false;
          }
        });


  }

}
