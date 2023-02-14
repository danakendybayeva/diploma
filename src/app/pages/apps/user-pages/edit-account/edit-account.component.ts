import { Component, OnDestroy, OnInit } from '@angular/core';
import { BasePageComponent } from '../../../base-page';
import { Store } from '@ngrx/store';
import { IAppState } from '../../../../interfaces/app-state';
import { HttpService } from '../../../../services/http/http.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IOption } from '../../../../ui/interfaces/option';
import {environment} from '../../../../../environments/environment';
import {Student} from '../../../../interfaces/services/student.service';
import {map} from 'rxjs/operators';
import {HttpClient} from '@angular/common/http';
import {Status} from '../../../../interfaces/services/util.service';
import {ToastrService} from 'ngx-toastr';

@Component({
  selector: 'page-edit-account',
  templateUrl: './edit-account.component.html',
  styleUrls: ['./edit-account.component.scss']
})
export class PageEditAccountComponent extends BasePageComponent implements OnInit, OnDestroy {
  userInfo: any;
  userForm: FormGroup;
  gender: IOption[];
  status: IOption[];
  currentAvatar: string | ArrayBuffer;
  defaultAvatar: string;
  changes: boolean;

  profileDetails: Student;
  canSave = false;

  passwordChange = {password: '', newPassword: '', confirmPassword: ''};

  constructor(
    store: Store<IAppState>,
    httpSv: HttpService,
    private formBuilder: FormBuilder,
    private http: HttpClient,
    private toastr: ToastrService
  ) {
    super(store, httpSv);

    this.pageData = {
      title: 'Edit account',
      breadcrumbs: [
        {
          title: 'Apps',
          route: 'dashboard'
        },
        {
          title: 'Service pages',
          route: 'dashboard'
        },
        {
          title: 'Edit account'
        }
      ]
    };
    this.gender = [
      {
        label: 'Male',
        value: 'male'
      },
      {
        label: 'Female',
        value: 'female'
      }
    ];
    this.status = [
      {
        label: 'Approved',
        value: 'approved'
      },
      {
        label: 'Pending',
        value: 'pending'
      }
    ];
    this.defaultAvatar = 'assets/content/anonymous-400.jpg';
    this.currentAvatar = this.defaultAvatar;
    this.changes = false;
  }

  ngOnInit() {
    super.ngOnInit();
    this.setLoaded();
    this.getListProfiles();
  }

  ngOnDestroy() {
    super.ngOnDestroy();
  }

  // save form data
  saveData(form: FormGroup) {
    if (form.valid) {
      this.userInfo = form.value;
      this.changes = false;
    }
  }

  getListProfiles() {
    return this.http.get<Student>(`${environment.apiUrl}/api/myprofile`)
        .pipe(map(data => {
          return data;
        }))
        .subscribe(data => {
          this.profileDetails = data;
          this.profileDetails.middleName = this.nullToDefaul(this.profileDetails.middleName, 'string');
          this.currentAvatar = this.profileDetails.avatar;
        });
  }

  // upload new file
  onFileChanged(inputValue: any) {
    const file: File = inputValue.target.files[0];
    const reader: FileReader = new FileReader();

    reader.onloadend = () => {
      this.currentAvatar = reader.result;
      this.changes = true;
    };

    reader.readAsDataURL(file);
    console.log(this.fileToReady(file));

    this.uploadAvatar(this.fileToReady(file), 'profiles');
  }

  nullToDefaul(data: any, type: string): any {
    if (data == null) {
      switch (type) {
        case 'string':
          return '';
        case 'array':
          return [];
        case 'number':
          return 0;
        default:
      }
    }
    return null;
  }

  changePassword() {
    return this.http.post<Status>(`${environment.apiUrl}/api/auth/password/change`, this.passwordChange)
      .subscribe({
        next: data => {
          if (data.status === 1) {
            // this.saveTeacher();
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

  uploadAvatar(fileImage: any, type: string) {
    return this.http.post<Status>(`${environment.apiUrl}/api/file/upload/${type}`, fileImage)
        .toPromise().then( data => {
          if (data.status === 1) {
            this.currentAvatar = data.value.toString();
            this.canSave = true;
          } else if (data.status === -1) {
            this.toastr.error(data.message, 'Error', { closeButton: true });
          } else {
            this.toastr.error(data.message, 'Error', { closeButton: true });
          }

        });
  }

  saveAvatar() {
    return this.http.post<Status>(`${environment.apiUrl}/api/profile/change-avatar`, {id: this.profileDetails.id, avatar: this.currentAvatar})
        .toPromise().then( data => {
          if (data.status === 1) {
            this.toastr.success(data.message, 'Error', { closeButton: true });
            this.canSave = false;
          } else if (data.status === -1) {
            this.toastr.error(data.message, 'Error', { closeButton: true });
          } else {
            this.toastr.error(data.message, 'Error', { closeButton: true });
          }

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
}
