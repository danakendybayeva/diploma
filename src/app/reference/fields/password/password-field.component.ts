import {Component, OnInit, Input, OnChanges, Output, EventEmitter, forwardRef} from '@angular/core';
import {AbstractControl, ControlValueAccessor, FormBuilder, FormGroup, NG_VALUE_ACCESSOR, ValidatorFn, Validators} from '@angular/forms';
import {PasswordField} from '../../../interfaces/services/reference/fields/password';
import {CustomValidators} from '../../validators/CustomValidators';

@Component({
	selector: 'tc-password-field',
	templateUrl: './password-field.component.html',
	styleUrls: ['./password-field.component.scss'],
	providers: [
		{
			provide: NG_VALUE_ACCESSOR,
			useExisting: forwardRef(() => TCPasswordFieldComponent),
			multi: true
		}
	]
})
export class TCPasswordFieldComponent implements OnInit, OnChanges, ControlValueAccessor {
	@Input() align: string;
	@Input() title: string;
	@Input() type: string;
	@Input() isNew = false;
	@Input() isConfig = false;
	@Input() styleType = 'standard';
	@Input() _valueField: PasswordField = null;
	@Input() form: FormGroup = new FormGroup({});
	// tslint:disable-next-line:no-input-rename
	@Input('value') innerValue: string;

	@Output() resultData: EventEmitter<string> = new EventEmitter();

	isFocused = false;
	prefix = '';
	mask: string = null;
	validatorMask = false;
	confirm = '';

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
				this.form.addControl(this._valueField.id, this.formBuilder.control(this.value, validate));
				this.form.addControl(this._valueField.id + 'confirm',
					this.formBuilder.control(this.confirm, []));
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

	checkConfirmPassword() {
		if (this.value !== this.confirm) {
			this.form.controls[this._valueField.id + 'confirm'].setErrors({'notMatch': true});
		} else {
			this.form.controls[this._valueField.id + 'confirm'].setErrors(null);
		}
	}

}
