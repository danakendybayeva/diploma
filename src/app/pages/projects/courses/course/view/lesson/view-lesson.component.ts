import {AfterViewChecked, AfterViewInit, Component, ElementRef, HostListener, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {map} from 'rxjs/operators';
import {ViewRecordComponent} from '../../../../../reference/record/view-record';
import {CourseFields, ModuleFields} from '../../../../../../interfaces/services/projects/courses.service';
import {environment} from '../../../../../../../environments/environment';
import {align} from '../../../../../../ui/interfaces/general';
import {Status} from '../../../../../../interfaces/services/util.service';

@Component({
  selector: 'view-lesson',
  templateUrl: 'view-lesson.component.html',
  styleUrls: ['../module/view-module.component.scss', './view-lesson.component.scss']
})
export class ViewLessonComponent extends ViewRecordComponent implements OnInit {

  lesson = {};
  fieldsDataObj = {};
  statusCourse = 3;

  expandB = [];
  expandedAll = false;
  markQuizzesPercent = 0;
  markQuizzesCount = 0;

  ngOnInit() {
    this.postImage = environment.apiUrl + '/api/project/course/media/request-file/image';
    this.getImageUrl = environment.apiUrl + '/api/project/course/media/';
    this.pageData = {
      title: '',
      loaded: true
    };
    this.isEmpty = false;
    super.ngOnInit();
  }

  async initRoute() {
    this.fieldsDataObj = ModuleFields;
    if (this.route.snapshot.params['id']) {
      this.recordId = this.route.snapshot.params['id'];
      this.getRecordData('get');
    }
  }

  getRecordData(type: string = 'get') {
    return this.http.get<any>(`${environment.apiUrl}/api/project/course/lesson/get/${this.recordId}`)
        .pipe(map(data => {
          return data;
        }))
        .subscribe(data => {
          if (data != null && data['id'] && Object.keys(data).length) {
            Object.entries(this.fieldsDataObj).forEach(
                ([key, value]) => {
                  this.fieldsDataObj[key].value = data[key];
                }
            );
            this.lesson = data;
            this.markQuizzesCount = this.markQuizzesPercent = 0;
            if (this.lesson['quizzes'] && this.lesson['quizzes'].length) {
              this.lesson['quizzes'].forEach(quiz => {
                if (quiz['marked']) {
                  this.markQuizzesCount++;
                }
              });
              this.markQuizzesPercent = Math.round((this.markQuizzesCount * 100) / this.lesson['quizzes'].length);
            } else {
              this.markQuizzesPercent = 100;
            }
            this.loaded = true;
          } else {
            this.isEmpty = true;
          }

        });
  }

  getEditUrl() {
    return ['/vertical/courses/admin/course/edit', this.recordId];
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

  lessonProgressCourse() {
    if (this.markQuizzesPercent < 100) {
      return this.toastr.error('Complete Quizzes', 'Error', { closeButton: true });
    }
    const payload = {
      object_id: this.lesson['id']
    };
    return this.http.post<Status>(`${environment.apiUrl}/api/project/course/lesson-progress/new`, payload)
        .subscribe({
          next: data => {
            if (data.status === 1) {
              this.toastr.success(data.message, 'Success', { closeButton: true });
              if (this.lesson['navigate']['next'] && this.lesson['navigate']['next']['type'] === 'lesson') {
                setTimeout(() => {
                  this.router.navigate(['/vertical/courses/course/lesson/view', this.lesson['navigate']['next']['id']]).then();
                }, 500);
              } else {
                setTimeout(() => {
                  this.router.navigate(['/vertical/courses/course/module/view', this.lesson['module_id']]).then();
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
