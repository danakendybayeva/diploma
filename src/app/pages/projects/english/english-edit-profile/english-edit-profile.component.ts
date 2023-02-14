import { Component, OnDestroy, OnInit } from '@angular/core';
import { BasePageComponent } from '../../../base-page';
import { Store } from '@ngrx/store';
import { IAppState } from '../../../../interfaces/app-state';
import { HttpService } from '../../../../services/http/http.service';
import {StudentService, Student} from '../../../../interfaces/services/student.service';
import {ActivatedRoute, NavigationEnd, Router} from '@angular/router';
import {environment} from '../../../../../environments/environment';
import {map} from 'rxjs/operators';
import {HttpClient} from '@angular/common/http';
import {UserService} from '../../../../user/_services/user.service';
import * as shape from 'd3-shape';
import {
    EnglishGroupProfile,
    EnglishReport, EnglishStudent,
    EnglishStudentReport,
    IndividualWork
} from '../../../../interfaces/services/projects/english.service';
import {formatDate} from '@angular/common';
import {Status} from '../../../../interfaces/services/util.service';
import {ToastrService} from 'ngx-toastr';


@Component({
    selector: 'english-edit-profile',
    templateUrl: './english-edit-profile.component.html',
    styleUrls: ['./english-edit-profile.component.scss']
})
export class EnglishEditProfileComponent extends BasePageComponent implements OnInit, OnDestroy {
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

    constructor(
        store: Store<IAppState>,
        httpSv: HttpService,
        private studentService: StudentService,
        private route: ActivatedRoute,
        private http: HttpClient,
        private router: Router,
        private userService: UserService,
        private toastr: ToastrService
    ) {
        super(store, httpSv);

        this.pageData = {
            title: ''
        };
    }


    async ngOnInit() {
        super.ngOnInit();
        this.setLoaded();
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

        this.isAdmin = await this.userService.isAdmin() || await this.userService.roleAccount(['english_teacher']);
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
    }

    onChangeSlider(value: number, index: number, type: string): void {
        switch (type) {
            case 'mock':
                this.dataReport.mocks[index] = value;
                break;
            case 'cept':
                this.dataReport.cepts[index] = value;
                break;
        }
    }

    trackByFn(index: any, item: any) {
        return index;
    }

    checkMCPer(event: any, type: string, index: number) {
        switch (type) {
            case 'mock':
                if (event > 100) {
                    this.dataReport.mocks[index] = 100;
                }
                break;
            case 'cept':
                if (event > 100) {
                    this.dataReport.cepts[index] = 100;
                }
                break;
        }
    }

    addMCPer(type: string) {
        switch (type) {
            case 'mock':
                this.dataReport.mocks.push(0);
                break;
            case 'cept':
                this.dataReport.cepts.push(0);
                break;
        }
    }


    getReportsByProfile() {
        this.loading = true;
        return this.http.get<EnglishStudentReport[]>(`${environment.apiUrl}/api/project/english-project/report/${this.reportId}/${this.profileId}`)
            .pipe(map(data => {
                return data;
            }))
            .subscribe(data => {
                console.log(data);
                if (data.length > 0) {
                    this.router.navigate(['/vertical/english/english-edit-profile/report', data[0].id]).then(r => {});
                } else {
                    this.getReport();
                    this.getProfile();
                    this.loading = false;
                }
            });
    }

    getReport() {
        this.loading = true;
        return this.http.get<EnglishReport>(`${environment.apiUrl}/api/project/english-project/report/${this.reportId}`)
            .pipe(map(data => {
                return data;
            }))
            .subscribe(data => {
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
                this.getReportsByGroup();
            });
    }

    getProfile() {
        this.loading = true;
        return this.http.get<Student>(`${environment.apiUrl}/api/profiles/${this.profileId}`)
            .pipe(map(data => {
                return data;
            }))
            .subscribe(data => {
                this.dataReport.student = data;
                this.dataReport.studentId = data.id;
                this.loading = false;
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
                console.log(data);
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
                this.reportId = this.dataReport.englishReportId;
                this.profileId = this.dataReport.studentId;
                this.getReport();
                // this.getReportsByGroup();
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
                this.dataReport.englishReport.datesReportDays.forEach(obj => {
                    const index = data.findIndex(x => x.dayId === obj.id);
                    if (index >= 0) {
                        obj.status = data[index].status;
                    } else {
                        obj.status = null;
                    }
                });
                this.loading = false;
            });
    }

    isTodayDate(day: Date) {
        return formatDate(day, 'dd.MM.yyyy', 'en') === formatDate(this.today, 'dd.MM.yyyy', 'en');
    }

    saveReportStudent() {
        const payload: EnglishStudentReport = this.getCopy(this.dataReport);
        delete payload.englishReport;
        return this.http.post<Status>(`${environment.apiUrl}/api/project/english-project/create-reports`, payload)
            .subscribe({
                next: data => {
                    if (data.status === 1) {
                        this.toastr.success(data.message, 'Success', { closeButton: true });
                        this.router.navigate(['/vertical/english/report/view', data.value]).then(r => {});
                    } else {
                        this.toastr.error(data.message, 'Error', { closeButton: true });
                    }
                },
                error: error => {
                    this.toastr.error('Not saved!', 'Error', { closeButton: true });
                }
            });
    }

    getCopy(object): EnglishStudentReport {
        return (JSON.parse(JSON.stringify(object)));
    }
}
