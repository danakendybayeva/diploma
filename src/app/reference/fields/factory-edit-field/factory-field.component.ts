import {Component, OnInit, Input, OnChanges, Output, EventEmitter, forwardRef} from '@angular/core';
import {ControlValueAccessor, FormBuilder, FormGroup, NG_VALUE_ACCESSOR, Validators} from '@angular/forms';
import {IField} from '../../../interfaces/services/reference/fields/field';

@Component({
	selector: 'tc-factory-field',
	templateUrl: './factory-field.component.html',
	styleUrls: ['./factory-field.component.scss'],
	providers: [
		{
			provide: NG_VALUE_ACCESSOR,
			useExisting: forwardRef(() => TCFactoryFieldComponent),
			multi: true
		}
	]
})
export class TCFactoryFieldComponent implements OnInit, OnChanges, ControlValueAccessor {
	@Input() align: string;
	@Input() title: string;
	@Input() type: string;
	@Input() isNew = false;
	@Input() isConfig = false;
	@Input() styleType = 'standard';
	@Input() _valueField: IField = null;
	@Input() form: FormGroup = new FormGroup({});
	// tslint:disable-next-line:no-input-rename
	@Input('value') innerValue: any = null;

	@Output() resultData: EventEmitter<any> = new EventEmitter();

	isFocused = false;

	onChange = (value: any) => {};
	onTouched = () => {};

	constructor(private formBuilder: FormBuilder) {}

	ngOnInit() {}

	ngOnChanges(changes) {
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
	}

}
