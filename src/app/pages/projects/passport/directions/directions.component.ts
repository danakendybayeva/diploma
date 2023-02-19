import { Component, Input, OnDestroy, OnInit, TemplateRef } from '@angular/core';
import { environment } from '../../../../../environments/environment';
import { Store } from '@ngrx/store';
import { IAppState } from '../../../../interfaces/app-state';
import { HttpService } from '../../../../services/http/http.service';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { UserService } from '../../../../user/_services/user.service';
import { FieldService } from '../../../../interfaces/services/reference/field.service';
import { ToastrService } from 'ngx-toastr';
import { TCModalService } from '../../../../ui/services/modal/modal.service';
import { BasePageComponent } from '../../../base-page';
import { FormBuilder, Validators } from '@angular/forms';
import { FormGroup } from '@angular/forms';
import { map } from 'rxjs/operators';
import { $e } from 'codelyzer/angular/styles/chars';
import { Status } from '../../../../interfaces/services/util.service';
import { NzUploadFile } from 'ng-zorro-antd/upload';
import { Observable, Observer } from 'rxjs';
import { ImageField } from '../../../../interfaces/services/reference/fields/image';
@Component({
  // tslint:disable-next-line:component-selector
  selector: 'passport-directions',
  templateUrl: './directions.component.html',
  styleUrls: ['./directions.component.scss']
})
export class PassportDirectionsComponent extends BasePageComponent implements OnInit, OnDestroy {
  @Input() referenceId = null;
  labelForm: FormGroup;

  innerValue: any[] = [];
  avatarUrl: string;
  id: string;
  isNew = true;
  apiUrl = environment.apiUrl;
  redirectUrl = '/vertical/passports/passport/view';
  passport = {};
  passportTasks = [];
  photo: any;
  title = '';
  title1: any;


  activeIndex;
  visibleDraw = false;
  dataDraw = {};
  removeIndex: number;

  loading = false;
  loadingPhoto = false;
  isAdmin = false;
  isEmpty = false;
  isFocused = false;
  loadingTask = false;
  loadingAddTask = false;


  canEdit = false;
  canDelete = false;

  postAction = environment.apiUrl + '/api/media/file/request-file/image';
  previewImage: string | undefined = '';

  exists = false;
  fieldsData = {};
  imgUrl = '';
  maxSize = 5;

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
    if (this.route.snapshot.params['id']) {
      this.id = this.route.snapshot.params['id'];
      this.isNew = false;
    }
    super.ngOnInit();
    this.setLoaded();
    this.loading = true;
    this.getPassport();
    this.pExists().then(r => {
      this.exists = r.valueOf();
    });
    this.isAdmin = await this.userService.isAdmin();
  }

  createForm() {
    this.labelForm = new FormGroup({});
    // this.labelForm.addControl('image', this.formBuilder.control(this.passport['image'], [Validators.required]));
    // this.labelForm.addControl('photo', this.formBuilder.control(this.passport.title, [Validators.required]));
  }

  pExists(): Promise<Boolean> {
    return this.http.get<Boolean>(`${environment.apiUrl}/api/project/passport/exists/${this.id}`)
      .toPromise()
      .then(response => response)
      .catch();
  }

  postRequest(url, postParam): Promise<Status> {
    return this.http.post<Status>(url, postParam)
      .toPromise()
      .then(response => response as Status)
      .catch();
  }

  getPassport() {
    if (!this.isNew) {
      const url = `${environment.apiUrl}/api/project/passport/task/list/${this.id}`;
      return this.http.get<any>(url)
        .pipe(map(data => {
          return data;
        }))
        .subscribe(
          async data => {
            if (Object.keys(data).length) {
              this.passport = data;
              this.imgUrl = this.passport['image'][0]['id'];
              this.passportTasks = data['tasks'];
              if (this.passport['image'] && this.passport['image'].length) {
                this.imgUrl = this.passport['image'][0]['id'];
              }
              this.loading = false;
            } else {
              this.isEmpty = true;
            }
          },
          error => {
            this.isEmpty = true;
          });
    } else {
      this.loading = false;
    }
  }

  async savePassport() {
    this.loading = true;
    const title = this.passport['title'] ? this.passport['title'] : this.title;
    if (title.split(' ').size > 5) {
      this.toastr.error('Title max 5 words', 'Error', { closeButton: true });
      this.loading = false;
    } else {
      const body = {
        id: this.passport['id'] ? this.passport['id'] : '',
        image: this.imgUrl ? [{ id: this.imgUrl, value: '' }] : this.passport['image'],
        title: this.passport['title'] ? this.passport['title'] : this.title
      };
      const result = await this.postRequest(`${environment.apiUrl}/api/project/passport/create`, body);
      if (result.status === 1) {
        this.toastr.success(result.message, 'Success', { closeButton: true });
        this.passport = result.value;
        if (this.id == null && this.passport['id']) {
          this.router.navigate([this.redirectUrl, this.passport['id']]).then();
        }
      } else {
        this.toastr.error(result.message, 'Error', { closeButton: true });
      }
      this.loading = false;
    }
  }

  async deletePassport() {
    this.modal.close();
    return this.http.post<Status>(`${environment.apiUrl}/api/project/passport/remove/${this.id}`, {})
      .subscribe({
        next: data => {
          if (data.status === 1) {
            this.toastr.success(data.message, 'Success', { closeButton: true });
            this.router.navigate(['/vertical/passports/passport/list']).then(r => { });
          } else {
            this.toastr.error(data.message, 'Error', { closeButton: true });
          }
        },
        error: error => {
          this.toastr.error('Not saved!', 'Error', { closeButton: true });
        }
      });
  }

  focused() {
    this.isFocused = true;
  }

  addTask() {
    this.loadingAddTask = true;
    this.passportTasks.push({ title: '', description: '' });
    this.openDraw(this.passportTasks.length - 1);
  }

  async saveTask() {
    this.loadingTask = true;
    if (this.dataDraw['title'].split(' ').size > 2) {
      this.toastr.error('Title max 2 words', 'Error', { closeButton: true });
      this.loadingTask = false;
    } else {
      const body = {
        id: this.dataDraw['id'] ? this.dataDraw['id'] : null,
        title: this.dataDraw['title'],
        description: this.dataDraw['description'],
        passportId: this.id,
        isFreeze: false
      };
      const result = await this.postRequest(`${environment.apiUrl}/api/project/passport/task/create`, body);
      if (result.status === 1) {
        this.toastr.success(result.message, 'Success', { closeButton: true });
        this.dataDraw = result.value;
        this.passportTasks[this.activeIndex] = this.dataDraw;
      } else {
        this.toastr.error(result.message, 'Error', { closeButton: true });
      }
      this.modal.close();
      this.closeDraw();
      this.loadingTask = false;
      this.loadingAddTask = false;
    }
  }

  async removeTask(removeIndex: number) {
    if (this.passportTasks[removeIndex]['id']) {
      const result = await this.postRequest(`${environment.apiUrl}/api/project/passport/task/remove/${this.passportTasks[removeIndex]['id']}`, {});
      if (result.status === 1) {
        this.toastr.success(result.message, 'Success', { closeButton: true });
        this.passportTasks.splice(removeIndex, 1);
        this.modal.close();
        if (this.visibleDraw) {
          this.closeDraw();
        }
      } else {
        this.toastr.error(result.message, 'Error', { closeButton: true });
      }
    } else {
      this.passportTasks.splice(removeIndex, 1);
      this.modal.close();
      if (this.visibleDraw) {
        this.closeDraw();
      }
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
    this.dataDraw['id'] = this.passportTasks[index]['id'];
    this.dataDraw['title'] = this.passportTasks[index]['title'];
    this.dataDraw['description'] = this.passportTasks[index]['description'];
    this.activeIndex = index;
  }

  closeDraw(): void {
    this.visibleDraw = false;
    this.passportTasks = this.passportTasks.filter(item => item['id'] !== undefined);
    this.dataDraw = {};
  }

  change($event: any) {
    // console.log($event);
  }

  handlePreview = async (file: NzUploadFile) => {
    if (file.url) {
      this.previewImage = file.url;
    } else {
      this.previewImage = file.thumbUrl;
    }
    // this.previewVisible = true;
  }

  private getBase64(img: File, callback: (img: string) => void): void {
    const reader = new FileReader();
    // tslint:disable-next-line:no-non-null-assertion
    reader.addEventListener('load', () => callback(reader.result!.toString()));
    reader.readAsDataURL(img);
  }

  handleChange(info: { file: NzUploadFile }): void {
    switch (info.file.status) {
      case 'uploading':
        this.loading = true;
        break;
      case 'done':
        if (this.innerValue === null) {
          this.innerValue = [];
        }
        if (info.file.response && info.file.response.status === 1) {
          this.imgUrl = info.file.response.value;
          this.innerValue.push({ id: info.file.response.value, value: info.file.name });
        }
        // Get this url from response in real world.
        // tslint:disable-next-line:no-non-null-assertion
        this.getBase64(info.file!.originFileObj!, (img: string) => {
          this.loading = false;
          this.avatarUrl = img;
        });
        this.loadingPhoto = false;
        break;
      case 'error':
        this.toastr.error('Network error', 'Error', { closeButton: true });
        this.loading = false;
        break;
      case 'removed':
        const index = this.innerValue.findIndex(p => p.id === info.file.uid
          || (info.file.response && p.id === info.file.response.value));
        if (index >= 0) {
          this.innerValue.splice(index, 1);
        }
        break;
    }
    this.loading = false;
  }

  beforeUpload = (file: File) => {
    return new Observable((observer: Observer<boolean>) => {
      const isJPG = file.type.includes('image/');
      if (!isJPG) {
        this.toastr.error('You can only upload Image file!', 'Error', { closeButton: true });
        observer.complete();
        return;
      }
      const isLt2M = file.size < (this.maxSize * 1024 * 1024) || this.maxSize === 0;
      if (!isLt2M) {
        this.toastr.error('Image must smaller than 5MB!', 'Error', { closeButton: true });
        observer.complete();
        return;
      }
      this.checkImageDimension(file).then(dimensionRes => {
        observer.next(isJPG && isLt2M && dimensionRes);
        observer.complete();
      });
    });
  }


  round(value, precision): number {
    const multiplier = Math.pow(10, precision || 0);
    return Math.round(value * multiplier) / multiplier;
  }

  private checkImageDimension(file: File): Promise<boolean> {
    return new Promise(resolve => {
      const img = new Image(); // create image
      img.src = window.URL.createObjectURL(file);
      img.onload = () => {
        // tslint:disable-next-line:no-non-null-assertion
        window.URL.revokeObjectURL(img.src!);
        resolve(true);
      };
    });
  }

}
