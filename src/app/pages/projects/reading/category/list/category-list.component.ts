import { Component, OnDestroy, OnInit} from '@angular/core';

import {FolderExtendComponent} from '../../../../reference/external/folder';

@Component({
  selector: 'category-table-list',
  templateUrl: '../../../../reference/folder/folder.component.html',
  styleUrls: ['./category-list.component.scss', '../../../../reference/folder/folder.component.scss'],
})
export class CategoryListComponent extends FolderExtendComponent implements OnInit, OnDestroy {
  ngOnInit() {
    this.pageSize = 30;
    this.fastEditEnable = false;
    this.enableFilter = false;
    this.pageData = {
      title: 'Menu Category',
      loaded: true
    };
    super.ngOnInit();
  }
  async initRoute() {
    this.referenceId = '340d4a62-69d7-4856-87d4-e27817c1e891';
    this.sectionId = 'f7cb9db9-b433-4496-ac51-fdfb4a40e19e';
    this.enableFilter = false;
    this.fixPage = true;
    await super.initRoute();
  }

  prepareNavigateLink(id) {
    return ['/vertical/reading/book/list', id];
  }
}
