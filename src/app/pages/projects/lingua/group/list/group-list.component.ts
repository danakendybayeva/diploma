import { Component, OnDestroy, OnInit} from '@angular/core';

import {FolderExtendComponent} from '../../../../reference/external/folder';
import {environment} from '../../../../../../environments/environment';
import {map} from 'rxjs/operators';

@Component({
  selector: 'lg-group-table-list',
  templateUrl: '../../../../reference/folder/folder.component.html',
  styleUrls: ['./group-list.component.scss', '../../../../reference/folder/folder.component.scss'],
})
export class LGGroupListComponent extends FolderExtendComponent implements OnInit, OnDestroy {

  ngOnInit() {
    this.pageData = {
      title: 'Lingua Group List',
      loaded: true
    };
    super.ngOnInit();
  }

  async initRoute() {
    this.referenceId = 'd924aba7-a38b-4688-905d-694511177686';
    this.sectionId = 'e82e6607-6a0f-48e8-a822-8eacf3a8fb76';
    this.pageSize = 1000000;

    this.enableFilter = true;
    this.fixPage = true;
    this.getListRefRecord();
    this.canAdd = await this.fieldService.mayAccessRecord('add', this.referenceId);
  }

  async getListRefRecord() {
    this.loading = true;
    this.initTable();
    this.headerRecord = this.prepareCustomFilter(await this.fieldService.getHeaderFields(this.referenceId, this.sectionId));
    return this.http.get<any[]>(`${environment.apiUrl}/api/project/lingua/group/list`)
        .pipe(map(data => {
          return data;
        }))
        .subscribe(data => {
          if (data.length) {
            this.dataRecord = data;
            this.checkData = new Array(this.dataRecord.length).fill(false);
            this.totalData = this.dataRecord.length;
            this.loading = false;
          } else {
            this.isEmpty = true;
          }
          this.loading = false;
        });
  }

  prepareNavigateLink(id) {
    return ['/vertical/lingua/group/view', id];
  }
}
