import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormsModule } from '@angular/forms';

import { Store } from '@ngrx/store';
import {BasePageComponent} from '../../base-page';
import { HttpService } from '../../../services/http/http.service';
import {IAppState} from '../../../interfaces/app-state';
import {IOption} from '../../../ui/interfaces/option';

import {StudentService, Student, Experience, Roles} from '../../../interfaces/services/student.service';
import {EduType, StudentList} from '../../../interfaces/services/studentList.service';
import {environment} from '../../../../environments/environment';
import {map} from 'rxjs/operators';
import {HttpClient} from '@angular/common/http';
import {ActivatedRoute, Router} from '@angular/router';
import {TCModalService} from '../../../ui/services/modal/modal.service';
import {Content} from '../../../ui/interfaces/modal';
import { ToastrService } from 'ngx-toastr';
// import { fs } from 'fs-extra';
import * as PageActions from '../../../store/actions/page.actions';
import {Status} from "../../../interfaces/services/util.service";

@Component({
  selector: 'lists-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.scss']
})
export class EditComponent extends BasePageComponent implements OnInit {
  autocompleteData: string[];
  selectData: IOption[];
  basicForm: FormGroup;

  profileDetails: Student;

  profileDetailsInit: Student;

  currentAvatar: string | ArrayBuffer;
  defaultAvatar: string;
  fileAvatar = new FormData();
  changes: boolean;

  tags = ['JAVASCRIPT', 'SCSS', 'HTML'];
  id: string;

  phones: any[] = [];
  skills: any[] = [];
  socials: any[] = [];
  user_roles_selected: any[] = [];
  iRoles: any[] = [];
  specs: any[] = [];

  educationType: any[] = [];
  eduType: EduType[] = [];

  succesCode = '';
  errorCode = '';

  constructor(store: Store<IAppState>, httpSv: HttpService,
              private formBuilder: FormBuilder,
              private StudentService: StudentService,
              private http: HttpClient, private router: Router,
              private route: ActivatedRoute,
              private modal: TCModalService,
              private toastr: ToastrService) {
    super(store, httpSv);
    this.pageData = {
      title: 'Student edit',
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
    this.selectData = [];

    this.defaultAvatar = 'assets/image/photo34.jpg';
    this.currentAvatar = this.defaultAvatar;
    this.id = this.route.snapshot.params['id'];

    this.succesCode = 'Successfully saved!';
    this.errorCode = 'Not saved!';

    this.getTestAes();
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

    // this.getData(`${environment.tmp}/_mds_education.json`, 'eduType', 'initTable', true);
    // this.getListEducationType();
    this.getSelectEduType();
    this.getRoles();
    this.getListSpeciality();
    if (this.id) {
      this.getListProfiles(this.id);
    } else {
      this.profileDetails = this.StudentService.newStudent;
      this.socials = JSON.parse(this.profileDetails.social);
    }
  }

  initTable(): void {
    setTimeout(
        () => this.store.dispatch(new PageActions.Update({ loaded: true })),
        0
    );
  }

  removePhone(item: number) {
    this.phones.splice(item, 1);
  }

  addPhone() {
    // this.StudentService.addPhone(item);
    if (this.phones == null) {
      this.phones = [];
    }
    this.phones.push('');
  }

  addUniver(item: Student) {
    this.StudentService.addUniver(item);
  }
  addExp(item: Student) {
    this.StudentService.addExp(item);
  }

  removeUniver(item: Student, index: number) {
    this.StudentService.removeUniver(item, index);
  }

  removeExp(item: Student, index: number) {
    this.StudentService.removeExp(item, index);
  }

  // upload new file
  onFileChanged(inputValue: any) {
    const file: File = inputValue.target.files[0];
    const reader: FileReader = new FileReader();
    const formData = new FormData();

    reader.onloadend = () => {
      this.currentAvatar = reader.result;
      this.changes = true;
    };

    reader.readAsDataURL(file);
    formData.append('file', file);
    this.fileAvatar = formData;
  }

  trackByFn(index: any, item: any) {
    return index;
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

  getListProfiles(id: string) {
    this.initTable();
    return this.http.get<Student>(`${environment.apiUrl}/api/profiles/${id}`)
        .pipe(map(data => {
          return data;
        }))
        .subscribe(data => {
          this.profileDetails = data;
          this.profileDetails.password = '';

          delete this.profileDetails.readsFinishedBooks;
          delete this.profileDetails.readsPoint;
          delete this.profileDetails.readsRecommendation;
          delete this.profileDetails.readsReviewNumber;

          if (this.profileDetails.phone == null) {
            this.profileDetails.phone = '';
          } else {
            this.phones = this.profileDetails.phone.split(',');
          }
          this.profileDetails.roles.forEach(obj => {
            this.user_roles_selected.push(obj.id);
          });

          if (this.profileDetails.avatar === '' || this.profileDetails.avatar === null) {
            this.currentAvatar = this.defaultAvatar;
          } else {
            this.currentAvatar = this.profileDetails.avatar;
          }
          if (this.profileDetails.middleName == null) {
            this.profileDetails.middleName = '';
          }
          if (this.profileDetails.skills == null) {
            this.profileDetails.skills = '';
            this.skills = null;
          } else {
            const skill = this.profileDetails.skills.split(',');
            skill.forEach(value => {
              if (value.length) {
                this.skills.push({display: value, value: value});
              }
            });
          }
          if (this.profileDetails.social != null) {
            this.socials = JSON.parse(this.profileDetails.social);
          } else {
            this.socials = JSON.parse(this.StudentService.newStudent.social);
          }
        });
  }

  getListEducationType() {
    return this.http.get<EduType[]>(`${environment.apiUrl}/api/education/types`)
        .pipe(map(data => {
          return data;
        }))
        .subscribe(data => {
          data.forEach( item => {
            this.educationType.push({label: item.title, value: item.id});
          });
        });
  }

  getListSpeciality() {
    return this.http.get<EduType[]>(`${environment.apiUrl}/api/edu/specs`)
        .pipe(map(data => {
          return data;
        }))
        .subscribe(data => {
          this.specs = data;
        });
  }

  getSelectEduType() {
    if (this.eduType.length > 0) {
      this.eduType.forEach( item => {
        this.educationType.push({label: item.title, value: item.id});
      });
      console.log('json');
      console.log(this.educationType);
    } else {
      this.http.get<EduType[]>(`${environment.apiUrl}/api/education/types`)
          .pipe(map(data => {
            this.eduType = data;
            return data;
          }))
          .subscribe(data => {
            data.forEach( item => {
              this.educationType.push({label: item.title, value: item.id});
            });
            console.log('db');
            console.log(this.educationType);
          });
    }
  }

  saveProfileAllDetailsuploadAvatar() {
    this.http.post<Status>(`${environment.apiUrl}/api/file/upload/profiles`, this.fileAvatar)
        .subscribe({
          next: data => {
            if (data.status === 1) {
              this.profileDetails.avatar = data.value;
              this.saveProfileAllDetails();
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

  saveProfileAllDetails() {
    this.profileDetails.phone = this.phones.join(',').replace(/ /g, '');
    const skill: any[] = [];
    if (this.skills) {
      this.skills.forEach( value => {
        skill.push(value.value);
      });
    }
    this.profileDetails.skills = skill.join(',');
    this.profileDetails.social = JSON.stringify(this.socials);
    this.profileDetails.roles = [];
    this.user_roles_selected.forEach(obj => {
      this.profileDetails.roles.push({id: obj, name: ''});
    });

    delete this.profileDetails.readsFinishedBooks;
    delete this.profileDetails.readsPoint;
    delete this.profileDetails.readsRecommendation;
    delete this.profileDetails.readsReviewNumber;

    if (this.id) {
      if (!this.profileDetails.password.length) {
        this.profileDetails.password = null;
      }
      this.http.put(`${environment.apiUrl}/api/profiles/${this.id}`, this.profileDetails)
          .subscribe({
            next: data => {
              this.toastr.success('Saved!', 'Success', { closeButton: true });
            },
            error: error => {
              this.toastr.error('Not saved!', 'Error', { closeButton: true });
            }
          });
    } else {
      this.http.post(`${environment.apiUrl}/api/profiles/new`, this.profileDetails)
          .subscribe({
            next: data => {
              this.toastr.success('Saved!', 'Success', { closeButton: true });
            },
            error: error => {
              this.toastr.error('Not saved!', 'Error', { closeButton: true });
            }
          });
    }

  }

  deleteProfile() {
    // this.toastr.success('Hello world!', 'Toastr fun!');
    if (this.id) {
      this.http.delete(`${environment.apiUrl}/api/profiles/${this.id}`)
          .subscribe({
            next: data => {
              this.toastr.success('Saved!', 'Success', { closeButton: true });
            },
            error: error => {
              this.toastr.error('Not saved!', 'Error', { closeButton: true });
            }
          });
    }
  }

  getRoles() {
    return this.http.get<Roles[]>(`${environment.apiUrl}/api/roles`)
        .pipe(map(data => {
          return data;
        }))
        .subscribe(data => {
          data.forEach( item => {
            this.iRoles.push({label: item.name, value: item.id});
          });
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
    if (this.fileAvatar.has('file')) {
      this.saveProfileAllDetailsuploadAvatar();
    } else {
      this.saveProfileAllDetails();
    }
  }

  getTestAes() {
    this.http.get(`${environment.apiUrl}/api/profiles/test`)
        .pipe(map(data => {
          return data;
        }))
        .subscribe(data => {
          console.log(data);
        });
  }

}
