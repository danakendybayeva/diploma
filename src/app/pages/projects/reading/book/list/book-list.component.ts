import { Component, OnDestroy, OnInit} from '@angular/core';

import {FolderExtendComponent} from '../../../../reference/external/folder';
import {environment} from '../../../../../../environments/environment';
import {IPageContent} from '../../../../../interfaces/services/page/page-content';
import {map} from 'rxjs/operators';

@Component({
  selector: 'book-table-list',
  // templateUrl: '../../../../reference/folder/folder.component.html',
  templateUrl: './book-list.component.html',
  styleUrls: ['./book-list.component.scss', '../../../../reference/folder/folder.component.scss'],
})
export class BookListComponent extends FolderExtendComponent implements OnInit, OnDestroy {
  categoryId = '';

  ngOnInit() {
    this.pageSize = 30;
    this.fastEditEnable = false;
    this.enableFilter = false;
    this.pageData = {
      title: 'Book List',
      loaded: true
    };
    super.ngOnInit();
  }
  async initRoute() {
    this.referenceId = 'c7d80924-a18b-4546-9647-4e6436c59e16';
    this.sectionId = 'e39b21a1-c83f-413e-aace-0654c0b082de';
    this.pageSize = 200;
    if (this.route.snapshot.params['categoryId']) {
      this.categoryId = this.route.snapshot.params['categoryId'];
      switch (this.categoryId) {
        case '06d691bb-bded-4a07-ba2e-1e3ed2153b3b':
          this.sectionId = 'a52b4616-c4ca-455f-89a5-77ae4a5387b6';
          break;
        case '349c838a-3b5b-4c9c-93e0-98e485ef000a':
          this.sectionId = '56145643-a99b-4cd0-81fd-eeed66a4fe03';
          break;
        case '7fd0f14e-bc3a-4362-bc84-a5ea385e40b3':
          this.sectionId = 'b0fe5731-614b-4d8c-816b-4cb749588e8f';
          break;
        case '103f3b93-22aa-4261-947d-9698ed431cfa':
          this.sectionId = '12af6efc-cd8b-4e7b-a041-628523700ce2';
          break;
      }
    }

    this.enableFilter = true;
    this.fixPage = true;

    if (this.route.snapshot.params['categoryId']) {
      this.categoryId = this.route.snapshot.params['categoryId'];
    }
    this.pageData = {
      title: 'Book List',
      loaded: true
    };
    await super.initRoute();
  }

  async getListRefRecord() {
    this.loading = true;
    let url = `${environment.apiUrl}/api/project/reading/books/list?s=${this.searchValue}`;
    if (this.categoryId) {
      url = `${environment.apiUrl}/api/project/reading/books/list/category/${this.categoryId}?s=${this.searchValue}`;
    }
    this.initTable();
    return this.http.get<any[]>(url)
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
}
