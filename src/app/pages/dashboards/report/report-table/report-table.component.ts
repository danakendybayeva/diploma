import {Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../../../../environments/environment';

@Component({
  selector: 'tc-all-report-table',
  templateUrl: './report-table.component.html',
  styleUrls: ['./report-table.component.scss']
})
export class ReportTableComponent implements OnInit, OnChanges, OnDestroy {

  @Output() sendData = new EventEmitter();
  @Input() filter = {};
  @Input() allData = {};
  listOfData: any[] = [];
  listOfStudent: any[] = [];
  listOfStudentFiltered: any[] = [];
  types = [
    { value: 'course', label: 'Menu Courses' },
  ];
  private reportTypes = ['lingua', 'reading', 'passport', 'course', 'seminar', 'eduway', 'edutest', 'practice', 'gpa'];
  semester = {
    1: [
      { value: 9, label: 'September' },
      { value: 10, label: 'October' },
      { value: 11, label: 'November' },
      { value: 12, label: 'December' },
    ],
    2: [
      { value: 2, label: 'February' },
      { value: 3, label: 'March' },
      { value: 4, label: 'April' },
      { value: 5, label: 'May' },
    ]
  };
  isLoading = true;
  compareLevel = {
    lingua : {
      high: 75,
      middle: 50
    },
    reading: {
      high: 75,
      middle: 50
    },
    passport: {
      high: 75,
      middle: 50
    },
    course: {
      high: 75,
      middle: 50
    },
    seminar: {
      high: 75,
      middle: 50
    },
    eduway: {
      high: 1,
      middle: 1
    },
    edutest: {
      high: 75,
      middle: 50
    },
    practice: {
      high: 75,
      middle: 50
    },
    gpa: {
      high: 3,
      middle: 2
    }
  };
  semesterNumber = 1;

  constructor(private http: HttpClient) {
  }

  ngOnInit() {
    this.isLoading = true;
    this.getReports().then(r => {
      r.forEach(item => {
        if (item['students'] && Object.keys(item['students']).length) {
          const result = {
            id: item['id'],
            fio: item['value'],
          };
          Object.values(this.types).forEach(value => {
            const key = value.value;
            result[key] = this.getAvgReport(key, item['students']);
          });
          if (item['students'] && item['students'].length) {
            item['students'].forEach((st, ins) => {
              st['mentor_id'] = item['id'];
              const array = Object.keys(st);
              if (array.filter(value => this.reportTypes.includes(value)).length) {
                this.listOfStudent.push(st);
              }
            });
          }
          this.listOfData.push(result);
        }
      });
      // const sort = 'semester' + (this.filter['semester'] ? this.filter['semester'] : 1);
      // this.listOfData.sort((a, b) => a[t][sort] > b.avg[sort] ? -1 : a.avg[sort] < b.avg[sort] ? 1 : 0);
      const data = {
        data: this.listOfData,
        type: 'all',
        semester: this.semesterNumber
      };
      this.sendData.emit(data);
      this.isLoading = false;
    });
  }

  ngOnChanges(changes) {
    // if (changes.filter && this.filter) {
    //   if (this.filter['semester']) {
    //   } else {
    //     const currentMonth = (new Date()).getMonth() + 1;
    //     if (currentMonth >= 9 && currentMonth <= 12) {
    //       this.filter['semester'] = 1;
    //     } else if (currentMonth >= 2 && currentMonth <= 5) {
    //       this.filter['semester'] = 2;
    //     }
    //   }
    // }
  }

  ngOnDestroy() {
  }

  async getReports(): Promise<any> {
    return this.http.get<any[]>(`${environment.apiUrl}/api/project/grade/all/reports`)
        .toPromise()
        .then(response => response)
        .catch();
  }

  getAvgReport(type: string, report: any[]): object {
    const count = {
      semester1: 0,
      semester2: 0
    };
    const avg = {
      semester1: null,
      semester2: null
    };
    report.forEach(item => {
      Object.keys(avg).forEach(key => {
        if (item.hasOwnProperty(type) && item[type].hasOwnProperty(key) && item[type][key] !== null) {
          avg[key] = avg[key] ? avg[key] : 0.0;
          avg[key] += item[type][key];
          count[key]++;
        }
      });
    });
    Object.keys(avg).forEach(key => {
      if (avg[key] !== null) {
        avg[key] /= count[key];
      }
    });
    return avg;
  }

  filterApply(event) {
    this.semesterNumber = 1;
    if (event['mentors'] && event['mentors'].length) {
      if (event['mentors'].includes('00000000-0000-0000-0000-000000000000')) {
        this.listOfStudentFiltered = this.listOfStudent;
      } else {
        this.listOfStudentFiltered = this.listOfStudent.filter(item => {
          return event['mentors'].includes(item['mentor_id']);
        });
      }
      if (event['university'] && event['university'].length) {
        this.listOfStudentFiltered = this.listOfStudentFiltered.filter(item => {
          return event['university'].includes(item['university']);
        });
      }
      if (event['city'] && event['city'].length) {
        this.listOfStudentFiltered = this.listOfStudentFiltered.filter(item => {
          return event['city'].includes(item['city']);
        });
      }
      if (event['course'] && event['course'].length) {
        this.listOfStudentFiltered = this.listOfStudentFiltered.filter(item => {
          return event['course'].includes(item['course'].toString());
          // return event['course'].includes(item['course']);
        });
      }
      console.log(this.listOfStudentFiltered);
      // this.listOfStudentFiltered = this.listOfStudentFiltered.filter(
      //     (thing, i, arr) => arr.findIndex(t => t.id === thing.id) === i
      // );
      const data = {
        data: this.listOfStudentFiltered,
        type: 'all'
      };
      this.sendData.emit(data);
    } else {
      const data = {
        data: this.listOfData,
        type: 'all',
        semester: this.semesterNumber
      };
      this.sendData.emit(data);
    }
  }

  getCompare(semester: number, report: any, index: number, type: string = 'mocksAvg'): string {
    // tslint:disable-next-line:max-line-length
    // ((filter['semester'] == 1 || !filter['semester']) && data['reports']['10'] && data['reports']['10']['compare'] && data['reports']['10']['compare'] == 'up') || (filter['semester'] == 2 && data['reports']['3'] && data['reports']['3']['compare'] && data['reports']['3']['compare'] == 'up'),
    // tslint:disable-next-line:max-line-length
    // ((filter['semester'] == 1 || !filter['semester']) && data['reports']['10']  && data['reports']['10']['compare'] && data['reports']['10']['compare'] == 'down') || (filter['semester'] == 2 && data['reports']['3'] && data['reports']['3']['compare'] && data['reports']['3']['compare'] == 'down')
    return '';
    const st = (semester === 1 || !semester) ? 9 : 2;
    if (index > 0) {
      if (
          report[(st + index).toString()]
          && report[(st + index).toString()].hasOwnProperty(type)
          && report[(st + index - 1).toString()]
          && report[(st + index - 1).toString()].hasOwnProperty(type)
      ) {
        if (type === 'mocksAvg' && !report[(st + index).toString()]['mocks'].length) {
          return '';
        }
        let result = 'equal';
        if (report[(st + index).toString()][type] > report[(st + index - 1).toString()][type]) {
          result = 'up';
        } else if (report[(st + index).toString()][type] < report[(st + index - 1).toString()][type]) {
          result = 'down';
        }
        return result;
      }
    }
    return '';
  }

  compare(data: number, type: string, st: string): string {
    const avg = (data.hasOwnProperty(type) && data[type].hasOwnProperty(st) && data[type][st] !== null) ? data[type][st] : null;
    if (avg === undefined || avg === null) {
      return '';
    }
    let result = '';
    if (avg >= this.compareLevel[type]['high']) {
      result = 'higher';
    } else if (avg >= this.compareLevel[type]['middle']) {
      result = 'middle';
    } else {
      result = 'lower';
    }
    return result;
  }

}
