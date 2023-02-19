import {Component, OnInit, Input, OnChanges, Output, EventEmitter, forwardRef} from '@angular/core';
import {ControlValueAccessor, FormBuilder, FormGroup, NG_VALUE_ACCESSOR, Validators} from '@angular/forms';
import {ImageField} from '../../../interfaces/services/reference/fields/image';
import { NzUploadFile, NzUploadXHRArgs } from 'ng-zorro-antd/upload';
import {Observable, Observer} from 'rxjs';
import {environment} from '../../../../environments/environment';
import {HttpClient, HttpEvent, HttpEventType, HttpRequest, HttpResponse} from '@angular/common/http';
import {ToastrService} from 'ngx-toastr';
import { ImageCroppedEvent } from 'ngx-image-cropper';
import {switchMap} from 'rxjs/operators';
import {Util} from '../../../interfaces/services/util.service';

@Component({
	selector: 'tc-image-field',
	templateUrl: './image-field.component.html',
	styleUrls: ['./image-field.component.scss'],
	providers: [
		{
			provide: NG_VALUE_ACCESSOR,
			useExisting: forwardRef(() => TCImageFieldComponent),
			multi: true
		}
	]
})
export class TCImageFieldComponent implements OnInit, OnChanges, ControlValueAccessor {
	@Input() align: string;
	@Input() title: string;
	@Input() type: string;
	@Input() referenceId: string = null;
	@Input() isNew = false;
	@Input() isConfig = false;
	@Input() styleType = 'standard';
	@Input() _valueField: ImageField = null;
	@Input() form: FormGroup = new FormGroup({});
	@Input('value') innerValue: any[] = [];
	@Input() postAction = environment.apiUrl + '/api/media/file/request-file/image';
	@Input() getUrl = environment.apiUrl + '/api/media/file/';

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

	onChange = (value: any[]) => {};
	onTouched = () => {};

	constructor(
		private formBuilder: FormBuilder,
		private http: HttpClient,
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
		}
	}

	// get value
	get value() {
		return this.innerValue;
	}

	// set value
	set value(value: any[]) {
		if (value === null) {
			value = [];
		}
		this.writeValue(value).then(r => {});
		this.onChange(value);
	}

	async writeValue(value: any[]) {
		if (value !== this.innerValue) {
			if (value && value.length && this.type === 'edit') {
				this.loadingValue = true;
				for (const item of value) {
					this.fileList.push({
						uid: item.id,
						name: item.value,
						status: 'done',
						url: this.getUrl + item.id,
						thumbUrl: this.getUrl + 'thumb/' + item.id
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
			const isJPG = file.type.includes('image/');
			if (!isJPG) {
				this.toastr.error('You can only upload Image file!', 'Error', { closeButton: true });
				observer.complete();
				return;
			}
			const isLt2M = file.size < this._valueField.maxSize || this._valueField.maxSize === 0;
			if (!isLt2M) {
				this.toastr.error('Image must smaller than '
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
			this.checkImageDimension(file).then(dimensionRes => {
				// TODO oilastiru kerek
				// if (!dimensionRes) {
				// this.toastr.error('Image only 300x300 above', 'Error', { closeButton: true });
				// 	observer.complete();
				// 	return;
				// }

				observer.next(isJPG && isLt2M && dimensionRes);
				observer.complete();
			});
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

	private checkImageDimension(file: File): Promise<boolean> {
		return new Promise(resolve => {
			const img = new Image(); // create image
			img.src = window.URL.createObjectURL(file);
			img.onload = () => {
				const width = img.naturalWidth;
				const height = img.naturalHeight;
				// tslint:disable-next-line:no-non-null-assertion
				window.URL.revokeObjectURL(img.src!);
				// resolve(width === height && width >= 1600);
				resolve(
					(this._valueField.thumbX === 0 && this._valueField.thumbY === 0)
					|| (this._valueField.thumbX === 0 && this._valueField.thumbY >= height)
					|| (this._valueField.thumbY === 0 && this._valueField.thumbX >= width)
					|| (this._valueField.thumbX >= width && this._valueField.thumbY >= height)
				);
			};
		});
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
					this.value.push({id: info.file.response.value, value: info.file.name});
				}
				// Get this url from response in real world.
				this.getBase64(info.file!.originFileObj!, (img: string) => {
					this.loading = false;
					this.avatarUrl = img;
				});
				break;
			case 'error':
				this.toastr.error('Network error', 'Error', { closeButton: true });
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

	handlePreview = async (file: NzUploadFile) => {
		if (file.url) {
			this.previewImage = file.url;
		} else {
			this.previewImage = file.thumbUrl;
		}
		this.previewVisible = true;
	}

	// Cropper
	fileChangeEvent(event: any): void {
		this.imageChangedEvent = event;
	}
	imageCropped(event: ImageCroppedEvent) {
		this.croppedImage = event.base64;
		// console.log(event);
	}
	imageLoaded(image: HTMLImageElement) {
		// show cropper
	}
	cropperReady(event) {
		// cropper ready
	}
	loadImageFailed() {
		// show message
	}
	changeImageCropped(param) {
		// console.log(param);
	}
}
