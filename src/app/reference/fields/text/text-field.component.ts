import {Component, OnInit, Input, OnChanges, Output, EventEmitter, forwardRef} from '@angular/core';
import {ControlValueAccessor, FormBuilder, FormGroup, NG_VALUE_ACCESSOR, Validators} from '@angular/forms';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import {TextField} from '../../../interfaces/services/reference/fields/text';

@Component({
	selector: 'tc-text-field',
	templateUrl: './text-field.component.html',
	styleUrls: ['./text-field.component.scss'],
	providers: [
		{
			provide: NG_VALUE_ACCESSOR,
			useExisting: forwardRef(() => TCTextFieldComponent),
			multi: true
		}
	]
})
export class TCTextFieldComponent implements OnInit, OnChanges, ControlValueAccessor {
	@Input() align: string;
	@Input() title: string;
	@Input() type: string;
	@Input() isNew = false;
	@Input() isConfig = false;
	@Input() disabled = false;
	@Input() styleType = 'standard';
	@Input() prefixIcon = '';
	@Input() _valueField: TextField = null;
	@Input() form: FormGroup = new FormGroup({});
	// tslint:disable-next-line:no-input-rename
	@Input('value') innerValue: string;
	@Input() minHeightText = 200;

	@Output() resultData: EventEmitter<string> = new EventEmitter();

	isFocused = false;
	prefix = '';
	validatorMask = false;
	tinyMceSettings = {
		base_url: '/tinymce',
		suffix: '.min',
		plugins: [
			'autoresize preview searchreplace autolink autosave',
			'directionality visualblocks visualchars fullscreen',
			'image link media template codesample table charmap',
			'hr pagebreak nonbreaking anchor toc insertdatetime',
			'advlist lists wordcount imagetools textpattern noneditable ' +
			'help charmap quickbars emoticons code'
		],
		skin: 'CUSTOM',
		content_css: 'CUSTOM',
		mode: 'none',
		statusbar: false,
		min_height: this.minHeightText,
		max_height: 1000,
		resize: true,
		toolbar: 'undo redo | formatselect | bold italic backcolor | \\\n' +
			'       alignleft aligncenter alignright alignjustify | \\\n' +
			'       bullist numlist outdent indent | removeformat | help | code',
	};
	showTxt = false;

	onChange = (value: string) => {};
	onTouched = () => {};

	constructor(private formBuilder: FormBuilder, private sanitizer: DomSanitizer) {}

	ngOnInit() {
		setTimeout(() => {
			this.showTxt = true;
		}, 500);
	}

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
		if (changes.minHeightText && this.minHeightText) {
			this.tinyMceSettings.min_height = this.minHeightText;
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
