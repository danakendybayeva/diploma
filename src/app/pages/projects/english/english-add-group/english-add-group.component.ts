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
  selector: 'english-add-group',
  templateUrl: './english-add-group.component.html',
  styleUrls: ['./english-add-group.component.scss'],
})
export class EnglishAddGroupComponent extends BasePageComponent implements OnInit, OnDestroy {
  groups: IGroup[];
  tableData: EnglishProfile[];
  id: string;
  autocompleteData = [{ country: '123'}, {country: '234'}, {country: '345'}];

  studentsSelected: StudentMiniList[] = [];
  teacher: StudentMiniList[] = [];
  groupEng: EnglishGroup = {
    id: '',
    title: '',
    city: '',
    englishType: 1,
    englishLevel: '',
    totalHour: 0,
    status: 1,
    mentorId: '',
    teacherId: null,
    wdays: [],
    listStudents: this.studentsSelected,
    listDays: [],
    description: '',
    startDate: new Date()
  }
    ;
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

  constructor(store: Store<IAppState>, httpSv: HttpService, public studentService: StudentService,
      private modal: TCModalService, private route: ActivatedRoute,
      private http: HttpClient, private toastr: ToastrService, private mini: MiniListComponent) {
    super(store, httpSv);

    this.pageData = {
      title: 'English Add Group',
      loaded: true
    };

    this.id = this.route.snapshot.params['id'];
  }

  ngOnInit() {
    super.ngOnInit();
    super.setLoaded();
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
    const index = this.studentsSelected.findIndex(x => x.id === id);
    this.studentsSelected.forEach(obj => {
      obj.teamLead = false;
    });
    if (index >= 0) {
      this.studentsSelected[index].teamLead = true;
    }
  }

  saveGroup() {
    this.studentsSelected.forEach(obj => {
      if (obj.teamLead) {
        this.groupEng.mentorId = obj.id;
        return;
      }
    });
    this.groupEng.listStudents = this.studentsSelected;
    if (this.teacher.length > 0) {
      this.groupEng.teacherId = this.teacher[0].id;
    }
    this.http.post<Status>(`${environment.apiUrl}/api/project/english-project/new`, this.groupEng)
        .subscribe({
          next: data => {
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
    return this.http.get<EnglishProfile[]>(`${environment.apiUrl}/api/project/english-project/group/list/${id}`)
        .pipe(map(data => {
          return data;
        }))
        .subscribe(data => {
          this.tableData = data;
          console.log(this.tableData);
        });
  }
}
