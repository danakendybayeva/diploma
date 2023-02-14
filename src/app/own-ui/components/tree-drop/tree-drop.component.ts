import {
	Component,
	OnInit,
	Input,
	forwardRef,
	ElementRef,
	Output,
	EventEmitter,
	OnChanges
} from '@angular/core';
import { NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';
import {moveItemInArray} from '@angular/cdk/drag-drop';


@Component({
	selector: 'tc-tree-drop',
	templateUrl: './tree-drop.component.html',
	styleUrls: ['./tree-drop.component.scss'],
	providers: [
		{
			provide: NG_VALUE_ACCESSOR,
			useExisting: forwardRef(() => TCTreeDropComponent),
			multi: true
		}
	]
})
export class TCTreeDropComponent
	implements ControlValueAccessor, OnInit, OnChanges {
	@Input() size: string;
	@Input() required: boolean;
	@Input() autoSize: boolean;
	@Input() isSorted: boolean;
	@Input() changeOptions: boolean;
	@Input() options: any[] = [];
	@Input('value') innerValue: any[] = [];
	@Input() bgColor: string | string[];
	@Input() borderColor: string | string[];
	@Input() color: string | string[];

	@Output() change: EventEmitter<any[]>;

	optionsField: any[] = [];

	onChange = (value: any[]) => {};
	onTouched = () => {};

	constructor(public element: ElementRef) {
		this.change = new EventEmitter<any[]>();
	}

	get value() {
		return this.innerValue;
	}

	set value(v: any[]) {
		if (v !== this.innerValue) {
			this.innerValue = v;
			this.onChange(v);
			this.change.emit(v);
		}
	}

	ngOnInit() {

	}

	ngOnChanges(changes) {
		setTimeout(() => {
			this.optionsField = [];
			this.value.forEach((obj, index) => {
				if (this.options.some(obj2 => obj2.id === obj.id)) {
					const item = {
						id: obj.id,
						title: obj.title,
						selected: true
					};
					if (this.isSorted) {
						item['sortingUp'] = 'sortingUp' in obj ? obj['sortingUp'] as boolean : true;

						const indexSortVar = this.value.findIndex(object => object.id === item.id);
						if (indexSortVar >= 0) {
							item['sortingUp'] = this.value[indexSortVar]['sortBy'] === 'DESC' ? false : true;
						}
					}
					this.optionsField.push(item);
				}
			});

			this.options.forEach((obj, index) => {
				if (!this.optionsField.some(obj2 => obj2.id === obj.id)) {
					const item = {
						id: obj.id,
						title: obj.title,
						selected: false
					};
					if (this.isSorted) {
						item['sortingUp'] = true;
					}
					this.optionsField.push(item);
					if (this.changeOptions) {
						this.options[index] = item;
					}
				}
			});
		});
	}

	registerOnChange(fn) {
		this.onChange = fn;
	}

	registerOnTouched(fn) {
		this.onTouched = fn;
	}

	writeValue(value: any[]) {
		if (value !== this.innerValue) {
			this.innerValue = value;
		}
	}

	onDrop(params)  {
		moveItemInArray(this.optionsField, params.previousIndex, params.currentIndex);
		if (this.changeOptions) {
			moveItemInArray(this.options, params.previousIndex, params.currentIndex);
		}
		this.fieldSelect(0, null);
	}

	fieldSelect(index: number, event: any) {
		const anyVal = [];
		this.optionsField.forEach(obj => {
			if (obj.selected) {
				const item = {
					id: obj.id,
					title: obj.title
				};
				if (this.isSorted) {
					item['sortBy'] = obj.sortingUp ? 'ASC' : 'DESC';
				}
				anyVal.push(item);
			}
		});
		this.value = anyVal;
	}

	changeSort(index: number) {
		this.optionsField[index].sortingUp = !this.optionsField[index].sortingUp;
		this.fieldSelect(0, null);
	}
}
