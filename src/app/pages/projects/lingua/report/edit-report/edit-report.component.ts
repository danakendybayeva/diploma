import {AfterViewChecked, Component, OnDestroy, OnInit} from '@angular/core';
import {environment} from '../../../../../../environments/environment';
import {TCExternalViewRecordComponent} from '../../../../reference/external/record/view-record';
import {FormGroup} from '@angular/forms';
import {formatDate} from '@angular/common';
import {Status} from '../../../../../interfaces/services/util.service';
import * as shape from 'd3-shape';
import {LinguaPeriod} from '../../../../../interfaces/services/projects/lingua.service';
import {map} from 'rxjs/operators';
import {Student} from '../../../../../interfaces/services/student.service';

@Component({
    selector: 'lg-edit-report',
    templateUrl: './edit-report.component.html',
    styleUrls: ['./edit-report.component.scss', '../../../../reference/record/view-record/view-record.component.scss']
})
export class LGEditReportComponent extends TCExternalViewRecordComponent implements OnInit, OnDestroy, AfterViewChecked {
    labelForm: FormGroup;
    styleType = 'standard';
    canAddDate = false;
    today = new Date();
    loadingAttendance = false;
    attendance = [];
    fieldPeriod = LinguaPeriod;
    profile = {};
    apiUrl = environment.apiUrl;
    groupId = '';

    ngxChartColors: any;
    barChartData: any[];
    ngxCurve: any;
    comment = {
        id: 'comment',
        hint: null,
        type: 'text',
        title: 'Коммент',
        isUnique: false,
        orderNum: 1,
        isRequired: false,
        defaultValue: null,
        maxShowLength: null
    };

    ngOnInit() {
        this.pageData = {
            title: '',
            loaded: true
        };
        this.referenceId = 'd924aba7-a38b-4688-905d-694511177686';
        this.canAddDate = true;
        this.labelForm = new FormGroup({});
        this.loaded = false;
        super.ngOnInit();
    }

    ngOnDestroy() {
        super.ngOnDestroy();
    }

    ngAfterViewChecked() {
        super.ngAfterViewChecked();
    }

    async initRoute() {
        this.fieldsData = await this.fieldService.getReferenceFields(this.referenceId, 'object');
        if (this.route.snapshot.params['groupId']) {
            this.canEdit = await this.mayAccessRecord(this.route.snapshot.params['groupId']);
            if (!this.canEdit) {
                setTimeout(() => {
                    this.router.navigate(['/error/404']);
                });
            }
            this.groupId = this.route.snapshot.params['groupId'];
        }
        if (this.route.snapshot.params['id']) {
            this.recordId = this.route.snapshot.params['id'];
            this.responseUrl = this.prepareResponseUrl();
            this.fieldsValue = await this.getRequest(this.prepareResponseUrl());
            this.loaded = true;
        }
    }

    editUrl() {
        return `${environment.apiUrl}/api/project/lingua/report/add`;
    }

    isTodayDate(day: Date) {
        return formatDate(day, 'dd.MM.yyyy', 'en') === formatDate(this.today, 'dd.MM.yyyy', 'en');
    }

    prepareResponseUrl(): string {
        return `${environment.apiUrl}/api/project/lingua/report/${this.recordId}`;
    }

    async saveReport() {
        const status = await this.postRequest(this.editUrl(), this.fieldsValue);
        if (status.status === 1) {
            this.toastr.success(status.message, 'Success', { closeButton: true });
            setTimeout(() => {
                this.router.navigate(['/vertical/lingua/report/view', this.groupId, this.recordId]);
            });
        } else {
            this.toastr.error(status.message, 'Error', { closeButton: true });
        }
    }

    postRequest(url, postParam): Promise<Status> {
        return this.http.post<Status>(url, postParam)
            .toPromise()
            .then(response => response as Status)
            .catch();
    }

    getRequest(url): Promise<any[]> {
        return this.http.get<any[]>(url)
            .toPromise()
            .then(response => response)
            .catch();
    }

    trackByFn(index: any, item: any) {
        return index;
    }

    onChangeSlider(value: number, index: number, type: string): void {
        switch (type) {
            case 'mock':
                this.fieldsValue['mocks'][index] = value;
                break;
            case 'cept':
                this.fieldsValue['cepts'][index] = value;
                break;
        }
    }

    checkMCPer(event: any, type: string, index: number) {
        switch (type) {
            case 'mock':
                if (event > 100) {
                    this.fieldsValue['mocks'][index] = 100;
                }
                break;
            case 'cept':
                if (event > 100) {
                    this.fieldsValue['cepts'][index] = 100;
                }
                break;
        }
    }

    addMCPer(type: string) {
        switch (type) {
            case 'mock':
                this.fieldsValue['mocks'].push(0);
                break;
            case 'cept':
                this.fieldsValue['cepts'].push(0);
                break;
        }
    }

    naMC(type: string, index: number) {
        switch (type) {
            case 'mock':
                this.fieldsValue['mocks'][index] = 0;
                break;
            case 'cept':
                this.fieldsValue['cepts'][index] = 0;
                break;
        }
    }
    removeMC(type: string, index: number) {
        switch (type) {
            case 'mock':
                this.fieldsValue['mocks'].splice(index, 1);
                break;
            case 'cept':
                this.fieldsValue['cepts'].splice(index, 1);
                break;
        }
    }

    isDateBeforeToday(date) {
        return new Date(date) < new Date();
    }

    mayAccessRecord(id): Promise<boolean> {
        return this.http.post<boolean>(`${environment.apiUrl}/api/project/lingua/group/may/edit/${id}`, {})
            .toPromise()
            .then(response => response as boolean)
            .catch();
    }

}
