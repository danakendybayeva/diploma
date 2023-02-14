import { Component, OnDestroy, OnInit} from '@angular/core';

import {Store} from '@ngrx/store';
import {BasePageComponent} from '../../../../base-page';
import {IAppState} from '../../../../../interfaces/app-state';
import {HttpService} from '../../../../../services/http/http.service';
import {environment} from '../../../../../../environments/environment';
import {map} from 'rxjs/operators';
import {HttpClient} from '@angular/common/http';
import {Package, Teacher, Teachers} from '../../../../../interfaces/services/projects/courses.service';
import {ActivatedRoute, Router} from '@angular/router';
import {Status} from '../../../../../interfaces/services/util.service';
import {UserService} from '../../../../../user/_services/user.service';

@Component({
  selector: 'app-package-list',
  templateUrl: './package-list.component.html',
  styleUrls: ['./package-list.component.scss'],
})
export class PackageListComponent extends BasePageComponent implements OnInit, OnDestroy {
  packagesList: Package[] = [];
  listType = 'accesslist';
  companyId = '';
  teachers: Teacher[] = [];
  isAdmin = false;

  constructor(store: Store<IAppState>,
              httpSv: HttpService,
              private http: HttpClient,
              private route: ActivatedRoute,
              private router: Router,
              private userService: UserService) {
    super(store, httpSv);

    this.pageData = {
      title: 'Packages',
    };

    this.companyId = this.route.snapshot.params['companyId'];
  }

  async ngOnInit() {
    super.ngOnInit();
    // this.getData('assets/data/groups.json', 'groups', 'getGroups');
    if (this.companyId) {
      this.getPackagesList();
      this.getTeachersList();
    }
    super.setLoaded();
    this.isAdmin = await this.userService.isAdmin();
  }

  ngOnDestroy() {
    super.ngOnDestroy();
  }

  getGroups() {
    super.setLoaded();
  }

  getPackagesList() {
    this.packagesList = [];
    return this.http.get<Status>(`${environment.apiUrl}/api/project/courses/packages/get/company/${this.companyId}`)
        .pipe(map(data => {
          return data;
        }))
        .subscribe(data => {
          this.packagesList = data.value;
        });
  }

  getTeachersList() {
    return this.http.get<Teacher[]>(`${environment.apiUrl}/api/project/courses/teachers/list/cpid/${this.companyId}`)
        .pipe(map(data => {
          return data;
        }))
        .subscribe(data => {
          this.teachers = data;
        });
  }

  goToStd(event: Event, link: string[]) {
    event.preventDefault();

    setTimeout(() => {
      this.router.navigate(link);
    });
  }
}
