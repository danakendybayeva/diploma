import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormsModule } from '@angular/forms';

import { Store } from '@ngrx/store';
import {BasePageComponent} from '../../../../../base-page';
import { HttpService } from '../../../../../../services/http/http.service';
import {IAppState} from '../../../../../../interfaces/app-state';

import {environment} from '../../../../../../../environments/environment';
import {HttpClient} from '@angular/common/http';
import {ActivatedRoute, Router} from '@angular/router';
import {TCModalService} from '../../../../../../ui/services/modal/modal.service';
import {Content} from '../../../../../../ui/interfaces/modal';
import { ToastrService } from 'ngx-toastr';
import * as PageActions from '../../../../../../store/actions/page.actions';
import {Status} from '../../../../../../interfaces/services/util.service';
import {
  Company,
  Test,
  Video, VideoPayload
} from '../../../../../../interfaces/services/projects/courses.service';

@Component({
  selector: 'add-lesson',
  templateUrl: './add-lesson.component.html',
  styleUrls: ['./add-lesson.component.scss']
})
export class AddLessonComponent extends BasePageComponent implements OnInit {
  basicForm: FormGroup;
  succesCode = '';
  errorCode = '';

  apiUrl: string = '';
  company: Company = {
    id: '',
    title: '',
    description: '',
    image: '',
    logo: '',
    views: 0
  };
  lesson: VideoPayload = {
    id: '',
    title: '',
    modulesId: '',
    coursesId: '',
    description: '',
    linkVideo: '',
    duration: 0,
    test: [],
    point: 0,
    orderNum: 1,
    access: false,
    studying: false,
    previousId: '',
    nextId: '',
    videoStatus: '',
    company: this.company
  };

  constructor(store: Store<IAppState>, httpSv: HttpService,
              private formBuilder: FormBuilder,
              private http: HttpClient, private router: Router,
              private route: ActivatedRoute,
              private modal: TCModalService,
              private toastr: ToastrService) {
    super(store, httpSv);
    this.pageData = {
      title: 'New Lesson',
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
    if (this.route.snapshot.params['lessonId']) {
      this.lesson.id = this.route.snapshot.params['lessonId'];
    }
    if (this.route.snapshot.params['courseId']) {
      this.lesson.coursesId = this.route.snapshot.params['courseId'];
    }
    if (this.route.snapshot.params['moduleId']) {
      this.lesson.modulesId = this.route.snapshot.params['moduleId'];
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
  }

  initTable(): void {
    setTimeout(
        () => this.store.dispatch(new PageActions.Update({ loaded: true })),
        0
    );
  }

  // getCompany(id: string) {
  //   this.initTable();
  //   return this.http.get<Company>(`${environment.apiUrl}/api/company/get/${id}`)
  //       .pipe(map(data => {
  //         return data;
  //       }))
  //       .subscribe(data => {
  //         this.company = data;
  //       });
  // }

  // getPackages() {
  //   this.initTable();
  //   return this.http.get<Package[]>(`${environment.apiUrl}/api/project/courses/packages/list`)
  //       .pipe(map(data => {
  //         return data;
  //       }))
  //       .subscribe(data => {
  //         // {value: 'kz', label: 'Қазақша'}
  //         for (let i = 0; i < data.length; i++) {
  //           this.packages.push({value: data[i].id, label: data[i].title});
  //         }
  //       });
  // }

  saveLesson() {
    let sUrl = `${environment.apiUrl}/api/project/courses/videos/new`;
    if (this.lesson.id && this.lesson.id !== '') {
      sUrl = `${environment.apiUrl}/api/project/courses/videos/update`;
    }

    return this.http.post<Status>(sUrl, this.lesson)
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
    this.saveLesson();
    // this.saveProfileAllDetailsuploadAvatar();
    // if (this.fileAvatar.has('file')) {
    //   this.saveProfileAllDetailsuploadAvatar();
    // } else {
    //   this.saveProfileAllDetails();
    // }
  }

  deleteCompany() {
    if (this.lesson.id) {
      this.http.delete<Status>(`${environment.apiUrl}/api/company/delete/${this.lesson.id}`)
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

  addVariants(variant: Test) {
    variant.variants.push('');
  }

  selectAnswer(test: Test, variant: string, isRemove = false) {
    if (variant.trim() !== '') {
      if (test.answer.includes(variant)) {
        const index: number = test.answer.indexOf(variant);
        if (index !== -1) {
          test.answer.splice(index, 1);
        }
      } else if (!isRemove) {
        test.answer.push(variant);
      }
    }
    console.log(test.answer);
  }

  removeVariant(test: Test, variant: string) {
    this.selectAnswer(test, variant, true);
    if (test.variants.includes(variant)) {
      const index: number = test.variants.indexOf(variant);
      test.variants.splice(index, 1);
    }

    // console.log(this.lessonTests[i].test[t]);
  }

  removeQuestion(index: number) {
    this.lesson.test.splice(index, 1);
  }

  addTest(tests: Test[]) {
    const test: Test = { id: '', question: '', answer: [], variants: [''], answerNum: 0 };
    tests.push(test);
  }

  onChangeVariant(test: Test) {
    test.answer = [];
  }

  removeLesson(i: number) {
  }

  trackByIdx(index: number, obj: any): any {
    return index;
  }

}
