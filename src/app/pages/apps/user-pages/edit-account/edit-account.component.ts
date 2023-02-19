import {AfterViewChecked, Component, OnDestroy, OnInit} from '@angular/core';
import {FormGroup, Validators} from '@angular/forms';
import {environment} from '../../../../../environments/environment';
import {map} from 'rxjs/operators';
import {TCExternalEditRecordComponent} from '../../../reference/external/record/edit-record';
import {IReference} from '../../../../interfaces/services/reference/reference';
import {Status} from '../../../../interfaces/services/util.service';
import {roleReference} from '../../../../interfaces/services/user.service';

@Component({
  selector: 'page-edit-account',
  templateUrl: './edit-account.component.html',
  styleUrls: ['./edit-account.component.scss']
})
export class PageEditAccountComponent extends TCExternalEditRecordComponent implements OnInit, OnDestroy, AfterViewChecked {
    tabindex;
    loaded = false;
    labelForm1: FormGroup;
    labelForm2: FormGroup;
    labelForm3: FormGroup;
    labelForm4: FormGroup;
    url = '';
    currentPassword = '';
    postAction = environment.apiUrl + '/api/v2/profiles/user/edit/avatar';
    canEdit = false;

    ngOnInit() {
        this.pageData = {
            title: 'Edit profile',
            loaded: true
        };
        super.ngOnInit();
    }

    ngOnDestroy() {
        super.ngOnDestroy();
    }

    ngAfterViewChecked() {
        super.ngAfterViewChecked();
    }

    async initRoute() {
        this.referenceId = '00000000-0000-0000-0000-000000000017';
        super.initRoute().then();
        this.isNew = false;
        this.urlPath = this.route.snapshot.url;
        this.fieldsData = await this.fieldService.getReferenceFields(this.referenceId, 'object');
        this.fieldsData[roleReference['id']] = roleReference;
        if (this.route.snapshot.queryParams['tabindex']) {
            this.tabindex = this.route.snapshot.queryParams['tabindex'];
        }
        if (this.route.snapshot.params['id']) {
            this.canEdit = await this.fieldService.mayAccessRecord('edit', this.referenceId, this.recordId);
            this.isNew = false;
            this.recordId = this.route.snapshot.params['id'];
        } else {
            this.canEdit = await this.fieldService.mayAccessRecord('edit', this.referenceId);
            this.pageData = {
                title: 'Create Profile',
                loaded: true
            };
            Object.entries(this.fieldsData).forEach(
                ([key, value]) => {
                    this.fieldsData[key].value = this.fieldsData[key].defaultValue;
                }
            );
            this.recordId = '';
            this.loaded = true;
        }
        this.getRecordData('get-edit');
    }

    createForm() {
        super.createForm();
        this.labelForm1 = new FormGroup({});
        this.labelForm2 = new FormGroup({});
        this.labelForm3 = new FormGroup({});
        this.labelForm4 = new FormGroup({});
        if (this.route.snapshot.params['id']) {
            this.recordId = this.route.snapshot.params['id'];
        }
        if (!this.recordId.length) {
            this.labelForm3.addControl('current', this.formBuilder.control(this.currentPassword, [Validators.required]));
        }
    }

    getRecordData(type: string = 'get-edit') {
        let url = `${environment.apiUrl}/api/v2/profiles/user/type/edit`;
        if (this.recordId) {
            url = `${environment.apiUrl}/api/v2/profiles/user/${this.recordId}/edit?fields=`;
        }
        return this.http.get<IReference>(url)
            .pipe(map(data => {
              return data;
            }))
            .subscribe(
                data => {
                  if (Object.keys(data).length) {
                    Object.entries(this.fieldsData).forEach(
                        ([key, value]) => {
                          this.fieldsData[key].value = data[key];
                        }
                    );
                    if (this.fieldsData['password']) {
                        this.fieldsData['password'].value = '';
                    }
                    this.loaded = true;
                  } else {
                    this.isEmpty = true;
                  }
                },
                error => {
                  this.isEmpty = true;
                });
    }

    changePassword(type: string = 'get-edit') {
        this.prepareValues();
        let url = `${environment.apiUrl}/api/v2/profiles/my/user/edit`;
        if (this.recordId) {
            url = `${environment.apiUrl}/api/v2/profiles/user/edit/${this.recordId}`;
        }
        return this.http.post<Status>(url, {
            username: this.fieldsValue['username'],
            email: this.fieldsValue['email'],
            password: this.currentPassword,
            confirmPassword: this.fieldsValue['password'],
            newPassword: this.fieldsValue['password']
        })
            .toPromise()
            .then(response => {
                if (response.status === 1) {
                    this.toastr.success(response.message, 'Success', { closeButton: true });
                } else {
                    this.toastr.error(response.message, 'Error', { closeButton: true });
                }
            })
            .catch();
    }
}
