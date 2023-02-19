import {Injectable} from '@angular/core';
import {Status} from '../util.service';
import {HttpClient} from '@angular/common/http';
import {IFieldSB} from './fields/field-sidebar';
import {IReference} from './reference';
import {environment} from '../../../../environments/environment';
import {map} from 'rxjs/operators';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {IField} from './fields/field';
import {CustomValidators} from '../../../reference/validators/CustomValidators';

@Injectable({providedIn: 'root'})
export class FieldService {
    selected = 0;

    constructor(private http: HttpClient, private formBuilder: FormBuilder) {
    }

    request(url, postParam): Promise<Status> {
        return this.http.post<Status>(url, postParam)
            .toPromise()
            .then(response => response as Status)
            .catch();
    }

    getStructureFio(author, count = 1): string {
        if (author != null && author.length) {
            return author[1][0];
        }
        return '';
    }

    getFieldsDataSB(data, data2): IFieldSB[] {
        let result: IFieldSB[] = [];
        let fieldsTogether = [];
        if (data && data2) {
            fieldsTogether = Object.assign(JSON.parse(data), JSON.parse(data2));
        } else if (data) {
            fieldsTogether = JSON.parse(data);
        } else if (data2) {
            fieldsTogether = JSON.parse(data2);
        }

        const fieldsSort = [];
        Object.keys(fieldsTogether).map(function (key) {
            const res: IFieldSB = {
                id: key,
                title: fieldsTogether[key]['title'],
                type: fieldsTogether[key]['type'],
                isRequired: fieldsTogether[key]['isRequired'],
                orderNum: fieldsTogether[key]['orderNum'],
            };
            fieldsSort.push(res);
        });
        result = fieldsSort.sort((a, b) => (a.orderNum > b.orderNum) ? 1 : -1);
        return result;
    }

    getAllFields(data, data2) {
        const result = [];
        const fieldsTogether = this.getAllFieldsByObject(data, data2);
        Object.keys(fieldsTogether).map(function (key) {
            const res = fieldsTogether[key];
            res.id = key;
            if (res.orderNum !== undefined && res.orderNum >= 0) {
                result[res.orderNum] = res;
            } else {
                result.push(res);
            }
        });
        return result;
    }

    getAllFieldsByObject(data, data2) {
        data = (typeof data) === 'string' ? JSON.parse(data) : data;
        data2 = (typeof data2) === 'string' ? JSON.parse(data2) : data2;
        let fieldsTogether = [];
        if (data && data2) {
            fieldsTogether = Object.assign(data, data2);
        } else if (data) {
            fieldsTogether = data;
        } else if (data2) {
            fieldsTogether = data2;
        }
        Object.keys(fieldsTogether).map(function (key) {
            fieldsTogether[key]['id'] = key;
        });
        return fieldsTogether;
    }

    saveSortFields(url, postParam): Promise<Status> {
        return this.http.post<Status>(url, postParam)
            .toPromise()
            .then(response => response as Status)
            .catch();
    }

    getAllReference(): Promise<IReference[]> {
        return this.http.get<IReference[]>(`${environment.apiUrl}/api/reference/list/all`)
            .toPromise()
            .then(response => response as IReference[])
            .catch();
    }

    getReferenceById(referenceId): Promise<IReference>  {
        if (referenceId) {
            return this.http.get<IReference>(`${environment.apiUrl}/api/reference/get/${referenceId}`)
                .toPromise()
                .then(response => response as IReference)
                .catch();
        }
        return null;
    }

    getReferenceFields(referenceId, type = 'array'): Promise<any[]>  {
        if (referenceId) {
            return this.http.get<any[]>(`${environment.apiUrl}/api/reference/get-fields/${referenceId}`)
                .toPromise()
                .then(response => {
                    if (type === 'array') {
                        return this.getAllFields(response, '{}');
                    }
                    Object.entries(response).forEach(
                        ([key, value]) => {
                            response[key].id = key;
                        }
                    );
                    return response;
                })
                .catch();
        }
        return null;
    }

    getReferenceSections(referenceId): Promise<any[]>  {
        if (referenceId) {
            return this.http.get<any[]>(`${environment.apiUrl}/api/reference/section/list/${referenceId}`)
                .toPromise()
                .then(response => response)
                .catch();
        }
        return null;
    }

    formValidateChange(_value: any, labelForm: FormGroup, type?: string) {
        const validate = (_value.isRequired) ? [Validators.required] : [];
        let check = false;
        switch (type) {
            case 'date':
                if (_value.currentTimestamp) {
                    validate.push(Validators.min(_value.minDate), Validators.max(_value.maxDate));

                    if (labelForm.contains(_value.id)) {
                        labelForm.setControl(_value.id, this.formBuilder.control(_value.addDays, validate));
                    } else {
                        labelForm.addControl(_value.id, this.formBuilder.control(_value.addDays, validate));
                    }
                    check = true;
                } else {
                    validate.push(CustomValidators.dateMinByDay(_value.minDate), CustomValidators.dateMaxByDay(_value.maxDate));
                }
                break;
            default:
                if (_value.hasRange) {
                    validate.push(Validators.min(_value.rangeFrom), Validators.max(_value.rangeTo));
                }
        }
        if (!check) {
            if (labelForm.contains(_value.id)) {
                labelForm.setControl(_value.id, this.formBuilder.control(_value.defaultValue, validate));
            } else {
                labelForm.addControl(_value.id, this.formBuilder.control(_value.defaultValue, validate));
            }
        }
    }

    convertRefArray(data: any[]): any[] {
        const result: any[] = [];
        if (data.length === 2 && data[0].length === data[1].length) {
            for (let i = 0; i < data[0].length; i++) {
                result.push({ id: data[0][i], value: data[1][i]});
            }
        }
        return result;
    }

    mayAccessRecord(type: string, referenceId: string, recordId: string = null): Promise<boolean> {
        let url = `${environment.apiUrl}/api/reference/access/record/add/${referenceId}`;
        if (recordId && recordId.length) {
            url = `${environment.apiUrl}/api/reference/access/record/${type}/${referenceId}/${recordId}`;
        }
        return this.http.post<boolean>(url, {})
            .toPromise()
            .then(response => response as boolean)
            .catch();
    }

    getHeaderFields(referenceId, sectionId): Promise<any[]>  {
        return this.http.get<any[]>(`${environment.apiUrl}/api/reference/section/header/${referenceId}/${sectionId}`)
            .toPromise()
            .then(response => response)
            .catch();
    }
}
