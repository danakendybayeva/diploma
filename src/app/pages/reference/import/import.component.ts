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
import {Status, Util} from '../../../interfaces/services/util.service';
import {IFieldSB} from '../../../interfaces/services/reference/fields/field-sidebar';
import {IOption} from '../../../ui/interfaces/option';
import {Observable, Observer} from 'rxjs';
import {NzMessageService} from 'ng-zorro-antd/message';
import {StudentCsv} from '../../../interfaces/services/student.service';

@Component({
  selector: 'tc-reference-import',
  templateUrl: './import.component.html',
  styleUrls: ['./import.component.scss']
})
export class TCImportComponent extends BasePageComponent implements OnInit {
  referenceId = '';

  pageSize = 30;
  pageIndex = 1;
  totalData = 0;
  loading = false;
  totalPages = 0;
  isLast = false;

  dataRecord: any[] = [];
  headerRecord: any = {};
  fieldSelected: any[] = [];
  fieldsOption: IOption[] = [];
  checkData = [];
  hasCheck = false;
  headerEnable = true;

  loadingAuto = false;
  routeSnapshot = '';
  queryParams: any = {};
  apiUrl = '';
  separator = ',';

  constructor(store: Store<IAppState>, httpSv: HttpService,
              private formBuilder: FormBuilder,
              private http: HttpClient, private router: Router,
              private route: ActivatedRoute,
              private toastr: ToastrService,
              private fieldService: FieldService,
              private msg: NzMessageService
  ) {
    super(store, httpSv);
    this.pageData = {
      title: 'Справочник список',
      loaded: true
    };
    this.loading = false;
    this.routeSnapshot = route.snapshot['_routerState'].url;
    const urlTree = this.router.parseUrl(this.routeSnapshot);
    this.routeSnapshot = urlTree.root.children['primary'].segments.map(it => it.path).join('/');

    this.apiUrl = environment.apiUrl;
  }

  ngOnInit() {
    super.ngOnInit();
    if (this.route.snapshot.params['referenceId']) {
      this.referenceId = this.route.snapshot.params['referenceId'];

      this.route.queryParams.subscribe(param => {
        this.queryParams = param;
        if (this.queryParams['page'] && this.queryParams['page'] > 0) {
          this.pageIndex = this.queryParams['page'];
        }
      });

      this.renderQueryParams(this.queryParams);
      this.getFields();
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

  getFields() {
    return this.http.get<any[]>(`${environment.apiUrl}/api/reference/get-fields/${this.referenceId}`)
        .pipe(map(data => {
          this.initTable();
          const field = [];
          Object.keys(data).map(function (key) {
            const res = {
              value: key,
              label: data[key]['title'],
              orderNum: data[key]['orderNum']
            };
            field.push(res);
          });
          this.fieldsOption = field.sort((a, b) => (a.orderNum > b.orderNum) ? 1 : -1);
          return data;
        }))
        .subscribe(data => {
          this.loadingAuto = false;
        });
  }

  onChangePageIndex(param) {
    this.pageIndex = param;
    this.loading = true;
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
    return this.http.get<any[]>(`${environment.apiUrl}/api/reference/record/get/autocomplete/${this.referenceId}` +
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

  beforeUpload = (file: File) => {
    return new Observable((observer: Observer<boolean>) => {
      const isCSV = file.type === 'text/csv';
      if (!isCSV) {
        this.msg.error('You can only upload CSV file!');
        observer.complete();
        return;
      }

      const isLt2M = file.size / 1024 / 1024 < 2;
      if (!isLt2M) {
        this.msg.error('File must smaller than 2MB!', {nzDuration: 2000});
        observer.complete();
        return;
      }

      observer.next(isCSV && isLt2M);
      observer.complete();
    });
  }

  handleChangeUpload({ file, fileList }: { [key: string]: any })  {
    const status = file.status;
    this.loading = true;
    if (status !== 'uploading') {}
    if (status === 'done') {
      this.msg.success(`${file.name} file uploaded successfully.`, {nzDuration: 2000});
      const reader = new FileReader();
      reader.readAsText(file.originFileObj);
      reader.addEventListener('load', () => {
        const res = reader.result.toString().split('\n');
        // const resultsKey: StudentCsv;
        // tslint:disable-next-line:prefer-const
        const res2: any[] = [];

        let headers = [];
        this.dataRecord = [];
        let i = 0;
        res.forEach(obj => {

          if (i === 0 && this.headerEnable) {
            headers = obj.toString().split(this.separator);
          } else {
            const res3 = obj.toString().split(this.separator);
            res2.push(res3);
          }
          i++;
        });
        this.headerRecord = headers;
        this.dataRecord = res2;
        this.fieldSelected = new Array(this.headerRecord.length);

        this.loading = false;
      }, false);

    } else if (status === 'error') {
      this.msg.error(`${file.name} file upload failed.`, {nzDuration: 2000});
    }
  }

  changeSelect(event, index) {
    const fSelected = [];
    this.fieldSelected.forEach(obj => {
      if (obj) {
        fSelected.push(obj);
      }
    });
    this.fieldsOption.forEach(obj => {
      obj.disabled = false;
      if (fSelected.includes(obj.value)) {
        obj.disabled = true;
      }
    });
  }

  saveRecord() {
    const values: any[] = [];
    this.dataRecord.forEach(item => {
      const one = {};
      this.fieldSelected.forEach((key, index) => {
        if (key) {
          one[key] = item[index];
        }
      });
      values.push(one);
    });
    this.loading = true;
    return this.http.post<Status>(`${environment.apiUrl}/api/reference/record/import/record/${this.referenceId}`, values)
        .subscribe({
          next: data => {
            if (data.status === 1) {
              this.toastr.success(data.message, 'Success', { closeButton: true });
            } else {
              this.toastr.error(data.message, 'Error', { closeButton: true });
            }
            this.loading = false;
          },
          error: error => {
            this.toastr.error('Not saved!', 'Error', { closeButton: true });
            this.loading = false;
          }
        });
  }
}
