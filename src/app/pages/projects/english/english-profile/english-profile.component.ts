import { Component, OnDestroy, OnInit} from '@angular/core';

import {Store} from '@ngrx/store';
import {BasePageComponent} from '../../../base-page';
import {IAppState} from '../../../../interfaces/app-state';
import {HttpService} from '../../../../services/http/http.service';
import {IGroup} from 'src/app/ui/interfaces/group';
import {environment} from '../../../../../environments/environment';
import {map} from 'rxjs/operators';
import {HttpClient} from '@angular/common/http';
import {Status} from '../../../../interfaces/services/util.service';
import {Content} from '../../../../ui/interfaces/modal';
import {ActivatedRoute, Router} from '@angular/router';
import {TCModalService} from '../../../../ui/services/modal/modal.service';
import {ToastrService} from 'ngx-toastr';
import {StudentList} from '../../../../interfaces/services/studentList.service';
import {UserService} from '../../../../user/_services/user.service';
import {EnglishService} from '../../../../interfaces/services/english.service';
import {EnglishGroupProfile} from '../../../../interfaces/services/projects/english.service';

@Component({
  selector: 'english-profile',
  templateUrl: './english-profile.component.html',
  styleUrls: ['./english-profile.component.scss'],
})
export class EnglishProfileComponent extends BasePageComponent implements OnInit, OnDestroy {
  groups: IGroup[];
  tableData: EnglishGroupProfile;
  today = new Date();
  month1: any;

  days = [];
  monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  teamleadMode = 0;

  englishPrc = 0;

  id = '';

  isTeamLead = false;
  tableDataSt: StudentList[];
  listOfName: any[];
  selectedCity: any[] = [];
  searchSpec = '';

  sort_key = '';
  sort_value = '';

  searchStr = '';

  cities = [];

  speciality = [];
  userInfo: any;

  selected = 0;

  constructor(store: Store<IAppState>, httpSv: HttpService, private http: HttpClient,
      private modal: TCModalService, private route: ActivatedRoute,
              private toastr: ToastrService, private router: Router,
              private userService: UserService, public englishService: EnglishService) {
    super(store, httpSv);

    this.englishService.selected = 0;

    this.pageData = {
      title: 'English Report'
    };
    this.days = this.range(1, 31);

    this.id = this.route.snapshot.params['id'];
    if (this.id !== '' && this.id !== null && this.id) {
      this.getListProfiles(this.id);
    } else {
      this.getListProfilesSelf();
      this.checkTeamLead();
    }
    this.userService.isAdmin().then(data => {
      if (data) {
        this.isTeamLead = true;
      }
    });

  }

  selectedMonth(index: number) {
    this.selected = index;
  }

  ngOnInit() {
    super.ngOnInit();
    super.setLoaded();
    // this.getData('assets/data/groups.json', 'groups', 'getGroups');
    this.getData('assets/data/user-profile.json', 'userInfo', 'loadedDetect');
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
  }

  range(start, end) {
    const foo = [];
    for (let i = start; i <= end; i++) {
      foo.push(i);
    }
    return foo;
  }

  getListProfiles(id: string) {
    return this.http.get<EnglishGroupProfile>(`${environment.apiUrl}/api/project/english-project/profiles/${id}`)
        .pipe(map(data => {
          return data;
        }))
        .subscribe(data => {
          this.tableData = data;
          this.tableData.listDays.forEach(obj => {
            const dates = new Date(obj.day);
            obj.day = dates;
          });
        });
  }

  getListProfilesSelf() {
    return this.http.get<EnglishGroupProfile>(`${environment.apiUrl}/api/project/english-project/profiles`)
        .pipe(map(data => {
          return data;
        }))
        .subscribe(data => {
          this.tableData = data;
          let i = 0;
          this.tableData.listDays.forEach(obj => {
            const dates = new Date(obj.day);
            obj.day = dates;
            if (obj.type === 1) {
              i++;
            }
          });
          this.englishPrc = this.tableData.listDays.length > 0 ? Math.round((i * 100) / this.tableData.listDays.length) : 0;
        });
  }

  checkTeamLead() {
    this.http.post<Status> (`${environment.apiUrl}/api/project/english-project/profiles/lead`, {})
        .subscribe({
          next: data => {
            if (data.status === 1) {
              this.isTeamLead = true;
              // this.teamleadMode = 1;
            }
            console.log(this.isTeamLead);
          },
          error: error => {
            this.isTeamLead = false;
          }
        });
  }

  gotoDays(id: string) {
    if (this.id !== '' && this.id !== null && this.isTeamLead) {
      this.router.navigateByUrl('/vertical/admin/attendance/' + id);
    }
  }
  sort({ key, value }): void {
    this.sort_key = key;
    if (value === 'ascend') {
      this.sort_value = 'asc';
    } else if (value === 'descend') {
      this.sort_value = 'desc';
    } else {
      this.sort_value = value;
    }
  }
  gotoProfile(id: string) {
    this.router.navigateByUrl('/vertical/user-profile/' + id);
  }

  test(selected: number) {
    console.log(selected);
  }
  eventClick(index: number) {
    this.selected = index;
  }
}
