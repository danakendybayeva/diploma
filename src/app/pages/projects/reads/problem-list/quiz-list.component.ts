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
import {Question} from '../../../../interfaces/services/projects/reads.service';

@Component({
  selector: 'reads-quiz-list',
  templateUrl: './quiz-list.component.html',
  styleUrls: ['./quiz-list.component.scss']
})
export class QuizListComponent extends BasePageComponent implements OnInit {
  isNew = true;

  bookId = '';
  typeField = null;

  pageSize = 20;
  pageIndex = 1;
  totalData = 0;
  loading = false;

  questions: Question[] = [];
  children = false;
  sortBy = '';
  sortAD = '';

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
    if (this.route.snapshot.params['bookId']) {
      this.bookId = this.route.snapshot.params['bookId'];
      this.getListQuiz();
    }
  }

  initTable(): void {
    setTimeout(
        () => this.store.dispatch(new PageActions.Update({ loaded: true })),
        0
    );
  }

  getListQuiz() {
    this.initTable();
    this.loading = true;
    this.questions = [];
    return this.http.get<IPageContent>(
        `${environment.apiUrl}/api/project/reads/quiz/list/${this.bookId}?page=${this.pageIndex}&size=${this.pageSize}&sort=${this.sortBy}&sortp=${this.sortAD}`)
        .pipe(map(data => {
          return data;
        }))
        .subscribe(data => {
          this.questions = data.content;
          this.totalData = data.totalElements;
          this.loading = false;
        });
  }

  onChangePageIndex(param) {
    this.pageIndex = param;
    this.getListQuiz();
  }

  onChangeSort(param): void {
    if (param.value != null) {
      this.sortBy = param.key;
      this.sortAD = param.value;
    }
    this.getListQuiz();
  }

  gotoByUrl(urlGoto: string) {
    this.router.navigate([urlGoto]).then(r => {});
  }

}
