import {AfterViewChecked, Component, OnDestroy, OnInit} from '@angular/core';

import {environment} from '../../../../../../../environments/environment';
import {LessonFields} from '../../../../../../interfaces/services/projects/courses.service';
import {TCExternalEditRecordComponent} from '../../../../../reference/external/record/edit-record';
import {map} from 'rxjs/operators';
import {NzFormatEmitEvent} from 'ng-zorro-antd';

@Component({
  selector: 'edit-lesson',
  templateUrl: './edit-lesson.component.html',
  styleUrls: ['./edit-lesson.component.scss']
})
export class EditLessonComponent extends TCExternalEditRecordComponent implements OnInit, OnDestroy, AfterViewChecked {
    loaded = false;
    url = '';
    postImage = environment.apiUrl + '/api/project/course/media/request-file/image';
    getImageUrl = environment.apiUrl + '/api/project/course/media/';
    tabShow = 0;

    nzEvent(event: NzFormatEmitEvent): void {
        console.log(event);
    }

    async ngOnInit() {
        this.loaded = false;
        this.createPost = `${environment.apiUrl}/api/project/course/lesson/new`;
        this.editPost = `${environment.apiUrl}/api/project/course/lesson/edit`;
        this.fieldsData = LessonFields;
        try {
            this.fieldsData['teachers'].values = await this.getValues(
                `${environment.apiUrl}/api/project/course/teacher/list/all`,
                'fio'
            );
        } catch (err) {
            console.log(err);
        }
        this.typePage = 'edit';
        this.pageData = {
          title: 'Create Lesson',
          loaded: true
        };
        super.ngOnInit();
        this.labelForm.addControl('video_progression_mode', this.formBuilder.control(null, []));
        this.redirectUrl = '/vertical/courses/admin/course/lesson/edit';
    }

    ngOnDestroy() {
        super.ngOnDestroy();
    }

    ngAfterViewChecked() {
        super.ngAfterViewChecked();
    }

    getRecordData(type: string = 'get') {
        return this.http.get<any>(`${environment.apiUrl}/api/project/course/lesson/get/${this.recordId}`)
            .pipe(map(data => {
              return data;
            }))
            .subscribe(
                data => {
                  if (Object.keys(data).length) {
                    Object.entries(data).forEach(
                      ([key, value]) => {
                          if (!this.fieldsData[key]) {
                              this.fieldsData[key] = {};
                          }
                          this.fieldsData[key].value = data[key];
                      }
                    );
                    // Object.entries(this.fieldsData).forEach(
                    //     ([key, value]) => {
                    //       this.fieldsData[key].value = data[key];
                    //     }
                    // );
                    this.loaded = true;
                  } else {
                    this.isEmpty = true;
                  }
                },
                error => {
                  this.isEmpty = true;
                });
    }

    getValues(url, displayName): Promise<any[]> {
        return this.http.get<any[]>(url)
            .toPromise()
            .then(
                data => {
                    const result = [];
                    if (data.length) {
                        data.forEach(item => {
                            result.push({
                                id: item['id'],
                                value: item[displayName],
                                selected: false
                            });
                        });

                    }
                    return result;
                });
    }

    getPackages(url): Promise<any[]> {
        return this.http.get<any[]>(url)
            .toPromise()
            .then(
                data => {
                    const result = [];
                    if (data.length) {
                        data.forEach(item => {
                            result.push({
                                title: item['display_name'],
                                key: item['id'],
                                isLeaf: true
                            });
                        });
                    }
                    return result;
                })
            .catch();
    }

    nzTabIndexChange(params) {
        this.tabShow = params;
    }
}
