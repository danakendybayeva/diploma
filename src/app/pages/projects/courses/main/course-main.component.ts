import { Component, OnDestroy, OnInit} from '@angular/core';

import {Store} from '@ngrx/store';
import {BasePageComponent} from '../../../base-page';
import {IAppState} from '../../../../interfaces/app-state';
import {HttpService} from '../../../../services/http/http.service';
import {IGroup} from 'src/app/ui/interfaces/group';
import {Company, Course, Package} from '../../../../interfaces/services/projects/courses.service';
import {environment} from '../../../../../environments/environment';
import {map} from 'rxjs/operators';
import {HttpClient} from '@angular/common/http';
import {Router} from '@angular/router';
import {UserService} from '../../../../user/_services/user.service';

@Component({
  selector: 'course-main',
  templateUrl: './course-main.component.html',
  styleUrls: [
      './course-main.component.scss',
      '../course/course-list/course-list.component.scss',
      '../package/package-list/package-list.component.scss'
  ],
})
export class CourseMainComponent extends BasePageComponent implements OnInit, OnDestroy {

  groupPositions: any[];
  groupLocations: any[];
  popularGroups: any[];
  colors: string[];

  coursesList: Course[] = [];
  packagesList: Package[] = [];

  companyListImg: Company[] = [];

  isAdmin = false;

  constructor(store: Store<IAppState>,
              httpSv: HttpService,
              private http: HttpClient,
              private router: Router,
              private userService: UserService) {
    super(store, httpSv);

    this.pageData = {
      title: 'MDS Courses',
    };
  }

  async ngOnInit() {
    super.ngOnInit();
    this.getCompanyList();
    this.getCoursesList('accesslist');
    this.getPackagesList();
    super.setLoaded();
    this.isAdmin = await this.userService.isAdmin();
  }

  ngOnDestroy() {
    super.ngOnDestroy();
  }

  getGroups() {
    super.setLoaded();
  }

  getCompanyList() {
    this.coursesList = [];
    return this.http.get<Company[]>(`${environment.apiUrl}/api/project/courses/company/list`)
        .pipe(map(data => {
          return data;
        }))
        .subscribe(data => {
          this.companyListImg = data;
        });
  }

  getCoursesList(listType: string) {
    this.coursesList = [];
    return this.http.get<Course[]>(`${environment.apiUrl}/api/project/courses/${listType}`)
        .pipe(map(data => {
          return data;
        }))
        .subscribe(data => {
          this.coursesList = data;
          if (this.coursesList.length > 8) {
            this.coursesList = this.coursesList.slice(0, 4);
          }
        });
  }

  getPackagesList() {
    this.coursesList = [];
    return this.http.get<Package[]>(`${environment.apiUrl}/api/project/courses/packages/list`)
        .pipe(map(data => {
          return data;
        }))
        .subscribe(data => {
          this.packagesList = data;
        });
  }

  goToStd(event: Event, link: string[]) {
    event.preventDefault();

    setTimeout(() => {
      this.router.navigate(link);
    });
  }
}
