import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormsModule } from '@angular/forms';

import { Store } from '@ngrx/store';
import {BasePageComponent} from '../../../../base-page';
import { HttpService } from '../../../../../services/http/http.service';
import {IAppState} from '../../../../../interfaces/app-state';
import {IOption} from '../../../../../ui/interfaces/option';

import {StudentService, Student, Experience, Roles} from '../../../../../interfaces/services/student.service';
import {EduType, StudentList} from '../../../../../interfaces/services/studentList.service';
import {environment} from '../../../../../../environments/environment';
import {map} from 'rxjs/operators';
import {HttpClient} from '@angular/common/http';
import {ActivatedRoute, Router} from '@angular/router';
import {TCModalService} from '../../../../../ui/services/modal/modal.service';
import {Content} from '../../../../../ui/interfaces/modal';
import { ToastrService } from 'ngx-toastr';
// import { fs } from 'fs-extra';
import * as PageActions from '../../../../../store/actions/page.actions';
import {Status} from '../../../../../interfaces/services/util.service';
import {Company, Package} from '../../../../../interfaces/services/projects/courses.service';

@Component({
  selector: 'add-package',
  templateUrl: './add-package.component.html',
  styleUrls: ['./add-package.component.scss']
})
export class AddPackageComponent extends BasePageComponent implements OnInit {
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
  company: Company = {
    id: '',
    title: '',
    description: '',
    image: '',
    logo: '',
    views: 0
  };
  package: Package = {
    id: '',
    title: '',
    companyId: '',
    description: '',
    image: ''
  };
  companyId = '';
  id = '';

  constructor(store: Store<IAppState>, httpSv: HttpService,
              private formBuilder: FormBuilder,
              private http: HttpClient, private router: Router,
              private route: ActivatedRoute,
              private modal: TCModalService,
              private toastr: ToastrService) {
    super(store, httpSv);
    this.pageData = {
      title: 'New Package',
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

    this.companyId = this.route.snapshot.params['companyId'];
    this.id = this.route.snapshot.params['id'];
    if (this.companyId) {
      this.package.companyId = this.companyId;
    }
    if (this.id) {
      this.getPackage(this.id);
    }


    this.showUploadAvatar = {
      showPreviewIcon: true,
      showRemoveIcon: true,
      hidePreviewIconInNonImage: true
    };

    this.photoWallAvatar = [];

    this.previewVisibleAvatar = false;
    this.previewImageAvatar = '';

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

  }

  initTable(): void {
    setTimeout(
        () => this.store.dispatch(new PageActions.Update({ loaded: true })),
        0
    );
  }

  getPackage(id: string) {
    this.initTable();
    return this.http.get<Package>(`${environment.apiUrl}/api/project/courses/packages/get/${id}`)
        .pipe(map(data => {
          return data;
        }))
        .subscribe(data => {
          this.package = data;
          console.log(this.package);
        });
  }

  saveGroup() {
    let sUrl = `${environment.apiUrl}/api/project/courses/packages/new`;
    if (this.id && this.id !== '') {
      sUrl = `${environment.apiUrl}/api/project/courses/packages/update`;
    }
    return this.http.post<Status>(sUrl, this.package)
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

  uploadImage(fileImage: any, type: string) {
    this.http.post<Status>(`${environment.apiUrl}/api/file/upload/course-packages`, fileImage)
      .subscribe({
        next: data => {
          if (data.status === 1) {
            // this.previewImageBackground = data.value;
            this.package.image = data.value;
            this.saveGroup();
          } else if (data.status === -1) {
            this.toastr.error(data.message, 'Error', { closeButton: true });
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

  async submitModal() {
    this.modal.close();
    if (this.previewImageBackground.length > 0) {
      await this.reImage();
    } else {
      this.saveGroup();
    }
  }

  async reImage() {
    const formData = new FormData();
    const reader: FileReader = new FileReader();
    if (this.previewImageBackground.length > 0) {
      const file: File = this.previewImageBackground[0]['originFileObj'];
      reader.readAsDataURL(file);
      formData.append('file', file);
      this.fileAvatar = formData;
      await this.uploadImage(this.fileAvatar, 'background');
    }
  }

  deleteCompany() {
    if (this.companyId) {
      this.http.delete<Status>(`${environment.apiUrl}/api/project/courses/packages/delete/${this.companyId}`)
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

}
