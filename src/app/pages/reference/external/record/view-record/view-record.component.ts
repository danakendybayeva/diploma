import {AfterViewChecked, ChangeDetectorRef, Component, ElementRef, Input, OnDestroy, OnInit} from '@angular/core';
import {environment} from '../../../../../../environments/environment';
import {map} from 'rxjs/operators';
import {ViewRecordComponent} from '../../../record/view-record';

@Component({
  selector: 'view-srecord',
  templateUrl: './view-record.component.html',
  styleUrls: ['./view-record.component.scss']
})
export class TCExternalViewRecordComponent extends ViewRecordComponent implements OnInit, OnDestroy, AfterViewChecked {
  responseUrl = '';

  ngOnInit() {
    super.ngOnInit();
  }

  ngOnDestroy() {
    super.ngOnDestroy();
  }

  ngAfterViewChecked() {
    super.ngAfterViewChecked();
  }

  async initRoute() {
    this.fieldsData = await this.fieldService.getReferenceFields(this.referenceId, 'object');
    if (this.route.snapshot.params['id']) {
      this.recordId = this.route.snapshot.params['id'];
      this.responseUrl = this.prepareResponseUrl();
      this.canEdit = await this.fieldService.mayAccessRecord('edit', this.referenceId, this.recordId);
      this.canDelete = await this.fieldService.mayAccessRecord('delete', this.referenceId, this.recordId);
      this.getRecordData('get');
    }
  }

  getRecordData(type: string = 'get') {
    return this.http.get<any>(this.responseUrl)
        .pipe(map(data => {
          return data;
        }))
        .subscribe(data => {
          if (Object.keys(data).length) {
            Object.entries(this.fieldsData).forEach(
                ([key, value]) => {
                  this.fieldsData[key].value = data[key];
                }
            );
            this.fieldsValue = data;
            this.loaded = true;
          } else {
            this.isEmpty = true;
          }
        });
  }

  getEditUrl() {
    return ['/vertical/reference/record/edit', this.referenceId, this.recordId];
  }

  prepareResponseUrl(): string {
    return `${environment.apiUrl}/api/reference/record/get/${this.referenceId}/${this.recordId}`;
  }


}
