import {Component, OnInit, Input, OnChanges, Output, EventEmitter, forwardRef} from '@angular/core';
import {ControlValueAccessor, FormBuilder, FormGroup, NG_VALUE_ACCESSOR, Validators} from '@angular/forms';

@Component({
	selector: 'tc-test',
	templateUrl: './test.component.html',
	styleUrls: ['./test.component.scss'],
	providers: [
		{
			provide: NG_VALUE_ACCESSOR,
			useExisting: forwardRef(() => TCTestComponent),
			multi: true
		}
	]
})
export class TCTestComponent implements OnInit, OnChanges, ControlValueAccessor {
	@Input() _valueField: any = {};
	// tslint:disable-next-line:no-input-rename
	@Input('value') innerValue: string | number;

	@Output() resultData: EventEmitter<number> = new EventEmitter();

	isFocused = false;

	onChange = (value: string | number) => {};
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
	set value(value: string | number) {
		this.writeValue(value);
		this.onChange(value);
	}

	writeValue(value: string | number) {
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
