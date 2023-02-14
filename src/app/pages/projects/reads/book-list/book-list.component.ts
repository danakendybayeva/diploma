import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';

import { Store } from '@ngrx/store';
import {BasePageComponent} from '../../../base-page';
import { HttpService } from '../../../../services/http/http.service';
import {IAppState} from '../../../../interfaces/app-state';

import {HttpClient} from '@angular/common/http';
import {ActivatedRoute, Router} from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import * as PageActions from '../../../../store/actions/page.actions';
import {environment} from '../../../../../environments/environment';
import {map} from 'rxjs/operators';
import {IPageContent} from '../../../../interfaces/services/page/page-content';
import {FieldService} from '../../../../interfaces/services/reference/field.service';
import {Questions, Topic} from '../../../../interfaces/services/projects/community.service';
import {Book} from '../../../../interfaces/services/projects/reads.service';

@Component({
  selector: 'reads-book-list',
  templateUrl: './book-list.component.html',
  styleUrls: ['./book-list.component.scss']
})
export class BookListComponent extends BasePageComponent implements OnInit {
  isNew = true;

  referenceId = '';
  typeField = null;

  pageSize = 20;
  pageIndex = 1;
  totalData = 0;
  loading = false;

  topicIds = [];
  relatedTopics = [];
  topicList: Topic[] = [];

  books: Book[] = [];
  children = false;
  searchBook = '';

  constructor(store: Store<IAppState>, httpSv: HttpService,
              private formBuilder: FormBuilder,
              private http: HttpClient, private router: Router,
              private route: ActivatedRoute,
              private toastr: ToastrService,
              private fieldService: FieldService
  ) {
    super(store, httpSv);
    this.pageData = {
      title: 'Problems List',
      loaded: true
    };
  }

  ngOnInit() {
    super.ngOnInit();
    this.getListBooks();
  }

  initTable(): void {
    setTimeout(
        () => this.store.dispatch(new PageActions.Update({ loaded: true })),
        0
    );
  }

  getListBooks() {
    this.initTable();
    this.loading = true;
    this.books = [];
    return this.http.get<IPageContent>(`${environment.apiUrl}/api/project/mdsreads/books/list/table?page=${this.pageIndex}&size=${this.pageSize}`)
        .pipe(map(data => {
          return data;
        }))
        .subscribe(data => {
          this.books = data.content;
          this.totalData = data.totalElements;
          this.loading = false;
        });
  }

  onChangePageIndex(param) {
    this.pageIndex = param;
    this.getListBooks();
  }

  onChangeSort(param): void {
    console.log(param);
  }

  gotoByUrl(urlGoto: string) {
    this.router.navigate([urlGoto]).then(r => {});
  }

  onChangeTree($event: string): void {
    console.log(this.topicIds);
  }

}
