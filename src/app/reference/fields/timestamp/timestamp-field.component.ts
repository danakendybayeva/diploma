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

				} else if (!this._valueField.currentTimestamp || !this.isConfig) {
					this.value = this._valueField.defaultValue;
				}

			}
			this.timestampChanged();
		}
	}

	defaultSetDate() {
		if ((!this._valueField.currentTimestamp || !this.isConfig)
			&& this._valueField.defaultValue
			&& this.value
		) {
			this.dateValue = this.value.toString().slice(0, 10);
			this.timeValue = this.value.toString().slice(11, 16);
		} else if (this._valueField.currentTimestamp || !this.isConfig) {
			const defaultDate = this.setDate(this._valueField.addDays, this._valueField.addTime);
			const formatDate = defaultDate.getFullYear() + '-'
				+ (defaultDate.getMonth() + 1 > 9 ? defaultDate.getMonth() + 1 : '0' + (defaultDate.getMonth() + 1))
				+ '-' + (defaultDate.getDate() > 9 ? defaultDate.getDate() : '0' + defaultDate.getDate());
			this.dateValue = formatDate;
			this.timeValue = defaultDate.toTimeString().substring(0, 5);
		}
	}

	timestampChanged() {
		const validate = (this._valueField.isRequired && !this.isConfig) ? [Validators.required] : [];
		if (
			this._valueField
			&& this.type === 'edit'
			&& this.form
		) {
			validate.push(
				CustomValidators.minTimestamp(this.setDate(this._valueField.minDay, this._valueField.minTime, 'minus')),
				CustomValidators.maxTimestamp(this.setDate(this._valueField.maxDay, this._valueField.maxTime))
			);

			if (this._valueField.currentTimestamp && this.isConfig) {
				this.value = this.setDate(this._valueField.addDays, this._valueField.addTime);
				if (this.form.contains(this._valueField.id)) {
					this.form.setControl(this._valueField.id, this.formBuilder.control(this.value, validate));
				} else {
					this.form.addControl(this._valueField.id, this.formBuilder.control(this.value, validate));
				}

				this.form.addControl(this._valueField.id + 'time',
					this.formBuilder.control(this._valueField.addTime, (this._valueField.isRequired) ? [Validators.required] : []));
				this.form.addControl(this._valueField.id + 'date',
					this.formBuilder.control(this._valueField.addDays, (this._valueField.isRequired) ? [Validators.required] : []));

				if (this.form.get([this._valueField.id]).invalid) {
					this.form.get([this._valueField.id + 'time']).setErrors({'date-max-day': {
							'date-maximum': this.setDate(this._valueField.maxDay, this._valueField.maxTime),
							'actual': this.value
						}});
					this.form.get([this._valueField.id + 'date']).setErrors({'date-max-day': {
							'date-maximum': this.setDate(this._valueField.maxDay, this._valueField.maxTime),
							'actual': this.value
						}});
				}
			} else if (!this._valueField.currentTimestamp || !this.isConfig) {
				this.form.addControl(this._valueField.id + 'time',
					this.formBuilder.control(this.timeValue, (this._valueField.isRequired) ? [Validators.required] : []));
				this.form.addControl(this._valueField.id + 'date',
					this.formBuilder.control(this.dateValue, (this._valueField.isRequired) ? [Validators.required] : []));

				if (this.dateValue.length || this.timeValue.length) {
					this.value = this.dateValue + ' ' + this.timeValue;
				}
				if (this.form.contains(this._valueField.id)) {
					this.form.setControl(this._valueField.id, this.formBuilder.control(this.value, validate));
				} else {
					this.form.addControl(this._valueField.id, this.formBuilder.control(this.value, validate));
				}

				this.defaultSetDate();
			}

		}

	}

	// get value
	get value() {
		return this.innerValue;
	}

	// set value
	set value(value: any) {
		this.writeValue(value);
		this.onChange(value);
	}

	writeValue(value: any) {
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
		this.timestampChanged();
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

}
