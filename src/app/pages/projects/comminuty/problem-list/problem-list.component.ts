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
import {IReference} from '../../../../interfaces/services/reference/reference';
import {IPageContent} from '../../../../interfaces/services/page/page-content';
import {FieldService} from '../../../../interfaces/services/reference/field.service';
import {Questions, Topic} from '../../../../interfaces/services/projects/community.service';

@Component({
  selector: 'community-problem-list',
  templateUrl: './problem-list.component.html',
  styleUrls: ['./problem-list.component.scss']
})
export class ProblemListComponent extends BasePageComponent implements OnInit {
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

  questions: Questions[] = [];
  children = false;

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
    this.getListQuiz();
    this.openTopicList();
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
    return this.http.get<IPageContent>(`${environment.apiUrl}/api/project/community/questions/list?page=${this.pageIndex}&size=${this.pageSize}`)
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
    console.log(param);
  }

  gotoByUrl(urlGoto: string) {
    this.router.navigate([urlGoto]).then(r => {});
  }

  openTopicList() {
    if (!this.children) {
      return this.http.get<Topic[]>(`${environment.apiUrl}/api/project/community/topic/list`)
          .pipe(map(data => {
            return data;
          }))
          .subscribe(data => {
            this.topicList = data;
            if (this.topicList.length === 0) {
              this.topicList.push({ id: '', title: '', key: '', children: [], parentId: null, orderNum: 0, hidden: false});
            } else {
              for (let i = 0; i < this.topicList.length; i++) {
                this.topicList[i].children = [];
                this.topicList[i].hidden = true;
                this.topicList[i].key = this.topicList[i].id;
              }
            }
            this.childrenData();
          });
    }
  }

  childrenData() {
    for (let i = 0; i < this.topicList.length; i++) {
      if (this.topicList[i].parentId == null || this.topicList[i].parentId === '') { continue; }
      const itemIndex = this.topicList.findIndex(topic => topic.id === this.topicList[i].parentId);
      if (this.topicList[itemIndex] !== undefined) {
        this.topicList[itemIndex].children.push(this.topicList[i]);
      }
    }
    for (let i = this.topicList.length - 1; i >= 0; i--) {
      if (this.topicList[i].parentId != null && this.topicList[i].parentId !== '') {
        this.topicList.splice(i, 1);
      }
    }
    this.children = true;
  }

  onChangeTree($event: string): void {
    console.log(this.topicIds);
  }

}
