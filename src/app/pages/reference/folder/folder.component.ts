import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';

import { Store } from '@ngrx/store';
import {BasePageComponent} from '../../base-page';
import { HttpService } from '../../../services/http/http.service';
import {IAppState} from '../../../interfaces/app-state';

import {HttpClient, HttpParams} from '@angular/common/http';
import {ActivatedRoute, Params, Router} from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import * as PageActions from '../../../store/actions/page.actions';
import {environment} from '../../../../environments/environment';
import {map} from 'rxjs/operators';
import {IReference} from '../../../interfaces/services/reference/reference';
import {IPageContent} from '../../../interfaces/services/page/page-content';
import {FieldService} from '../../../interfaces/services/reference/field.service';
import {Util} from '../../../interfaces/services/util.service';
import {IFieldSB} from '../../../interfaces/services/reference/fields/field-sidebar';

@Component({
  selector: 'tc-folder',
  templateUrl: './folder.component.html',
  styleUrls: ['./folder.component.scss']
})
export class TCFolderComponent extends BasePageComponent implements OnInit {
  referenceId = '';
  sectionId = '';

  pageSize = 30;
  pageIndex = 1;
  totalData = 0;
  loading = false;
  totalPages = 0;
  isLast = false;

  dataRecord: any[] = [];
  headerRecord: any = {};
  checkData = [];
  hasCheck = false;

  loadingAuto = false;
  routeSnapshot = '';
  queryParams: any = {};

  constructor(store: Store<IAppState>, httpSv: HttpService,
              private formBuilder: FormBuilder,
              private http: HttpClient, private router: Router,
              private route: ActivatedRoute,
              private toastr: ToastrService,
              private fieldService: FieldService
  ) {
    super(store, httpSv);
    this.pageData = {
      title: 'Справочник список',
      loaded: true
    };
    this.loading = true;
    this.routeSnapshot = route.snapshot['_routerState'].url;
    const urlTree = this.router.parseUrl(this.routeSnapshot);
    this.routeSnapshot = urlTree.root.children['primary'].segments.map(it => it.path).join('/');
  }

  ngOnInit() {
    super.ngOnInit();
    if (this.route.snapshot.params['referenceId']) {
      this.referenceId = this.route.snapshot.params['referenceId'];

      if (this.route.snapshot.params['sectionId']) {
        this.sectionId = this.route.snapshot.params['sectionId'];
      }
      this.route.queryParams.subscribe(param => {
        this.queryParams = param;
        if (this.queryParams['page'] && this.queryParams['page'] > 0) {
          this.pageIndex = this.queryParams['page'];
        }
      });

      this.renderQueryParams(this.queryParams);

      this.getListRefRecord();
      //TODO dorabotat
      this.hasCheck = true;
    }
  }

  initTable(): void {
    setTimeout(
        () => this.store.dispatch(new PageActions.Update({ loaded: true })),
        0
    );
  }

  getListRefRecord() {
    let url = `${environment.apiUrl}/api/reference/record/list/${this.referenceId}` +
        `?page=${this.pageIndex}&size=${this.pageSize}&customised=true`;
    if (this.sectionId) {
      url = `${environment.apiUrl}/api/reference/section/list/${this.referenceId}/${this.sectionId}` +
          `?page=${this.pageIndex}&size=${this.pageSize}${this.prepareParamsFields()}`;
    }
    this.loading = true;

    this.initTable();
    return this.http.get<IPageContent>(url)
        .pipe(map(data => {
          return data;
        }))
        .subscribe(data => {
          if (data.size > 0) {
            this.headerRecord = this.prepareCustomFilter(data.content[0].header);
            this.dataRecord = data.content.splice(1);
            this.checkData = new Array(this.dataRecord.length).fill(false);
            this.totalData = data.totalElements;
            this.totalPages = data.totalPages;
            this.isLast = data.last;
          }
          this.loading = false;
        });
  }

  onChangePageIndex(param) {
    this.pageIndex = param;
    this.loading = true;
    this.getListRefRecord();
    this.renderQueryParams({page: this.pageIndex});
  }

  onChangeSort(param): void {
    console.log(param);
  }

  updateFilter(field: string, value: any): void {
    const fieldParam = {};
    fieldParam[field] = encodeURI(value);
    this.renderQueryParams(fieldParam);
    this.pageIndex = 1;
    this.getListRefRecord();
  }

  changeDefaultAuto(index) {
    const wordSearch = this.headerRecord[index]['filterValue'];
    if (this.headerRecord[index]['filterValue'].length > 2) {
      this.loadingAuto = true;
    }
    setTimeout(() => {
      if (wordSearch === this.headerRecord[index]['filterValue']) {
        if (this.headerRecord[index]['filterValue'] && this.headerRecord[index]['filterValue'].length > 2) {
          this.getListAutocomplete(index);
        }
      }
    }, 900);
  }

  getListAutocomplete(index) {
    const fields = [this.headerRecord[index].id];
    const templateView = '{' + this.headerRecord[index].title + '}';
    return this.http.get<any[]>(`${environment.apiUrl}/api/reference/section/get/autocomplete/${this.referenceId}/${this.sectionId}` +
        `?value=${encodeURI(this.headerRecord[index]['filterValue'])}&fields=${encodeURI(fields.join(','))}&template=${encodeURI(templateView)}`, {params: this.queryParams})
        .pipe(map(data => {
          if (!this.headerRecord[index]['autoValues']) {
            this.headerRecord[index]['autoValues'] = [];
          }
          this.headerRecord[index]['autoValues'] = Util.getUnique(this.headerRecord[index]['autoValues'].concat(data), 'value');
          return data;
        }))
        .subscribe(data => {
          this.loadingAuto = false;
        });
  }

  changeDefaultAutoSelected(event) {

  }

  prepareCustomFilter(data: any[]): any[] {
    data.forEach(item => {
      // switch (item.type) {
      //   case 'string':
      //   case 'reference':
      //     item['autoValues'] = [];
      //     item['filterValue'] = '';
      //     break;
      // }
      item['autoValues'] = [];
      item['filterValue'] = '';
    });
    console.log(data);
    return data;
  }

  renderQueryParams(queryParams: Params) {
    const keys = Object.keys(queryParams);
    const keys2 = Object.keys(this.queryParams);
    const param = {};
    keys2.forEach(item => {
      param[item] = this.queryParams[item];
    });

    keys.forEach(item => {
      param[item] = queryParams[item];
    });
    this.queryParams = param;
    this.router.navigate([this.routeSnapshot], {
      queryParams: this.queryParams
    }).then(r => {});
  }

  prepareParamsFields(): string {
    const keys = Object.keys(this.queryParams);
    const arr = ['page', 'sort'];
    let result = '';
    keys.forEach(item => {
      if (!arr.includes(item)) {
        result += `&${item}=${this.queryParams[item]}`;
      }
    });
    return result;
  }
}
