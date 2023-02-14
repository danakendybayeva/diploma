import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormsModule } from '@angular/forms';

import { Store } from '@ngrx/store';
import {BasePageComponent} from '../../../../../base-page';
import { HttpService } from '../../../../../../services/http/http.service';
import {IAppState} from '../../../../../../interfaces/app-state';
import {IOption} from '../../../../../../ui/interfaces/option';

import {StudentService, Student, Experience, Roles} from '../../../../../../interfaces/services/student.service';
import {EduType, StudentList} from '../../../../../../interfaces/services/studentList.service';
import {environment} from '../../../../../../../environments/environment';
import {map} from 'rxjs/operators';
import {HttpClient} from '@angular/common/http';
import {ActivatedRoute, Router} from '@angular/router';
import {TCModalService} from '../../../../../../ui/services/modal/modal.service';
import {Content} from '../../../../../../ui/interfaces/modal';
import { ToastrService } from 'ngx-toastr';
// import { fs } from 'fs-extra';
import * as PageActions from '../../../../../../store/actions/page.actions';
import {Status} from '../../../../../../interfaces/services/util.service';
import {Company, Course, LessonTest, Module, Package, Test, Video} from '../../../../../../interfaces/services/projects/courses.service';

@Component({
  selector: 'add-module',
  templateUrl: './add-module.component.html',
  styleUrls: ['./add-module.component.scss']
})
export class AddModuleComponent extends BasePageComponent implements OnInit {
  basicForm: FormGroup;
  succesCode = '';
  errorCode = '';

  showUploadAvatar: any;
  photoWallAvatar: any;
  previewVisibleAvatar: boolean;
  previewImageAvatar: string | undefined;
  fileAvatar = new FormData();

  showUploadBackground: any;
  photoWallBackground: any;
  previewVisibleBackground: boolean;
  previewImageBackground: string | undefined;
  fileBackground = new FormData();

  apiUrl = '';
  lessons: Video[] = [];
  module: Module = {
    id: '',
    title: '',
    description: '',
    videoNum: 0,
    orderNum: 1,
    coursesId: '',
    access: false,
    finished: false,
    studying: false,
    videos: []
  };
  test: Test = { id: '', question: '', answer: [], variants: [''], answerNum: 0 };
  lessonTests: LessonTest[] = [{ id: '', test: [] }];

  id = '';
  moduleId = '';

  packages: any[] = [];
  language: any[] = [
    {value: 'kz', label: 'Қазақша'},
    {value: 'ru', label: 'Русский'},
    {value: 'en', label: 'English'},
  ];
  active: any[] = [
    {value: 1, label: 'Active'},
    {value: 2, label: 'Disable'},
  ];
  selectActive = 2;

  tags: any[] = [];

  bslide: boolean[] = [false];
  title = 'New Module';

  constructor(store: Store<IAppState>, httpSv: HttpService,
              private formBuilder: FormBuilder,
              private http: HttpClient, private router: Router,
              private route: ActivatedRoute,
              private modal: TCModalService,
              private toastr: ToastrService) {
    super(store, httpSv);
    this.pageData = {
      title: this.title,
      loaded: true,
      // breadcrumbs: [
      //   {
      //     title: 'link 1',
      //     route: ''
      //   },
      //   {
      //     title: 'Typography'
      //   }
      // ]
    };

    if (this.route.snapshot.params['courseId']) {
      this.id = this.route.snapshot.params['courseId'];
      this.module.coursesId = this.route.snapshot.params['courseId'];
    }
    if (this.route.snapshot.params['moduleId']) {
      this.moduleId = this.route.snapshot.params['moduleId'];
      this.getModule();
    }

    this.succesCode = 'Successfully saved!';
    this.errorCode = 'Not saved!';

    this.apiUrl = environment.apiUrl;
  }

  initBasicForm() {
    this.basicForm = this.formBuilder.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    });
  }

  ngOnInit() {
    super.ngOnInit();
    this.initBasicForm();
    this.getCourse();
  }

  initTable(): void {
    setTimeout(
        () => this.store.dispatch(new PageActions.Update({ loaded: true })),
        0
    );
  }

  getCourse() {
    super.setLoaded();
    return this.http.get<Course>(`${environment.apiUrl}/api/project/courses/course/${this.id}`)
        .pipe(map(data => {
          return data;
        }))
        .subscribe(data => {
          this.title += ' - ' + data.title;
        });
  }

  getModule() {
    super.setLoaded();
    return this.http.get<Module>(`${environment.apiUrl}/api/project/courses/modules/get/${this.moduleId}`)
        .pipe(map(data => {
          return data;
        }))
        .subscribe(data => {
          this.module = data;
        });
  }

  saveModule() {
    let sUrl = `${environment.apiUrl}/api/project/courses/modules/new`;
    if (this.moduleId && this.moduleId !== '') {
      sUrl = `${environment.apiUrl}/api/project/courses/modules/update`;
    }
    console.log(this.module);
    return this.http.post<Status>(sUrl, this.module)
        .subscribe({
          next: data => {
            if (data.status === 1) {
              this.toastr.success('Saved!', 'Success', { closeButton: true });
            } else {
              this.toastr.error(data.message, 'Error', { closeButton: true });
            }
          },
          error: error => {
            this.toastr.error('Not saved!', 'Error', { closeButton: true });
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

  closeModal() {
    this.modal.close();
  }

  submitModal() {
    this.modal.close();
    this.saveModule();
    // this.saveProfileAllDetailsuploadAvatar();
    // if (this.fileAvatar.has('file')) {
    //   this.saveProfileAllDetailsuploadAvatar();
    // } else {
    //   this.saveProfileAllDetails();
    // }
  }

  deleteCompany() {
    if (this.id) {
      this.http.delete<Status>(`${environment.apiUrl}/api/company/delete/${this.id}`)
          .subscribe({
            next: data => {
              if (data.status === 1) {
                this.toastr.success(data.message, 'Success', { closeButton: true });
              } else {
                this.toastr.success(data.message, 'Warning', { closeButton: true });
              }
            },
            error: error => {
              this.toastr.error('Not saved!', 'Error', { closeButton: true });
            }
          });
    }
  }

  trackByIdx(index: number, obj: any): any {
    return index;
  }

}
