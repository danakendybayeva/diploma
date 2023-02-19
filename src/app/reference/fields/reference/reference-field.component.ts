import {Component, OnInit, Input, OnChanges, Output, EventEmitter, forwardRef} from '@angular/core';
import {ControlValueAccessor, FormBuilder, FormGroup, NG_VALUE_ACCESSOR, Validators} from '@angular/forms';
import {StringField} from '../../../interfaces/services/reference/fields/string';
import {ReferenceField} from '../../../interfaces/services/reference/fields/reference';
import {environment} from '../../../../environments/environment';
import {map} from 'rxjs/operators';
import {HttpClient} from '@angular/common/http';
import {IOption} from '../../../ui/interfaces/option';
import {Content} from '../../../ui/interfaces/modal';
import {TCModalService} from '../../../ui/services/modal/modal.service';
import {moveItemInArray} from '@angular/cdk/drag-drop';
import {FieldService} from '../../../interfaces/services/reference/field.service';

@Component({
	selector: 'tc-reference-field',
	templateUrl: './reference-field.component.html',
	styleUrls: ['./reference-field.component.scss'],
	providers: [
		{
			provide: NG_VALUE_ACCESSOR,
			useExisting: forwardRef(() => TCReferenceFieldComponent),
			multi: true
		}
	]
})
export class TCReferenceFieldComponent implements OnInit, OnChanges, ControlValueAccessor {
	@Input() align: string;
	@Input() title: string;
	@Input() type = 'view';
	@Input() isNew = false;
	@Input() isConfig = false;
	@Input() styleType = 'standard';
	@Input() _valueField: ReferenceField = null;
	@Input() isStructure = false;
	@Input() form: FormGroup = new FormGroup({});
	// tslint:disable-next-line:no-input-rename
	@Input('value') innerValue: any[] = [];
	loadingRef = false;
	refDefaultValue = '';
	referenceFieldsOption: IOption[] = [];
	referenceSelectedTitle = '';
	modalRec = [];

	@Output() resultData: EventEmitter<any[]> = new EventEmitter();

	isFocused = false;

	referenceValueAuto: any[] = [];
	onChange = (value: any[]) => {};
	onTouched = () => {};

	constructor(
		private formBuilder: FormBuilder,
		private http: HttpClient,
		private modal: TCModalService,
		private fieldService: FieldService,
	) {}

	ngOnInit() {}

	async ngOnChanges(changes) {
		if (changes._valueField && this._valueField) {
			if (
				this._valueField
				&& this.type === 'edit'
				&& this.form
			) {
				const validate = (this._valueField.isRequired && !this.isConfig) ? [Validators.required] : [];
				this.form.addControl(this._valueField.id, this.formBuilder.control(null, validate));
				await this.prepareRefFieldsOption();
			}
			this.refDefaultValue = '';
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
		this.writeValue(value);
		this.onChange(value);
	}

	writeValue(value: any[]) {
		if (value !== this.innerValue) {
			this.innerValue = value;
		}
		if (value === null) {
			this.innerValue = [];
		}
		this.onChange(this.innerValue);
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

	changeDefaultAuto(event) {
		const wordSearch = this.refDefaultValue;
		if (this.refDefaultValue.length > 2) {
			this.loadingRef = true;
		}
		setTimeout(() => {
			if (wordSearch === this.refDefaultValue) {
				if (this.refDefaultValue && this.refDefaultValue.length > 2) {
					this.getListRecordAutocomplete();
				}
			}
		}, 900);
	}

	getListRecordAutocomplete() {
		return this.http.get<any[]>(`${environment.apiUrl}/api/reference/record/get/autocomplete/${this._valueField.referenceId}` +
			`?value=${encodeURI(this.refDefaultValue)}&fields=${encodeURI(this._valueField.fields.join(','))}&template=${encodeURI(this._valueField.templateView)}`)
			.pipe(map(data => {
				return data;
			}))
			.subscribe(data => {
				this.referenceValueAuto = this.getUnique(this.referenceValueAuto.concat(data));
				this.loadingRef = false;
			});
	}

	prepareDefaultValue(event) {
		let templateView = this._valueField.templateView;
		this.referenceFieldsOption.forEach(item => {
			if (this._valueField.fields.indexOf(item.value) >= 0) {
				templateView = templateView.replace(item.label, item.value);
			}
		});
		let templateView1 = templateView;
		this.referenceFieldsOption.forEach(item => {
			if (this._valueField.fields.indexOf(item.value) >= 0) {
				templateView1 = templateView1.replace('{' + item.value + '}', event[item.value]);
			}
		});
		return {id: event['id'], value: templateView1};
	}

	getUnique(data): any[] {
		const arrayUniqueByKey = [...new Map(data.map(item =>
			[item['id'], item])).values()];
		return arrayUniqueByKey;
	}

	changeDefaultAutoSelected(event) {
		if (this.value.length >= this._valueField.limit && this._valueField.limit > 0) {
			this.refDefaultValue = '';
			return;
		}
		const search = this.referenceValueAuto.filter(function (item) {
			return event.toString() === item['value'];
		});
		let resultValue = this.value;
		if (search.length > 0) {
			if (this._valueField.isSingle) {
				resultValue = [{id: search[0]['id'], value: event}];
			} else {
				resultValue.push({id: search[0]['id'], value: event});
			}
		}
		this.value = this.getUnique(resultValue);
		this.refDefaultValue = '';
	}

	openModal<T>(body: Content<T>, header: Content<T> = null, footer: Content<T> = null, options: any = null) {
		this.modal.open({
			body: body,
			header: null,
			footer: footer,
			options: options
		});
	}

	closeModal() {
		this.modal.close();
		// TODO потом озгерту керек; когда екі модалка ашылганда search input жасамайды; пока говно код спасает
		const myElement = document.getElementsByClassName('cdk-overlay-container');
		for (let i = 0; i < myElement.length; i++) {
			const slide = myElement[i] as HTMLElement;
			slide.style.display = 'block';
		}
	}

	selectRecordRef() {
		this.closeModal();
		const record = this.modalRec;
		let templateView = this._valueField.templateView;
		this.referenceFieldsOption.forEach(item => {
			if (this._valueField.fields.indexOf(item.value) >= 0) {
				templateView = templateView.replace(item.label, item.value);
			}
		});
		const resultValue = [];
		for (let i = 0; i < record.length; i++) {
			let templateView1 = templateView;
			this.referenceFieldsOption.forEach(item => {
				if (this._valueField.fields.indexOf(item.value) >= 0) {
					templateView1 = templateView1.replace('{' + item.value + '}', record[i][item.value] ? record[i][item.value] : '');
				}
			});
			resultValue.push({id: record[i].id, value: templateView1});
		}
		this.value = resultValue;
	}

	selectedDefaultValue(event) {
		this.modalRec = event;
	}

	removeItem(index: number) {
		this.value.splice(index, 1);
	}

	onDrop(params)  {
		moveItemInArray(this.value, params.previousIndex, params.currentIndex);
		moveItemInArray(this.modalRec, params.previousIndex, params.currentIndex);
	}

	async prepareRefFieldsOption() {
		if (this._valueField.referenceId === null) { return; }
		const referenceB = await this.fieldService.getReferenceById(this._valueField.referenceId);
		if (referenceB === null) { return; }
		this.referenceSelectedTitle = referenceB.title;
		let fieldsTogether = null;
		if (referenceB.userFields && referenceB.sysFields) {
			fieldsTogether = Object.assign(JSON.parse(referenceB.userFields), JSON.parse(referenceB.sysFields));
		} else if (referenceB.userFields) {
			fieldsTogether = JSON.parse(referenceB.userFields);
		} else if (referenceB.sysFields) {
			fieldsTogether = JSON.parse(referenceB.sysFields);
		}
		const resultOption = [];
		Object.keys(fieldsTogether).map(function (key) {
			const res = {
				value: key,
				label: fieldsTogether[key]['title']
			};
			resultOption[fieldsTogether[key]['orderNum']] = res;
		});
		this.referenceFieldsOption = resultOption;
	}
}
