import {AfterViewChecked, Component, OnDestroy, OnInit} from '@angular/core';
import {TCExternalEditRecordComponent} from '../../../../reference/external/record/edit-record';
import {environment} from '../../../../../../environments/environment';

@Component({
  selector: 'lg-edit-teacher',
  templateUrl: './edit-group.component.html',
  styleUrls: ['./edit-group.component.scss']
})
export class LGEditGroupComponent extends TCExternalEditRecordComponent implements OnInit, OnDestroy, AfterViewChecked {
  loaded = false;
  url = '';

  ngOnInit() {
    this.referenceId = 'd924aba7-a38b-4688-905d-694511177686';
    this.redirectUrl = '/vertical/lingua/group/view/' + this.recordId;
    this.prepareUrls();
    this.typePage = 'edit';
    this.pageData = {
      title: 'Create Group',
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
}
