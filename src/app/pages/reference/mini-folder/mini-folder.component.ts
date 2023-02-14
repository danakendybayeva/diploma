import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import { FormBuilder } from '@angular/forms';

import { Store } from '@ngrx/store';
import {BasePageComponent} from '../../base-page';
import { HttpService } from '../../../services/http/http.service';
import {IAppState} from '../../../interfaces/app-state';

import {HttpClient} from '@angular/common/http';
import {ActivatedRoute, Router} from '@angular/router';
import * as PageActions from '../../../store/actions/page.actions';
import {environment} from '../../../../environments/environment';
import {map} from 'rxjs/operators';
import {IPageContent} from '../../../interfaces/services/page/page-content';

@Component({
  selector: 'tc-mini-folder',
  templateUrl: './mini-folder.component.html',
  styleUrls: ['./mini-folder.component.scss']
})
export class TCMiniFolderComponent extends BasePageComponent implements OnInit {
  data: any[];

  @Input() referenceId = '';
  @Input() referenceTitle = '';
  @Input() fields = [];
  @Input() isSingle = false;
  @Output() public selectedItem: EventEmitter<any> = new EventEmitter();

  searchValue = '';
  pageSize = 20;
  pageIndex = 1;
  loading = false;
  totalData = 0;
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
  }

  ngOnInit() {
    super.ngOnInit();
    if (this.route.snapshot.params['referenceId']) {
      this.referenceId = this.route.snapshot.params['referenceId'];
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
            this.totalData = data.totalElements;
          }
        });
  }

  onChangePageIndex(param) {
    this.pageIndex = param;
    this.getListRefRecord();
  }

  onChangeSort(param): void {
    console.log(param);
  }

  selectSpan(index: number) {
    if (!this.checkData[index]) {
      if (this.isSingle) {
        for (let i = 0; i < this.checkData.length; i++) {
          this.checkData[i] = false;
        }
        this.selectedItem.emit([this.data[index]]);
      } else {
        if (!Object.keys(this.selItem).some(key => this.selItem[key].id === this.data[index].id)) {
          this.selItem.push(this.data[index]);
        }
        this.selectedItem.emit(this.selItem);
      }
    } else {
      if (this.isSingle) {
        this.selectedItem.emit([]);
      } else if (Object.keys(this.selItem).some(key => this.selItem[key].id === this.data[index].id)) {
        for (let i = 0; i < this.selItem.length; i++) {
          if (this.selItem[i].id === this.data[index].id) {
            this.selItem.splice(i, 1);
            break;
          }
        }
        this.selectedItem.emit(this.selItem);
      }
    }
    this.checkData[index] = !this.checkData[index];

  }

}
