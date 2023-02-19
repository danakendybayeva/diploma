import {Component, OnInit, Input, OnChanges, Output, EventEmitter, forwardRef} from '@angular/core';
import {ControlValueAccessor, FormBuilder, FormGroup, NG_VALUE_ACCESSOR, Validators} from '@angular/forms';
import {Observable, Observer} from 'rxjs';
import {environment} from '../../../../environments/environment';
import {HttpClient, HttpEvent, HttpEventType, HttpRequest, HttpResponse} from '@angular/common/http';
import {ToastrService} from 'ngx-toastr';
import {Util} from '../../../interfaces/services/util.service';
import {FileField} from '../../../interfaces/services/reference/fields/file';
import {NzUploadFile, NzUploadXHRArgs} from 'ng-zorro-antd/upload';
import {HttpService} from '../../../services/http/http.service';
import {map} from 'rxjs/operators';

@Component({
	selector: 'tc-file-field',
	templateUrl: './file-field.component.html',
	styleUrls: ['./file-field.component.scss'],
	providers: [
		{
			provide: NG_VALUE_ACCESSOR,
			useExisting: forwardRef(() => TCFileFieldComponent),
			multi: true
		}
	]
})
export class TCFileFieldComponent implements OnInit, OnChanges, ControlValueAccessor {
	@Input() align: string;
	@Input() title: string;
	@Input() type: string;
	@Input() referenceId: string = null;
	@Input() isNew = false;
	@Input() isConfig = false;
	@Input() styleType = 'standard';
	@Input() _valueField: FileField = null;
	@Input() form: FormGroup = new FormGroup({});
	@Input('value') innerValue: any[] = [];

	@Output() resultData: EventEmitter<any[]> = new EventEmitter();

	isFocused = false;
	loading = false;
	loadingValue = false;
	avatarUrl: string;
	showUploadList = {
		showPreviewIcon: true,
		showRemoveIcon: true,
		hidePreviewIconInNonImage: true
	};
	// TODO fileList Input Value boladi au
	fileList = [];
	previewImage: string | undefined = '';
	previewVisible = false;

	imageChangedEvent: any = '';
	croppedImage: any = '';
	apiUrl = environment.apiUrl;

	currentUser = null;
	formatMime = {};
	formatTypes = '';

	onChange = (value: any[]) => {};
	onTouched = () => {};

	constructor(
		private formBuilder: FormBuilder,
		private http: HttpClient,
		private httpSv: HttpService,
		private toastr: ToastrService
	) {}

	ngOnInit() {}

	ngOnChanges(changes) {
		if (changes._valueField && this._valueField) {
			if (this.type === 'edit') {
				if (this.isNew) {
					this.value = this._valueField.defaultValue;
				}
				if (this.form.contains(this._valueField.id)) {
					this.form.setControl(this._valueField.id, this.formBuilder.control(this.value, []));
				} else {
					this.form.addControl(this._valueField.id, this.formBuilder.control(this.value, []));
				}
			}

			if (Object.keys(this.formatMime).length === 0) {
				this.getData('assets/data/file-extension-to-mime-types.json', 'formatMime')
					.subscribe(
						data => {
							this.formatMime = data;
							const formats = [];
							this._valueField.extension.split(',').forEach(obj => {
								formats.push(this.formatMime['.' + obj.trim().toLowerCase()]);
							});
							this.formatTypes = formats.join(',');
						},
						err => {
							console.log(err);
						}
					);
			} else {
				this._valueField.extension.split(',').forEach(obj => {
					const formats = [];
					this._valueField.extension.split(',').forEach(obj => {
						formats.push(this.formatMime['.' + obj.trim().toLowerCase()]);
					});
					this.formatTypes = formats.join(',');
				});
			}
		}
	}

	// get value
	get value() {
		return this.innerValue;
	}

	// set value
	set value(value: any[]) {
		this.writeValue(value);
		this.onChange(value);
	}

	writeValue(value: any[]) {
		if (value !== this.innerValue) {
			if (value && value.length && this.type === 'edit') {
				this.loadingValue = true;
				for (const item of value) {
					this.fileList.push({
						uid: item.id,
						name: item.value,
						status: 'done',
						url: this.apiUrl + '/api/media/file/download/' + item.id
					});
					if (this._valueField.isSingle) {
						break;
					}
				}
				this.loadingValue = false;
			}
			this.innerValue = value;
		}
		this.fileList = Util.getUnique(this.fileList, 'uid');
	}

	// register OnChange event
	registerOnChange(fn: any) {
		this.onChange = fn;
	}

	// register OnTouched event
	registerOnTouched(fn: any) {
		this.onTouched = fn;
	}

	focused() {
		this.isFocused = true;
	}

	beforeUpload = (file: File) => {
		return new Observable((observer: Observer<boolean>) => {
			let isExtension = false;
			if (file.name.lastIndexOf('.') >= 0) {
				const extension = file.name.substring(file.name.lastIndexOf('.') + 1);
				isExtension = (this._valueField.extension.includes(extension) || this._valueField.extension.length === 0);
				if (!isExtension) {
					this.toastr.error('You can\'t upload this format!', 'Error', { closeButton: true });
					observer.complete();
					return;
				}
			}
			const isLt2M = file.size < this._valueField.maxSize || this._valueField.maxSize === 0;
			if (!isLt2M) {
				this.toastr.error('File must smaller than '
					+ this.round(this._valueField.maxSize / 1024 / 1024, 2) + 'MB!',
					'Error', { closeButton: true });
				observer.complete();
				return;
			}
			if (this.duplicateFile(file)) {
				this.toastr.error('File is duplicate!', 'Error', { closeButton: true });
				observer.complete();
				return;
			}
			// check height
			observer.next(isExtension && isLt2M);
			observer.complete();
		});
	}

	round(value, precision): number {
		const multiplier = Math.pow(10, precision || 0);
		return Math.round(value * multiplier) / multiplier;
	}

	private getBase64(img: File, callback: (img: string) => void): void {
		const reader = new FileReader();
		reader.addEventListener('load', () => callback(reader.result!.toString()));
		reader.readAsDataURL(img);
	}

	duplicateFile(file: File): boolean {
		let result = false;
		this.fileList.forEach(item => {
			if (
				item.name === file.name
				&& item.size === file.size
				&& item.type === file.type
			) {
				result = true;
				return;
			}
		});
		return result;
	}

	handleChange(info: { file: NzUploadFile }): void {
		switch (info.file.status) {
			case 'uploading':
				this.loading = true;
				break;
			case 'done':
				if (this.value === null) {
					this.value = [];
				}
				if (info.file.response && info.file.response.status === 1) {
					info.file.url = this.apiUrl + '/api/media/file/download/' + info.file.response.value;
					this.value.push({id: info.file.response.value, value: info.file.name});
					this.fileList[this.fileList.length - 1]['url'] = this.apiUrl + '/api/media/file/download/' + info.file.response.value;
				}
				this.loading = false;
				// Get this url from response in real world.
				// this.getBase64(info.file!.originFileObj!, (img: string) => {
				// 	this.loading = false;
				// });
				break;
			case 'error':
				this.toastr.error(info.file.error, 'Error', { closeButton: true });
				this.loading = false;
				break;
			case 'removed':
				const index = this.value.findIndex(p => p.id === info.file.uid
					|| (info.file.response && p.id === info.file.response.value));
				if (index >= 0) {
					this.value.splice(index, 1);
				}
				break;
		}
	}

	customReq = (item: NzUploadXHRArgs) => {
		// Create a FormData here to store files and other parameters.
		const formData = new FormData();
		// tslint:disable-next-line:no-any
		formData.append('file', item.file as any);
		formData.append('id', this.referenceId);
		formData.append('fieldId', this._valueField.id);
		// tslint:disable-next-line:no-non-null-assertion
		const req = new HttpRequest('POST', item.action!, formData, {
			reportProgress: true,
			withCredentials: true
		});
		// Always returns a `Subscription` object. nz-upload would automatically unsubscribe it at correct time.
		return this.http.request(req).subscribe(
			// tslint:disable-next-line no-any
			(event: HttpEvent<any>) => {
				if (event.type === HttpEventType.UploadProgress) {
					// tslint:disable-next-line:no-non-null-assertion
					if (event.total! > 0) {
						// tslint:disable-next-line:no-non-null-assertion
						(event as any).percent = (event.loaded / event.total!) * 100;
					}
					// tslint:disable-next-line:no-non-null-assertion
					item.onProgress!(event, item.file!);
				} else if (event instanceof HttpResponse) {
					// tslint:disable-next-line:no-non-null-assertion
					item.onSuccess!(event.body, item.file!, event);
				}
			},
			err => {
				// tslint:disable-next-line:no-non-null-assertion
				item.onError!(err, item.file!);
			}
		);
	}

	downloadReq = (file: NzUploadFile) => {
		this.downloadEvent(file.url, file.name);
	}

	downloadEvent(url: string, filename: string) {
		this.http.get(url,
			{responseType: 'blob' as 'json'}).subscribe(
			(response: any) => {
				const dataType = response.type;
				const binaryData = [];
				binaryData.push(response);
				const downloadLink = document.createElement('a');
				downloadLink.href = window.URL.createObjectURL(new Blob(binaryData, {type: dataType}));
				if (filename) {
					downloadLink.setAttribute('download', filename);
				}
				document.body.appendChild(downloadLink);
				downloadLink.click();
			}
		);
	}

	getTypeByName(filename: string): string {
		const dote = filename.lastIndexOf('.');
		if (dote >= 0) {
			switch (filename.substring(dote + 1)) {
				case 'jpg':
				case 'jpeg':
				case 'png':
				case 'gif':
					return 'icofont-file-image';
				case 'xls':
				case 'xlsx':
					return 'icofont-file-excel';
				case 'doc':
				case 'docx':
					return 'icofont-file-word';
				default:
					return 'sli-paper-clip tc-icon-wrap';
			}
		}
		return 'sli-paper-clip tc-icon-wrap';
	}

	getData(url: string, dataName: string) {
		return this.httpSv.getData(url)
			.pipe(map(data => {
				this[dataName] = data;
				return data;
			}));
	}
}
