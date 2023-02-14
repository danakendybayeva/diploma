import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormsModule } from '@angular/forms';

import { Store } from '@ngrx/store';
import {BasePageComponent} from '../../../base-page';
import { HttpService } from '../../../../services/http/http.service';
import {IAppState} from '../../../../interfaces/app-state';

import {environment} from '../../../../../environments/environment';
import {map} from 'rxjs/operators';
import {HttpClient} from '@angular/common/http';
import {ActivatedRoute, Router} from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import * as PageActions from '../../../../store/actions/page.actions';
import {Status} from '../../../../interfaces/services/util.service';
import {Topic} from '../../../../interfaces/services/projects/community.service';

@Component({
  selector: 'add-topic',
  templateUrl: './add-topic.component.html',
  styleUrls: ['./add-topic.component.scss']
})
export class AddTopicComponent extends BasePageComponent implements OnInit {
  basicForm: FormGroup;
  succesCode = '';
  errorCode = '';

  apiUrl = '';
  companyId = '';
  id = '';

  topics: Topic[] = [];
  children = false;

  constructor(store: Store<IAppState>, httpSv: HttpService,
              private formBuilder: FormBuilder,
              private http: HttpClient, private router: Router,
              private route: ActivatedRoute,
              private toastr: ToastrService) {
    super(store, httpSv);
    this.pageData = {
      title: 'Topics',
      loaded: true,
      // breadcrumbs: [
      //   {
      //     title: 'link 1',
      //     route: ''
      //   },
      //   {
      //     title: 'Typography'
      //   }
      // ]
    };

    this.companyId = this.route.snapshot.params['companyId'];
    this.id = this.route.snapshot.params['id'];

    this.succesCode = 'Successfully saved!';
    this.errorCode = 'Not saved!';

    this.apiUrl = environment.apiUrl;
  }

  initBasicForm() {
  }

  ngOnInit() {
    super.ngOnInit();
    this.initBasicForm();
    this.getTopics();
  }

  initTable(): void {
    setTimeout(
        () => this.store.dispatch(new PageActions.Update({ loaded: true })),
        0
    );
  }

  addTopic() {
    this.topics.push({ id: '', title: '', children: [], parentId: null, orderNum: 0, hidden: false });
  }

  childrenData() {
    for (let i = 0; i < this.topics.length; i++) {
      if (this.topics[i].parentId == null || this.topics[i].parentId === '') { continue; }
      const itemIndex = this.topics.findIndex(topic => topic.id === this.topics[i].parentId);
      if (this.topics[itemIndex] !== undefined) {
        this.topics[itemIndex].children.push(this.topics[i]);
      }
    }
    for (let i = this.topics.length - 1; i >= 0; i--) {
      if (this.topics[i].parentId != null && this.topics[i].parentId !== '') {
        this.topics.splice(i, 1);
      }
    }
    this.children = true;
  }

  getTopics() {
    this.initTable();
    return this.http.get<Topic[]>(`${environment.apiUrl}/api/project/community/topic/list`)
        .pipe(map(data => {
          return data;
        }))
        .subscribe(data => {
          this.topics = data;
          if (this.topics.length === 0) {
            this.topics.push({ id: '', title: '', children: [], parentId: null, orderNum: 0, hidden: false});
          } else {
            for (let i = 0; i < this.topics.length; i++) {
              this.topics[i].children = [];
              this.topics[i].hidden = true;
            }
          }
          this.childrenData();
        });
  }

  saveGroup() {
    let sUrl = `${environment.apiUrl}/api/project/courses/packages/new`;
    if (this.id && this.id !== '') {
      sUrl = `${environment.apiUrl}/api/project/courses/packages/update`;
    }
    return this.http.post<Status>(sUrl, this.topics)
      .subscribe({
        next: data => {
          if (data.status === 1) {
            this.toastr.success('Saved!', 'Success', { closeButton: true });
          } else {
            this.toastr.error(data.message, 'Error', { closeButton: true });
          }
        },
        error: error => {
          this.toastr.error('Not saved!', 'Error', { closeButton: true });
        }
      });
  }


  deleteCompany() {
    if (this.companyId) {
      this.http.delete<Status>(`${environment.apiUrl}/api/project/courses/packages/delete/${this.companyId}`)
          .subscribe({
            next: data => {
              if (data.status === 1) {
                this.toastr.success(data.message, 'Success', { closeButton: true });
              } else {
                this.toastr.success(data.message, 'Warning', { closeButton: true });
              }
            },
            error: error => {
              this.toastr.error('Not saved!', 'Error', { closeButton: true });
            }
          });
    }
  }

}
