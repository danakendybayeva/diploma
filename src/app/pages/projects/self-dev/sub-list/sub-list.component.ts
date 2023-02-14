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
import {Content} from '../../../../ui/interfaces/modal';
import {ActivatedRoute, Router} from '@angular/router';
import {TCModalService} from '../../../../ui/services/modal/modal.service';
import {Skills, SkillsProfile} from '../../../../interfaces/services/projects/skills.service';
import {ToastrService} from 'ngx-toastr';
import {Status} from "../../../../interfaces/services/util.service";

@Component({
  selector: 'self-dev-list',
  templateUrl: './sub-list.component.html',
  styleUrls: ['./sub-list.component.scss'],
})
export class SubListComponent extends BasePageComponent implements OnInit, OnDestroy {
  groups: IGroup[];

  groupPositions: any[];
  groupLocations: any[];
  popularGroups: any[];
  colors: string[];

  tableData: SelfDev[];

  aList: Skills[] = [];

  aSelected: SkillsProfile[] = [];
  aChoosed = [];

  iCountSelect = 0;

  id?: string = null;

  profile_id?: string = null;

  imageList1: any[] = [];
  imageList2: any[] = [];

  sComment = '';

  constructor(store: Store<IAppState>, httpSv: HttpService, private http: HttpClient,
      private modal: TCModalService, private route: ActivatedRoute,
              private toastr: ToastrService) {
    super(store, httpSv);

    this.pageData = {
      title: 'List Skills'
    };

    this.groups = [];
    this.id = this.route.snapshot.params['id'];
    if (this.route.snapshot.params['profile_id']) {
      this.profile_id = this.route.snapshot.params['profile_id'];
      this.getListProfileSkills(this.id, this.profile_id);
    } else {
      this.getListProfileSkillsMySelf(this.route.snapshot.params['id']);
    }
    // this.getListSkills(this.id);

  }

  ngOnInit() {
    super.ngOnInit();
    super.setLoaded();
    // this.getData('assets/data/groups.json', 'groups', 'getGroups');
  }

  ngOnDestroy() {
    super.ngOnDestroy();
  }

  chooseOnList(item: any) {
    if (!item.selectEnd) {
      if (item.selected) {
        item.selected = false;
        console.log(this.iCountSelect);
        if (this.iCountSelect > 0) {
          this.iCountSelect--;
        }
      } else if (this.iCountSelect < 2) {
        item.selected = true;
        console.log(this.iCountSelect);
        if (this.iCountSelect < 2) {
          this.iCountSelect++;
        }
      }
    }
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
    this.saveChoosed();
  }

  // getListSkills(id: string) {
  //   return this.http.get<Skills[]>(`${environment.apiUrl}/api/project/skills-project/lists/${id}`)
  //       .pipe(map(data => {
  //         return data;
  //       }))
  //       .subscribe(data => {
  //         this.aList = data;
  //         this.aList.forEach(obj => {
  //           if (this.aChoosed.indexOf(obj.id) >= 0) {
  //             obj.view = 'success';
  //             obj.selected = true;
  //             this.iCountSelect++;
  //           } else {
  //             obj.view = 'default';
  //           }
  //         })
  //         this.imageList1 = [{thumbUrl: this.aList[0].image }];
  //         this.imageList2 = [{thumbUrl: this.aList[0].avatar }];
  //       });
  // }

  getListProfileSkills(id: string, profileId: string) {
    return this.http.get<Skills[]>(`${environment.apiUrl}/api/project/skills-project/profiles/${id}/${profileId}`)
        .pipe(map(data => {
          return data;
        }))
        .subscribe(data => {
          this.aList = data;
          this.aList.forEach(obj => {
            if (obj.selected) {
              this.iCountSelect++;
            }
          });
        });
  }

  getListProfileSkillsMySelf(id: string) {
    return this.http.get<Skills[]>(`${environment.apiUrl}/api/project/skills-project/profiles/myself/${id}`)
        .pipe(map(data => {
          return data;
        }))
        .subscribe(data => {
          this.aList = data;
          this.aList.forEach(obj => {
            if (obj.selected) {
              this.iCountSelect++;
            }
          });
        });
  }

  saveChoosed() {
    this.aSelected = [];
    this.aList.forEach(obj => {
      if (obj.selected === true) {
        // tslint:disable-next-line:max-line-length
        this.aSelected.push({id: null, profileId: this.profile_id, listId: obj.id, actualId: null, comment: null, link: null, blocked: false });
      }
    });
    this.http.put<Status>(`${environment.apiUrl}/api/project/skills-project/skills-profile`, this.aSelected)
        .subscribe({
          next: data => {
            if (data.status === 1) {
              this.toastr.success(data.message, 'Success', { closeButton: true });
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
