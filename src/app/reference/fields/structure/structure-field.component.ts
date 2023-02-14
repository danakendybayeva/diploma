import {Component, OnInit, Input, OnChanges, Output, EventEmitter, forwardRef} from '@angular/core';
import {ControlValueAccessor, FormBuilder, FormGroup, NG_VALUE_ACCESSOR, Validators} from '@angular/forms';
import {ReferenceField} from '../../../interfaces/services/reference/fields/reference';
import {HttpClient} from '@angular/common/http';
import {IOption} from '../../../ui/interfaces/option';
import {TCModalService} from '../../../ui/services/modal/modal.service';
import {FieldService} from '../../../interfaces/services/reference/field.service';
import {TCReferenceFieldComponent} from '../reference';

@Component({
	selector: 'tc-structure-field',
	templateUrl: './structure-field.component.html',
	styleUrls: ['./structure-field.component.scss'],
	providers: [
		{
			provide: NG_VALUE_ACCESSOR,
			useExisting: forwardRef(() => TCStructureFieldComponent),
			multi: true
		}
	]
})
export class TCStructureFieldComponent extends TCReferenceFieldComponent implements OnInit, OnChanges, ControlValueAccessor {
	@Input() align: string;
	@Input() title: string;
	@Input() type = 'view';
	@Input() isNew = false;
	@Input() isConfig = false;
	@Input() styleType = 'standard';
	@Input() _valueField: ReferenceField = null;
	@Input() form: FormGroup = new FormGroup({});
	@Input('value') innerValue = [];
	loadingRef = false;
	refDefaultValue = '';
	referenceFieldsOption: IOption[] = [];
	referenceSelectedTitle = '';

	@Output() resultData: EventEmitter<any[]> = new EventEmitter();

	isFocused = false;

	referenceValueAuto: any[] = [];
	onChange = (value: any[]) => {};
	onTouched = () => {};

	constructor(
		formBuilder: FormBuilder,
		http: HttpClient,
		modal: TCModalService,
		fieldService: FieldService,
	) {
		super(formBuilder, http, modal, fieldService);
	}

	ngOnInit() {
		super.ngOnInit();
	}

	async ngOnChanges(changes) {
		super.ngOnChanges(changes);
		if (changes._valueField && this._valueField) {
			this._valueField.referenceId = '00000000-0000-0000-0000-000000000017';
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

}
