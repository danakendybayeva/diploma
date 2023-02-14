import {Component, OnInit, Input, OnChanges, Output, EventEmitter, forwardRef} from '@angular/core';
import {ControlValueAccessor, FormBuilder, FormGroup, NG_VALUE_ACCESSOR, Validators} from '@angular/forms';
import {StringField} from '../../../interfaces/services/reference/fields/string';

@Component({
	selector: 'tc-string-field',
	templateUrl: './string-field.component.html',
	styleUrls: ['./string-field.component.scss'],
	providers: [
		{
			provide: NG_VALUE_ACCESSOR,
			useExisting: forwardRef(() => TCStringFieldComponent),
			multi: true
		}
	]
})
export class TCStringFieldComponent implements OnInit, OnChanges, ControlValueAccessor {
	@Input() align: string;
	@Input() title: string;
	@Input() type: string;
	@Input() isNew = false;
	@Input() isConfig = false;
	@Input() styleType = 'standard';
	@Input() _valueField: StringField = null;
	@Input() form: FormGroup = new FormGroup({});
	// tslint:disable-next-line:no-input-rename
	@Input('value') innerValue: string;

	@Output() resultData: EventEmitter<number> = new EventEmitter();

	isFocused = false;

	onChange = (value: string) => {};
	onTouched = () => {};

	constructor(private formBuilder: FormBuilder) {}

	ngOnInit() {}

	ngOnChanges(changes) {
		if (changes._valueField && this._valueField) {
			if (
				this._valueField
				&& this.type === 'edit'
				&& this.form
			) {
				const validate = (this._valueField.isRequired && !this.isConfig) ? [Validators.required] : [];
				this.form.addControl(this._valueField.id, this.formBuilder.control(null, validate));
			}
			if (this._valueField.defaultValue === 'null') {
				this._valueField.defaultValue = null;
			}
		}
	}

	// get value
	get value() {
		return this.innerValue;
	}

	// set value
	set value(value: string) {
		this.writeValue(value);
		this.onChange(value);
	}

	writeValue(value: string) {
		if (value !== this.innerValue) {
			this.innerValue = value;
		}
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
