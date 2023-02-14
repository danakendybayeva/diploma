import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormsModule } from '@angular/forms';

import { Store } from '@ngrx/store';
import {BasePageComponent} from '../../../../base-page';
import { HttpService } from '../../../../../services/http/http.service';
import {IAppState} from '../../../../../interfaces/app-state';
import {environment} from '../../../../../../environments/environment';
import {map} from 'rxjs/operators';
import {HttpClient} from '@angular/common/http';
import {ActivatedRoute, Router} from '@angular/router';
import {TCModalService} from '../../../../../ui/services/modal/modal.service';
import {Content} from '../../../../../ui/interfaces/modal';
import { ToastrService } from 'ngx-toastr';
import * as PageActions from '../../../../../store/actions/page.actions';
import {Status} from '../../../../../interfaces/services/util.service';
import {Company, Course, Package, Teacher} from '../../../../../interfaces/services/projects/courses.service';
import {Observable, Observer} from 'rxjs';
import { UploadFile } from 'ng-zorro-antd';

@Component({
  selector: 'add-course',
  templateUrl: './add-course.component.html',
  styleUrls: ['./add-course.component.scss']
})
export class AddCourseComponent extends BasePageComponent implements OnInit {
  basicForm: FormGroup;
  succesCode = '';
  errorCode = '';
  loading: boolean = false;
  showUploadAvatar: any[];
  photoWallAvatar: any[];
  previewVisibleAvatar: boolean[];
  previewImageAvatar: string[] | undefined[];
  fileAvatar: FormData[] = [new FormData()];

  showUploadBackground: any;
  photoWallBackground: any;
  previewVisibleBackground: boolean;
  previewImageBackground: string | undefined;
  fileBackground = new FormData();

  apiUrl = '';
  company: Company = {
    id: '',
    title: '',
    description: '',
    image: '',
    logo: '',
    views: 0
  };
  course: Course = {
    id: '',
    title: '',
    packageId: '',
    companyId: '',
    description: '',
    image: '',
    introVideo: '',
    introDescription: '',
    language: '',
    active: false,
    activeDatetime: new Date(),
    access: '',
    leftRatings: 0,
    ratingSum: 0,
    rating: 0,
    finishedStudents: 0,
    progress: 0,
    allLesson: 0,
    allTime: 0,
    isJoined: false,
    packages: null,
    company: this.company,
    commentNumber: 0,
    oneStar: 0,
    twoStar: 0,
    threeStar: 0,
    fourStar: 0,
    fiveStar: 0,
    teacherIds: '',
    studyingLesson: ''
  };
  teachers: Teacher[] = [];
  teacherGet: Teacher[] = [];
  teacherOpt: string[] = [];

  id = '';

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
  teachersSlt: any[] = [];
  selectActive = 2;

  tags: any[] = [];

  bslide: boolean[] = [false];

  avatarUrl: string[] = [];

  constructor(store: Store<IAppState>, httpSv: HttpService,
              private formBuilder: FormBuilder,
              private http: HttpClient, private router: Router,
              private route: ActivatedRoute,
              private modal: TCModalService,
              private toastr: ToastrService) {
    super(store, httpSv);
    this.pageData = {
      title: 'New Course',
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

    this.id = this.route.snapshot.params['id'];
    if (this.id) {
      this.course.id = this.id;
    }
    if (this.route.snapshot.params['companyId']) {
      this.course.companyId = this.route.snapshot.params['companyId'];
    }


    this.showUploadBackground = {
      showPreviewIcon: true,
      showRemoveIcon: true,
      hidePreviewIconInNonImage: true
    };

    this.photoWallBackground = [];

    this.previewVisibleBackground = false;
    this.previewImageBackground = '';

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
    this.getPackages();
    this.getTeachers();
  }

  initTable(): void {
    setTimeout(
        () => this.store.dispatch(new PageActions.Update({ loaded: true })),
        0
    );
  }

  getPackages() {
    this.initTable();
    return this.http.get<Package[]>(`${environment.apiUrl}/api/project/courses/packages/list`)
        .pipe(map(data => {
          return data;
        }))
        .subscribe(data => {
          // {value: 'kz', label: 'Қазақша'}
          for (let i = 0; i < data.length; i++) {
            this.packages.push({value: data[i].id, label: data[i].title});
          }
        });
  }

  selectActiveMethod() {
    if (this.selectActive === 1) {
      this.course.active = true;
    } else {
      this.course.active = false;
    }
  }

  saveCourse() {
    let sUrl = `${environment.apiUrl}/api/project/courses/new`;
    if (this.id && this.id !== '') {
      sUrl = `${environment.apiUrl}/api/project/courses/update`;
    }
   this.course.active = this.selectActive === 1 ? true : false;
    if (this.previewImageBackground.length > 0) {
      this.course.image = this.previewImageBackground;
    }
    return this.http.post<Status>(sUrl, this.course)
        .subscribe({
          next: data => {
            if (data.status === 1) {
              // this.saveTeacher();
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

  async uploadImage(fileImage: any, type: string, val: string) {
    await this.http.post<Status>(`${environment.apiUrl}/api/file/upload/course-company`, fileImage)
      .toPromise().then( data => {
          if (data.status === 1) {
            this.course.image = data.value;
          } else if (data.status === -1) {
            this.toastr.error(data.message, 'Error', { closeButton: true });
          } else {
            this.toastr.error(data.message, 'Error', { closeButton: true });
          }

        });
  }

   uploadAvatar(fileImage: any, type: string, index: number) {
     return this.http.post<Status>(`${environment.apiUrl}/api/file/upload/course-company`, fileImage)
        .toPromise().then( data => {
          if (data.status === 1) {
            this.teachers[index].image = data.value.toString();
          } else if (data.status === -1) {
            this.toastr.error(data.message, 'Error', { closeButton: true });
          } else {
            this.toastr.error(data.message, 'Error', { closeButton: true });
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
    this.uploadImages();
    // this.saveProfileAllDetailsuploadAvatar();
    // if (this.fileAvatar.has('file')) {
    //   this.saveProfileAllDetailsuploadAvatar();
    // } else {
    //   this.saveProfileAllDetails();
    // }
  }

  async uploadImages() {
    const formData = new FormData();
    const reader: FileReader = new FileReader();
    if (this.photoWallBackground.length > 0) {
      const file: File = this.photoWallBackground[0]['originFileObj'];
      reader.readAsDataURL(file);
      formData.append('file', file);
      this.fileBackground = formData;
      await this.uploadImage(this.fileBackground, 'avatar', this.previewImageBackground);
    }
    this.saveCourse();
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

  getTeachers() {
    return this.http.get<Teacher[]>(`${environment.apiUrl}/api/project/courses/teachers/list/cpid/${this.course.companyId}`)
        .pipe(map(data => {
          return data;
        }))
        .subscribe(data => {
          this.teacherGet = data;
          // {value: 'kz', label: 'Қазақша'}
          for (let i = 0; i < data.length; i++) {
            this.teachersSlt.push({value: data[i].id, label: data[i].fio});
          }
        });
  }

  addTeacher() {
    const teacher: Teacher = {id: '', fio: '', image: '', speciality: '', coursesId: this.course.id, companyId: this.course.companyId};
    this.teachers.push(teacher);
    this.teacherOpt.push('');
  }

  removeTeacher(i: number) {
    this.teachers.splice(i, 1);
    this.teacherOpt.splice(i, 1);
  }

  saveTeacher(teacher: Teacher) {
    let sUrl = `${environment.apiUrl}/api/project/courses/teachers/new`;
    if (teacher.id && teacher.id !== '') {
      sUrl = `${environment.apiUrl}/api/project/courses/teachers/update`;
    }
    console.log(sUrl, teacher.id);
    for (let i = 0; i < this.teachers.length; i++) {
      this.teachers[i].id = this.teachers[i].id === 'none' ? '' : this.teachers[i].id;
    }
    return this.http.post<Status>(sUrl, teacher)
        .subscribe({
          next: data => {
            if (data.status === 1) {
              this.course.teacherIds += (this.course.teacherIds.length > 0 ? ',' : '') + data.value.toString();
              teacher.id = data.value.toString();
              this.toastr.success(data.message, 'Success', { closeButton: true });
            } else {
              this.toastr.error(data.message, 'Error', { closeButton: true });
            }
          },
          error: error => {
            this.toastr.error(error, 'Error', { closeButton: true });
          }
        });
  }

  saveTeachers() {
    const ids = '';
    for (let i = 0; i < this.teachers.length; i++) {
      this.saveTeacher(this.teachers[i]);
    }
  }

  beforeUpload = (file: File) => {
    return new Observable((observer: Observer<boolean>) => {
      const isJPG = file.type === 'image/jpeg' || file.type === 'image/png';
      if (!isJPG) {
        this.toastr.error('You can only upload JPG or PNG file!', 'Error', { closeButton: true });
        observer.complete();
        return;
      }

      const isLt2M = file.size / 1024 / 1024 < 2;
      if (!isLt2M) {
        this.toastr.error('Image must smaller than 2MB!', 'Error', { closeButton: true });
        observer.complete();
        return;
      }
      // check height
      this.checkImageDimension(file).then(dimensionRes => {
        if (!dimensionRes) {
          this.toastr.error('Image only 2000x2000 above', 'Error', { closeButton: true });
          observer.complete();
          return;
        }

        observer.next(isJPG && isLt2M && dimensionRes);
        observer.complete();
      });
    });
  }

  handleChange(info: { file: UploadFile }, index: number): void {
    switch (info.file.status) {
      case 'uploading':
        this.loading = true;
        break;
      case 'done':
        // Get this url from response in real world.
        // tslint:disable-next-line:no-non-null-assertion
        this.uploadAvatar(this.fileToReady(info.file!.originFileObj!), 'avatar', index);
        // tslint:disable-next-line:no-non-null-assertion
        // this.getBase64(info.file!.originFileObj!, (img: string) => {
        //   this.loading = false;
        //   this.avatarUrl = img;
        // });
        break;
      case 'error':
        this.loading = false;
        break;
    }
  }

  private getBase64(img: File, callback: (img: string) => void): void {
    const reader = new FileReader();
    // tslint:disable-next-line:no-non-null-assertion
    reader.addEventListener('load', () => callback(reader.result!.toString()));
    reader.readAsDataURL(img);
  }

  private checkImageDimension(file: File): Promise<boolean> {
    return new Promise(resolve => {
      const img = new Image();
      img.src = window.URL.createObjectURL(file);

      img.onload = () => {
        const width = img.naturalWidth;
        const height = img.naturalHeight;
        console.log({width: width, height: height});
        // tslint:disable-next-line:no-non-null-assertion
        window.URL.revokeObjectURL(img.src!);
        resolve(width < 2000);
      };
    });
  }

  private fileToReady(originFileObj: any): FormData {
    const reader: FileReader = new FileReader();
    const formData = new FormData();
    const file: File = originFileObj;
    reader.readAsDataURL(file);
    formData.append('file', file);
    return formData;
  }

  changeSelect(index: number) {
    for (let i = 0; i < this.teacherGet.length; i++) {
      if (this.teacherGet[i].id === this.teacherOpt[index]) {
        this.teachers[index] = this.teacherGet[i];
        break;
      }
    }
  }
}
