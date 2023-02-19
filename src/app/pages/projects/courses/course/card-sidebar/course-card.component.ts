import {Component, Input, OnDestroy, OnInit} from '@angular/core';

import {BasePageComponent} from '../../../../base-page';
import {Store} from '@ngrx/store';
import {IAppState} from '../../../../../interfaces/app-state';
import {HttpService} from '../../../../../services/http/http.service';
import {environment} from '../../../../../../environments/environment';
import {Status} from '../../../../../interfaces/services/util.service';
import {HttpClient} from '@angular/common/http';
import {ToastrService} from 'ngx-toastr';
import {Router} from '@angular/router';
import {Validators} from '@angular/forms';

@Component({
  selector: 'tc-course-card-sidebar',
  templateUrl: 'course-card.component.html',
  styleUrls: ['./course-card.component.scss'],
})
export class CourseCardSidebarComponent extends BasePageComponent implements OnInit, OnDestroy {
  @Input() course = {};
  @Input() statusCourse = 1;
  @Input() accessCourse = false;

  statusLoading = false;

  constructor(
      store: Store<IAppState>,
      httpSv: HttpService,
      private http: HttpClient,
      private toastr: ToastrService,
      protected router: Router
  ) {
    super(store, httpSv);
    this.pageData = {
      title: '',
      loaded: true
    };
  }

  ngOnInit() {
    super.ngOnInit();
  }

  ngOnDestroy() {
    super.ngOnDestroy();
  }

  srcImage(id) {
    return `${environment.apiUrl}/api/project/course/media/${id}`;
  }

  getLetters(text: string) {
    const arr = text.split(' ');
    if (arr.length > 1) {
      return arr[0][0] + arr[1][0];
    } else if (arr.length) {
      return arr[0][0];
    } else {
      return 'A';
    }
  }


  joiningCourse(status: number) {
    this.statusLoading = true;
    const payload = {
      course_id: this.course['id']
    };
    return this.http.post<Status>(`${environment.apiUrl}/api/project/course/joining/new`, payload)
        .subscribe({
          next: data => {
            if (data.status === 1) {
              this.toastr.success(data.message, 'Success', { closeButton: true });
              if (this.course['modules'].length) {
                setTimeout(() => {
                  this.statusCourse = data.value;
                  this.router.navigate(['/vertical/courses/course/module/view', this.course['modules'][0]['id']]).then();
                  this.statusLoading = false;
                }, 500);
              }
            } else {
              this.toastr.error(data.message, 'Error', { closeButton: true });
            }
          },
          error: error => {
            this.toastr.error('Not saved!', 'Error', { closeButton: true });
          }
        });
  }
}
