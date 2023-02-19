import {Component, OnInit, Input, OnChanges, Output, EventEmitter, ChangeDetectionStrategy, forwardRef} from '@angular/core';
import {
	AbstractControl,
	ControlValueAccessor,
	FormBuilder,
	FormGroup,
	NG_VALUE_ACCESSOR,
	ValidationErrors,
	ValidatorFn,
	Validators
} from '@angular/forms';
import {CustomValidators} from '../../validators/CustomValidators';
import {TimestampField} from '../../../interfaces/services/reference/fields/timestamp';
import {DatePipe} from '@angular/common';

@Component({
	selector: 'tc-timestamp-field',
	templateUrl: './timestamp-field.component.html',
	styleUrls: ['./timestamp-field.component.scss'],
	providers: [
		{
			provide: NG_VALUE_ACCESSOR,
			useExisting: forwardRef(() => TCTimestampFieldComponent),
			multi: true
		}
	]
})
export class TCTimestampFieldComponent implements OnInit, OnChanges, ControlValueAccessor {
	@Input() align: string;
	@Input() title: string;
	@Input() type: string;
	@Input() isNew = false;
	@Input() styleType = 'standard';
	@Input() isConfig = false;
	@Input() _valueField: TimestampField = null;
	@Input() form: FormGroup = new FormGroup({});
	// tslint:disable-next-line:no-input-rename
	@Input('value') innerValue: any;

	@Output() resultData: EventEmitter<number> = new EventEmitter();

	dateValue = '';
	timeValue = '';

	isFocused = false;
	clientTimezoneOffset = new Date().getTimezoneOffset();
	isChanged = false;

	onChange = (value: any) => {};
	onTouched = () => {};

	constructor(
		private formBuilder: FormBuilder
	) {}

	ngOnInit() {}

	ngOnChanges(changes) {
		if (changes._valueField && this._valueField) {
			if (this.isNew) {
				if (this._valueField.currentTimestamp && this.isConfig) {

				} else if (!this._valueField.currentTimestamp && !this.isConfig) {
					this.value = this._valueField.defaultValue;
				}

			}
			this.timestampChanged();
			// this.form.addControl(this._valueField.id, this.formBuilder.control(this.value, []));
		}
	}

	timestampChanged() {
		const validate = (this._valueField.isRequired && !this.isConfig) ? [Validators.required] : [];
		if (
			this._valueField
			&& this.type === 'edit'
			&& this.form
		) {
			if (this._valueField.minDay ||  this._valueField.minTime) {
				validate.push(CustomValidators.minTimestamp(this.setDate(this._valueField.minDay, this._valueField.minTime, 'minus')));
			}
			if (this._valueField.maxDay || this._valueField.maxTime) {
				validate.push(CustomValidators.maxTimestamp(this.setDate(this._valueField.maxDay, this._valueField.maxTime)));
			}
			if (this.isNew) {
				if (this._valueField.currentTimestamp && !this.isConfig) {
					this.value = this.setDate(this._valueField.addDays, this._valueField.addTime);
				}
			}
			this.form.addControl(this._valueField.id, this.formBuilder.control(this.value, validate));

		}

	}

	// get value
	get value() {
		if (this.type !== 'edit' && !this.isChanged && this.innerValue) {
			this.innerValue = new Date(this.innerValue);
			this.innerValue.setMinutes(this.innerValue.getMinutes() - Number(this.clientTimezoneOffset));
			this.isChanged = true;
		}
		return this.innerValue;
	}

	// set value
	set value(value: any) {
		if (!this.isNew && typeof value === 'string' && !this.isChanged) {
			value = new Date(value);
			value.setMinutes(value.getMinutes() - Number(this.clientTimezoneOffset));
			this.isChanged = true;
		}
		this.writeValue(value);
		this.onChange(value);
	}

	writeValue(value: any) {
		if (!this.isFocused && value === null) {
			return;
		}
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

	setDate(day: number, time: any, event: string = 'plus'): Date {
		const dateValue = new Date();
		if (event === 'minus') {
			if (day) {
				dateValue.setDate(dateValue.getDate() - Number(day));
			}
			if (time) {
				dateValue.setHours(
					dateValue.getHours() - Number(time.toString().substring(0, 2)),
					dateValue.getMinutes() - Number(time.toString().substring(3, 5)));
			}
		} else {
			if (day) {
				dateValue.setDate(dateValue.getDate() + Number(day));
			}
			if (time) {
				dateValue.setHours(
					dateValue.getHours() + Number(time.toString().substring(0, 2)),
					dateValue.getMinutes() + Number(time.toString().substring(3, 5)));
			}
		}
		return dateValue;
	}

	onChangeTimestamp(result: Date): void {
		// console.log('Selected Time: ', result);
	}

	onOk(result: Date | Date[] | null): void {
		// console.log('onOk', result);
	}

}
