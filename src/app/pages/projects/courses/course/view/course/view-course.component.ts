import {AfterViewChecked, AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {map} from 'rxjs/operators';
import {ViewRecordComponent} from '../../../../../reference/record/view-record';
import {CourseFields} from '../../../../../../interfaces/services/projects/courses.service';
import {environment} from '../../../../../../../environments/environment';
import {align} from '../../../../../../ui/interfaces/general';
import {Status} from '../../../../../../interfaces/services/util.service';

@Component({
  selector: 'view-course',
  templateUrl: 'view-course.component.html',
  styleUrls: ['./view-course.component.scss']
})
export class ViewCourseComponent extends ViewRecordComponent implements OnInit {

  course = {};
  fieldsDataObj = {};
  statusCourse = 1;

  @ViewChild('coverBanner') elementView: ElementRef;
  contentHeight = 0;

  expandB = [];
  expandedAll = false;

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
    this.fieldsDataObj = CourseFields;
    if (this.route.snapshot.params['id']) {
      this.recordId = this.route.snapshot.params['id'];
      this.getRecordData('get');
    }
  }

  getRecordData(type: string = 'get') {
    return this.http.get<any>(`${environment.apiUrl}/api/project/course/get/${this.recordId}`)
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
            this.course = data;
            if (this.course['modules'] && this.course['modules'].length) {
              this.course['modules'].forEach((module, index) => {
                let markedCount = 0;
                this.course['modules'][index]['lessons'].forEach(lesson => {
                  if (lesson['marked']) {
                    markedCount++;
                  }
                });
                this.course['modules'][index]['progress_percent'] = Math.round((markedCount * 100) / module['lesson_count']);
                this.course['modules'][index]['marked_count'] = markedCount;
              });
            }
            if (this.course['modules'] && this.course['modules'].length) {
              this.expandB = new Array(this.course['modules'].length).fill(false);
            }
            switch (this.course['progress_percent']) {
              case null:
                this.statusCourse = 1;
                break;
              case 100:
                this.statusCourse = 3;
                break;
              default:
                this.statusCourse = 2;
            }
            this.loaded = true;
            setTimeout(
                () => {
                  this.contentHeight = this.elementView.nativeElement.offsetHeight;
                },
                500
            );
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

  onChangeAffix(status: boolean): void {
    console.log(status);
  }

  expandingAll() {
    this.expandB.forEach((item, index) => {
      this.expandB[index] = !this.expandedAll;
    });
    this.expandedAll = !this.expandedAll;
  }

}
