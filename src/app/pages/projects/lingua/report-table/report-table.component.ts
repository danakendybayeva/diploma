import { Component, Input, Output, OnChanges, OnDestroy, OnInit, EventEmitter } from '@angular/core';
import { environment } from '../../../../../environments/environment';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'tc-lingua-report-table',
  templateUrl: './report-table.component.html',
  styleUrls: ['./report-table.component.scss'],
})
export class LinguaReportTableComponent implements OnInit, OnChanges, OnDestroy {
  @Output() sendData = new EventEmitter();
  @Output() toAllData = new EventEmitter();
  @Input() filter = {};
  listOfData: any[] = [];
  listOfStudent: any[] = [];
  listOfStudentFiltered: any[] = [];
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
  semesterNumber = 1;

  constructor(private http: HttpClient) {
  }

  ngOnInit() {
    this.isLoading = true;
    this.getReports().then(r => {
      r.forEach(item => {
        if (item['reports'] && Object.keys(item['reports']).length) {
          Object.entries(item['reports']).forEach(([key, report]) => {
            report['mocks'] = [];
          });
          const result = {
            id: item['id'],
            fio: item['value'],
            reports: item['reports'],
            final: this.getAvgReport('final', item['students']),
            avg: this.getAvgReport('avg', item['students']),
          };
          if (item['students'] && item['students'].length) {
            item['students'].forEach((st, ins) => {
              if (st['reports'] && Object.keys(st['reports']).length) {
                st['mentor_id'] = item['id'];
                Object.entries(st['reports']).forEach(([key, report]) => {
                  result.reports[key]['mocks'] = result.reports[key]['mocks'].concat(report['mocks']);
                });
                this.listOfStudent.push(st);
              }
            });
          }
          this.listOfData.push(result);
        }
      });
      const sort = 'semester' + (this.filter['semester'] ? this.filter['semester'] : 1);
      this.listOfData.sort((a, b) => a.avg[sort] > b.avg[sort] ? -1 : a.avg[sort] < b.avg[sort] ? 1 : 0);
      const data = {
        data: this.listOfData,
        type: 'lingua',
        semester: this.semesterNumber
      };
      this.sendData.emit(data);
      this.toAllData.emit(data);
      this.isLoading = false;
    });
  }

  ngOnChanges(changes) {
    if (changes.filter && this.filter) {
      if (this.filter['semester']) {
      } else {
        const currentMonth = (new Date()).getMonth() + 1;
        if (currentMonth >= 9 && currentMonth <= 12) {
          this.filter['semester'] = 1;
        } else if (currentMonth >= 2 && currentMonth <= 5) {
          this.filter['semester'] = 2;
        }
      }
    }
  }

  ngOnDestroy() {
  }

  async getReports(): Promise<any> {
    return this.http.get<any[]>(`${environment.apiUrl}/api/project/grade/lingua/reports`)
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
        if (item[type][key] !== null) {
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
    this.semesterNumber = event['semester'] === 1 || !event['semester'] ? 1 : 2;
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
      const sort = 'semester' + this.semesterNumber;
      this.listOfStudentFiltered.sort((a, b) => a.avg[sort] > b.avg[sort] ? -1 : a.avg[sort] < b.avg[sort] ? 1 : 0);
      this.listOfStudentFiltered = this.listOfStudentFiltered.filter(
        (thing, i, arr) => arr.findIndex(t => t.id === thing.id) === i
      );
      const data = {
        data: this.listOfStudentFiltered,
        type: 'lingua',
        semester: this.semesterNumber
      };
      this.sendData.emit(data);
    }
    else {
      const data = {
        data: this.listOfData,
        type: 'lingua',
        semester: this.semesterNumber
      };
      this.sendData.emit(data);
    }
  }

  getCompare(semester: number, report: any, index: number, type: string = 'mocksAvg'): string {
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
        } else if (!report[(st + index).toString()][type]) {
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

  compare(semester: number, report: any, index: number, type: string = 'mocksAvg'): string {
    const st = semester === 1 || !semester ? 9 : 2;
    if (index >= 0) {
      if (report[(st + index).toString()] && report[(st + index).toString()].hasOwnProperty(type)) {
        if (type === 'mocksAvg' && !report[(st + index).toString()]['mocks'].length) {
          return '';
        } else if (!report[(st + index).toString()][type]) {
          return '';
        }
        let result;
        if (report[(st + index).toString()][type] >= 75) {
          result = 'higher';
        } else if (report[(st + index).toString()][type] >= 50) {
          result = 'middle';
        } else {
          result = 'lower';
        }
        return result;
      }
    }
    return '';
  }
}
