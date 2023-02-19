import {Component, OnInit, Input, OnChanges, Output, EventEmitter, forwardRef} from '@angular/core';
import {ControlValueAccessor, FormBuilder, FormGroup, NG_VALUE_ACCESSOR, Validators} from '@angular/forms';

@Component({
	selector: 'tc-multiple',
	templateUrl: './multiple.component.html',
	styleUrls: ['./multiple.component.scss'],
	providers: [
		{
			provide: NG_VALUE_ACCESSOR,
			useExisting: forwardRef(() => TCMultipleComponent),
			multi: true
		}
	]
})
export class TCMultipleComponent implements OnInit, OnChanges, ControlValueAccessor {
	@Input() _valueField: any = {};
	// tslint:disable-next-line:no-input-rename
	@Input('value') innerValue = [];

	@Output() resultData: EventEmitter<any[]> = new EventEmitter();
	isFocused = false;

	onChange = (value: any[]) => {};
	onTouched = () => {};

	constructor() {}

	ngOnInit() {}

	ngOnChanges(changes) {
		if (changes._valueField && this._valueField) {
		}
	}

	// get value
	get value() {
		return this.innerValue;
	}

	// set value
	set value(value: any[]) {
		this.writeValue(value);
		this.onChange(value);
	}

	writeValue(value: any[]) {
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

	changeCheckbox(event) {
		const result = [];
		if (this._valueField['answers'] != null && this._valueField['answers'].length) {
			this._valueField['answers'].forEach((item, index) => {
				if (item['selected']) {
					result.push(item['id']);
				}
			});
		}
		this.value = result;
	}

}
