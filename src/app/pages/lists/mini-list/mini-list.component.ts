import {Component, Input, OnDestroy, OnInit} from '@angular/core';

import { Store } from '@ngrx/store';
import {BasePageComponent} from '../../base-page';
import { HttpService } from '../../../services/http/http.service';
import {IAppState} from '../../../interfaces/app-state';
import * as PageActions from '../../../store/actions/page.actions';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../../../environments/environment';
import {map} from 'rxjs/operators';
import {StudentMiniList} from '../../../interfaces/services/studentList.service';
import { Router } from '@angular/router';

@Component({
  selector: 'profiles-mini-list',
  templateUrl: './mini-list.component.html',
  styleUrls: ['./mini-list.component.scss']
})
export class MiniListComponent extends BasePageComponent implements OnInit, OnDestroy {
  studentsData: StudentMiniList[];
  @Input() studentsSelected: StudentMiniList[] = [];
  @Input() role = 'student';
  selectedCity: any[] = [];
  searchSpec = '';

  sort_key = '';
  sort_value = '';

  searchStr = '';

  cities = [];

  speciality = [];

  constructor(store: Store<IAppState>,
              httpSv: HttpService,
              private http: HttpClient,
              private router: Router) {
    super(store, httpSv);
  }

  get test() {
    return this.studentsData;
  }

  ngOnInit() {
    // super.ngOnInit();
    this.getListProfiles();
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
  selectStudent(a: string) {
    if (this.studentsSelected.findIndex(x => x.id === a) === -1) {
      this.studentsData[this.studentsData.findIndex(x => x.id === a)].selectedC = true;
      this.studentsSelected.push(this.studentsData[this.studentsData.findIndex(x => x.id === a)]);
    }
  }

  ngOnDestroy() {
    // super.ngOnDestroy();
  }

  getListProfiles() {
    return this.http.get<StudentMiniList[]>(`${environment.apiUrl}/api/v2/profiles/${this.role}/list`)
        .pipe(map(data => {
            return data;
        }))
        .subscribe(data => {
          const aCity = [];
          const aSpec = [];
          data.forEach(city => {
            city.selectedC = false;
            if (aCity.indexOf(city.address) === -1) {
              aCity.push(city.address);
              this.cities.push({ name: city.address});
            }
            if (aSpec.indexOf(city.speciality) === -1) {
              aSpec.push(city.speciality);
              this.speciality.push({name: city.speciality});
            }
          });
          this.studentsData = data;
        });
  }
}
