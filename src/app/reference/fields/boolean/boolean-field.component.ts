import {Component, OnInit, Input, OnChanges, Output, EventEmitter, forwardRef} from '@angular/core';
import {ControlValueAccessor, FormBuilder, FormGroup, NG_VALUE_ACCESSOR, Validators} from '@angular/forms';
import {BooleanField} from '../../../interfaces/services/reference/fields/boolean';

@Component({
	selector: 'tc-boolean-field',
	templateUrl: './boolean-field.component.html',
	styleUrls: ['./boolean-field.component.scss'],
	providers: [
		{
			provide: NG_VALUE_ACCESSOR,
			useExisting: forwardRef(() => TCBooleanFieldComponent),
			multi: true
		}
	]
})
export class TCBooleanFieldComponent implements OnInit, OnChanges, ControlValueAccessor {
	@Input() align: string;
	@Input() title: string;
	@Input() type: string;
	@Input() isNew = false;
	@Input() isConfig = false;
	@Input() styleType = 'standard';
	@Input() _valueField: BooleanField = null;
	@Input() form: FormGroup = new FormGroup({});
	// tslint:disable-next-line:no-input-rename
	@Input('value') innerValue = false;

	@Output() resultData: EventEmitter<number> = new EventEmitter();

	isFocused = false;

	onChange = (value: boolean) => {};
	onTouched = () => {};

	constructor(private formBuilder: FormBuilder) {}

	ngOnInit() {}

	ngOnChanges(changes) {
		if (changes._valueField && this._valueField) {
			if (this.type === 'edit') {
				if (this.isNew) {
					this.value = this._valueField.defaultValue.toString().toLowerCase() === 'true';
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
	set value(value: boolean) {
		this.writeValue(value);
		this.onChange(value);
	}

	writeValue(value: boolean) {
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
