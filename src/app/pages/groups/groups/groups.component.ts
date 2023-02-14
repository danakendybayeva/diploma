import { Component, OnDestroy, OnInit} from '@angular/core';

import {Store} from '@ngrx/store';
import {BasePageComponent} from '../../base-page';
import {IAppState} from '../../../interfaces/app-state';
import {HttpService} from '../../../services/http/http.service';
import {IGroup} from 'src/app/ui/interfaces/group';
import {environment} from '../../../../environments/environment';
import {map} from 'rxjs/operators';
import {HttpClient} from '@angular/common/http';
import { Group } from '../../../interfaces/services/group.service';

@Component({
  selector: 'page-groups-list',
  templateUrl: './groups.component.html',
  styleUrls: ['./groups.component.scss'],
})
export class GroupsListComponent extends BasePageComponent implements OnInit, OnDestroy {
  groups: IGroup[];

  groupPositions: any[];
  groupLocations: any[];
  popularGroups: any[];
  colors: string[];

  tableData: Group[];

  constructor(store: Store<IAppState>, httpSv: HttpService, private http: HttpClient) {
    super(store, httpSv);

    this.pageData = {
      title: 'Groups',
      breadcrumbs: [
        {
          title: 'UI Kit',
          route: 'dashboard',
        },
        {
          title: 'Components',
          route: 'dashboard',
        },
        {
          title: 'Groups',
        },
      ],
    };

    this.groups = [];
  }

  ngOnInit() {
    super.ngOnInit();
    this.getData('assets/data/groups.json', 'groups', 'getGroups');
    this.getListProfiles();
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
    return this.http.get<Group[]>(`${environment.apiUrl}/api/group/list`)
        .pipe(map(data => {
          return data;
        }))
        .subscribe(data => {
          this.tableData = data;
          this.tableData.forEach(obj => {
            obj.connections = [
              "assets/content/user-40-1.jpg",
              "assets/content/user-40-2.jpg",
              "assets/content/user-40-3.jpg",
              "assets/content/user-40-4.jpg"
            ];
            obj.members = Math.floor(Math.random() * 30) + 7;
          });
        });
  }
}
