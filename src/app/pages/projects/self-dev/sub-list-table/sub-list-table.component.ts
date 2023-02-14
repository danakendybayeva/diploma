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
import {ActivatedRoute, Router} from '@angular/router';
import {SkillsListProfiles} from '../../../../interfaces/services/projects/skills.service';
import {Content} from '../../../../ui/interfaces/modal';
import {TCModalService} from '../../../../ui/services/modal/modal.service';
import {StudentList} from '../../../../interfaces/services/studentList.service';
import {Status} from "../../../../interfaces/services/util.service";
import {ToastrService} from "ngx-toastr";

@Component({
  selector: 'self-dev-list',
  templateUrl: './sub-list-table.component.html',
  styleUrls: ['./sub-list-table.component.scss'],
})
export class SubListTableComponent extends BasePageComponent implements OnInit, OnDestroy {
  groups: IGroup[];

  groupPositions: any[];
  groupLocations: any[];
  popularGroups: any[];
  colors: string[];

  tableData: SkillsListProfiles[];

  displayedData: any[];

  sort_key = '';
  sort_value = '';
  id = '';

  iCountSelect = 0;
  isInstagram = 'Instagram is Block';

  constructor(store: Store<IAppState>, httpSv: HttpService, private http: HttpClient,
              private router: Router, private modal: TCModalService,
              private route: ActivatedRoute, private toastr: ToastrService) {
    super(store, httpSv);

    this.pageData = {
      title: 'Спорт және денсаулық'
    //   breadcrumbs: [
    //     {
    //       title: 'UI Kit',
    //       route: 'dashboard',
    //     },
    //     {
    //       title: 'Components',
    //       route: 'dashboard',
    //     },
    //     {
    //       title: 'Groups',
    //     },
    //   ],
    };

    this.id = this.route.snapshot.params['parentId'];

    this.groups = [];
    this.getListProfiles();
  }

  ngOnInit() {
    super.ngOnInit();
    super.setLoaded();
    // this.getData('assets/data/groups.json', 'groups', 'getGroups');
  }

  ngOnDestroy() {
    super.ngOnDestroy();
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

    //
    // if (sortingEnabled) {
    //   const direction = value === 'ascend' ? 1 : -1;
    //   const sortFn = (prev, cur) => (prev[key] > cur[key] ? 1 : -1) * direction;
    //
    //   this.displayedData = this.displayedData.sort(sortFn);
    // } else {
    //   this.displayedData = this.tableData;
    // }
  }

  gotoProfile(id: string) {
    this.router.navigateByUrl('');
  }

  openModal<T>(body: Content<T>, header: Content<T> = null, footer: Content<T> = null, options: any = null, item: number = 0) {
    this.iCountSelect = item;
    if (this.tableData[item].blocked) {
      this.isInstagram = 'Instagram is Block';
    } else {
      this.isInstagram = 'Instagram is not Block';
    }
    this.modal.open({
      body: body,
      header: header,
      footer: footer,
      options: options
    });
  }

  closeModal(item: number) {
    this.modal.close();
  }

  submitModal(item: SkillsListProfiles) {
    console.log(item);
    if (item.link !== null && item.link !== '') {
      this.saveChoosed(item);
    }
    this.modal.close();
  }

  getListProfiles() {
    return this.http.get<SkillsListProfiles[]>(`${environment.apiUrl}/api/project/skills-project/selected/list/${this.id}`)
        .pipe(map(data => {
          return data;
        }))
        .subscribe(data => {
          this.tableData = data;
          const aCity = [];
          const aSpec = [];
        });
  }

  saveChoosed(item: SkillsListProfiles) {
    this.http.put<Status>(`${environment.apiUrl}/api/project/skills-project/skills-profile/item/checked`, item)
        .subscribe({
          next: data => {
            if (data.status === 1) {
              this.toastr.success(data.message, 'Success', { closeButton: true });
              item.done = new Date().toDateString();
            } else if (data.status === 2) {
              this.toastr.warning(data.message, 'Warning', { closeButton: true });
            } else {
              this.toastr.error('Not saved!', 'Error', { closeButton: true });
            }
          },
          error: error => {
            this.toastr.error('Not saved!', 'Error', { closeButton: true });
          }
        });
  }
}
