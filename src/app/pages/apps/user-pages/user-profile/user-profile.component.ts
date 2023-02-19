import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { BasePageComponent } from '../../../base-page';
import { Store } from '@ngrx/store';
import { IAppState } from '../../../../interfaces/app-state';
import { HttpService } from '../../../../services/http/http.service';
import { IOption } from '../../../../ui/interfaces/option';
import {ActivatedRoute, Router} from '@angular/router';
import {environment} from '../../../../../environments/environment';
import {filter, map} from 'rxjs/operators';
import {HttpClient} from '@angular/common/http';
import {UserService} from '../../../../user/_services/user.service';
import {FieldService} from '../../../../interfaces/services/reference/field.service';
import {Status} from '../../../../interfaces/services/util.service';
import {ToastrService} from 'ngx-toastr';
import {Content} from '../../../../ui/interfaces/modal';
import {TCModalService} from '../../../../ui/services/modal/modal.service';
import {ChartComponent} from 'ng-apexcharts';
import {ChartOptions} from '../../../../interfaces/dashboard/dashboard';
import {AuthenticationService} from '../../../../user/_services/authentication.service';

@Component({
  selector: 'page-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss']
})

export class PageUserProfileComponent extends BasePageComponent implements OnInit, OnDestroy {
  @ViewChild('chart') chart: ChartComponent;
  public chartOptions: Partial<ChartOptions>;
  numDir = 5;
  chartData = {
    series: [
      {
        name: 'Series 1',
        data: [0, 0, 0, 0, 0, 0, 0]
      }
    ],
    xaxis: {
      categories: ['Books', 'Курс', 'Семинар', 'Тәжірибе', 'Edutest', 'Ағылшын тілі']
    }
  };
  userInfo: any;
  gender: IOption[];
  status: IOption[];
  currentAvatar: string | ArrayBuffer;
  defaultAvatar: string;
  changes: boolean;
  profile: any;
  profileStatistic: any;
  profileEmpty = {
    reading: false,
    course: false,
    seminar: false,
    practice: false,
    edutest: false,
    lingua: false,
    passport: false
  };

  id: string;
  loading = false;
  isEmpty = false;

  phones: any[] = [];
  isAdmin = false;
  referenceId = '00000000-0000-0000-0000-000000000017';
  fieldsData = {};
  apiUrl = environment.apiUrl;
  canEdit = false;
  archive = false;
  canDelete = false;

  selectedSemester = 'semester1';
  semester: any[] = [
    {value: 'semester1', label: 'FirstSemester'},
    {value: 'semester2', label: 'SecondSemester'},
    {value: 'year', label: 'Year'},
  ];
  typeChart = [
    {value: 'list', label: 'List'},
    {value: 'spyder', label: 'Spyder chart'},
  ];
  selectedTypeChart = 'list';

  selectedMonth = 'september';
  selectedSertificate = 1;
  month: any[] = [
    // {value: 'august', label: 'August'},
    {value: 'september', label: 'September'},
    {value: 'october', label: 'October'},
    {value: 'november', label: 'November'},
    {value: 'december', label: 'December'},
    {value: 'semester1', label: 'Semester 1'},
    {value: 'january', label: 'January'},
    {value: 'february', label: 'February'},
    {value: 'march', label: 'March'},
    {value: 'april', label: 'April'},
    {value: 'may', label: 'May'},
    {value: 'semester2', label: 'Semester 2'},
    {value: 'year', label: 'Year'},
    // {value: 'june', label: 'June'},
    // {value: 'july', label: 'July'},
  ];
  sertificate: any[] = [
    {value: 1, label: 'СertificatesValue'},
    {value: 2, label: 'DocumentsValue'},
    {value: 3, label: 'DiplomaValue'},
  ];

  array: [1, 2, 3, 4];

  switchValue = true;
  isEduWT = false;
  isPractice = false;
  switched = false;

  constructor(
    store: Store<IAppState>,
    httpSv: HttpService,
    private route: ActivatedRoute,
    private http: HttpClient,
    private router: Router,
    private userService: UserService,
    private fieldService: FieldService,
    private toastr: ToastrService,
    private modal: TCModalService,
    private authenticationService: AuthenticationService,
  ) {
    super(store, httpSv);
    this.pageData = {
      title: '',
      loaded: true
    };
    // this.chartRadar = new ApexChart();
    this.chartOptions = {
      chart: {
        width: 480,
        height: 480,
        type: 'radar',
        toolbar: {
          show: false
        },
      },
      title: {
        text: ''
      },
      yaxis: {
        min: 0,
        max: 100,
        tickAmount: 5
      }
    };
    this.defaultAvatar = 'assets/content/anonymous-400.jpg';
    this.currentAvatar = this.defaultAvatar;
    this.changes = false;

    this.switched = this.authenticationService.isSwitched;
    if (this.route.snapshot.params['id']) {
      this.id = this.route.snapshot.params['id'];
    }
  }

  async ngOnInit() {
    super.ngOnInit();
    this.setLoaded();
    this.loading = true;
    this.fieldsData = await this.fieldService.getReferenceFields(this.referenceId, 'object');
    this.getProfile();
    this.getProfileStatistic();
    this.isAdmin = await this.userService.isAdmin();
    Object.values(this.route.snapshot.url).forEach(
        (value) => {
          if (value.path === 'archive') {
            this.archive = true;
          }
        }
    );
    if (this.id) {
      this.canEdit = await this.fieldService.mayAccessRecord('edit', this.referenceId, this.id);
      this.canDelete = await this.fieldService.mayAccessRecord('delete', this.referenceId, this.id);
    }
  }

  switch() {
    if (this.switched) {
      this.authenticationService.switchBack();
    } else if (this.id) {
      this.authenticationService.switchLog(this.id);
    }
  }

  ngOnDestroy() {
    super.ngOnDestroy();
  }

  gotoProfile() {
    this.router.navigateByUrl('/vertical/profile/edit/' + this.id).then();
  }

  getProfile() {
    let url = `${environment.apiUrl}/api/v2/profiles/user/type/view`;
    if (this.id) {
      url = `${environment.apiUrl}/api/v2/profiles/user/${this.id}?fields=`;
    }
    return this.http.get<any>(url)
        .pipe(map(data => {
          return data;
        }))
        .subscribe(
            async data => {
              if (Object.keys(data).length) {
                this.profile = data;
                this.isEduWT = (this.profile.course === '1' || this.profile.course === '2' || this.profile.course === null);
                this.isPractice = (this.profile.course === '3' || this.profile.course === '4' || this.profile.course === null);
                if (this.isEduWT) {
                  this.numDir += 2;
                }
                if (this.isPractice) {
                  this.numDir += 1;
                }
                if (this.profile['id']) {
                  this.canEdit = await this.fieldService.mayAccessRecord('edit', this.referenceId, this.profile['id']);
                }
                this.loading = false;
              } else {
                this.isEmpty = true;
              }
            },
            error => {
              this.isEmpty = true;
            });
  }

  getProfileStatistic() {
    let url = `${environment.apiUrl}/api/project/grade/page/my?month=true`;
    if (this.id) {
      url = `${environment.apiUrl}/api/project/grade/page/${this.id}?month=true`;
    }
    return this.http.get<any>(url)
        .pipe(map(data => {
          return data;
        }))
        .subscribe(
            async data => {
              if (Object.keys(data).length) {
                this.profileStatistic = data;
                Object.keys(this.profileEmpty).forEach(
                    (key) => {
                      if (Object.keys(this.profileStatistic[key]).length) {
                        this.profileEmpty[key] = true;
                      }
                    }
                );
                this.changeMonth();
                this.loading = false;
              } else {
                this.isEmpty = true;
              }
            },
            error => {
              this.isEmpty = true;
            });
  }

  changeMonth() {
    const categories = ['Books', 'Курс', 'Семинар', 'Ағылшын тілі', 'M Passport'];
    // tslint:disable-next-line:max-line-length
    const data = [this.profileStatistic['reading'][this.selectedMonth]['avg'] ? this.profileStatistic['reading'][this.selectedMonth]['avg'] : 0,
      this.profileStatistic['course'][this.selectedMonth]['avg'] ? this.profileStatistic['course'][this.selectedMonth]['avg'] : 0,
      this.profileStatistic['seminar'][this.selectedMonth]['avg'] ? this.profileStatistic['seminar'][this.selectedMonth]['avg'] : 0,
      this.profileStatistic['lingua'][this.selectedMonth]['avg'] ? this.profileStatistic['lingua'][this.selectedMonth]['avg'] : 0,
      this.profileStatistic['passport'][this.selectedMonth]['avg'] ? this.profileStatistic['passport'][this.selectedMonth]['avg'] : 0,
    ];
    if (this.isEduWT) {
      // tslint:disable-next-line:max-line-length
      data.push(this.profileStatistic['edutest'][this.selectedMonth]['avg'] ? this.profileStatistic['edutest'][this.selectedMonth]['avg'] : 0);
      // tslint:disable-next-line:max-line-length
      // data.push(this.profileStatistic['eduway'][this.selectedMonth]['avg'] ? this.profileStatistic['eduway'][this.selectedMonth]['avg'] : 0,
      categories.push('Edutest');
    }
    if (this.isPractice) {
      // tslint:disable-next-line:max-line-length
      data.push(this.profileStatistic['practice'][this.selectedMonth]['avg'] ? this.profileStatistic['practice'][this.selectedMonth]['avg'] : 0);
      categories.push('Тәжірибе');
    }
    this.chartData.series = [{
      name: 'Series 1',
      data: data
    }];
    this.chartData.xaxis = {
      categories: categories
    };
  }

  removeRecord() {
    this.modal.close();
    return this.http.post<Status>(`${environment.apiUrl}/api/reference/record/remove/${this.referenceId}/${this.id}`, {})
        .subscribe({
          next: data => {
            if (data.status === 1) {
              this.toastr.success(data.message, 'Success', { closeButton: true });
              this.router.navigate(['/vertical/reference/record/section', this.referenceId, this.referenceId]).then(r => {});
            } else {
              this.toastr.error(data.message, 'Error', { closeButton: true });
            }
          },
          error: error => {
            this.toastr.error('Not saved!', 'Error', { closeButton: true });
          }
        });
  }

  addFromArchive() {
    this.modal.close();
    return this.http.delete<Status>(`${environment.apiUrl}/api/profile/archive/unzip/${this.id}`)
        .subscribe({
          next: data => {
            if (data.status === 1) {
              this.toastr.success(data.message, 'Success', { closeButton: true });
              this.router.navigate(['/vertical/reference/record/section', this.referenceId, this.referenceId]).then(r => {});
            } else {
              this.toastr.error(data.message, 'Error', { closeButton: true });
            }
          },
          error: error => {
            this.toastr.error('Not saved!', 'Error', { closeButton: true });
          }
        });
  }

  openModal<T>(
      body: Content<T>,
      header: Content<T> = null,
      footer: Content<T> = null,
      options: any = null
  ) {
    this.modal.open({
      body: body,
      header: header,
      footer: footer,
      options: options
    });
  }

  formatOne = (percent: number) => `${this.profileStatistic[this.selectedSemester]} pts.`;

  closeModal() {
    this.modal.close();
  }

}
