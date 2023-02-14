import {Component, OnInit, Input, OnChanges, Output, EventEmitter, AfterViewChecked, ChangeDetectorRef, forwardRef} from '@angular/core';
import {ControlValueAccessor, FormBuilder, FormGroup, NG_VALUE_ACCESSOR, Validators} from '@angular/forms';
import {DateField} from '../../../interfaces/services/reference/fields/date';
import {CustomValidators} from '../../validators/CustomValidators';

@Component({
	selector: 'tc-date-field',
	templateUrl: './date-field.component.html',
	styleUrls: ['./date-field.component.scss'],
	providers: [
		{
			provide: NG_VALUE_ACCESSOR,
			useExisting: forwardRef(() => TCDateFieldComponent),
			multi: true
		}
	]
})
export class TCDateFieldComponent implements OnInit, OnChanges, ControlValueAccessor {
	@Input() align: string;
	@Input() title: string;
	@Input() type: string;
	@Input() isNew = false;
	@Input() isConfig = false;
	@Input() styleType = 'standard';
	@Input() _valueField: DateField = null;
	@Input() form: FormGroup = new FormGroup({});
	@Input('value') innerValue: string;

	@Output() resultData: EventEmitter<any> = new EventEmitter();

	isFocused = false;

	onChange = (value: string) => {};
	onTouched = () => {};

	constructor(private formBuilder: FormBuilder) {}

	ngOnInit() {}

	ngOnChanges(changes) {
		if (changes._valueField && this._valueField) {
			this.dateChanged();
		}
	}

	dateChanged() {
		if (
			this._valueField
			&& this.type === 'edit'
			&& this.form
		) {
			const validate = (this._valueField.isRequired && !this.isConfig) ? [Validators.required] : [];
			if (this._valueField.currentTimestamp && this.isNew) {
				const dateValue2 = new Date();
				dateValue2.setDate(dateValue2.getDate() + Number(this._valueField.addDays));
				if (!this.isConfig) {
					this.value = dateValue2.getFullYear() + '-'
						+ (dateValue2.getMonth() + 1 > 9 ? dateValue2.getMonth() + 1 : '0' + (dateValue2.getMonth() + 1)) + '-'
						+ (dateValue2.getDate() > 9 ? dateValue2.getDate() : '0' + dateValue2.getDate());
				}
				validate.push(Validators.min(this._valueField.minDate), Validators.max(this._valueField.maxDate));
			} else {
				validate.push(CustomValidators.dateMinByDay(this._valueField.minDate), CustomValidators.dateMaxByDay(this._valueField.maxDate));
			}
			if (this.form.contains(this._valueField.id)) {
				this.form.setControl(this._valueField.id, this.formBuilder.control(this.value, validate));
			} else {
				this.form.addControl(this._valueField.id, this.formBuilder.control(this.value, validate));
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

}
