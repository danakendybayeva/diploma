import {Component, OnDestroy, OnInit} from '@angular/core';

import { Store } from '@ngrx/store';
import {BasePageComponent} from '../../base-page';
import { HttpService } from '../../../services/http/http.service';
import {IAppState} from '../../../interfaces/app-state';
import * as PageActions from '../../../store/actions/page.actions';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../../../environments/environment';
import {map} from 'rxjs/operators';
import {StudentList} from '../../../interfaces/services/studentList.service';
import { Router } from '@angular/router';

@Component({
  selector: 'lists-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListComponent extends BasePageComponent implements OnInit, OnDestroy {
  tableData: StudentList[];
  listOfName: any[];
  selectedCity: any[] = [];
  searchSpec = '';

  sort_key = '';
  sort_value = '';

  searchStr = '';

  cities = [];

  speciality = [];

  pageSize = 10;
  pageIndex = 1;
  loading = false;

  constructor(store: Store<IAppState>,
              httpSv: HttpService,
              private http: HttpClient,
              private router: Router) {
    super(store, httpSv);

    this.pageData = {
      title: 'Page title',
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
  }

  ngOnInit() {
    this.getListProfiles();
    super.ngOnInit();
  }

  initTable(): void {
    setTimeout(
        () => this.store.dispatch(new PageActions.Update({ loaded: true })),
        0
    );
  }

  sort({ key, value }): void {
    this.sort_key = key;
    if (value === 'ascend') {
      this.sort_value = 'asc';
    } else if (value === 'descend') {
      this.sort_value = 'desc';
    } else {
      this.sort_value = value;
    }
  }

  sortTest(param): void {
    console.log(param);
  }

  ngOnDestroy() {
    super.ngOnDestroy();
  }

  getListProfiles() {
    this.initTable();
    return this.http.get<StudentList[]>(`${environment.apiUrl}/api/profiles/roles/list`)
        .pipe(map(data => {
            return data;
        }))
        .subscribe(data => {
          this.tableData = data;
          const aCity = [];
          const aSpec = [];
          data.forEach(city => {
            if (aCity.indexOf(city.address) === -1) {
              aCity.push(city.address);
              this.cities.push({ name: city.address});
            }
            if (aSpec.indexOf(city.speciality) === -1) {
              aSpec.push(city.speciality);
              this.speciality.push({name: city.speciality});
            }
          });
        });
  }

  gotoProfile(id: string) {
    this.router.navigateByUrl('/vertical/user-profile/' + id);
  }

  onChangePageIndex(param) {
    console.log(param);
  }

  loadDataFromServer(
      pageIndex: number,
      pageSize: number,
      sortField: string | null,
      sortOrder: string | null,
      filter: Array<{ key: string; value: string[] }>
  ): void {
    this.loading = true;
    // this.randomUserService.getUsers(pageIndex, pageSize, sortField, sortOrder, filter).subscribe(data => {
    //   this.loading = false;
    //   this.total = 200; // mock the total data here
    //   this.listOfRandomUser = data.results;
    // });
  }

}
