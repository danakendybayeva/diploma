import {AfterViewChecked, ChangeDetectorRef, Component, OnDestroy, OnInit} from '@angular/core';

import {environment} from '../../../../../../../environments/environment';
import {ModuleFields} from '../../../../../../interfaces/services/projects/courses.service';
import {TCExternalEditRecordComponent} from '../../../../../reference/external/record/edit-record';
import {map} from 'rxjs/operators';
import {NzFormatEmitEvent} from 'ng-zorro-antd';

@Component({
  selector: 'edit-module',
  templateUrl: './edit-module.component.html',
  styleUrls: ['./edit-module.component.scss']
})
export class EditModuleComponent extends TCExternalEditRecordComponent implements OnInit, OnDestroy, AfterViewChecked {
    loaded = false;
    url = '';
    postImage = environment.apiUrl + '/api/project/course/media/request-file/image';
    getImageUrl = environment.apiUrl + '/api/project/course/media/';
    tabShow = 0;
    recordId = null;

    nzEvent(event: NzFormatEmitEvent): void {
        console.log(event);
    }

    ngOnInit() {
        this.loaded = false;
        this.createPost = `${environment.apiUrl}/api/project/course/module/new`;
        this.editPost = `${environment.apiUrl}/api/project/course/module/edit`;
        this.fieldsData = ModuleFields;
        this.typePage = 'edit';
        this.pageData = {
          title: 'Create Module',
          loaded: true
        };
        super.ngOnInit();
        this.labelForm.addControl('video_progression_mode', this.formBuilder.control(null, []));
        this.redirectUrl = '/vertical/courses/admin/course/module/edit';
    }

    ngOnDestroy() {
        super.ngOnDestroy();
    }

    ngAfterViewChecked() {
        super.ngAfterViewChecked();
    }

    getRecordData(type) {
        return this.http.get<any>(`${environment.apiUrl}/api/project/course/module/get/${this.recordId}`)
            .pipe(map(data => {
              return data;
            }))
            .subscribe(
                data => {
                  if (Object.keys(data).length) {
                    Object.entries(this.fieldsData).forEach(
                        ([key, value]) => {
                          this.fieldsData[key].value = data[key];
                        }
                    );
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
