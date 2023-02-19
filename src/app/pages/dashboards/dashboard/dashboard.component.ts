import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';

import { Store } from '@ngrx/store';
import { BasePageComponent } from '../../base-page';
import { IAppState } from '../../../interfaces/app-state';
import { HttpService } from '../../../services/http/http.service';
import { EChartOption } from 'echarts';
import {UserService} from '../../../user/_services/user.service';
import {Router} from '@angular/router';

import {ApexPlotOptions, ChartComponent} from 'ng-apexcharts';
import {DashboardService} from '../services/dashboard.service';
import {ChartLineOptions, ChartOptionColumns, ChartOptions} from '../../../interfaces/dashboard/dashboard';
import {environment} from '../../../../environments/environment';
import {Status} from '../../../interfaces/services/util.service';
import {HttpClient} from '@angular/common/http';
import { LOCALE_ID } from '@angular/core';



@Component({
  selector: 'page-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})

export class PageDashboardComponent extends BasePageComponent implements OnInit, OnDestroy {
  @ViewChild('chart') chart: ChartComponent;
  public chartGum: Partial<ChartOptions>;
  public chartTech: Partial<ChartOptions>;
  public attendanceEnglish: Partial<ChartLineOptions>;
  public radialBar: Partial<ChartOptions>;

  specCourseOption = [
    { value: 1, label: '1' },
    { value: 2, label: '2' },
    { value: 3, label: '3' },
    { value: 4, label: '4' },
  ];
  semester: any[] = [
    { value: 1, label: 'Семестр 1' },
    { value: 2, label: 'Семестр 2' }
  ];
  months: any[] = [
    { value: 9, label: 'September' },
    { value: 10, label: 'October' },
    { value: 11, label: 'November' },
    { value: 12, label: 'December' },
    { value: 2, label: 'February' },
    { value: 3, label: 'March' },
    { value: 4, label: 'April' },
    { value: 5, label: 'May' },
  ];
  gender: any[] = [
    { value: 1, label: 'Boys' },
    { value: 2, label: 'Girls' },
  ];
  englevel = [];
  university = [];
  speciality = [];
  mentors = [];
  city = [];

  isAdmin = false;

  filter = {
    monthReport: {
      semester: null,
      month: null,
      city: [],
      mentors: [],
      university: [],
      speciality: [],
      gender: null,
      loading: false
    },
    specCount: {
      mentors: [],
      university: [],
      speciality: [],
      city: [],
      englevel: [],
      gender: null,
      specHumCourse: null,
      specTechCourse: null,
      loading: false
    },
    rating12: {
      semester: null,
      city: [],
      mentors: [],
      gender: null,
      loading: false
    },
    rating34: {
      semester: null,
      city: [],
      mentors: [],
      gender: null,
      loading: false
    },
    filterAttLin: {
      semester: null,
      month: [],
      mentors: [],
      gender: null,
      loading: false
    },
  };

  countStatistic = {};
  humanitarian = [];
  humanitarianLabels = [];
  humanitarianTotal = 0;
  technical = [];
  technicalLabels = [];
  technicalTotal = 0;
  hColors = ['#985FD8', '#CB8BDB', '#ECBCE6', '#FFC7E1', '#FF98B8', '#FF6583', '#FF2343', '#8B24BB', '#65E543', '#F3F72E', '#474729', '#8E919B', '#5A43E5', '#F62E8E', '#13E4F1', '#8E919B'];
  tColors = ['#8B24BB', '#10142D', '#FFA31A', '#13E4F1', '#65E543', '#F3F72E', '#474729', '#8E919B', '#5A43E5', '#F62E8E', '#13E4F1', '#8E919B', '#985FD8', '#CB8BDB', '#ECBCE6', '#FFC7E1'];
  chartPlotH: ApexPlotOptions;
  chartPlotT: ApexPlotOptions;

  listOfStudent = {
    READING: [],
    EDUWAY: [],
    EDUTEST: [],
    COURSE: [],
    LINGUA: [],
    PRACTICE: [],
    SEMINAR: [],
    PASSPORT: [],
  };
  listOfStudentFiltered = {};
  mothReportFiltered = {};

  attLin = [];
  att = {
    9:  { label: 'September' , count: 0, isSelected: true },
    10: { label: 'October' , count: 0, isSelected: true},
    11: { label: 'November' , count: 0, isSelected: true},
    12: { label: 'December' , count: 0, isSelected: true},
    1:  { label: 'January' , count: 0, isSelected: false},
    2:  { label: 'February' , count: 0, isSelected: true},
    3:  { label: 'March' , count: 0, isSelected: true},
    4:  { label: 'April' , count: 0, isSelected: true},
    5:  { label: 'May' , count: 0 , isSelected: true},
  };

  studentData12: any[];
  studentData34: any[];
  pageIndex = 1;
  pageIndex2 = 1;

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
      title: 'Dashboard',
      loaded: true
    };

    this.chartPlotH = {
      pie: {
        expandOnClick: false,
        donut: {
          size: '75%',
          labels: {
            show: true,
            total: {
              show: true,
              showAlways: true,
              fontWeight: 'bold',
              fontFamily: 'Montserrat',
              fontSize: '32px',
              color: '#10142D',
              label: '',
              formatter(w: any): string {
                return 'студент';
              }
            }
          }
        }
      }
    };
    this.chartPlotT = {
      pie: {
        expandOnClick: false,
        donut: {
          size: '75%',
          labels: {
            show: true,
            total: {
              show: true,
              showAlways: true,
              fontWeight: 'bold',
              fontFamily: 'Montserrat',
              fontSize: '32px',
              color: '#10142D',
              label: '',
              formatter(w: any): string {
                return 'студент';
              }
            }
          }
        }
      }
    };

    const data = [];
    const categories = [];

    Object.entries(this.attLin).forEach(
        ([key, value]) => {
          if (value.isSelected) {
            data.push(value.count);
            categories.push(value.label);
          }
        }
    );

    this.attendanceEnglish = {
      series: [
        {
          name: 'Студенттер',
          data: data,
          color: '#3D3DD8'
        }
      ],
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
      xaxis: {
        categories: categories
      }
    };
    this.radialBar = {
      series: [0],
      colors: ['#3D3DD8'],
      chart: {
        height: 275,
        width: 275,
        offsetX: -10,
        offsetY: -10,
        type: 'radialBar',
        sparkline: {
          enabled: true
        },
      },
      plotOptions: {
        radialBar: {
          hollow: {
            margin: 0,
            size: '70%'
          },
          track: {
            margin: 0,
            strokeWidth: '100%',
          },
          dataLabels: {
            name: {
              show: false,
            },
            value: {
              fontSize: '46px',
              color: '#3D3DD8',
              fontWeight: 700,
              show: true
            }
          },
        }
      },
      labels: [],
      legend: {
        itemMargin: {
          horizontal: 0,
          vertical: 0
        }
      }
    };

    const now = new Date();
    let month = now.getMonth();
    if ([0, 1].includes(month)) {
      month = 12;
    } else if ([5, 6, 7].includes(month)) {
      month = 4;
    } else if (month === 8) {
      month = 9;
    }
    this.filter.monthReport.month = month;
  }

  async ngOnInit() {
    super.ngOnInit();
    // TODO истеу керек
    // if (!await this.userService.isAdmin()) {
    //   this.router.navigate(['/vertical/user-profile']).then(r => {
    //   });
    // }

    this.getPrepareOption().then(r => {
      this.speciality = this.prepareOption(r['speciality']);
      this.university = this.prepareOption(r['university']);
      this.mentors = this.prepareOption(r['mentors']);
      this.city = this.prepareOption(r['city']);
      if (r.hasOwnProperty('englevel')) {
        this.englevel = this.prepareOption(r['englevel']);
      }
    });

    // Count
    this.getCountStatistic().then(r => {
      this.countStatistic = r;
      this.getHumCountSpec();
      this.getTechCountSpec();
    });

    // Month
    Object.entries(this.listOfStudent).forEach(
        ([key, value]) => {
          this.getByUrl(`${environment.apiUrl}/api/dashboard/${key.toLowerCase()}/reports`).then(r => {
            r.forEach((item, index) => {
              if (item['students'] && item['students'].length) {
                item['students'].forEach((st, ins) => {
                  if (st['reports'] && Object.keys(st['reports']).length) {
                    st['mentor_id'] = item['id'];
                    this.listOfStudent[key].push(st);
                  }
                });
              }
            });
            this.applyMonthReport();
          });
        }
    );


    // Lingua attendance
    this.applyAttLin().then();

    // Rating 1,2 and 3,4
    await this.getRatingStudents('freshman', 'rating12');
    //     .then(r => {
    //   this.studentData12 = r;
    // });
    await this.getRatingStudents('big', 'rating34');
    //     .then(r => {
    //   this.studentData34 = r;
    // });

  }

  prepareOption(value: any[]): any[] {
    const rr = [];
    value.forEach(item => {
      rr.push({value: item.id, label: item.value});
    });
    return rr;
  }
  async getPrepareOption(): Promise<any> {
    return this.http.get<any>(`${environment.apiUrl}/api/profile/fields/list`)
        .toPromise()
        .then(response => response)
        .catch();
  }

  // Filter
  prepareFilter(type: string): string {
    const result = [];
    if (this.filter[type].semester) {
      result.push('st=' + this.filter[type].semester);
    }
    if (this.filter[type].month && this.filter[type].semester == null) {
      if (type === 'filterAttLin' && this.filter.filterAttLin.month.length) {
        result.push('mm=' + this.filter[type].month.join(','));
      } else {
        result.push('mm=' + this.filter[type].month);
      }
    }
    if (this.filter[type].hasOwnProperty('englevel') && this.filter[type].englevel.length) {
      result.push('lvl=' + this.filter[type].englevel.join(','));
    }
    if (this.filter[type].gender) {
      result.push('gn=' + this.filter[type].gender);
    }
    if (this.filter[type].mentors && this.filter[type].mentors.length) {
      result.push('mt=' + this.filter[type].mentors.join(','));
    }
    if (this.filter[type].city && this.filter[type].city.length) {
      result.push('ct=' + this.filter[type].city.join(','));
    }
    if (this.filter[type].university && this.filter[type].university.length) {
      result.push('u=' + this.filter[type].university.join(','));
    }
    if (this.filter[type].speciality && this.filter[type].speciality.length) {
      result.push('sp=' + this.filter[type].speciality.join(','));
    }
    return result.join('&');
  }
  async applyFilter(type: string, course: string = '') {
    switch (type) {
      case 'specCount':
        this.filter.specCount.loading = true;
        this.getCountStatistic().then(r => {
          const mentors = this.countStatistic['MENTOR'];
          this.countStatistic = r;
          this.getHumCountSpec(this.filter.specCount.specHumCourse);
          this.getTechCountSpec(this.filter.specCount.specTechCourse);
          if (!this.countStatistic['MENTOR']) {
            this.countStatistic['MENTOR'] = mentors;
          }
          this.filter.specCount.loading = false;
        });
        break;
      case 'rating':
        if (course === 'freshman') {
          await this.getRatingStudents(course, 'rating12');
        } else if (course === 'big') {
          await this.getRatingStudents(course, 'rating34');
        }
    }
  }

  // Count
  async getCountStatistic(): Promise<any> {
    return this.http.get<any>(`${environment.apiUrl}/api/dashboard/count?${this.prepareFilter('specCount')}`)
        .toPromise()
        .then(response => response)
        .catch();
  }
  getPercentageCount(value: any[], key: string): number {
    let allCount = 0;
    let keyCount = 0;
    value.forEach(item => {
      allCount += item['count'];
      if (item['gender_enum'] === key) {
        keyCount = item['count'];
      }
    });
    return keyCount * 100 / allCount;
  }
  getTotalCount(value: any[]): number {
    let result = 0;
    value.forEach(item => {
      result += item['count'];
    });

    return result;
  }
  getHumCountSpec(course: number = null) {
    if (this.countStatistic['speciality']) {
      const array = this.countStatistic['speciality'];
      this.humanitarian = [];
      this.humanitarianLabels = [];
      this.humanitarianTotal = 0;
      let indexH = 0;
      const labelsH = [];
      const groupNameUnique = [...new Map(array.map(item => [item['group_name'], item])).values()];
      Object.values(groupNameUnique).forEach((groupName) => {
        // @ts-ignore
        const countGroup = array.reduce((sum, currentValue) => {
          if (currentValue['direction'] === 'Гуманитар' && currentValue['group_name'] === groupName['group_name']
              && (course === null || course === Number(currentValue['course']))) {
            return sum + currentValue['count'];
          }
          return sum;
        }, 0);
        if (countGroup) {
          this.humanitarian.push(countGroup);
          this.humanitarianTotal += countGroup;
          this.humanitarianLabels.push({
            label: groupName['group_name'],
            count: countGroup,
            color: this.hColors[ indexH % this.hColors.length]
          });
          labelsH.push(groupName['group_name']);
          indexH++;
        }
      });
      this.chartPlotH.pie.donut.labels.total.label = this.humanitarianTotal.toString();
      this.chartGum = {
        chart: {
          type: 'donut',
          width: '100%',
        },
        dataLabels: {
          enabled: false
        },
        plotOptions: this.chartPlotH,
        legend: {
          show: false
        },
        labels: labelsH
      };
    }
  }
  getTechCountSpec(course: number = null) {
    if (this.countStatistic['speciality']) {
      const array = this.countStatistic['speciality'];
      this.technical = [];
      this.technicalLabels = [];
      this.technicalTotal = 0;
      let indexT = 0;
      const labelsT = [];
      const groupNameUnique = [...new Map(array.map(item => [item['group_name'], item])).values()];
      Object.values(groupNameUnique).forEach((groupName) => {
        // @ts-ignore
        const countGroup = array.reduce((sum, currentValue) => {
          if (currentValue['direction'] === 'Жаратылыстану' && currentValue['group_name'] === groupName['group_name']
              && (course === null || course === Number(currentValue['course']))) {
            return sum + currentValue['count'];
          }
          return sum;
        }, 0);
        if (countGroup) {
          this.technical.push(countGroup);
          this.technicalTotal += countGroup;
          this.technicalLabels.push({
            label: groupName['group_name'],
            count: countGroup,
            color: this.hColors[ indexT % this.hColors.length]
          });
          labelsT.push(groupName['group_name']);
          indexT++;
        }
      });
      this.chartPlotT.pie.donut.labels.total.label = this.technicalTotal.toString();
      this.chartTech = {
        chart: {
          type: 'donut',
          width: '100%',
        },
        dataLabels: {
          enabled: false
        },
        plotOptions: this.chartPlotT,
        legend: {
          show: false
        },
        labels: labelsT
      };
    }
  }
  // getHumCountSpec(course: number = null) {
  //   if (this.countStatistic['speciality']) {
  //     this.humanitarian = [];
  //     this.humanitarianLabels = [];
  //     this.humanitarianTotal = 0;
  //     let indexH = 0;
  //     const labelsH = [];
  //     Object.entries(this.countStatistic['speciality']).forEach(
  //         ([key, value]) => {
  //           let countGroup = 0;
  //           let groupName = '';
  //           let direction = '';
  //           Object.entries(value).forEach(
  //               ([keyIn, valueIn]) => {
  //                 if (course === null || course === Number(valueIn['course'])) {
  //                   countGroup += Number(valueIn['count']);
  //                   groupName = valueIn['group_name'];
  //                   direction = valueIn['direction'];
  //                 }
  //               }
  //           );
  //           if (direction === 'Гуманитар') {
  //             this.humanitarian.push(countGroup);
  //             this.humanitarianTotal += countGroup;
  //             this.humanitarianLabels.push({
  //               label: groupName,
  //               count: countGroup,
  //               color: this.hColors[ indexH % this.hColors.length]
  //             });
  //             labelsH.push(groupName);
  //             indexH++;
  //           }
  //
  //           this.chartPlotH.pie.donut.labels.total.label = this.humanitarianTotal.toString();
  //
  //           this.chartGum = {
  //             chart: {
  //               type: 'donut',
  //               width: '100%',
  //             },
  //             dataLabels: {
  //               enabled: false
  //             },
  //             plotOptions: this.chartPlotH,
  //             legend: {
  //               show: false
  //             },
  //             labels: labelsH
  //           };
  //         }
  //     );
  //   }
  // }
  // getTechCountSpec(course: number = null) {
  //   if (this.countStatistic['speciality']) {
  //     this.technical = [];
  //     this.technicalLabels = [];
  //     this.technicalTotal = 0;
  //     let indexT = 0;
  //     const labelsT = [];
  //     Object.entries(this.countStatistic['speciality']).forEach(
  //         ([key, value]) => {
  //           let countGroup = 0;
  //           let groupName = '';
  //           let direction = '';
  //           Object.entries(value).forEach(
  //               ([keyIn, valueIn]) => {
  //                 if (course === null || course === Number(valueIn['course'])) {
  //                   countGroup += Number(valueIn['count']);
  //                   groupName = valueIn['group_name'];
  //                   direction = valueIn['direction'];
  //                 }
  //               }
  //           );
  //           if (direction === 'Жаратылыстану') {
  //             this.technical.push(countGroup);
  //             this.technicalTotal += countGroup;
  //             this.technicalLabels.push({
  //               label: groupName,
  //               count: countGroup,
  //               color: this.tColors[ indexT % this.tColors.length]
  //             });
  //             indexT++;
  //             labelsT.push(groupName);
  //           }
  //
  //           this.chartPlotT.pie.donut.labels.total.label = this.technicalTotal.toString();
  //
  //           this.chartTech = {
  //             chart: {
  //               type: 'donut',
  //               width: '100%',
  //             },
  //             dataLabels: {
  //               enabled: false
  //             },
  //             plotOptions: this.chartPlotT,
  //             legend: {
  //               show: false
  //             },
  //             labels: labelsT
  //           };
  //         }
  //     );
  //   }
  // }

  // Month Statistic by report
  async getByUrl(url: string): Promise<any> {
    return this.http.get<any>(url)
        .toPromise()
        .then(response => response)
        .catch();
  }
  applyMonthReport() {
    this.filter.monthReport.loading = true;
    this.changeMonthFilter();
    Object.entries(this.listOfStudentFiltered).forEach(
        ([key, value]) => {
          let avg = 0;
          let avgCount = 0;
          let oldAvg = 0;
          let oldAvgCount = 0;
          if (this.filter.monthReport.semester) {
            const currentSemester = 'semester' + this.filter.monthReport.semester;
            for (let i = 0; i < (value as []).length; i++) {
              if (value[i]['avg'][currentSemester] !== null) {
                avg += value[i]['avg'][currentSemester];
                avgCount++;
              }
            }
          }
          if (this.filter.monthReport.month && this.filter.monthReport.semester == null) {
            const currentMonth = this.filter.monthReport.month;
            let oldMonth = currentMonth - 1;

            if (currentMonth === 2) {
              oldMonth--;
            }
            for (let i = 0; i < (value as []).length; i++) {
              if (value[i]['reports'][currentMonth] && value[i]['reports'][currentMonth]['gradesAvg'] !== null) {
                avg += value[i]['reports'][currentMonth]['gradesAvg'];
                avgCount++;
              }
              if (value[i]['reports'][oldMonth] && value[i]['reports'][oldMonth]['gradesAvg'] !== null && currentMonth !== 9) {
                oldAvg += value[i]['reports'][oldMonth]['gradesAvg'];
                oldAvgCount++;
              }
            }
          }

          if (avgCount === 0) {
            avgCount = 1;
          }
          if (oldAvgCount === 0) {
            oldAvgCount = 1;
          }
          avg = this.round(avg / avgCount);
          oldAvg = this.round(oldAvg / oldAvgCount);
          this.mothReportFiltered[key] = {
            avg: avg,
            oldAvg: oldAvg,
            progress: this.filter.monthReport.semester ? 0 : avg - oldAvg,
          };
        }
    );
    this.filter.monthReport.loading = false;

    // this.mothReportFiltered['PASSPORT'] = {
    //   avg: 0,
    //   oldAvg: 0,
    //   progress: 0,
    // };
  }
  round(value: any): number {
    return Math.round(Number(value));
  }
  abs(value: any): number {
    return Math.abs(Number(value));
  }
  changeMonthFilter() {
    Object.entries(this.listOfStudent).forEach(
        ([key, value]) => {
          this.listOfStudentFiltered[key] = this.listOfStudent[key];
          if (this.filter.monthReport.mentors && this.filter.monthReport.mentors.length) {
            this.listOfStudentFiltered[key] = this.listOfStudent[key].filter(item => {
              return this.filter.monthReport.mentors.includes(item['mentor_id']);
            });
          }
          if (this.filter.monthReport.university && this.filter.monthReport.university.length) {
            this.listOfStudentFiltered[key] = this.listOfStudentFiltered[key].filter(item => {
              return this.filter.monthReport.university.includes(item['university']);
            });
          }
          if (this.filter.monthReport.speciality && this.filter.monthReport.speciality.length) {
            this.listOfStudentFiltered[key] = this.listOfStudentFiltered[key].filter(item => {
              return this.filter.monthReport.speciality.includes(item['speciality']);
            });
          }
          if (this.filter.monthReport.city && this.filter.monthReport.city.length) {
            this.listOfStudentFiltered[key] = this.listOfStudentFiltered[key].filter(item => {
              return this.filter.monthReport.city.includes(item['city']);
            });
          }
          if (this.filter.monthReport.gender) {
            this.listOfStudentFiltered[key] = this.listOfStudentFiltered[key].filter(item => {
              return this.filter.monthReport.gender.toString() === item['gender'].toString();
            });
          }
        }
    );
  }

  // Lingua attendance
  async getAttLin(): Promise<any> {
    return this.http.get<any>(`${environment.apiUrl}/api/dashboard/attendance?${this.prepareFilter('filterAttLin')}`)
        .toPromise()
        .then(response => response)
        .catch();
  }
  async applyAttLin() {
    this.filter.filterAttLin.loading = true;
    this.attLin = await this.getAttLin();
    if (Object.keys(this.attLin).length) {

      Object.entries(this.att).forEach(
          ([key, value]) => {
            value.count = 0;
          }
      );

      Object.entries(this.attLin).forEach(
          ([key, value]) => {
            this.att[key].count = this.round(value[0].count);
          }
      );

      this.attSemMonthChange();
      this.attSetData();
    }
    this.filter.filterAttLin.loading = false;
  }
  ngModelChangeSem() {
    this.attSemMonthChange();
    this.attSetData();
  }
  attSemMonthChange() {
    Object.entries(this.att).forEach(
        ([key, value]) => {
          value.isSelected = false;
        }
    );

    if (this.filter['filterAttLin'].semester) {
      if (this.filter['filterAttLin'].semester === 1) {
        Object.entries(this.att).forEach(
            ([key, value]) => {
              if ([9, 10, 11, 12].includes(Number(key))) {
                value.isSelected = true;
              }
            }
        );
      }
      if (this.filter['filterAttLin'].semester === 2) {
        Object.entries(this.att).forEach(
            ([key, value]) => {
              if ([2, 3, 4, 5].includes(Number(key))) {
                value.isSelected = true;
              }
            }
        );
      }
    } else if (this.filter['filterAttLin'].month.length && this.filter['filterAttLin'].semester == null) {
      for (let i = 0; i < this.filter['filterAttLin'].month.length; i++) {
        this.att[this.filter['filterAttLin'].month[i]].isSelected = true;
      }
    } else {
      Object.entries(this.att).forEach(
          ([key, value]) => {
            value.isSelected = true;
          }
      );
    }
  }
  attSetData() {
    const data = [];
    const categories = [];

    Object.entries(this.att).forEach(([key, value]) => {
      if ([9, 10, 11, 12].includes(Number(key)) && value.isSelected) {
        data.push(value.count);
        categories.push(value.label);
      }
    });

    Object.entries(this.att).forEach(([key, value] ) => {
      if ([2, 3, 4, 5].includes(Number(key)) && value.isSelected) {
        data.push(value.count);
        categories.push(value.label);
      }
    });
    data.unshift(0);
    categories.unshift('');
    data.push(data[data.length - 1]);
    categories.push('');
    this.attendanceEnglish.series = [{
      name: 'Студенттер',
      data: data,
      color: '#3D3DD8'
    }];
    this.attendanceEnglish.xaxis = {
      categories: categories
    };
  }

  // Rating
  async getRatingStudents(course: string = '', filter: string = 'rating'): Promise<any> {
    this.filter[filter].loading = true;
    this.filter[filter].loading = true;
    const filterStr = this.prepareFilter(filter);
    let url = `${environment.apiUrl}/api/dashboard/data/rating/list?${this.prepareFilter(filter)}`;
    if (course.length) {
      url = `${environment.apiUrl}/api/dashboard/data/rating/list/all?cr=${course}`;
      if (filterStr.length) {
        url += `&${filterStr}`;
      }
    }
    return this.http.get<any>(url)
        .toPromise()
        .then(response => {
          if (filter === 'rating12') {
            this.studentData12 = response;
          } else if (filter === 'rating34') {
            this.studentData34 = response;
          }
          this.filter[filter].loading = false;
        } )
        .catch();
  }
  onChangePageIndex(event) { this.pageIndex = event; }
  onChangePageIndex2(event) { this.pageIndex2 = event; }
}
