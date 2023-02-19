import {Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../../../../environments/environment';

@Component({
  selector: 'tc-passport-report-table',
  templateUrl: '../../reading/report-table/report-table.component.html',
  styleUrls: ['../../reading/report-table/report-table.component.scss']
})
export class PassportReportTableComponent implements OnInit, OnChanges, OnDestroy {
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
      r.forEach((item, index) => {
        if (item['reports'] && Object.keys(item['reports']).length) {
          const result = {
            id: item['id'],
            fio: item['value'],
            reports: item['reports'],
            avg : this.getAvgReport('avg', item['students'])
          };
          this.listOfData.push(result);
        }
        if (item['students'] && item['students'].length) {
          item['students'].forEach((st, ins) => {
            if (st['reports'] && Object.keys(st['reports']).length) {
              st['mentor_id'] = item['id'];
              this.listOfStudent.push(st);
            }
          });
        }
      });
      const sort = 'semester' + (this.filter['semester'] ? this.filter['semester'] : 1);
      this.listOfData.sort((a, b) => a.avg[sort] > b.avg[sort] ? -1 : a.avg[sort] < b.avg[sort] ? 1 : 0);
      const data = {
        data: this.listOfData,
        type: 'mPassport',
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
    return this.http.get<any[]>(`${environment.apiUrl}/api/project/grade/passport/reports`)
        .toPromise()
        .then(response => response)
        .catch();
  }

  getAvg(semester: number, index: number): number {
    let result = 0;
    let count = 0;
    const st = semester === 1 || !semester ? 1 : 2;
    this.semester[st].forEach(item => {
      if (
          this.listOfData[index]['reports'][item['value'].toString()]
          && this.listOfData[index]['reports'][item['value'].toString()].hasOwnProperty('gradesAvg')
      ) {
        result += Number(this.listOfData[index]['reports'][item['value'].toString()]['gradesAvg']);
        count++;
      }
    });
    if (this.semester[st].length) {
      return result / this.semester[st].length;
    }
    return result;
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
        type: 'mPassport',
        semester: this.semesterNumber
      };
      this.sendData.emit(data);
    } else {
      const sort = 'semester' + this.semesterNumber;
      this.listOfStudentFiltered.sort((a, b) => a.avg[sort] > b.avg[sort] ? -1 : a.avg[sort] < b.avg[sort] ? 1 : 0);
      const data = {
        data: this.listOfData,
        type: 'mPassport',
        semester: this.semesterNumber
      };
      this.sendData.emit(data);
    }
  }

  getCompare(semester: number, report: any, index: number): string {
    const st = semester === 1 || !semester ? 9 : 2;
    if (index > 0) {
      if (
          report[(st + index).toString()]
          && report[(st + index).toString()].hasOwnProperty('gradesAvg')
          && report[(st + index - 1).toString()]
          && report[(st + index - 1).toString()].hasOwnProperty('gradesAvg')
      ) {
        if (!report[(st + index).toString()]['gradesAvg']) {
          return '';
        }
        let result = 'equal';
        if (report[(st + index).toString()]['gradesAvg'] > report[(st + index - 1).toString()]['gradesAvg']) {
          result = 'up';
        } else if (report[(st + index).toString()]['gradesAvg'] < report[(st + index - 1).toString()]['gradesAvg']) {
          result = 'down';
        }
        return result;
      }
    }
    return '';
  }

  compare(semester: number, report: any, index: number): string {
    const st = semester === 1 || !semester ? 9 : 2;
    if (index >= 0) {
      if (report[(st + index).toString()] && report[(st + index).toString()].hasOwnProperty('gradesAvg')) {
        if (!report[(st + index).toString()]['gradesAvg']) {
          return '';
        }
        let result;
        if (report[(st + index).toString()]['gradesAvg'] >= 75) {
          result = 'higher';
        } else if (report[(st + index).toString()]['gradesAvg'] >= 50) {
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
