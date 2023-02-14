import {
  Component,
  OnInit,
  HostBinding,
  HostListener,
  Input,
  ElementRef,
  AfterContentInit,
  ViewChild,
  forwardRef,
  EventEmitter,
  Output, OnDestroy
} from '@angular/core';

import { ControlValueAccessor, NG_VALUE_ACCESSOR} from '@angular/forms';

import { TCPickerComponent } from './picker/picker.component';

@Component({
  selector: 'tc-color-picker',
  templateUrl: './color-picker.component.html',
	styleUrls: ['./color-picker.component.scss'],
	providers: [
		{
			provide: NG_VALUE_ACCESSOR,
			useExisting: forwardRef(() => TCColorPickerComponent),
			multi: true
		}
	]
})
export class TCColorPickerComponent implements OnInit, AfterContentInit, ControlValueAccessor {
	@ViewChild('picker', { static: true }) public picker: TCPickerComponent;
	@ViewChild('secondPicker', { static: true }) public secondPicker: TCPickerComponent;
	@HostBinding('class.tc-color-picker') true;
	@HostBinding('class.disabled') @Input() disabled: boolean;
	@HostBinding('class.gradient') @Input() gradient: boolean;

	@Input() opened: boolean;
	@Input() palette: boolean;
	@Input() buttons: boolean;
	@Input() overlay: boolean;
	@Input() savedColor: string;
	@Input() secondColor: string;
	@Input() alphaChanel: boolean;
	@Input() width: number | string;
	@Input() paletteColors: Array<string>;

	@Output() pickerOpened: EventEmitter<string>;
	@Output() pickerClosed: EventEmitter<string>;
  @Output() colorSelected: EventEmitter<{color: string, contrast: string}>;
  @Output() secondColorSelected: EventEmitter<{ color: string, contrast: string }>;

	contrastColor: string;
	secondContrastColor: string;
	defaultPalette: string[];

	onChange = (color: string) => {};
	onTouched = () => {};

  constructor(private element: ElementRef) {
    this.width = 305;
		this.opened = false;
		this.palette = true;
		this.overlay = false;
		this.buttons = false;
		this.alphaChanel = true;
		this.savedColor = '#06bebd';

		this.pickerClosed = new EventEmitter();
    this.pickerOpened = new EventEmitter();
		this.colorSelected = new EventEmitter();
    this.secondColorSelected = new EventEmitter();

		this.defaultPalette = ['#f44336', '#9c27b0', '#2196f3', '#4caf50', '#ffeb3b', '#ff9800', '#795548', '#607d8b'];
  }

	ngOnInit() {
		let palette = [];

		if (this.paletteColors && this.paletteColors.length >= 8) {
			palette = this.paletteColors.splice(0, 8);
		} else if (this.paletteColors && this.paletteColors.length < 8) {
			palette = [...this.paletteColors, ...this.defaultPalette.splice(0, 8 - this.paletteColors.length)];
		} else {
			palette = this.defaultPalette;
		}

		if (this.picker) {
			this.picker.pickerOpened.subscribe(() => {
				this.pickerOpened.emit(this.SavedColor);
				this.picker.setPosition(this.getOffsets().top, this.getOffsets().left);
			});

			this.picker.pickerClosed.subscribe(() => {
				this.SavedColor = this.picker.savedColor;
				this.pickerClosed.emit(this.SavedColor);
			});

			this.picker.colorSelected.subscribe(({color, contrast}) => {
				this.SavedColor = color;
				this.contrastColor = contrast;
				this.colorSelected.emit({ color: color, contrast: contrast });
			});

			if (this.opened) {
				this.picker.show();
			}

			this.picker.palette = palette;
			this.picker.opened = this.opened;
			this.picker.buttons = this.buttons;
			this.picker.overlay = this.overlay;
			this.picker.showPalette = this.palette;
			this.picker.savedColor = this.SavedColor;
			this.picker.alphaChanel = this.alphaChanel;
			this.contrastColor = this.picker.contrastColor;

			this.picker.width = this.width;
			this.picker.setPosition(this.getOffsets().top, this.getOffsets().left);
			this.picker.appendToBody();
		}

		if (this.gradient) {
			this.secondPicker.pickerClosed.subscribe(() => {
				this.picker.setPosition(this.getOffsets().top, this.getOffsets().left + 13);
				this.secondContrastColor = this.secondPicker.contrastColor;
				this.secondColor = this.secondPicker.savedColor;
			});

      this.secondPicker.colorSelected.subscribe(({ color, contrast }) => {
        this.secondColor = color;
        this.secondColorSelected.emit({ color: color, contrast: contrast });
			});

			this.secondPicker.pickerOpened.subscribe(() => {
				this.onResize();
			});

			this.secondPicker.gradient = true;
			this.secondPicker.palette = palette;
			this.secondPicker.buttons = this.buttons;
			this.secondPicker.overlay = this.overlay;
			this.secondPicker.showPalette = this.palette;
			this.secondPicker.savedColor = this.secondColor;
			this.secondPicker.alphaChanel = this.alphaChanel;
			this.secondContrastColor = this.secondPicker.contrastColor;

			this.secondPicker.width = this.width;
			this.secondPicker.setPosition(this.getOffsets().top, this.getOffsets().left);
			this.secondPicker.appendToBody();
		}
	}

	ngAfterContentInit() {
		this.onResize();
	}

	@HostListener('window:resize')
	public onResize() {
		this.picker.setPosition(this.getOffsets().top, this.getOffsets().left);
		if (this.secondPicker) {
			this.secondPicker.setPosition(this.getOffsets().top, this.getOffsets().left);
		}
	}

	set SavedColor(color: string) {
    this.savedColor = color;
    this.onChange(color);
    this.writeValue(color);
	}

	get SavedColor(): string {
    if (this.gradient) {
      return this.savedColor;
    }

		return this.savedColor;
	}

  writeValue(color: string): void {
    this.savedColor = color;
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
		this.onTouched = fn;
  }

	openPicker(event, gradient: boolean) {
		event.stopPropagation();

		if (!this.disabled) {
			if (gradient) {
				this.secondPicker.show();
			} else {
				this.picker.show();
			}
		}
	}

	gradientStyles() {
		return {
			'left': '33px'
		};
	}

	getCursorClass(second: boolean) {
		if (second) {
			return {
				'black': this.secondContrastColor !== '#ffffff'
			};
		} else {
			return {
				'black': this.contrastColor !== '#ffffff'
			};
		}
	}

	getOffsets(): { top: number, left: number} {
		const rect = this.element.nativeElement.getBoundingClientRect(),
    scrollLeft = window.pageXOffset || document.documentElement.scrollLeft,
    scrollTop = window.pageYOffset || document.documentElement.scrollTop;

    return { top: rect.top + scrollTop, left: rect.left + scrollLeft };
	}
}
