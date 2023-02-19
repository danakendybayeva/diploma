import {AfterViewChecked, Component, Input, OnDestroy, OnInit} from '@angular/core';
import {map} from 'rxjs/operators';
import {ViewRecordComponent} from '../../../../reference/record/view-record';
import {CompanyFields, TeacherFields} from '../../../../../interfaces/services/projects/courses.service';
import {environment} from '../../../../../../environments/environment';

@Component({
  selector: 'view-teacher',
  templateUrl: '../../../../reference/record/view-record/view-record.component.html',
  styleUrls: ['./view-teacher.component.scss', '../../../../reference/record/view-record/view-record.component.scss']
})
export class ViewTeacherComponent extends ViewRecordComponent implements OnInit, OnDestroy, AfterViewChecked {

  ngOnInit() {
    this.postImage = environment.apiUrl + '/api/project/course/media/request-file/image';
    this.getImageUrl = environment.apiUrl + '/api/project/course/media/';
    super.ngOnInit();
  }

  ngOnDestroy() {
    super.ngOnDestroy();
  }

  ngAfterViewChecked() {
    super.ngAfterViewChecked();
  }

  async initRoute() {
    // this.urlPath = this.route.snapshot.url;
    // if (this.route.snapshot.params['referenceId']) {
    //   this.referenceId = this.route.snapshot.params['referenceId'];
    //   this.fieldsData = await this.fieldService.getReferenceFields(this.referenceId);
    //   if (this.route.snapshot.params['recordId']) {
    //     this.recordId = this.route.snapshot.params['recordId'];
    //     this.getRecordData('get');
    //   }
    //   super.ngOnInit();
    // }


    this.fieldsData = this.fieldService.getAllFields(TeacherFields, '{}');
    if (this.route.snapshot.params['id']) {
      this.recordId = this.route.snapshot.params['id'];
      this.getRecordData('get');
    }
  }

  getRecordData(type: string = 'get') {
    return this.http.get<any>(`${environment.apiUrl}/api/project/course/teacher/get/${this.recordId}`)
        .pipe(map(data => {
          return data;
        }))
        .subscribe(data => {
          this.fieldsData.forEach(item => {
            item.value = data[item.id];
          });
          this.loaded = true;
        });
  }

  getEditUrl() {
    return ['/vertical/courses/admin/teacher/edit', this.recordId];
  }

  // removeRecord(referenceId: string, recordId: string) {
  //   return this.http.post<Status>(`${environment.apiUrl}/api/reference/record/remove/${this.referenceId}/${this.recordId}`,
  //       this.fieldsValue)
  //       .subscribe({
  //         next: data => {
  //           if (data.status === 1) {
  //             this.toastr.success(data.message, 'Success', { closeButton: true });
  //             this.router.navigate(['/vertical/reference/record/list', this.referenceId]).then(r => {});
  //           } else {
  //             this.toastr.error(data.message, 'Error', { closeButton: true });
  //           }
  //         },
  //         error: error => {
  //           this.toastr.error('Not saved!', 'Error', { closeButton: true });
  //         }
  //       });
  // }

}
