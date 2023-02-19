import { Component, OnDestroy, OnInit} from '@angular/core';

import {FolderExtendComponent} from '../../../../reference/external/folder';
import {environment} from '../../../../../../environments/environment';
import {map} from 'rxjs/operators';

@Component({
  selector: 'rd-group-table-list',
  // templateUrl: '../../../../reference/folder/folder.component.html',
  templateUrl: './group-list.component.html',
  styleUrls: ['./group-list.component.scss', '../../../../reference/folder/folder.component.scss'],
})
export class RDGroupListComponent extends FolderExtendComponent implements OnInit, OnDestroy {
  categoryId = '';

  async initRoute() {
    // this.referenceId = 'c7d80924-a18b-4546-9647-4e6436c59e16';
    // this.sectionId = 'e39b21a1-c83f-413e-aace-0654c0b082de';
    this.pageSize = 200;
    this.fastEditEnable = false;
    this.enableFilter = false;
    this.pageData = {
      title: 'Group',
      loaded: true
    };
    this.enableFilter = true;
    this.fixPage = true;
    this.getListRefRecord();
  }

  async getListRefRecord() {
    this.loading = true;
    this.initTable();
    return this.http.get<any[]>(`${environment.apiUrl}/api/project/reading/group/list`)
        .pipe(map(data => {
          return data;
        }))
        .subscribe(data => {
          if (data.length) {
            this.dataRecord = data;
            this.loading = false;
          } else {
            this.isEmpty = true;
          }
          this.loading = false;
        });
  }

  mapToString(data: any[]): string {
    const result = [];
    if (data && data.length) {
      data.forEach(item => {
        if (item['value']) {
          result.push(item['value'].toString());
        }
      });
    }

    return result.join(', ');
  }

  prepareNavigateLink(id) {
    return ['/vertical/reading/group/period-list', id];
  }
}
