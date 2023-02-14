import {ChangeDetectorRef, Component, OnDestroy, OnInit} from '@angular/core';

import {Store} from '@ngrx/store';
import {BasePageComponent} from '../../../../base-page';
import {IAppState} from '../../../../../interfaces/app-state';
import {HttpService} from '../../../../../services/http/http.service';
import {environment} from '../../../../../../environments/environment';
import {map} from 'rxjs/operators';
import {HttpClient} from '@angular/common/http';
import {Course, Module, Test, Video} from '../../../../../interfaces/services/projects/courses.service';
import {ActivatedRoute, Router} from '@angular/router';
import {Status} from '../../../../../interfaces/services/util.service';
import {ToastrService} from 'ngx-toastr';
import * as SettingsActions from '../../../../../store/actions/app-settings.actions';

@Component({
  selector: 'lesson-item',
  templateUrl: './lesson.component.html',
  styleUrls: ['./lesson.component.scss'],
})
export class LessonComponent extends BasePageComponent implements OnInit, OnDestroy {

  groupPositions: any[];
  groupLocations: any[];
  popularGroups: any[];
  colors: string[];

  lesson: Video = null;
  modules: Module[] = [];
  typeDisplay = 'grid';

  id = '';

  exam: Test[] = [];
  ansRadio: string[] = [];


  constructor(store: Store<IAppState>, httpSv: HttpService,
              private http: HttpClient, private route: ActivatedRoute,
              private toastr: ToastrService, private router: Router,
              private ref: ChangeDetectorRef) {
    super(store, httpSv);
    // this.store.dispatch(new SettingsActions.Update({ boxed: true }));

    // this.pageData = {
    //   title: '',
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
      // this.course.packageId = this.id;
    }
  }

  ngOnInit() {
    super.ngOnInit();
    this.setLoaded();
    this.router.routeReuseStrategy.shouldReuseRoute = () => {
      return false;
    };
    this.getLesson();
    this.ref.detectChanges();
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

  getLesson() {
    super.setLoaded();
    return this.http.get<Video>(`${environment.apiUrl}/api/project/courses/videos/video/${this.id}`)
        .pipe(map(data => {
          return data;
        }))
        .subscribe(data => {
            this.lesson = data;
            this.exam = JSON.parse(this.lesson.test);
            for (let i = 0; i < this.exam.length; i++) {
              this.ansRadio.push('');
              this.exam[i].answer = [];
              if (this.exam[i].variants.length === 0) {
                this.exam[i].answer.push('');
              }
            }
          this.ref.detectChanges();
        });
  }

  selectAnswer(id: string, answer: string) {
    this.exam.filter(data => {
      if (data.id === id) {
        if (data.answer.indexOf(answer) > -1) {
          data.answer.splice(data.answer.indexOf(answer), 1);
        } else {
          data.answer.push(answer);
        }
      }
    });
  }

  passExam() {
    for (let i = 0; i < this.exam.length; i++) {
      if (this.exam[i].answerNum === 1 && this.ansRadio.length > 0) {
        this.exam[i].answer = [this.ansRadio[i]];
      }
    }
    console.log(this.exam);
    return this.http.post<Status>(`${environment.apiUrl}/api/project/courses/videos/test/${this.id}`, this.exam)
        .subscribe({
          next: data => {
            if (data.status === 1) {
              this.toastr.success(data.message, 'Success', { closeButton: true });
              this.getLesson();
            } else {
              this.toastr.error(data.message, 'Error', { closeButton: true });
            }

          },
          error: error => {
            this.toastr.error(error, 'Error', { closeButton: true });
          }
        });
  }

  // joinCourse() {
  //   this.http.post<Status>(`${environment.apiUrl}/api/project/courses/joined/registration`, this.course)
  //       .subscribe({
  //         next: data => {
  //           if (data.status === 1) {
  //             this.toastr.success('Saved!', 'Success', { closeButton: true });
  //             this.getCourse();
  //           } else {
  //             this.toastr.error('Not saved!', 'Error', { closeButton: true });
  //           }
  //         },
  //         error: error => {
  //           this.toastr.error('Not saved!', 'Error', { closeButton: true });
  //         }
  //       });
  // }
}
