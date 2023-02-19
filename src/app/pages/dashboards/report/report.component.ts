import {Component, ElementRef, HostListener, OnDestroy, OnInit, ViewChild} from '@angular/core';

import {Store} from '@ngrx/store';
import {BasePageComponent} from '../../base-page';
import {IAppState} from '../../../interfaces/app-state';
import {HttpService} from '../../../services/http/http.service';
import {IGroup} from 'src/app/ui/interfaces/group';
import {Status} from '../../../interfaces/services/util.service';
import {environment} from '../../../../environments/environment';
import {HttpClient} from '@angular/common/http';

@Component({
  selector: 'page-report',
  templateUrl: './report.component.html',
  styleUrls: ['./report.component.scss'],
})
export class ReportComponent extends BasePageComponent implements OnInit, OnDestroy {
  currentIndex: Number = 0;
  lingua = null;
  books = null;
  courses = null;
  seminar = null;
  eduway = null;
  edutest = null;
  practice = null;
  mPassport = null;
  gpa = null;
  allReport = null;
  filterMore = {
    lingua: {},
    books: {}
  };
  scrollIcon = 'icofont-arrow-down';
  scrolled = false;
  semester = 1;

  @ViewChild('top') top: ElementRef;
  @ViewChild('bottom') bottom: ElementRef;

  constructor(store: Store<IAppState>, httpSv: HttpService, private http: HttpClient) {
    super(store, httpSv);

    this.pageData = {
      title: 'Report',
      loaded: true
    };
  }

  ngOnInit() {
    super.ngOnInit();
    this.setLoaded();
  }

  ngOnDestroy() {
    super.ngOnDestroy();
  }
  @HostListener('mousewheel', ['$event'])
  onMousewheel(event) {
    if ((this.top !== undefined) && (this.top !== null)) {
      const viewportHeight = window.innerHeight || document.documentElement.clientHeight;
      const topRef = this.top.nativeElement.getBoundingClientRect();
      this.scrolled = !(topRef.bottom > 0 && topRef.bottom <= viewportHeight && topRef.top >= 0);
      this.changeScrollButton();
    }
    if ((this.bottom !== undefined) && (this.bottom !== null)) {
      const viewportHeight = window.innerHeight || document.documentElement.clientHeight;
      const bottomRef = this.bottom.nativeElement.getBoundingClientRect();
      this.scrolled = bottomRef.bottom > 0 && bottomRef.bottom <= viewportHeight && bottomRef.top >= 0;
      this.changeScrollButton();
    }
  }

  scrollToBottom(el: HTMLElement) {
    this.scrolled = !this.scrolled;
    this.changeScrollButton();
    el.scrollIntoView();
  }
  changeScrollButton() {
    if (this.scrolled) {
      this.scrollIcon = 'icofont-arrow-up';
    } else {
      this.scrollIcon = 'icofont-arrow-down';
    }
  }


  async downloadExcell() {
    let data = {};
    let isLingua = false;
    let fileName = 'file';
    switch (this.currentIndex) {
      case 0:
        data = this.lingua;
        fileName = 'Lingua report';
        isLingua = true;
        break;
      case 1:
        data = this.books;
        fileName = 'Book Report';
        break;
      case 2:
        data = this.mPassport;
        fileName = 'Mugalim Passport Report';
        break;
      case 3:
        data = this.courses;
        fileName = 'Courses Report';
        break;
      case 4:
        data = this.seminar;
        fileName = 'Seminar Report';
        break;
      case 5:
        data = this.eduway;
        fileName = 'Eduway Report';
        break;
      case 6:
        data = this.edutest;
        fileName = 'Edutest Report';
        break;
      case 7:
        data = this.practice;
        fileName = 'Experience Report';
        break;
      case 8:
        data = this.gpa;
        fileName = 'GPA Report';
        break;
      case 9:
        data = this.allReport;
        fileName = 'All Report';
        break;
    }
    if (isLingua) {
      await this.http.post<any[]>(`${environment.apiUrl}/api/media/file/excel/lingua-report/${this.semester}`, data)
          .toPromise()
          .then(response => response)
          .catch();
    } else if (fileName === 'GPA Report') {
      await this.http.post<any[]>(`${environment.apiUrl}/api/media/file/excel/semester-report`, data)
          .toPromise()
          .then(response => response)
          .catch();
    } else if (fileName === 'Eduway Report') {
      await this.http.post<any[]>(`${environment.apiUrl}/api/media/file/excel/eduway-report/${this.semester}`, data)
          .toPromise()
          .then(response => response)
          .catch();
    } else if (fileName === 'All Report') {
      // console.log(data);
      await this.http.post<any[]>(`${environment.apiUrl}/api/media/file/excel/mentor-semester-report`, data)
          .toPromise()
          .then(response => response)
          .catch();
    } else {
      await this.http.post<any[]>(`${environment.apiUrl}/api/media/file/excel/report/${this.semester}`, data)
          .toPromise()
          .then(response => response)
          .catch();
    }
    return this.http.get(`${environment.apiUrl}/api/media/file/excel/download`,
        {responseType: 'blob' as 'json'}).subscribe(
        (response: any) => {
          const dataType = response.type;
          const binaryData = [];
          binaryData.push(response);
          const downloadLink = document.createElement('a');
          downloadLink.href = window.URL.createObjectURL(new Blob(binaryData, {type: dataType}));
          // if (filename) {
          downloadLink.setAttribute('download', `${fileName}.xlsx`);
          // }
          document.body.appendChild(downloadLink);
          downloadLink.click();
        }
    );
  }

  getExcellData(data: any) {
    const type: String  = data.type;
    this.semester = data.semester;
    data = data.data;
    switch (type) {
      case 'lingua':
        this.lingua = data;
        break;
      case 'mPassport':
        this.mPassport = data;
        break;
      case 'books':
        this.books = data;
        break;
      case 'course':
        this.courses = data;
        break;
      case 'seminar':
        this.seminar = data;
        break;
      case 'eduway':
        this.eduway = data;
        break;
      case 'edutest':
        this.edutest = data;
        break;
      case 'practice':
        this.practice = data;
        break;
      case 'gpa':
        this.gpa = data;
        break;
      case 'all':
        this.allReport = data;
        break;
    }
  }
}
