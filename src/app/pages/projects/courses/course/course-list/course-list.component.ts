import {Component, ElementRef, OnDestroy, OnInit} from '@angular/core';

import {Store} from '@ngrx/store';
import {BasePageComponent} from '../../../../base-page';
import {IAppState} from '../../../../../interfaces/app-state';
import {HttpService} from '../../../../../services/http/http.service';
import {environment} from '../../../../../../environments/environment';
import {map} from 'rxjs/operators';
import {HttpClient} from '@angular/common/http';
import {Course} from '../../../../../interfaces/services/projects/courses.service';
import {ActivatedRoute, Router} from '@angular/router';
import {UserService} from '../../../../../user/_services/user.service';

@Component({
  selector: 'course-list',
  templateUrl: './course-list.component.html',
  styleUrls: ['./course-list.component.scss'],
})
export class CourseListComponent extends BasePageComponent implements OnInit, OnDestroy {

  groupPositions: any[];
  groupLocations: any[];
  popularGroups: any[];
  colors: string[];

  filterActive: any[] = [
    {id: '1', name: 'Все', count: 0, type: 'accesslist'},
    {id: '2', name: 'Текущие', count: 0, type: 'studyinglist'},
    {id: '3', name: 'Завершенные', count: 0, type: 'finishedlist'},
  ];
  filterChoosed = '1';
  coursesList: Course[] = [];
  typeDisplay = 'grid';

  listType = 'accesslist';
  packageId = '';
  companyId = '';
  isAdmin = false;

  search: any;
  search2: any;
  column = '';
  column2 = '';

  twoSizeColumn = true;

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
      title: 'Courses',
    };
    if (this.route.snapshot.params['packageId']) {
      this.packageId = this.route.snapshot.params['packageId'];
    }
    if (this.route.snapshot.params['companyId']) {
      this.companyId = this.route.snapshot.params['companyId'];
    }
  }

  async ngOnInit() {
    super.ngOnInit();
    // this.getData('assets/data/groups.json', 'groups', 'getGroups');
    if (this.el.nativeElement.offsetWidth > 544) {
      this.twoSizeColumn = false;
    }
    super.setLoaded();
    if (this.packageId && this.companyId) {
      this.getCoursesListPC(this.companyId, this.packageId);
    } else if (this.packageId) {
      this.getCoursesListById(this.packageId);
    } else {
      this.getCoursesList(this.listType);
    }
    this.isAdmin = await this.userService.isAdmin();
  }

  ngOnDestroy() {
    super.ngOnDestroy();
  }

  getGroups() {
    super.setLoaded();
  }

  getColor(): string {
    return this.colors[Math.floor(Math.random() * this.colors.length)];
  }

  setTypeDisplay(type: string) {
    this.typeDisplay = type;
  }

  getCoursesList(listType: string) {
    this.coursesList = [];
    return this.http.get<Course[]>(`${environment.apiUrl}/api/project/courses/${listType}`)
        .pipe(map(data => {
          return data;
        }))
        .subscribe(data => {
          if (data !== null) {
            this.coursesList = data;
            this.getCountCouse();
          }
        });
  }

  getCoursesListById(packageId: string) {
    this.coursesList = [];
    return this.http.get<Course[]>(`${environment.apiUrl}/api/project/courses/listbypackage/${packageId}`)
        .pipe(map(data => {
          return data;
        }))
        .subscribe(data => {
          if (data !== null) {
            this.coursesList = data;
            this.getCountCouse();
          }
        });
  }

  getCoursesListPC(companyId: string, packageId: string) {
    this.coursesList = [];
    return this.http.get<Course[]>(`${environment.apiUrl}/api/project/courses/list/${companyId}/${packageId}`)
        .pipe(map(data => {
          return data;
        }))
        .subscribe(data => {
          if (data !== null) {
            this.coursesList = data;
            this.getCountCouse();
          }
        });
  }

  getCountCouse() {
    let current = 0;
    let finished = 0;
    for (let i = 0; i < this.coursesList.length; i++) {
      if (this.coursesList[i].isJoined) {
        if (this.coursesList[i].progress === 100) {
          finished++;
        } else {
          current++;
        }
      }
    }
    if (this.filterActive.length >= 3) {
      this.filterActive[1].count = current;
      this.filterActive[2].count = finished;
    }
  }

  chooseFilter(notif: any) {
    this.filterChoosed = notif.id;
    this.listType = notif.type;

    this.column = '';
    this.search = '';
    this.column2 = '';
    this.search2 = '';

    switch (this.listType) {
      case 'studyinglist':
        this.column = 'isJoined';
        this.search = true;
        this.column2 = 'progress';
        this.search2 = 100;
        break;
      case 'finishedlist':
        this.column = 'progress';
        this.search = 100;
        this.column2 = '';
        this.search2 = '';
        break;
    }
    // this.getCoursesList(this.listType);
  }

  goToStd(event: Event, link: string[]) {
    event.preventDefault();

    setTimeout(() => {
      this.router.navigate(link);
    });
  }
}
