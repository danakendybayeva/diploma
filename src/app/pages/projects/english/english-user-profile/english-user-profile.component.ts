import { Component, OnDestroy, OnInit } from '@angular/core';
import { BasePageComponent } from '../../../base-page';
import { Store } from '@ngrx/store';
import { IAppState } from '../../../../interfaces/app-state';
import { HttpService } from '../../../../services/http/http.service';
import { IOption } from '../../../../ui/interfaces/option';

import {StudentService} from '../../../../interfaces/services/student.service';
import {ActivatedRoute, NavigationEnd, Router} from '@angular/router';
import {environment} from '../../../../../environments/environment';
import {map} from 'rxjs/operators';
import {HttpClient} from '@angular/common/http';
import {UserService} from '../../../../user/_services/user.service';
import * as shape from 'd3-shape';
import {EnglishService} from '../../../../interfaces/services/english.service';
import {
    EnglishReport,
    EnglishStudent,
    EnglishStudentReport
} from '../../../../interfaces/services/projects/english.service';
import {formatDate} from '@angular/common';
import {Status} from '../../../../interfaces/services/util.service';
import {ToastrService} from 'ngx-toastr';


@Component({
    selector: 'english-user-profile',
    templateUrl: './english-user-profile.component.html',
    styleUrls: ['./english-user-profile.component.scss']
})
export class EnglishUserProfileComponent extends BasePageComponent implements OnInit, OnDestroy {
    userInfo: any;
    gender: IOption[];
    status: IOption[];
    currentAvatar: string | ArrayBuffer;
    changes: boolean;
    ngxChartColors: any;
    barChartData: any[];
    ngxCurve: any;

    id: string;
    reportId: string;
    profileId: string;
    studentReportId: string;
    isAdmin = false;
    loading = false;
    selected = 0;

    today = new Date();
    monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
    ];
    tinyMceSettings = {
        base_url: '/tinymce',
        suffix: '.min',
        plugins: 'link',
        skin: 'CUSTOM',
        content_css: 'CUSTOM',
        mode : 'none',
        statusbar : false,
        toolbar: 'formatselect | bold italic underline | bullist numlist | undo redo ',
    };

    dataReport: EnglishStudentReport = {
        id: null,
        englishReportId: '',
        studentId: '',
        student: null,
        active: 0,
        homeProject: 0,
        reading: 0,
        listening: 0,
        writing: 0,
        speaking: 0,
        vocabulary: 0,
        grammar: 0,
        pronunciation: 0,
        mocks: [],
        cepts: [],
        averageResult: 0,
        comment: '',
        individualWorkArr: [],
        dateReport: new Date(),
    };
    dataReportsByGroup: EnglishReport[] = [];
    _routeListener = null;
    attendancePercent = 0;

    constructor(
        store: Store<IAppState>,
        httpSv: HttpService,
        private studentService: StudentService,
        private route: ActivatedRoute,
        private http: HttpClient,
        private router: Router,
        private userService: UserService,
        public englishService: EnglishService,
        private toastr: ToastrService
    ) {
        super(store, httpSv);
        this.englishService.selected = 0;

        this.pageData = {
            title: ''
        };

    }

    async ngOnInit() {
        super.ngOnInit();
        super.setLoaded();
        await this.initRoute();
        this.onRouteChange();
    }

    ngOnDestroy() {
        super.ngOnDestroy();
        this._routeListener.unsubscribe();
    }

    onRouteChange() {
        this._routeListener = this.router.events.subscribe((val) => {
            if (val instanceof NavigationEnd) {
                this.initRoute().then(r => {});
            }
        });
    }

    async initRoute() {
        this.dataReport = {
            id: null,
            englishReportId: '',
            studentId: '',
            student: null,
            active: 0,
            homeProject: 0,
            reading: 0,
            listening: 0,
            writing: 0,
            speaking: 0,
            vocabulary: 0,
            grammar: 0,
            pronunciation: 0,
            mocks: [],
            cepts: [],
            averageResult: 0,
            comment: '',
            individualWorkArr: [],
            dateReport: new Date(),
        };
        this.dataReportsByGroup = [];
        this.studentReportId = null;
        this.reportId = null;
        this.profileId = null;
        this.isAdmin = false;
        this.loading = true;

        if (this.route.snapshot.params['reportId']) {
            this.reportId = this.route.snapshot.params['reportId'];
        }
        if (this.route.snapshot.params['profileId']) {
            this.profileId = this.route.snapshot.params['profileId'];
        }
        if (this.route.snapshot.params['studentReportId']) {
            this.studentReportId = this.route.snapshot.params['studentReportId'];
            this.getStudentReport(this.studentReportId);
        }
        if (this.reportId && this.profileId) {
            this.getReportsByProfile();
        }
        this.setChartColors();
        this.isAdmin = await this.userService.isAdmin() || await this.userService.roleAccount(['english_teacher']);
    }

    setBarChartData() {
        this.barChartData = [];
        this.dataReport.mocks.forEach((obj, key) => {
            const value = obj === null ? 0 : obj;
            this.barChartData.push({name: 'Mock ' + (key + 1), value: value});
        });
        this.dataReport.cepts.forEach((obj, key) => {
            const value = obj === null ? 0 : obj;
            this.barChartData.push({name: 'CEPT ' + (key + 1), value: value});
        });
        this.barChartData.push({name: 'Total', value: this.dataReport.averageResult});
    }

    setChartColors() {
        this.ngxChartColors = {
            domain: ['#3d5a80', '#4289b3', '#5b9dc2', '#98c1d9', '#e13d14', '#ed5631', '#f5a38f', '#48bf84']
        };

        this.ngxCurve = shape.curveCardinal;
    }
    range(start, end) {
        const foo = [];
        for (let i = start; i <= end; i++) {
            foo.push(i);
        }
        return foo;
    }

    selectedMonth(index: number) {
        this.selected = index;
    }

    getReportsByProfile() {
        this.loading = true;
        return this.http.get<EnglishStudentReport[]>(`${environment.apiUrl}/api/project/english-project/report/${this.reportId}/${this.profileId}`)
            .pipe(map(data => {
                return data;
            }))
            .subscribe(data => {
                console.log(data);
                if (data.length === 0) {
                    // this.router.navigate(['/vertical/english/admin/report/create', this.reportId, this.profileId]).then(r => {});
                } else {
                    this.dataReport = data[0];
                    this.studentReportId = data[0].id;
                    this.getStudentReport(this.studentReportId);
                }
                this.loading = false;
            });
    }

    getReport() {
        this.loading = true;
        return this.http.get<EnglishReport>(`${environment.apiUrl}/api/project/english-project/report/${this.reportId}`)
            .pipe(map(data => {
                return data;
            }))
            .subscribe(data => {
                data.datesReportDays = [];
                this.dataReport.englishReport = data;
                this.dataReport.englishReportId = data.id;
                if (this.dataReport.id == null) {
                    this.dataReport.mocks = [];
                    for (let i = 0; i < this.dataReport.englishReport.mocksCount; i++) {
                        this.dataReport.mocks.push(0);
                    }
                    this.dataReport.cepts = [];
                    for (let i = 0; i < this.dataReport.englishReport.ceptsCount; i++) {
                        this.dataReport.cepts.push(0);
                    }
                }
                this.getStudentAttendance();
            });
    }

    getReportsByGroup() {
        this.loading = true;
        return this.http.get<EnglishReport[]>(`${environment.apiUrl}/api/project/english-project/group/report/${this.dataReport.englishReport.englishId}`)
            .pipe(map(data => {
                return data;
            }))
            .subscribe(data => {
                this.dataReportsByGroup = data;
            });
    }

    getStudentReport(id) {
        this.loading = true;
        return this.http.get<EnglishStudentReport>(`${environment.apiUrl}/api/project/english-project/student/report/${id}`)
            .pipe(map(data => {
                return data;
            }))
            .subscribe(data => {
                this.dataReport = data;
                this.profileId = data.studentId;
                this.reportId = data.englishReportId;
                this.getStudentAttendance();
                this.setBarChartData();
                this.setChartColors();
                this.getReportsByGroup();
                this.loading = false;
            });
    }

    getStudentAttendance() {
        this.loading = true;
        return this.http.get<EnglishStudent[]>(`${environment.apiUrl}/api/project/english-project/attendance/report/${this.reportId}/${this.profileId}`)
            .pipe(map(data => {
                return data;
            }))
            .subscribe(data => {
                this.dataReport.attendance = data;
                let i0 = 0;
                let i1 = 0;
                this.dataReport.attendance.forEach(obj => {
                    if (obj.status === 1) {
                        i1++;
                    } else {
                        i0++;
                    }
                });
                this.attendancePercent = Math.round((i1 * 100) / this.dataReport.attendance.length);
                this.dataReport.englishReport.datesReportDays.forEach(obj => {
                    const index = data.findIndex(x => x.dayId === obj.id);
                    if (index >= 0) {
                        obj.status = data[index].status;
                    } else {
                        obj.status = null;
                    }
                });
                this.loading = false;
                console.log(this.dataReport);
            });
    }

    removeReportStudent() {
        const payload: EnglishStudentReport = this.getCopy(this.dataReport);
        delete payload.englishReport;
        return this.http.post<Status>(`${environment.apiUrl}/api/project/english-project/delete-reports`, payload)
            .subscribe({
                next: data => {
                    if (data.status === 1) {
                        this.toastr.success(data.message, 'Success', { closeButton: true });
                        this.router.navigate(['/vertical/english/group', this.dataReport.englishReport.englishId]).then(r => {});
                    } else {
                        this.toastr.error(data.message, 'Error', { closeButton: true });
                    }
                },
                error: error => {
                    this.toastr.error(error, 'Error', { closeButton: true });
                }
            });
    }

    isTodayDate(day: Date) {
        return formatDate(day, 'dd.MM.yyyy', 'en') === formatDate(this.today, 'dd.MM.yyyy', 'en');
    }

    getCopy(object): EnglishStudentReport {
        return (JSON.parse(JSON.stringify(object)));
    }
}
