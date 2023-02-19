import {Component, OnDestroy, OnInit, ViewChild, Inject, LOCALE_ID} from '@angular/core';

import {Store} from '@ngrx/store';
import {BasePageComponent} from '../../base-page';
import {IAppState} from '../../../interfaces/app-state';
import {HttpService} from '../../../services/http/http.service';
import {EChartOption} from 'echarts';
import {UserService} from '../../../user/_services/user.service';
import {Router} from '@angular/router';

import {ApexPlotOptions, ChartComponent} from 'ng-apexcharts';
import {DashboardService} from '../services/dashboard.service';
import {ChartLineOptions, ChartOptionColumns, ChartOptions} from '../../../interfaces/dashboard/dashboard';
import {environment} from '../../../../environments/environment';
import {Status} from '../../../interfaces/services/util.service';
import {HttpClient} from '@angular/common/http';


@Component({
    selector: 'page-analytics',
    templateUrl: './analytics.component.html',
    styleUrls: ['./analytics.component.scss'],
})


export class PageAnalyticsComponent extends BasePageComponent implements OnInit, OnDestroy {
    @ViewChild('chart') chart: ChartComponent;
    public avgRating: Partial<ChartLineOptions>;
    types = [
        {
            key: 'reading',
            title: 'Books',
            info: 'BooksGradingInfo',
            infoVisible: false,
        },
        {
            key: 'lingua',
            title: 'Lingua',
            info: 'LinguaGradingInfo',
            infoVisible: false,
        },
        {
            key: 'practice',
            title: 'Practice',
            info: 'PracticeGradingInfo',
            infoVisible: false,
        },
        // {
        //     key: 'eduway',
        //     title: 'Eduway',
        //     info: 'EduwayGradingInfo',
        //     infoVisible: false,
        // },
        {
            key: 'edutest',
            title: 'Edutest',
            info: 'EdutestGradingInfo',
            infoVisible: false,
        },
        {
            key: 'seminar',
            title: 'Seminar',
            info: 'SeminarGradingInfo',
            infoVisible: false,
        },
        {
            key: 'course',
            title: 'Course',
            info: 'CourseGradingInfo',
            infoVisible: false,
        },
    ];
    avg = {};

    isAdmin = false;
    loading = false;
    semester: any[] = [
        {value: 1, label: 'FirstSemester'},
        {value: 2, label: 'SecondSemester'}
    ];
    months: any[] = [
        {value: 9, label: 'September'},
        {value: 10, label: 'October'},
        {value: 11, label: 'November'},
        {value: 12, label: 'December'},
        {value: 1, label: 'January'},
        {value: 2, label: 'February'},
        {value: 3, label: 'March'},
        {value: 4, label: 'April'},
        {value: 5, label: 'May'},
    ];
    specCourseOption = [
        {value: 1, label: '1'},
        {value: 2, label: '2'},
        {value: 3, label: '3'},
        {value: 4, label: '4'},
    ];
    university = [];
    speciality = [];
    city = [];
    mentors = [];
    gender: any[] = [
        {value: 1, label: 'Boys'},
        {value: 2, label: 'Girls'},
    ];

    avgType = [];

    constructor(
        store: Store<IAppState>,
        httpSv: HttpService,
        private userService: UserService,
        private dashboardService: DashboardService,
        private router: Router,
        private http: HttpClient,
    ) {
        super(store, httpSv);
        this.pageData = {
            title: 'Analytics',
            loaded: true
        };

        this.avgRating = {
            chart: {
                height: 350,
                type: 'line',
                zoom: {
                    enabled: false
                }
            },
            dataLabels: {
                enabled: false
            },
            stroke: {
                curve: 'straight'
            },
            title: {
                align: 'left'
            },
            grid: {
                row: {
                    colors: ['#f3f3f3', 'transparent'],
                    opacity: 0.5
                }
            },
        };

        const now = new Date();
    }

    async ngOnInit() {
        super.ngOnInit();
        // TODO истеу керек
        // if (!await this.userService.isAdmin()) {
        //   this.router.navigate(['/vertical/user-profile']).then(r => {
        //   });
        // }
        this.loading = true;
        await Object.values(this.types).forEach((value) => {
            this.avg[value.key] = {
                title: value.title  ,
                series: [
                    {
                        name: 'Students',
                        data: [],
                        color: '#3D3DD8'
                    }
                ],
                xaxis: {categories: []},
                filter: {
                    semester: null,
                    mentors: [],
                    gender: null,
                    city: [],
                    loading: false
                },
                att: {
                    9: {label: 'September', count: 0, avg: 0, isSelected: true},
                    10: {label: 'October', count: 0, avg: 0, isSelected: true},
                    11: {label: 'November', count: 0, avg: 0, isSelected: true},
                    12: {label: 'December', count: 0, avg: 0, isSelected: true},
                    1: {label: 'January', count: 0, avg: 0, isSelected: true},
                    111: {label: 'Semester 1', count: 0, avg: 0, isSelected: false},
                    2: {label: 'February', count: 0, avg: 0, isSelected: true},
                    3: {label: 'March', count: 0, avg: 0, isSelected: true},
                    4: {label: 'April', count: 0, avg: 0, isSelected: true},
                    5: {label: 'May', count: 0, avg: 0, isSelected: true},
                    6: {label: 'June', count: 0, avg: 0, isSelected: true},
                    112: {label: 'Semester 2', count: 0, avg: 0, isSelected: false},
                },
            };
        });

        await this.getSpeciality().then(r => {
            this.speciality = this.getPrepareOption(r['speciality']);
            this.university = this.getPrepareOption(r['university']);
            this.city = this.getPrepareOption(r['city']);
            this.mentors = this.getPrepareOption(r['mentors']);
        });
        // TODO remove eduway from avgType and remove if in 181l
        this.avgType = await this.getAvgRatingAll().then();
        Object.entries(this.avg).forEach(
            ([key, value]) => {
                // @ts-ignore
                Object.entries(value.att).forEach(
                    ([keyAtt, valueAtt]) => {
                        // @ts-ignore
                        valueAtt.avg = 0;
                        // @ts-ignore
                        valueAtt.count = 0;
                    }
                );
            }
        );
        if (Object.keys(this.avgType).length) {
            Object.entries(this.avgType).forEach(
                ([key, value]) => {
                    if (key !== 'eduway') {
                        Object.entries(value).forEach(
                            ([k, v]) => {
                                this.avg[key].att[k].avg = this.round(v['avg']);
                                this.avg[key].att[k].count = this.round(v['count']);
                            }
                        );
                        this.attSemMonthChange(key);
                        this.attSetData(key);
                    }
                }
            );
        }
        // Object.entries(this.avg).forEach(
        //     ([key, value]) => {
        //         this.applyAvgRating(key).then();
        //     }
        // );
        this.loading = false;
    }

    async getSpeciality(): Promise<any> {
        return this.http.get<any>(`${environment.apiUrl}/api/profile/fields/list`)
            .toPromise()
            .then(response => response)
            .catch();
    }
    getPrepareOption(value: any[]): any[] {
        const rr = [];
        value.forEach(item => {
            rr.push({value: item.id, label: item.value});
        });
        return rr;
    }

    async getAvgRatingAll(): Promise<any> {
        return this.http.get<any>(`${environment.apiUrl}/api/analytics/data/all?`)
            .toPromise()
            .then(response => response)
            .catch();
    }

    // One by one
    prepareFilter(type: string): string {
        const result = [];
        if (this.avg[type].filter.semester) {
            result.push('st=' + this.avg[type].filter.semester);
        }
        if (this.avg[type].filter.mentors && this.avg[type].filter.mentors.length) {
            result.push('mt=' + this.avg[type].filter.mentors.join(','));
        }
        if (this.avg[type].filter.gender) {
            result.push('gn=' + this.avg[type].filter.gender);
        }
        if (this.avg[type].filter.city && this.avg[type].filter.city.length) {
            result.push('ct=' + this.avg[type].filter.city.join(','));
        }
        return result.join('&');
    }

    async getAvgRating(type: string = ''): Promise<any> {
        return this.http.get<any>(`${environment.apiUrl}/api/analytics/month/${type}?${this.prepareFilter(type)}`)
            .toPromise()
            .then(response => response)
            .catch();
    }

    async applyAvgRating(type: string = '') {
        this.avg[type].filter.loading = true;
        this.avgType = await this.getAvgRating(type);
        Object.entries(this.avg[type].att).forEach(
            ([key, value]) => {
                this.avg[type].att[key].avg = 0;
                this.avg[type].att[key].count = 0;
            }
        );
        if (Object.keys(this.avgType).length && type.length) {
            Object.entries(this.avgType).forEach(
                ([key, value]) => {
                    this.avg[type].att[key].avg = this.round(value.avg);
                    this.avg[type].att[key].count = this.round(value.count);
                }
            );

            this.attSemMonthChange(type);
            this.attSetData(type);
        }
        this.avg[type].filter.loading = false;
    }


    abs(value: any): number { return Math.abs(Number(value)); }
    round(value: any): number { return Math.round(Number(value)); }

    attSemMonthChange(type: string) {

        Object.entries(this.avg[type].att).forEach(
            ([key, value]) => {
                this.avg[type].att[key].isSelected = false;
            }
        );

        if (this.avg[type].filter.semester) {
            if (this.avg[type].filter.semester === 1) {
                Object.entries(this.avg[type].att).forEach(
                    ([key, value]) => {
                        // if ([9, 10, 11, 12, 111].includes(Number(key))) {
                        if ([9, 10, 11, 12].includes(Number(key))) {
                            this.avg[type].att[key].isSelected = true;
                        }
                    }
                );
            }
            if (this.avg[type].filter.semester === 2) {
                Object.entries(this.avg[type].att).forEach(
                    ([key, value]) => {
                        // if ([2, 3, 4, 5, 112].includes(Number(key))) {
                        if ([2, 3, 4, 5].includes(Number(key))) {
                            this.avg[type].att[key].isSelected = true;
                        }
                    }
                );
            }
        } else {
            Object.entries(this.avg[type].att).forEach(
                ([key, value]) => {
                    this.avg[type].att[key].isSelected = !(key === '111' || key === '112');
                }
            );
        }
    }
    attSetData(type: string) {
        const data = [];
        const count = [];
        const categories = [];

        Object.entries(this.avg[type].att).forEach(([key, value]) => {
            // Uncomment if Semester 1 needed
            // if ([9, 10, 11, 12, 111].includes(Number(key)) && this.avg[type].att[key].isSelected) {
            if ([9, 10, 11, 12].includes(Number(key)) && this.avg[type].att[key].isSelected) {
                data.push(this.avg[type].att[key].avg);
                count.push(this.avg[type].att[key].count);
                categories.push(this.avg[type].att[key].label);
            }
        });

        Object.entries(this.avg[type].att).forEach(([key, value]) => {
            // If Semester 2 needed
            // if ([2, 3, 4, 5, 112].includes(Number(key)) && this.avg[type].att[key].isSelected) {
            if ([2, 3, 4, 5].includes(Number(key)) && this.avg[type].att[key].isSelected) {
                data.push(this.avg[type].att[key].avg);
                count.push(this.avg[type].att[key].count);
                categories.push(this.avg[type].att[key].label);
            }
        });

        data.unshift(0);
        count.unshift(0);
        categories.unshift('');
        data.push(data[data.length - 1]);
        count.push(count[count.length - 1]);
        categories.push('');

        this.avg[type].series = [
            {
                name: 'Average Point',
                data: data,
                color: '#3D3DD8',
            }, {
                name: 'Students',
                data: count,
                color: '#00000000'
            }
        ];
        this.avg[type].xaxis = {
            categories: categories
        };
    }
}
