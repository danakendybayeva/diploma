import {
  Component,
  OnInit,
  Input,
  ElementRef,
  forwardRef,
  ChangeDetectorRef,
  HostListener,
  HostBinding,
  Output,
  EventEmitter, OnChanges,
} from '@angular/core';

import { NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { TCInputComponent } from '../input';

@Component({
  selector: 'tc-autocomplete-mds',
  templateUrl: './autocomplete-mds.component.html',
  styleUrls: ['./autocomplete-mds.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => TCAutocompleteMdsComponent),
      multi: true,
    },
  ],
})
export class TCAutocompleteMdsComponent extends TCInputComponent implements OnInit, OnChanges, ControlValueAccessor {
  @HostBinding('class.tc-autocomplete') true;

  @Input() data: any[];
  @Input() key: string;
  @Input() loading = false;
  @Input() listBgColor: string;
  @Input() listBorderColor: string;
  @Input() listColor: string;
  @Input() listMarkColor: string;

  @Output() opened: EventEmitter<void>;
  @Output() closed: EventEmitter<void>;
  @Output() optionSelected: EventEmitter<string>;

  results: string[];
  arrowKeyLocation: number;
  openedList: boolean;
  attached: boolean;
  dataOld: any[];

  constructor(
    element: ElementRef,
    private changeDetector: ChangeDetectorRef,
    private sanitizer: DomSanitizer
  ) {
    super(element);

    this.simpleInput = false;
    this.attached = false;
    this.results = [];
    this.arrowKeyLocation = -1;
    this.data = [];
    this.dataOld = this.data;

    this.openedList = false;
    this.opened = new EventEmitter<void>();
    this.closed = new EventEmitter<void>();
    this.optionSelected = new EventEmitter<string>();
    this.listMarkColor = '#cd5447';
  }

  ngOnInit() {}

  @HostListener('document:click', ['$event'])
  @HostListener('document:touchstart', ['$event'])
  handleClick(event: Event) {
    if (this.opened && !this.element.nativeElement.contains(event.target)) {
      this.closeList();
    }
  }

  ngOnChanges() {
    super.ngOnChanges();
    if (this.data !== this.dataOld) {
      this.dataOld = this.data;
      this.modelChanged(this.value);
    }
  }

  // model change
  modelChanged(val: string) {
    if (val.length > 2) {
      this.results = this.getResults(this.data, val, this.key);
      !this.openedList && val && this.results ? this.openList() : null;
      this.openedList && (!val || !this.results.length) ? this.closeList() : null;
    } else {
      this.closeList();
    }
  }

  // open list
  openList() {
    this.opened.emit();
    this.openedList = true;
  }

  // close list
  closeList() {
    this.closed.emit();
    this.openedList = false;
    this.arrowKeyLocation = -1;
  }

  // get autocomplete list
  getResults(data: string[], val: string, key?: string) {
    if (!data.length) {
      return [];
    }

    return data.filter(item => {
      const v = key ? item[key] : item;

      return v.toLowerCase().indexOf(val.toLowerCase()) > -1;
    });
  }

  // mark filled value
  markValue(label: string, val: string) {
    let text: string = label;
    const regex = new RegExp(val, 'gi');
    const COLOR = this.listMarkColor;

    if (val) {
      text = text.replace(regex, function(match) {
        return `<span class='val-mark' style='color: ${COLOR}'>${match}</span>`;
      });
    }

    return this.sanitizer.bypassSecurityTrustHtml(text);
  }

  // detect focus event
  autocompleteOnFocus() {
    this.focus.emit();
  }

  // detect blur event
  autocompleteOnBlur() {
    this.blur.emit();
  }

  // select item
  selectItem(value: string, event?: Event) {
    event ? event.preventDefault() : null;

    let newVal = this.key ? value[this.key] : value;

    if (newVal.length > this.charLimiting) {
      newVal = newVal.slice(0, this.charLimiting);
    }
    if (this.charLimiting > 0) {
      super.changeCharLength(this.charLimiting, newVal.length);
    }

    this.innerValue = newVal;
    this.optionSelected.emit(newVal);
    this.onChange(newVal);
    this.closeList();
  }

  // key click map
  keyClick(event: KeyboardEvent) {
    switch (event.key) {
      case 'Enter':
        if (this.arrowKeyLocation >= 0 && this.results.length) {
          this.selectItem(this.results[this.arrowKeyLocation]);
        }
        break;
      case 'Escape':
        this.closeList();
        break;
      case 'ArrowUp':
        this.arrowKeyLocation > 0 ? this.arrowKeyLocation-- : null;
        break;
      case 'ArrowDown':
        this.arrowKeyLocation + 1 < this.results.length
          ? this.arrowKeyLocation++
          : null;
    }
  }

  // custom component style
  getListStyles() {
    return {
      color: this.listColor ? this.listColor : null,
      background: this.listBgColor ? this.listBgColor : null,
      'border-color': this.listBorderColor ? this.listBorderColor : null,
    };
  }

  getMarkColor() {
    return this.listMarkColor ? this.listMarkColor : null;
  }
}
