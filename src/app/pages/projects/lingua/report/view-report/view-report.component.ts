import {AfterViewChecked, Component, OnDestroy, OnInit} from '@angular/core';
import {environment} from '../../../../../../environments/environment';
import {TCExternalViewRecordComponent} from '../../../../reference/external/record/view-record';
import {FormGroup} from '@angular/forms';
import {formatDate} from '@angular/common';
import {Status} from '../../../../../interfaces/services/util.service';
import * as shape from 'd3-shape';
import {LinguaPeriod} from '../../../../../interfaces/services/projects/lingua.service';
import {map} from 'rxjs/operators';

@Component({
    selector: 'lg-view-report',
    templateUrl: './view-report.component.html',
    styleUrls: ['./view-report.component.scss', '../../../../reference/record/view-record/view-record.component.scss']
})
export class LGViewReportComponent extends TCExternalViewRecordComponent implements OnInit, OnDestroy, AfterViewChecked {
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
            this.groupId = this.route.snapshot.params['groupId'];
        }
        if (this.route.snapshot.params['id']) {
            this.recordId = this.route.snapshot.params['id'];
            this.responseUrl = this.prepareResponseUrl();
            this.fieldsValue = await this.getRequest(this.prepareResponseUrl());
            this.setChartColors();
            this.setBarChartData();
            this.loaded = true;
        }
    }

    getEditUrl() {
        return ['/vertical/lingua/report/edit', this.groupId, this.recordId];
    }

    isTodayDate(day: Date) {
        return formatDate(day, 'dd.MM.yyyy', 'en') === formatDate(this.today, 'dd.MM.yyyy', 'en');
    }

    prepareResponseUrl(): string {
        return `${environment.apiUrl}/api/project/lingua/report/${this.recordId}`;
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

    setChartColors() {
        this.ngxChartColors = {
            domain: ['#3d5a80', '#4289b3', '#5b9dc2', '#98c1d9', '#e13d14', '#ed5631', '#f5a38f', '#48bf84']
        };

        this.ngxCurve = shape.curveCardinal;
    }

    setBarChartData() {
        this.barChartData = [];
        this.fieldsValue['mocks'].forEach((obj, key) => {
            const value = obj === null ? 0 : obj;
            this.barChartData.push({name: 'Mock ' + (key + 1), value: value});
        });
        this.fieldsValue['cepts'].forEach((obj, key) => {
            const value = obj === null ? 0 : obj;
            this.barChartData.push({name: 'CEPT ' + (key + 1), value: value});
        });
        this.barChartData.push({name: 'Total', value: this.fieldsValue['average_result']});
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

    async removeReport() {
        const result = await this.postRequest(`${environment.apiUrl}/api/project/lingua/report/remove/${this.recordId}`, {});
        if (result.status === 1) {
            this.toastr.success(result.message, 'Success', { closeButton: true });
            this.router.navigate(['/vertical/lingua/group/view', this.groupId]).then();
        } else {
            this.toastr.error(result.message, 'Error', { closeButton: true });
        }
        this.closeModal();
    }

}
