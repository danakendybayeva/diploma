import { Component, OnDestroy, OnInit} from '@angular/core';

import {Store} from '@ngrx/store';
import {BasePageComponent} from '../../../base-page';
import {IAppState} from '../../../../interfaces/app-state';
import {HttpService} from '../../../../services/http/http.service';
import {IGroup} from 'src/app/ui/interfaces/group';
import {environment} from '../../../../../environments/environment';
import {map} from 'rxjs/operators';
import {HttpClient} from '@angular/common/http';
import {SelfDev} from '../../../../interfaces/services/self-dev.service';
import {Router} from '@angular/router';
import {Actual, Skills} from '../../../../interfaces/services/projects/skills.service';
import {formatDate} from '@angular/common';
import {AuthGuard} from '../../../../user/_helpers/auth.guard';
import {UserService} from "../../../../user/_services/user.service";

@Component({
  selector: 'self-dev-list',
  templateUrl: './lists.component.html',
  styleUrls: ['./lists.component.scss'],
})
export class ListsComponent extends BasePageComponent implements OnInit, OnDestroy {
  groups: IGroup[];

  groupPositions: any[];
  groupLocations: any[];
  popularGroups: any[];
  colors: string[];

  tableData: Skills[];

  groupActuals: Actual[];

  actual: Actual;

  isAdmin: boolean = false;

  constructor(store: Store<IAppState>, httpSv: HttpService, private http: HttpClient,
              private router: Router, private userService: UserService) {
    super(store, httpSv);

    this.pageData = {
      title: 'Groups',
      // breadcrumbs: [
      //   {
      //     title: 'UI Kit',
      //     route: 'dashboard',
      //   },
      //   {
      //     title: 'Components',
      //     route: 'dashboard',
      //   },
      //   {
      //     title: 'Groups',
      //   },
      // ],
    };

    this.groups = [];
    this.groupActuals = [];
  }

  async ngOnInit() {
    super.ngOnInit();
    this.getData('assets/data/groups.json', 'groups', 'getGroups');
    this.getListProfiles();
    this.getActuals();
    this.isAdmin = await this.userService.isAdmin();
  }

  ngOnDestroy() {
    super.ngOnDestroy();
  }

  getPopularGroups(groups: IGroup[]) {
    return groups
      .sort((prev, curr) => curr.members > prev.members ? 1 : -1)
      .slice(0, 5)
      .map((group) => ({ avatar: group.avatar, title: group.title, members: group.members, bg: group.bg }));
  }

  getGroups() {
    this.popularGroups = this.getPopularGroups(this.groups);

    this.groupPositions = [
      { name: 'Front-End Developer', num: 23 },
      { name: 'Android Developer', num: 15 },
      { name: 'UI/UX Designer', num: 13 },
      { name: 'Manager', num: 9 },
      { name: 'Full-Stack Developer', num: 8 }
    ];

    this.groupLocations = [
      { name: 'Madrid, Spain', num: 22 },
      { name: 'Paris, France', num: 18 },
      { name: 'Los Angeles, California', num: 17 },
      { name: 'San Francisco, California', num: 14 },
      { name: 'Austin, Texas', num: 11 }
    ];

    super.setLoaded();
  }

  getColor(): string {
    return this.colors[Math.floor(Math.random() * this.colors.length)];
  }

  getListProfiles() {
    return this.http.get<Skills[]>(`${environment.apiUrl}/api/project/skills-project/list`)
        .pipe(map(data => {
          return data;
        }))
        .subscribe(data => {
          this.tableData = data;
          this.tableData.forEach(obj => {
            obj.connections = [
              'assets/content/user-40-1.jpg',
              'assets/content/user-40-2.jpg',
              'assets/content/user-40-3.jpg',
              'assets/content/user-40-4.jpg'
            ];
            obj.members = Math.floor(Math.random() * 30) + 7;
          });
        });
  }

  getActuals() {
      return this.http.get<Actual[]>(`${environment.apiUrl}/api/project/skills-project/actual/list`)
          .pipe(map(data => {
            return data;
          }))
          .subscribe(data => {
            this.groupActuals = data;
            let i = 0;
            console.log(this.groupActuals);
            for (i = 0; i < this.groupActuals.length; i++) {
              console.log(this.groupActuals[i]);
              if (this.groupActuals[i].actual) {
                this.actual = this.groupActuals[i];
                break;
              }
            }
          });
  }

  gotoSubSkills(id: string) {
    const dateSelected = formatDate(this.actual.dateSelect, 'yyyy-MM-dd', 'en');
    const now = formatDate(new Date(), 'yyyy-MM-dd', 'en');
    if (dateSelected >= now) {
      this.router.navigateByUrl('/vertical/self-dev-sub-list/' + id);
    } else {
      this.router.navigateByUrl('/vertical/self-dev-pass/' + id);
      // this.router.navigateByUrl('/vertical/self-edit/' + id);
    }
  }
}
