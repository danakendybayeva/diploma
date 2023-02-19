import { Component, OnDestroy, OnInit} from '@angular/core';

import {FolderExtendComponent} from '../../../../reference/external/folder';
import {environment} from '../../../../../../environments/environment';
import {IPageContent} from '../../../../../interfaces/services/page/page-content';
import {map} from 'rxjs/operators';

@Component({
  selector: 'rd-period-table-list',
  // templateUrl: '../../../../reference/folder/folder.component.html',
  templateUrl: './period-list.component.html',
  styleUrls: ['./period-list.component.scss', '../../../../reference/folder/folder.component.scss'],
})
export class RDPeriodListComponent extends FolderExtendComponent implements OnInit, OnDestroy {
  groupId = '';

  async initRoute() {
    // this.referenceId = 'c7d80924-a18b-4546-9647-4e6436c59e16';
    // this.sectionId = 'e39b21a1-c83f-413e-aace-0654c0b082de';
    this.pageSize = 200;

    this.enableFilter = true;
    this.fixPage = true;

    if (this.route.snapshot.params['groupId']) {
      this.groupId = this.route.snapshot.params['groupId'];
    }

    this.getListRefRecord();
  }

  async getListRefRecord() {
    this.loading = true;
    this.initTable();
    return this.http.get<any[]>(`${environment.apiUrl}/api/project/reading/period/list`)
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
    return ['/vertical/reading/group/vote-book', this.groupId, id];
  }
}
