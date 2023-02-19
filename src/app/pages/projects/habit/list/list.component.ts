import {Component, OnDestroy, OnInit} from '@angular/core';
import {environment} from '../../../../../environments/environment';
import {FormBuilder, FormGroup} from '@angular/forms';
import {Store} from '@ngrx/store';
import {IAppState} from '../../../../interfaces/app-state';
import {HttpService} from '../../../../services/http/http.service';
import {ActivatedRoute, Router} from '@angular/router';
import {HttpClient} from '@angular/common/http';
import {UserService} from '../../../../user/_services/user.service';
import {FieldService} from '../../../../interfaces/services/reference/field.service';
import {ToastrService} from 'ngx-toastr';
import {TCModalService} from '../../../../ui/services/modal/modal.service';
import {Status} from '../../../../interfaces/services/util.service';
import {map} from 'rxjs/operators';
import {NzUploadFile} from 'ng-zorro-antd/upload';
import {Observable, Observer} from 'rxjs';
import {BasePageComponent} from '../../../base-page';

@Component({
  selector: 'habit-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class HabitListComponent extends BasePageComponent implements OnInit, OnDestroy {

  innerValue: any[] = [];
  avatarUrl: string;

  apiUrl = environment.apiUrl;
  labelForm: FormGroup;
  habits = [];

  activeIndex;
  visibleDraw = false;
  dataDraw = {};
  removeIndex: number;

  loading = false;
  isAdmin = false;
  isEmpty = false;
  loadingHabit = false;
  loadingAddHabit = false;

  canEdit = false;
  canDelete = false;

  constructor(store: Store<IAppState>,
              httpSv: HttpService,
              protected formBuilder: FormBuilder,
              private route: ActivatedRoute,
              private http: HttpClient,
              private router: Router,
              private userService: UserService,
              private fieldService: FieldService,
              private toastr: ToastrService,
              private modal: TCModalService,
  ) {
    super(store, httpSv);
    this.pageData = {
      title: 'Passport Direction',
      loaded: true
    };
  }

  async ngOnInit() {
    super.ngOnInit();
    this.setLoaded();
    this.loading = true;
    this.getHabits();
    this.isAdmin = await this.userService.isAdmin();
  }

  createForm() {
    this.labelForm = new FormGroup({});
    // this.labelForm.addControl('image', this.formBuilder.control(this.passport['image'], [Validators.required]));
    // this.labelForm.addControl('photo', this.formBuilder.control(this.passport.title, [Validators.required]));
  }

  postRequest(url, postParam): Promise<Status> {
    return this.http.post<Status>(url, postParam)
        .toPromise()
        .then(response => response as Status)
        .catch();
  }

  deleteRequest(url): Promise<Status> {
    return this.http.delete<Status>(url)
        .toPromise()
        .then(response => response as Status)
        .catch();
  }

  getHabits() {
      const url = `${environment.apiUrl}/api/calendar/habits/list`;
      return this.http.get<any>(url)
          .pipe(map(data => {
            return data;
          }))
          .subscribe(
              async data => {
                if (Object.keys(data).length) {
                  this.habits = data;
                  this.loading = false;
                } else {
                  this.isEmpty = true;
                }
              },
              error => {
                this.isEmpty = true;
              });
  }

  addHabit() {
    this.loadingAddHabit = true;
    this.habits.push({display_name: '', description: ''});
    this.openDraw(this.habits.length - 1);
  }

  async saveHabit() {
    this.loadingHabit = true;
    // if (this.dataDraw['display_name'].split(' ').size > 2) {
    //   this.toastr.error('Title max 2 words', 'Error', {closeButton: true});
    //   this.loadingHabit = false;
    // } else {
      const body = {
        id: this.dataDraw['id'] ? this.dataDraw['id'] : '',
        display_name: this.dataDraw['display_name'],
        description: this.dataDraw['description']
      };
      const result = await this.postRequest(`${environment.apiUrl}/api/calendar/new/habit`, body);
      if (result.status === 1) {
        this.toastr.success(result.message, 'Success', {closeButton: true});
        this.dataDraw = result.value;
        this.habits[this.activeIndex] = this.dataDraw;
      } else {
        this.toastr.error(result.message, 'Error', {closeButton: true});
      }
      this.modal.close();
      this.closeDraw();
      this.loadingHabit = false;
      this.loadingAddHabit = false;
    // }
  }

  async removeHabit(removeIndex: number) {
    this.loading = true;
    if (this.habits[removeIndex]['id']) {
      const result = await this.deleteRequest(`${environment.apiUrl}/api/calendar/remove/habit/${this.habits[removeIndex]['id']}`);
      if (result.status === 1) {
        this.toastr.success(result.message, 'Success', {closeButton: true});
        this.habits.splice(removeIndex, 1);
        this.modal.close();
        if (this.visibleDraw) {
          this.closeDraw();
        }
        this.loading = false;
      } else {
        this.toastr.error(result.message, 'Error', {closeButton: true});
        this.loading = false;
      }
    } else {
      this.habits.splice(removeIndex, 1);
      this.modal.close();
      if (this.visibleDraw) {
        this.closeDraw();
      }
      this.loading = false;
    }
  }

  openModalRemove(
      body: any,
      header: any = null,
      footer: any = null,
      options: any = null,
      index: number = -1
  ) {
    this.removeIndex = index;
    this.modal.open({
      body: body,
      header: header,
      footer: footer,
      options: options
    });
  }

  closeModal() {
    this.modal.close();
  }

  openDraw(index: number): void {
    this.visibleDraw = true;
    this.dataDraw['id'] = this.habits[index]['id'];
    this.dataDraw['display_name'] = this.habits[index]['display_name'];
    this.dataDraw['description'] = this.habits[index]['description'];
    this.dataDraw['isExists'] = this.habits[index]['isExists'];
    this.activeIndex = index;
  }

  closeDraw(): void {
    this.visibleDraw = false;
    this.habits = this.habits.filter(item => item['id'] !== undefined);
    this.dataDraw = {};
  }

}
