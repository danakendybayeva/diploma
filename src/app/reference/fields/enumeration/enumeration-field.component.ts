import {Component, EventEmitter, Input, OnChanges, OnInit, Output} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {EnumerationField} from '../../../interfaces/services/reference/fields/enumeration';
import {IOption} from '../../../ui/interfaces/option';
import {Util} from '../../../interfaces/services/util.service';

@Component({
	selector: 'tc-enumeration-field',
	templateUrl: './enumeration-field.component.html',
	styleUrls: ['./enumeration-field.component.scss']
})
export class TCEnumerationFieldComponent implements OnInit, OnChanges {
	@Input() align: string;
	@Input() title: string;
	@Input() type: string;
	@Input() color: string;
	@Input() isNew = false;
	@Input() styleType = 'standard';
	@Input('value') innerValue: any[] = [];
	@Input() _valueField: EnumerationField = null;
	@Input() form: FormGroup = new FormGroup({});

	@Output() resultData: EventEmitter<number> = new EventEmitter();

	isFocused = false;
	enumOption: IOption[] = [];

	selected: string[] = [];

	constructor(private formBuilder: FormBuilder) {}

	ngOnInit() {}

	ngOnChanges(changes) {
		if (changes._valueField && this._valueField) {
			if (this.type === 'edit') {
				const validate = (this._valueField.isRequired) ? [Validators.required] : [];
				this.form.addControl(this._valueField.id, this.formBuilder.control(null, validate));

				if (this._valueField.value) {
					this._valueField.value.forEach(item => {
						this.selected.push(item.id);
					});
				}
				if (this._valueField.values) {
					this._valueField.values.forEach(item => {
						this.enumOption.push({value: item.id, label: item.value, selected: item.selected});
					});
				}
			}
		}
	}

	focused() {
		this.isFocused = true;
	}

	changeValueEnum(event) {
		if (event) {
			let eventClone = event;
			if (!Array.isArray(event)) {
				eventClone = [event];
			}
			this._valueField.value = this._valueField.values.filter(function (item) {
				return eventClone.indexOf(item.id) > -1;
			});
		}
	}

	convertToAng() {
		if (this._valueField.value != null) {
			const result = [];
			Object.entries(this._valueField.value).forEach(
				([key, value]) => {
					result.push({id: key, value: value});
				}
			);
			this._valueField.value = result;
		}
	}

	setBadges(id) {
		const badges = Util.getFromArrObjectFilter(this._valueField.values, id);
		if (badges.length) {
			return badges[0].badges;
		}
		return null;
	}

}
