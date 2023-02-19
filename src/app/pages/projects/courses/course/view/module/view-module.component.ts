import {AfterViewChecked, AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {map} from 'rxjs/operators';
import {ViewRecordComponent} from '../../../../../reference/record/view-record';
import {CourseFields, ModuleFields} from '../../../../../../interfaces/services/projects/courses.service';
import {environment} from '../../../../../../../environments/environment';
import {align} from '../../../../../../ui/interfaces/general';

@Component({
  selector: 'view-module',
  templateUrl: 'view-module.component.html',
  styleUrls: ['./view-module.component.scss']
})
export class ViewModuleComponent extends ViewRecordComponent implements OnInit {

  module = {};
  fieldsDataObj = {};
  statusCourse = 3;

  expandB = [];
  expandedAll = false;
  markedCount = 0;
  markedPercent = 0;

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
    return this.http.get<any>(`${environment.apiUrl}/api/project/course/module/get/${this.recordId}`)
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
            this.module = data;
            this.markedCount = this.markedPercent = 0;
            if (this.module['lessons'] && this.module['lessons'].length) {
              this.module['lessons'].forEach(lesson => {
                if (lesson['marked']) {
                  this.markedCount++;
                }
              });
              this.markedPercent = Math.round((this.markedCount * 100) / this.module['lesson_count']);
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


}
