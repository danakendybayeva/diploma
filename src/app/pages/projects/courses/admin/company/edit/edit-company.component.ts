import {AfterViewChecked, ChangeDetectorRef, Component, OnDestroy, OnInit} from '@angular/core';

import {environment} from '../../../../../../../environments/environment';
import {CompanyFields} from '../../../../../../interfaces/services/projects/courses.service';
import {TCExternalEditRecordComponent} from '../../../../../reference/external/record/edit-record';
import {map} from 'rxjs/operators';

@Component({
  selector: 'edit-company',
  templateUrl: './edit-company.component.html',
  styleUrls: ['./edit-company.component.scss']
})
export class EditCompanyComponent extends TCExternalEditRecordComponent implements OnInit, OnDestroy, AfterViewChecked {
  loaded = false;
  url = '';
  postImage = environment.apiUrl + '/api/project/course/media/request-file/image';
  getImageUrl = environment.apiUrl + '/api/project/course/media/';

  ngOnInit() {
    this.createPost = `${environment.apiUrl}/api/project/course/company/new`;
    this.editPost = `${environment.apiUrl}/api/project/course/company/edit`;
    this.fieldsData = CompanyFields;
    this.typePage = 'edit';
    this.pageData = {
      title: 'Create Company',
      loaded: true
    };
    super.ngOnInit();
  }

  ngOnDestroy() {
    super.ngOnDestroy();
  }

  ngAfterViewChecked() {
    super.ngAfterViewChecked();
  }

  getRecordData(type: string = 'get') {
    return this.http.get<any>(`${environment.apiUrl}/api/project/course/company/get/${this.recordId}`)
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
}
