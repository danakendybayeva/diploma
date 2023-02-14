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

@Component({
  selector: 'list-reference',
  templateUrl: './list-reference.component.html',
  styleUrls: ['./list-reference.component.scss']
})
export class ListReferenceComponent extends BasePageComponent implements OnInit {
  isNew = true;

  referenceId = '';
  typeField = null;

  pageSize = 10;
  pageIndex = 1;
  loading = false;

  references: IReference[] = [];

  constructor(store: Store<IAppState>, httpSv: HttpService,
              private formBuilder: FormBuilder,
              private http: HttpClient, private router: Router,
              private route: ActivatedRoute,
              private toastr: ToastrService,
              private fieldService: FieldService
  ) {
    super(store, httpSv);
    this.pageData = {
      title: 'Справочник',
      loaded: true
    };
    this.loading = true;
  }

  ngOnInit() {
    super.ngOnInit();
    if (this.route.snapshot.params['referenceId']) {
      this.referenceId = this.route.snapshot.params['referenceId'];
      this.isNew = false;
      console.log(this.referenceId);
    }
    if (this.route.snapshot.params['typeField']) {
      this.typeField = this.route.snapshot.params['typeField'];
    }

    this.getListReference();
  }

  initTable(): void {
    setTimeout(
        () => this.store.dispatch(new PageActions.Update({ loaded: true })),
        0
    );
  }

  getListReference() {
    this.initTable();
    return this.http.get<IPageContent>(`${environment.apiUrl}/api/reference/list?page=1&size=20`)
        .pipe(map(data => {
          return data;
        }))
        .subscribe(data => {
          this.references = data.content;
          this.loading = false;
        });
  }

  onChangePageIndex(param) {
    console.log(param);
  }

  onChangeSort(param): void {
    console.log(param);
  }

  gotoByUrl(urlGoto: string) {
    this.router.navigate([urlGoto]).then(r => {});
  }

}
