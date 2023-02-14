import { Component, OnDestroy, OnInit} from '@angular/core';

import {Store} from '@ngrx/store';
import {BasePageComponent} from '../../../base-page';
import {IAppState} from '../../../../interfaces/app-state';
import {HttpService} from '../../../../services/http/http.service';
import {IGroup} from 'src/app/ui/interfaces/group';
import {environment} from '../../../../../environments/environment';
import {map} from 'rxjs/operators';
import {HttpClient} from '@angular/common/http';
import {SelfDev} from '../../../../interfaces/services/self-dev.service';
import {Content} from '../../../../ui/interfaces/modal';
import {ActivatedRoute, Router} from '@angular/router';
import {TCModalService} from '../../../../ui/services/modal/modal.service';
import {Student} from '../../../../interfaces/services/student.service';
import {Skills} from '../../../../interfaces/services/projects/skills.service';
import {ToastrService} from 'ngx-toastr';
import {Status} from '../../../../interfaces/services/util.service';

@Component({
  selector: 'self-dev-list',
  templateUrl: './sub-edit.component.html',
  styleUrls: ['./sub-edit.component.scss'],
})
export class SubEditComponent extends BasePageComponent implements OnInit, OnDestroy {
  groups: IGroup[];
  colors: string[];

  imageList1: any[] = [];
  imageList2: any[] = [];

  tableData: SelfDev[];

  sComment = '';

  aList: Skills[] = [];

  iCountSelect = 0;

  succesCode = '';
  errorCode = '';

  id?: string = null;

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

  apiUrl: String = '';

  constructor(store: Store<IAppState>, httpSv: HttpService, private http: HttpClient,
      private modal: TCModalService, private router: Router, private route: ActivatedRoute,
              private toastr: ToastrService) {
    super(store, httpSv);

    this.pageData = {
      title: 'New skills'
    };

    this.groups = [];

    this.apiUrl = environment.apiUrl;



    this.succesCode = 'Successfully saved!';
    this.errorCode = 'Not saved!';

    this.id = this.route.snapshot.params['id'];

    this.getListProfiles(this.id);

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

  }

  ngOnInit() {
    super.ngOnInit();
    super.setLoaded();
    // this.getData('assets/data/groups.json', 'groups', 'getGroups');
  }

  ngOnDestroy() {
    super.ngOnDestroy();
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
    let formData = new FormData();
    let reader: FileReader = new FileReader();
    if (this.photoWallBackground.length > 0) {
      const file: File = this.photoWallBackground[0]['originFileObj'];
      reader.readAsDataURL(file);
      formData.append('file', file);
      this.fileBackground = formData;
      this.saveProfileAllDetailsuploadAvatar(this.fileBackground, 'avatar');
    }
    formData = new FormData();
    reader = new FileReader();
    if (this.photoWallAvatar.length > 0) {
      const file: File = this.photoWallAvatar[0]['originFileObj'];
      reader.readAsDataURL(file);
      formData.append('file', file);
      this.fileAvatar = formData;
      this.saveProfileAllDetailsuploadAvatar(this.fileAvatar, 'background');
    }
    if (this.photoWallAvatar.length === 0 && this.photoWallAvatar.length === 0) {
      this.saveSkill();
    }
    this.modal.close();
  }

  submitToDeleteModal() {
    this.modal.close();
    this.removeSkillGroup();
  }

  addSkill() {
    const aNew: Skills = { id: null, title: '', parentId: this.id, description: null, image: null, avatar: null, bgColor: null };
    this.aList.push(aNew);
  }

  saveSkill() {
    if (this.aList.length > 0) {
      this.aList[0].description = this.sComment;
    }
    console.log(this.aList);
    if (this.id) {
      this.http.put<Status>(`${environment.apiUrl}/api/project/skills-project/new/list`, this.aList)
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
    } else {
      this.http.post<Status>(`${environment.apiUrl}/api/project/skills-project/new/list`, this.aList)
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

  removeSkillGroup() {
    if (this.id) {
      this.http.delete<Status>(`${environment.apiUrl}/api/project/skills-project/delete/group/${this.id}`)
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

  removeSkill(index: number) {
    this.aList.splice(index, 1);
  }

  getListProfiles(id: string) {
    return this.http.get<Skills[]>(`${environment.apiUrl}/api/project/skills-project/lists/${id}`)
        .pipe(map(data => {
          return data;
        }))
        .subscribe(data => {
          this.aList = data;
          if (data.length > 0) {
            this.sComment = data[0].description;
          }
          this.imageList1 = [{thumbUrl: this.aList[0].image }];
          this.imageList2 = [{thumbUrl: this.aList[0].avatar }];
        });
  }

  saveProfileAllDetailsuploadAvatar(fileImage: any, type: string) {
    this.http.post<Status>(`${environment.apiUrl}/api/upload`, fileImage)
        .subscribe({
          next: data => {
            if (data.status === 1) {
              if (type === 'avatar') {
                this.previewImageAvatar = data.value;
                this.aList[0].avatar = data.value;
              } else {
                this.previewImageBackground = data.value;
                this.aList[0].image = data.value;
              }
              this.saveSkill();
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
}
