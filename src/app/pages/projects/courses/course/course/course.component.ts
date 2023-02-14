import { Component, OnDestroy, OnInit, ElementRef} from '@angular/core';

import {Store} from '@ngrx/store';
import {BasePageComponent} from '../../../../base-page';
import {IAppState} from '../../../../../interfaces/app-state';
import {HttpService} from '../../../../../services/http/http.service';
import {IGroup} from 'src/app/ui/interfaces/group';
import {environment} from '../../../../../../environments/environment';
import {map} from 'rxjs/operators';
import {HttpClient} from '@angular/common/http';
import {Comment, Course, Module, Teacher} from '../../../../../interfaces/services/projects/courses.service';
import {ActivatedRoute, Router} from '@angular/router';
import {Status} from '../../../../../interfaces/services/util.service';
import {ToastrService} from 'ngx-toastr';
import {UserService} from '../../../../../user/_services/user.service';

@Component({
  selector: 'course-item',
  templateUrl: './course.component.html',
  styleUrls: ['./course.component.scss'],
})
export class CourseComponent extends BasePageComponent implements OnInit, OnDestroy {

  groupPositions: any[];
  groupLocations: any[];
  popularGroups: any[];
  colors: string[];

  filterActive: any[] = [
    {id: '1', name: 'Все', count: 0},
    {id: '2', name: 'Текущие', count: 3},
    {id: '3', name: 'Завершенные', count: 17},
  ];
  filterChoosed = '1';
  course: Course = null;
  modules: Module[] = [];
  comments: Comment[] = [];
  commentP: Comment = { id: '', comment: '', rating: 0, courseId: '', parentId: '', profileName: '' };
  moduleLoaded = false;
  teachers: Teacher[] = [];

  id = '';
  title = 'jgjkg';

  accordion: boolean[] = [];
  isAdmin = false;
  iconSize = 18;

  constructor(
      store: Store<IAppState>,
      httpSv: HttpService,
      private http: HttpClient,
      private route: ActivatedRoute,
      private toastr: ToastrService,
      private router: Router,
      private userService: UserService,
      private el: ElementRef
  ) {
    super(store, httpSv);

    // this.pageData = {
    //   title: this.title,
    //   breadcrumbs: [
    //     {
    //       title: 'Carrier Vision',
    //       route: 'dashboard'
    //     },
    //     {
    //       title: 'Math',
    //       route: 'dashboard'
    //     }
    //   ]
    // };

    this.id = this.route.snapshot.params['id'];
    if (this.id) {
      this.commentP.courseId = this.id;
    }
  }

  async ngOnInit() {
    super.ngOnInit();
    if (this.el.nativeElement.offsetWidth < 544) {
      this.iconSize = 14;
    }
    this.getData('assets/data/groups.json', 'groups', 'getGroups');
    this.getCourse();
    this.getComments();
    this.getTeachers();
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

  getCourse() {
    return this.http.get<Status>(`${environment.apiUrl}/api/project/courses/course/${this.id}`)
        .pipe(map(data => {
          return data;
        }))
        .subscribe(data => {
          if (data.status === 1) {
            this.course = data.value;
            this.getModules();
          }
        });
  }

  getTeachers() {
    return this.http.get<Teacher[]>(`${environment.apiUrl}/api/project/courses/teachers/lists/${this.id}`)
        .pipe(map(data => {
          return data;
        }))
        .subscribe(data => {
          this.teachers = data;
        });
  }

  getModules() {
    return this.http.get<Module[]>(`${environment.apiUrl}/api/project/courses/modules/list/${this.id}`)
        .pipe(map(data => {
          return data;
        }))
        .subscribe(data => {
          this.modules = data;
          this.modules.forEach(obj => {
            this.accordion.push(false);
          });
          this.moduleLoaded = true;
        });
  }

  joinCourse() {
    this.http.post<Status>(`${environment.apiUrl}/api/project/courses/joined/registration`, this.course)
        .subscribe({
          next: data => {
            if (data.status === 1) {
              this.toastr.success(data.message, 'Success', { closeButton: true });
              this.getCourse();
            } else {
              this.toastr.error(data.message, 'Error', { closeButton: true });
            }
          },
          error: error => {
            this.toastr.error(error, 'Error', { closeButton: true });
          }
        });
  }

  unjoinCourse() {
    this.http.delete<Status>(`${environment.apiUrl}/api/project/courses/joined/unsubscribe/${this.id}`)
        .subscribe({
          next: data => {
            if (data.status === 1) {
              this.toastr.success(data.message, 'Success', { closeButton: true });
              this.getCourse();
            } else {
              this.toastr.error(data.message, 'Error', { closeButton: true });
            }
          },
          error: error => {
            this.toastr.error(error, 'Error', { closeButton: true });
          }
        });
  }

  getComments() {
    return this.http.get<Status>(`${environment.apiUrl}/api/project/courses/comment/get/${this.id}`)
        .pipe(map(data => {
          return data;
        }))
        .subscribe(data => {
          this.comments = data.value;
        });
  }

  newCommentCourse() {
    this.http.post<Status>(`${environment.apiUrl}/api/project/courses/comment/new`, this.commentP)
        .subscribe({
          next: data => {
            if (data.status === 1) {
              this.toastr.success(data.message, 'Success', { closeButton: true });
              this.getCourse();
            } else {
              this.toastr.error(data.message, 'Error', { closeButton: true });
            }
          },
          error: error => {
            this.toastr.error(error, 'Error', { closeButton: true });
          }
        });
  }

  setAccordion(accordion: boolean, i: number) {
    this.accordion[i] = !accordion;
  }

  getBgColorLesson(access: boolean, studying: boolean): string {
    if (access) {
      if (studying) { return '#ff993f'; }
      return '#7ee081';
    }
    return '#bfbfbf';
  }
  getLessonStatus(access: boolean, studying: boolean): string {
    if (access) {
      if (studying) { return 'studying'; }
      return 'finished';
    }
    return 'locked';
  }

  goToStd(event: Event, link: string[]) {
    event.preventDefault();

    setTimeout(() => {
      this.router.navigate(link);
    });
  }
}
