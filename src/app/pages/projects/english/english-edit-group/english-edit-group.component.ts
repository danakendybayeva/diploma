import {Component, Input, OnDestroy, OnInit} from '@angular/core';

import {Store} from '@ngrx/store';
import {BasePageComponent} from '../../../base-page';
import {IAppState} from '../../../../interfaces/app-state';
import {HttpService} from '../../../../services/http/http.service';
import {IGroup} from 'src/app/ui/interfaces/group';
import {environment} from '../../../../../environments/environment';
import {map} from 'rxjs/operators';
import {HttpClient} from '@angular/common/http';
import {SelfDev} from '../../../../interfaces/services/self-dev.service';
import {Content} from '../../../../ui/interfaces/modal';
import {ActivatedRoute, Router} from '@angular/router';
import {TCModalService} from '../../../../ui/services/modal/modal.service';
import {Skills, SkillsProfile} from '../../../../interfaces/services/projects/skills.service';
import {ToastrService} from 'ngx-toastr';
import {MiniListComponent} from '../../../lists/mini-list';
import {StudentMiniList} from '../../../../interfaces/services/studentList.service';
import {StudentService} from '../../../../interfaces/services/student.service';
import {Status} from '../../../../interfaces/services/util.service';
import {EnglishGroup, EnglishProfile} from '../../../../interfaces/services/projects/english.service';

@Component({
  selector: 'english-edit-group',
  templateUrl: './english-edit-group.component.html',
  styleUrls: ['./english-edit-group.component.scss'],
})
export class EnglishEditGroupComponent extends BasePageComponent implements OnInit, OnDestroy {
  groups: IGroup[];
  tableData: EnglishProfile[];
  groupData: EnglishGroup;
  id: string;
  autocompleteData = [{ country: '123'}, {country: '234'}, {country: '345'}];

  studentsSelected: StudentMiniList[] = [];
  wdays: any[] = [];
  days: any[] = [
    {label: 'Monday', value: 1},
    {label: 'Tuesday', value: 2},
    {label: 'Wednesday', value: 3},
    {label: 'Thursday', value: 4},
    {label: 'Friday', value: 5},
    {label: 'Saturday', value: 6},
    {label: 'Sunday', value: 7}
  ];

  constructor(store: Store<IAppState>, httpSv: HttpService, private http: HttpClient,
      private modal: TCModalService, private route: ActivatedRoute,
              private toastr: ToastrService, private mini: MiniListComponent,
              private studentService: StudentService) {
    super(store, httpSv);

    this.pageData = {
      title: 'English Edit Group',
      loaded: true
    };
  }

  ngOnInit() {
    super.ngOnInit();
    super.setLoaded();
    this.id = this.route.snapshot.params['groupId'];
    if (this.id && this.id !== '') {
      this.getGroup(this.id);
    }
    // this.getData('assets/data/groups.json', 'groups', 'getGroups');
  }

  ngOnDestroy() {
    super.ngOnDestroy();
  }

  openModal<T>(body: Content<T>, header: Content<T> = null, footer: Content<T> = null, options: any = null) {
    this.modal.open({
      body: body,
      header: header,
      footer: footer,
      options: options
    });
  }

  closeModal() {
    this.modal.close();
  }

  submitModal() {
    this.modal.close();
  }

  submitModalSave() {
    this.saveGroup();
    this.modal.close();
  }

  removeStudent(id) {
    const index = this.studentsSelected.findIndex(x => x.id === id);
    if (index >= 0) {
      this.studentsSelected.splice(index, 1);
    }
  }

  selectTeam(id) {
    const index = this.groupData.listStudents.findIndex(x => x.id === id);
    this.groupData.listStudents.forEach(obj => {
      obj.teamLead = false;
    });
    if (index >= 0) {
      this.groupData.listStudents[index].teamLead = true;
    }
  }

  saveGroup() {
    this.groupData.listStudents.forEach(obj => {
      if (obj.teamLead) {
        this.groupData.mentorId = obj.id;
        return;
      }
    });
    this.groupData.wdays = [];
    this.http.post<Status>(`${environment.apiUrl}/api/project/english-project/edit`, this.groupData)
        .subscribe({
          next: data => {
            console.log(data);
            if (data.status === 1) {
              this.toastr.success('Saved!', 'Success', { closeButton: true });
            } else {
              this.toastr.error('Not saved!', 'Error', { closeButton: true });
            }
          },
          error: error => {
            this.toastr.error('Not saved!', 'Error', { closeButton: true });
          }
        });
  }

  getGroup(id: string) {
    return this.http.get<EnglishGroup>(`${environment.apiUrl}/api/project/english-project/group/${id}`)
        .pipe(map(data => {
          return data;
        }))
        .subscribe(data => {
          this.groupData = data;
          this.groupData.listStudents.sort((a, b) => (a.fio > b.fio) ? 1 : -1);
        });
  }
}
