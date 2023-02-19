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
import {environment} from '../../../../environments/environment';
import {HttpClient} from '@angular/common/http';


@Component({
	selector: 'tc-filter-students',
	templateUrl: './filter-students.component.html',
	styleUrls: ['./filter-students.component.scss'],
	providers: [
		{
			provide: NG_VALUE_ACCESSOR,
			useExisting: forwardRef(() => TCFilterStudentsComponent),
			multi: true
		}
	]
})
export class TCFilterStudentsComponent
	implements ControlValueAccessor, OnInit, OnChanges {
	@Input('value') innerValue: any = {};
	@Input() hasMentor: Boolean = false;
	@Input() hasGender: Boolean = false;
	@Input() hasSpeciality: Boolean = false;
	@Input() hasUniversity: Boolean = false;
	@Input() hasSemester: Boolean = false;
	@Input() hasCity: Boolean = false;
	@Input() hasMonth: Boolean = false;
	@Input() hasCourse: Boolean = false;
	@Input() hasApply: Boolean = false;
	@Output() change: EventEmitter<any>;
	@Output() apply: EventEmitter<any> = new EventEmitter<any>();

	university = [];
	speciality = [];
	mentors = [];
	city = [];
	gender: any[] = [
		{ value: 1, label: 'Boys' },
		{ value: 2, label: 'Girls' },
	];

	course: any[] = [
		{ value: '1', label: '1' },
		{ value: '2', label: '2' },
		{ value: '3', label: '3' },
		{ value: '4', label: '4' },
	];

	semester: any[] = [
		{ value: 1, label: 'Семестр 1' },
		{ value: 2, label: 'Семестр 2' }
	];

	months: any[] = [
		{ value: 9, label: 'September' },
		{ value: 10, label: 'October' },
		{ value: 11, label: 'November' },
		{ value: 12, label: 'December' },
		{ value: 2, label: 'February' },
		{ value: 3, label: 'March' },
		{ value: 4, label: 'April' },
		{ value: 5, label: 'May' },
	];
	optionsField: any[] = [];

	onChange = (value: any[]) => {};
	onTouched = () => {};

	constructor(public element: ElementRef, private http: HttpClient) {
		this.change = new EventEmitter<any>();
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
		this.getSpeciality().then(r => {
			this.speciality = this.getPrepareOption(r['speciality']);
			this.university = this.getPrepareOption(r['university']);
			this.city = this.getPrepareOption(r['city']);
			this.mentors = [{value: '00000000-0000-0000-0000-000000000000', label: 'Барлық студенттер'}, ...this.getPrepareOption(r['mentors'])];
		});
	}

	ngOnChanges(changes) {
		setTimeout(() => {

		});
	}

	registerOnChange(fn) {
		this.onChange = fn;
	}

	registerOnTouched(fn) {
		this.onTouched = fn;
	}

	writeValue(value: any) {
		if (value !== this.innerValue) {
			this.innerValue = value;
		}
	}

	async getSpeciality(): Promise<any> {
		return this.http.get<any>(`${environment.apiUrl}/api/profile/fields/list`)
			.toPromise()
			.then(response => response)
			.catch();
	}

	getPrepareOption(value: any[]): any[] {
		const rr = [];
		value.forEach(item => {
			rr.push({value: item.id, label: item.value});
		});
		return rr;
	}

	changeFilter() {
		this.change.emit(this.value);
	}

	applyFilter() {
		this.change.emit(this.value);
		this.apply.emit(this.value);
	}
}
