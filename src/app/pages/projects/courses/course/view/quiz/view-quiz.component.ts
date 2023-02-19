import {AfterViewChecked, AfterViewInit, Component, ElementRef, HostListener, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {map} from 'rxjs/operators';
import {ViewRecordComponent} from '../../../../../reference/record/view-record';
import {CourseFields, ModuleFields} from '../../../../../../interfaces/services/projects/courses.service';
import {environment} from '../../../../../../../environments/environment';
import {Status} from '../../../../../../interfaces/services/util.service';

@Component({
  selector: 'view-quiz',
  templateUrl: 'view-quiz.component.html',
  styleUrls: ['../module/view-module.component.scss', '../lesson/view-lesson.component.scss', './view-quiz.component.scss']
})
export class ViewQuizComponent extends ViewRecordComponent implements OnInit {

  quiz = {};
  fieldsDataObj = {};
  statusCourse = 3;

  expandB = [];
  expandedAll = false;
  markQuizzesPercent = 0;
  markQuizzesCount = 0;

  showQuestion = 0;
  startQuiz = false;
  finishQuiz = false;

  correct = 0;
  countQuestions = 0;
  percentResult = 0;

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
      this.getRecordData();
    }
  }

  getRecordData(type: string = 'get') {
    return this.http.get<any>(`${environment.apiUrl}/api/project/course/quiz/get/client/${this.recordId}`)
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
            this.quiz = data;
            this.quiz['questions'].forEach((item, index) => {
              this.quiz['questions'][index]['selectedAnswers'] = [];
              if (
                  item['type'] === 'multiple'
                  && this.quiz['questions'][index]['answers'] != null
                  && this.quiz['questions'][index]['answers'].length > 0
              ) {
                this.quiz['questions'][index]['answers'].forEach((answer, inx) => {
                  this.quiz['questions'][index]['answers'][inx]['selected'] = false;
                });
              }
            });
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

  passQuizCourse() {
    // if (this.markQuizzesPercent < 100) {
    //   return this.toastr.error('Complete Quizzes', 'Error', { closeButton: true });
    // }
    const result = [];
    this.quiz['questions'].forEach((item, index) => {
      if (this.quiz['questions'][index]['selectedAnswers']) {
        result.push({
          id: item['id'],
          selectedAnswers: item['selectedAnswers']
        });
      }
    });
    const payload = {
      id: this.quiz['id'],
      answered: result
    };
    return this.http.post<Status>(`${environment.apiUrl}/api/project/course/quiz/check`, payload)
        .subscribe({
          next: data => {
            if (data.status === 1) {
              this.toastr.success(data.message, 'Success', { closeButton: true });
            } else {
              this.toastr.error(data.message, 'Error', { closeButton: true });
            }
            this.correct = data.value['correct'];
            this.countQuestions = data.value['total'];
            this.percentResult = data.value['percent'];
            this.finishQuiz = true;
          },
          error: error => {
            this.toastr.error('Not saved!', 'Error', { closeButton: true });
          }
        });
  }

  npQuestion(index: number, type: string) {
    if (type === 'next' && this.showQuestion < this.quiz['questions'].length) {
      this.showQuestion++;
    } else if (type === 'prev'  && this.showQuestion > 0) {
      this.showQuestion--;
    }

  }

  reloadQuiz() {
    this.quiz = {};
    this.fieldsDataObj = {};
    this.statusCourse = 3;

    this.expandB = [];
    this.expandedAll = false;
    this.markQuizzesPercent = 0;
    this.markQuizzesCount = 0;

    this.showQuestion = 0;
    this.startQuiz = false;
    this.finishQuiz = false;

    this.correct = 0;
    this.countQuestions = 0;
    this.percentResult = 0;

    this.initRoute().then();
    this.startQuiz = true;
  }

}
