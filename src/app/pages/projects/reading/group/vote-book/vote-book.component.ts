import {Component, EventEmitter, OnDestroy, OnInit} from '@angular/core';

import {FolderExtendComponent} from '../../../../reference/external/folder';
import {environment} from '../../../../../../environments/environment';
import {IPageContent} from '../../../../../interfaces/services/page/page-content';
import {map} from 'rxjs/operators';
import {Status} from '../../../../../interfaces/services/util.service';
import {Content} from '../../../../../ui/interfaces/modal';
import {NzPlacementType} from 'ng-zorro-antd';

@Component({
  selector: 'rd-vote-book-table-list',
  // templateUrl: '../../../../reference/folder/folder.component.html',
  templateUrl: './vote-book.component.html',
  styleUrls: ['./vote-book.component.scss', '../../../../reference/folder/folder.component.scss'],
})
export class RDVoteBookComponent extends FolderExtendComponent implements OnInit, OnDestroy {
  groupId = '';
  periodId = '';
  selectedBook = false;

  bookOption = [];
  fieldsData = {};
  books = [];
  selectedBooks = [];

  userBookProfiles = [];
  loadingUserBook = false;
  toogle = [];
  setbook: any;

  students = [];
  allBooks = [];
  studentSelect = [];
  bookSelect = null;
  isLoaded = false;
  removingId = null;

  closeDropdown: EventEmitter<boolean>;

  async initRoute() {
    // this.referenceId = 'c7d80924-a18b-4546-9647-4e6436c59e16';
    // this.sectionId = 'e39b21a1-c83f-413e-aace-0654c0b082de';
    this.closeDropdown = new EventEmitter<boolean>();
    this.pageSize = 200;

    this.enableFilter = true;
    this.fixPage = true;

    if (this.route.snapshot.params['groupId']) {
      this.groupId = this.route.snapshot.params['groupId'];
    }
    if (this.route.snapshot.params['periodId']) {
      this.periodId = this.route.snapshot.params['periodId'];
    }

    this.getListRefRecord();
    this.getUserBookProfile();
    this.getStudentBook();
    this.getBooks();
  }

  async getListRefRecord() {
    this.loading = true;
    this.initTable();
    this.http.get<any[]>(`${environment.apiUrl}/api/project/reading/books/list`)
        .pipe(map(data => {
          return data;
        }))
        .subscribe(data => {
          if (data.length) {
            for (let i = 0; i < data.length; i++) {
              this.books.push({
                label: data[i]['display_name'],
                value: data[i]['id']
              });
            }
          } else {
            this.isEmpty = true;
          }
        });
    return this.http.get<any[]>(`${environment.apiUrl}/api/project/reading/period/report/${this.groupId}/${this.periodId}`)
        .pipe(map(data => {
          return data;
        }))
        .subscribe(data => {
          if (data.length) {
            this.dataRecord = data;
            this.checkData = new Array(this.dataRecord.length).fill(false);
            for (let i = 0; i < this.dataRecord.length; i++) {
              if (this.dataRecord[i]['selectedBook']) {
                this.selectedBook = true;
              }
              this.bookOption.push({
                label: this.dataRecord[i]['display_name'],
                value: this.dataRecord[i]['id']
              });
            }
            if (this.selectedBook) {
              this.getUserBookProfile();
            }
            this.loading = false;
          } else {
            this.isEmpty = true;
          }
          this.loading = false;
        });
  }

  mapToString(data: any[]): string {
    const result = [];
    if (data && data.length) {
      data.forEach(item => {
        if (item['value']) {
          result.push(item['value'].toString());
        }
      });
    }

    return result.join(', ');
  }

  prepareNavigateLink(id) {
    return ['/vertical/restaurant/order/view', id];
  }

  confirmBook() {
    let indexBook = -1;
    let bookId = '';
    for (let i = 0; i < this.checkData.length; i++) {
      if (this.checkData[i]) {
        indexBook = i;
        bookId = this.dataRecord[indexBook]['id'];
        break;
      }
    }
    if (bookId) {
      this.loading = true;
      return this.http.post<Status>(`${environment.apiUrl}/api/project/reading/user/add/${this.groupId}/${bookId}`, {})
          .subscribe({
            next: data => {
              if (data.status === 1) {
                this.toastr.success(data.message, 'Success', {closeButton: true});
              } else {
                this.toastr.error(data.message, 'Error', {closeButton: true});
              }
              this.loading = false;
            },
            error: error => {
              this.toastr.error('Not saved!', 'Error', {closeButton: true});
              this.loading = false;
            }
          });
    }
  }

  selectBook(index) {
    this.checkData.forEach((item, key) => {
      if (key !== index) {
        this.checkData[key] = false;
      }
    });
  }

  getUserBookProfile() {
    this.loadingUserBook = true;
    this.initTable();
    return this.http.get<any[]>(`${environment.apiUrl}/api/project/reading/user/get/list/members/${this.groupId}/${this.periodId}`)
        .pipe(map(data => {
          return data;
        }))
        .subscribe(data => {
          if (data.length) {
            this.toogle = new Array(data.length).fill(false);
            this.userBookProfiles = data;
            for (let i = 0; i < this.userBookProfiles.length; i++) {
              if (!this.userBookProfiles[i]['grade']) {
                this.userBookProfiles[i]['nan'] = true;
              }
            }
          }
          this.loadingUserBook = false;
        });
  }

  setGradeBook(userBook: any) {
    if (userBook != null) {
      let check = true;
      if (userBook['nan'] === true) {
        userBook['grade'] = 0;
      } else if (!userBook['grade'] || (userBook['grade'] > 100 || userBook['grade'] < 0)) {
        check = false;
      }
      if (check) {
        return this.http.post<Status>(`${environment.apiUrl}/api/project/reading/user/set/grade/${userBook['id']}`,
            {grade: userBook['grade']})
            .subscribe({
              next: data => {
                if (data.status === 1) {
                  if (!userBook['grade']) {
                    userBook['nan'] = true;
                  }
                  this.toastr.success(data.message, 'Success', {closeButton: true});
                } else {
                  this.toastr.error(data.message, 'Error', {closeButton: true});
                }
                this.loading = false;
              },
              error: error => {
                this.toastr.error('Not saved!', 'Error', {closeButton: true});
                this.loading = false;
              }
            });
      } else {
        this.toastr.error('Grade is not valid!', 'Error', {closeButton: true});
      }
    }
  }

  setBook(userBook: any, index: number = -1, number: any) {
    if (userBook != null && userBook['bookId'] !== this.setbook) {
      return this.http.post<Status>(`${environment.apiUrl}/api/project/reading/user/set/${userBook['id']}/${userBook['bookId']}`, {})
          .subscribe({
            next: data => {
              if (data.status === 1) {
                this.toastr.success(data.message, 'Success', {closeButton: true});
                userBook['bookName'] = data.value;
                this.toogle[index] = false;
              } else {
                this.toastr.error(data.message, 'Error', {closeButton: true});
              }
              this.loading = false;
            },
            error: error => {
              this.toastr.error('Not saved!', 'Error', {closeButton: true});
              this.loading = false;
            }
          });
    }
  }

  addVotedBook() {
    this.http.post<Status>(`${environment.apiUrl}/api/project/reading/user/add/book/${this.groupId}/${this.periodId}`, {
      book: this.bookSelect, students: this.studentSelect
    })
        .subscribe({
          next: data => {
            if (data.status === 1) {
              this.toastr.success(data.message, 'Success', {closeButton: true});
              this.getListRefRecord();
              this.getUserBookProfile();
              this.studentSelect = [];
              this.bookSelect = null;
            } else {
              this.toastr.error(data.message, 'Error', {closeButton: true});
            }
            this.modal.close();
          },
          error: error => {
            this.toastr.error('Not saved!', 'Error', {closeButton: true});
            this.loading = false;
            this.modal.close();
          }
        });
  }

  openModal<T>(body: Content<T>, header: Content<T> = null, footer: Content<T> = null, options: any = null) {
    this.modal.open({
      body: body,
      header: header,
      footer: footer,
      options: options
    });
  }

  openModalDelete<T>(body: Content<T>, header: Content<T> = null, footer: Content<T> = null, options: any = null, id = null) {
    this.modal.open({
      body: body,
      header: header,
      footer: footer,
      options: options
    });
    this.removingId = id;
  }

  closeModal() {
    this.modal.close();
  }

  getStudentBook() {
    return this.http.get<any[]>(`${environment.apiUrl}/api/project/reading/group/list/student/${this.groupId}`)
        .pipe(map(data => {
          return data;
        }))
        .subscribe(data => {
          this.students = [];
          data.forEach(item => {
            this.students.push({value: item['id'], label: item['value']});
          });
          this.isLoaded = true;
        });
  }

  getBooks() {
    return this.http.get<any[]>(`${environment.apiUrl}/api/project/reading/books/list`)
        .pipe(map(data => {
          return data;
        }))
        .subscribe(data => {
          this.allBooks = [];
          data.forEach(item => {
            this.allBooks.push({value: item['id'], label: item['display_name']});
          });
          this.isLoaded = true;
        });
  }

  removeVotedBook() {
    this.http.post<Status>(`${environment.apiUrl}/api/project/reading/user/remove/book/${this.removingId}`, {
      book: this.bookSelect, students: this.studentSelect
    })
        .subscribe({
          next: data => {
            if (data.status === 1) {
              this.toastr.success(data.message, 'Success', {closeButton: true});
              this.getListRefRecord();
              this.getUserBookProfile();
              this.studentSelect = [];
              this.bookSelect = null;
            } else {
              this.toastr.error(data.message, 'Error', {closeButton: true});
            }
            this.modal.close();
          },
          error: error => {
            this.toastr.error('Not saved!', 'Error', {closeButton: true});
            this.loading = false;
            this.modal.close();
          }
        });
  }

  change(grade: any) {
    if (grade === '') {
      grade = null;
    }
  }
}
