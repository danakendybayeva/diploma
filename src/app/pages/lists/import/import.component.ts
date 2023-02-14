import { Component, OnInit } from '@angular/core';
import {BasePageComponent} from '../../base-page';
import {Store} from '@ngrx/store';
import {IAppState} from '../../../interfaces/app-state';
import {HttpService} from '../../../services/http/http.service';
import {FormBuilder} from '@angular/forms';
import {NzMessageService} from 'ng-zorro-antd/message';
import {Observable, Observer} from 'rxjs';
import {environment} from '../../../../environments/environment';
import {HttpClient} from '@angular/common/http';
import {StudentCsv} from '../../../interfaces/services/student.service';

@Component({
  selector: 'csv-import',
  templateUrl: './import.component.html',
  styleUrls: ['./import.component.scss']
})
export class ImportComponent extends BasePageComponent implements OnInit {
  records = [];
  fileList: any[];
  headers = [];
  recordsJson: StudentCsv[];
  apiUrl: String = '';
  constructor(store: Store<IAppState>,
              httpSv: HttpService,
              private formBuilder: FormBuilder,
              private msg: NzMessageService,
              private http: HttpClient) {
    super(store, httpSv);

    this.pageData = {
      title: 'Page Edit',
      loaded: true,
    };

    this.apiUrl = environment.apiUrl;
  }

  ngOnInit() {
    super.ngOnInit();
  }

  handleChangeUpload({ file, fileList }: { [key: string]: any })  {
    const status = file.status;
    if (status !== 'uploading') {
      console.log(file);
    }
    if (status === 'done') {
      this.msg.success(`${file.name} file uploaded successfully.`, {nzDuration: 2000});
      const reader = new FileReader();
      reader.readAsText(file.originFileObj);
      reader.addEventListener('load', () => {
        const res = reader.result.toString().split('\n');
        const results = [];
        // const resultsKey: StudentCsv;
        // tslint:disable-next-line:prefer-const
        const res2: StudentCsv[] = [];

        const headers = [];
        this.records = [];
        let i = 0;
        res.forEach(obj => {

          if (i === 0) {
            headers.push(obj.toString().split(';'));
          } else {
            const res3 = obj.toString().split(';');
            // const res2: StudentCsv;
            // results.push(res);
            // let j = 0;
            // res2 = null;
            // res2.firstName = res3[0];
            // res2.lastName = res3[1];
            // res2.education = res3[2];
            // res2.speciality = res3[3];
            // res2.gender = res3[4];
            // res2.grants = res3[5];
            // res2.english_value = res3[6];
            // res2.phone = res3[7];
            // res2.email = res3[8];
            // obj.toString().split(';').forEach(obj2 => {
            //   res2;
            //   j++;
            // });
            // resultsKey.push(res2);
            // const fio = res3[0].split(' ');
            let grant = true;
            if (res3[10].toLowerCase().trim() === ('MDS мүмкіндіктері').toLowerCase().trim()) {
              grant = false;
            }
            res2.push({ firstName: res3[0].trim(), lastName: res3[1].trim(), genderString: res3[2],
              speciality: res3[5], course: res3[6],
              email: res3[3], educationStr: res3[4], grants: grant});
          }
          i++;
        });
        this.headers = headers;
        this.recordsJson = res2;
        this.records = results;
        console.log(this.recordsJson);
        this.exportStudentList();
      }, false);

    } else if (status === 'error') {
      this.msg.error(`${file.name} file upload failed.`, {nzDuration: 2000});
    }
  }

  isCSVFile(file: any) {

    return file.name.endsWith('.csv');

  }
  beforeUpload = (file: File) => {
    return new Observable((observer: Observer<boolean>) => {
      const isCSV = file.type === 'text/csv';
      if (!isCSV) {
        this.msg.error('You can only upload CSV file!');
        observer.complete();
        return;
      }

      const isLt2M = file.size / 1024 / 1024 < 2;
      if (!isLt2M) {
        this.msg.error('File must smaller than 2MB!', {nzDuration: 2000});
        observer.complete();
        return;
      }

      observer.next(isCSV && isLt2M);
      observer.complete();
    });
  }

  exportStudentList() {
    this.http.post(`${environment.apiUrl}/api/profiles/list/csv`, this.recordsJson)
        .subscribe({
          next: data => console.log('success => ' + data),
          error: error => console.log('Error => ' + error)
        });
  }

}
