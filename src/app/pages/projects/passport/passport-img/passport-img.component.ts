import {Component, OnInit, Input, Output, EventEmitter} from '@angular/core';
import {BasePageComponent} from '../../../base-page';
import {environment} from '../../../../../environments/environment';
import {Observable, Observer} from 'rxjs';
import {ToastrService} from 'ngx-toastr';
import {Store} from '@ngrx/store';
import {IAppState} from '../../../../interfaces/app-state';
import {HttpService} from '../../../../services/http/http.service';
import {NzUploadFile} from 'ng-zorro-antd/upload';

@Component({
    // tslint:disable-next-line:component-selector
    selector: 'passport-img',
    templateUrl: './passport-img.component.html',
    styleUrls: ['./passport-img.component.scss']
})
export class PassportImgComponent extends BasePageComponent implements OnInit {
    @Input() imgUrl: string;
    @Output() changeImgUrl = new EventEmitter<string>();
    inputValue = 'okhjg';
    postAction = environment.apiUrl + '/api/media/file/request-file/image';
    maxSize = 5;
    apiUrl = environment.apiUrl;

    constructor(store: Store<IAppState>,
                httpSv: HttpService,
                private toastr: ToastrService,
    ) {
        super(store, httpSv);
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

    handleChange(info: { file: NzUploadFile }): void {
        switch (info.file.status) {
            case 'uploading':
                // this.loading = true;
                break;
            case 'done':
                if (info.file.response && info.file.response.status === 1) {
                    this.imgUrl = info.file.response.value;
                    this.changeImgUrl.emit(this.imgUrl);
                    // this.innerValue.push({id: info.file.response.value, value: info.file.name});
                }
                break;
            case 'error':
                this.toastr.error('Network error', 'Error', { closeButton: true });
                // this.loading = false;
                break;
            case 'removed':
                // const index = this.innerValue.findIndex(p => p.id === info.file.uid
                //     || (info.file.response && p.id === info.file.response.value));
                // if (index >= 0) {
                //     this.innerValue.splice(index, 1);
                // }
                // break;
        }
    }

    private getBase64(img: File, callback: (img: string) => void): void {
        const reader = new FileReader();
        // tslint:disable-next-line:no-non-null-assertion
        reader.addEventListener('load', () => callback(reader.result!.toString()));
        reader.readAsDataURL(img);
    }
}
