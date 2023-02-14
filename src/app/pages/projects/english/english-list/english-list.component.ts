import {Component, ElementRef, OnDestroy, OnInit} from '@angular/core';

import {Store} from '@ngrx/store';
import {BasePageComponent} from '../../../base-page';
import {IAppState} from '../../../../interfaces/app-state';
import {HttpService} from '../../../../services/http/http.service';
import {environment} from '../../../../../environments/environment';
import {map} from 'rxjs/operators';
import {HttpClient} from '@angular/common/http';
import {Course} from '../../../../interfaces/services/projects/courses.service';
import {ActivatedRoute, Router} from '@angular/router';
import {UserService} from '../../../../user/_services/user.service';
import {EnglishGroup, EnglishReport} from '../../../../interfaces/services/projects/english.service';
import {Group} from '../../../../interfaces/services/group.service';
import {IMenuItem} from '../../../../interfaces/main-menu';

@Component({
  selector: 'english-list',
  templateUrl: './english-list.component.html',
  styleUrls: ['./english-list.component.scss'],
})
export class EnglishListComponent extends BasePageComponent implements OnInit, OnDestroy {
  groupList: Group[] = [];
  isAdmin = false;

  constructor(
      store: Store<IAppState>,
      httpSv: HttpService,
      private http: HttpClient,
      private route: ActivatedRoute,
      private router: Router,
      private userService: UserService,
      private el: ElementRef
  ) {
    super(store, httpSv);

    this.pageData = {
      title: 'English Group',
    };
    if (this.route.snapshot.params['packageId']) {
      // this.packageId = this.route.snapshot.params['packageId'];
    }

  }

  async ngOnInit() {
    super.ngOnInit();
    if (this.el.nativeElement.offsetWidth > 544) {
    }
    super.setLoaded();
    this.isAdmin = await this.userService.isAdmin() || await this.userService.roleAccount(['english_teacher']);
    if (this.isAdmin || this.userService.roleAccount(['english_teacher']).then(r => {})) {
      this.getGroupList();
    }
  }

  ngOnDestroy() {
    super.ngOnDestroy();
  }

  getGroups() {
    super.setLoaded();
  }

  getGroupList() {
    return this.http.get<Group[]>(`${environment.apiUrl}/api/project/english-project/group/list`)
        .pipe(map(data => {
          return data;
        }))
        .subscribe(data => {
          if (data !== null) {
            data.forEach((item: Group) => {
              item.routerLink = `/vertical/english/group/${item.id}`;
              item.image = '';
            });
            this.groupList = data;
          }
        });
  }

  goToStd(event: Event, link: string[]) {
    event.preventDefault();

    setTimeout(() => {
      this.router.navigate(link);
    });
  }

}
