import {Component, OnInit, Input, OnChanges, Output, EventEmitter, forwardRef} from '@angular/core';
import {ControlValueAccessor, FormBuilder, FormGroup, NG_VALUE_ACCESSOR, Validators} from '@angular/forms';
import {IntegerField} from '../../../interfaces/services/reference/fields/integer';

@Component({
	selector: 'tc-integer-field',
	templateUrl: './integer-field.component.html',
	styleUrls: ['./integer-field.component.scss'],
	providers: [
		{
			provide: NG_VALUE_ACCESSOR,
			useExisting: forwardRef(() => TCIntegerFieldComponent),
			multi: true
		}
	]
})
export class TCIntegerFieldComponent implements OnInit, OnChanges, ControlValueAccessor {
	@Input() align: string;
	@Input() title: string;
	@Input() type = 'view';
	@Input() isNew = false;
	@Input() isConfig = false;
	@Input() styleType = 'standard';
	@Input() _valueField: IntegerField = null;
	@Input() form: FormGroup = new FormGroup({});
	// tslint:disable-next-line:no-input-rename
	@Input('value') innerValue: number;

	@Output() resultData: EventEmitter<number> = new EventEmitter();

	isFocused = false;

	onChange = (value: number) => {};
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
				if (this._valueField.hasRange) {
					validate.push(Validators.min(this._valueField.rangeFrom), Validators.max(this._valueField.rangeTo));
				}
				if (this.form.contains(this._valueField.id)) {
					this.form.setControl(this._valueField.id, this.formBuilder.control(null, validate));
				} else {
					this.form.addControl(this._valueField.id, this.formBuilder.control(null, validate));
				}
			}
		}
	}

	// get value
	get value() {
		return this.innerValue;
	}

	// set value
	set value(value: number) {
		this.writeValue(value);
		this.onChange(value);
	}

	writeValue(value: number) {
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
