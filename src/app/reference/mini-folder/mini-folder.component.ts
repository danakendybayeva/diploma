import {Component, EventEmitter, forwardRef, Input, OnChanges, OnInit, Output} from '@angular/core';
import {FormBuilder, NG_VALUE_ACCESSOR, Validators} from '@angular/forms';

import { Store } from '@ngrx/store';
import {BasePageComponent} from '../../pages/base-page';
import { HttpService } from '../../services/http/http.service';
import {IAppState} from '../../interfaces/app-state';
import {HttpClient} from '@angular/common/http';
import {ActivatedRoute, Router} from '@angular/router';
import * as PageActions from '../../store/actions/page.actions';
import {environment} from '../../../environments/environment';
import {find, map} from 'rxjs/operators';
import {IPageContent} from '../../interfaces/services/page/page-content';

@Component({
  selector: 'tc-mini-folder-ref',
  templateUrl: './mini-folder.component.html',
  styleUrls: ['./mini-folder.component.scss']
})
export class TCMiniFolderRefComponent extends BasePageComponent implements OnInit, OnChanges {
  data: any[];

  @Input() referenceId = '';
  @Input() referenceTitle = '';
  @Input() fields = [];
  // TODO Sort field
  @Input() sortField = [];
  @Input() records = [];
  @Input() isSingle = false;
  @Input() limit = 0;
  @Output() public selectedItem: EventEmitter<any[]> = new EventEmitter();
  selectedItems = [];
  selectedIds = [];

  searchValue = '';
  pageSize = 20;
  pageIndex = 1;
  loading = false;
  totalData = 0;
  totalPages = 0;
  selItem = [];

  headerRecord: any = {};
  checkData = [];
  hasCheck = false;

  constructor(store: Store<IAppState>, httpSv: HttpService,
              private formBuilder: FormBuilder,
              private http: HttpClient, private router: Router,
              private route: ActivatedRoute
  ) {
    super(store, httpSv);
    this.data = [];
    this.pageData = {
      title: '',
      loaded: true
    };
    this.loading = true;
  }

  ngOnInit() {
    super.ngOnInit();
  }

  ngOnChanges(changes) {
    if (changes.records && this.records) {
      const sIds = [];
      this.selectedItems = this.records;
      this.records.forEach(obj => {
        sIds.push(obj.id);
      });
      this.selectedIds = sIds;
    }
    if (changes.referenceId && this.referenceId) {
      this.getSelectedRecord();
      this.getListRefRecord();
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
    this.initTable();
    return this.http.get<IPageContent>(`${environment.apiUrl}/api/reference/record/list/${this.referenceId}` +
        `?page=${this.pageIndex}&size=${this.pageSize}&customised=false&fields=${this.fields.join(',')}`)
        .pipe(map(data => {
          return data;
        }))
        .subscribe(data => {
          if (data.size > 0) {
            this.headerRecord = data.content[0];
            this.data = data.content.splice(1);
            this.checkData = new Array(this.data.length).fill(false);
            this.data.forEach((item, key) => {
              if (this.selectedIds.includes(item.id)) {
                this.checkData[key] = true;
                this.updateInfoSelected(item);
              }
            });
            this.totalData = data.totalElements;
            this.totalPages = data.totalPages;
          }
          this.loading = false;
        });
  }

  getSelectedRecord() {
    this.initTable();
    return this.http.get<any[]>(`${environment.apiUrl}/api/reference/record/get/selected/${this.referenceId}` +
        `?fields=${this.fields.join(',')}&rec=${this.selectedIds.join(',')}`)
        .pipe(map(data => {
          return data;
        }))
        .subscribe(data => {
          const result = [];
          this.selectedItems.forEach(obj => {
            const findIndex = data.findIndex(function (o) {
              return o.id === obj.id;
            });
            result.push(data[findIndex]);
          });
          this.selectedItems = result;
          this.selectedItem.emit(this.selectedItems);
        });
  }

  updateInfoSelected(item: any) {
    // this.selectedItems.push(item);
  }

  onChangePageIndex(param) {
    this.pageIndex = param;
    this.getListRefRecord();
  }

  onChangeSort(param): void {
    console.log(param);
  }

  selectSpan(index: number) {
    // this.checkData[index] = !this.checkData[index];
    this.changeCheckbox(index);
  }

  changeCheckbox(index: number, isSpan = false) {
    if (isSpan) {
      this.checkData[index] = !this.checkData[index];
    }
    console.log(this.checkData[index]);
    if (this.checkData[index]) {
      if (this.isSingle) {
        for (let i = 0; i < this.checkData.length; i++) {
          this.checkData[i] = false;
        }
        this.selectedItems = [this.data[index]];
        this.selectedIds = [this.data[index].id];
        this.checkData[index] = true;
      } else {
        if (this.selectedIds.length >= this.limit  && this.limit >= 0) {
          this.checkData[index] = false;
          return;
        }
        if (!this.selectedIds.includes(this.data[index].id)) {
          this.selectedItems.push(this.data[index]);
          this.selectedIds.push(this.data[index].id);
        }
      }
    } else {
      if (this.isSingle) {
        this.selectedItems = [];
        this.selectedIds = [];
        for (let i = 0; i < this.checkData.length; i++) {
          this.checkData[i] = false;
        }
      } else {
        const data = this.data;
        const findIndex = this.selectedItems.findIndex(function (o) {
          return o.id === data[index].id;
        });
        if (findIndex !== -1 ) {
          this.selectedItems.splice(findIndex, 1);
        }
        const indexIds = this.selectedIds.indexOf(this.data[index].id);
        if (indexIds > -1) {
          this.selectedIds.splice(indexIds, 1);
        }
      }
    }
    console.log(this.selectedItems);
    console.log(this.selectedIds);
    this.selectedItem.emit(this.selectedItems);
  }

}
