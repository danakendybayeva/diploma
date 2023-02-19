import {
  ChangeDetectionStrategy,
  HostBinding,
  Input,
  SimpleChanges,
  Component,
  OnChanges,
  OnInit,
} from '@angular/core';

@Component({
  selector: 'tc-circle-progress',
  templateUrl: './circle-progress.component.html',
  styleUrls: ['./circle-progress.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TCCircleProgressComponent implements OnInit, OnChanges {
  @HostBinding('class.tc-circle-progress') true;
  @HostBinding('style.height') @Input() size: string;
  @HostBinding('style.width') get ViewSize() {
    return this.size;
  }

  @Input() rotate: number;
  @Input() value: number | boolean;
  @Input() type = 'progress';
  @Input() strokeColor: string | string[];

  @Input() strokeWidth: number;
  @Input() secondaryStrokeWidth: number;

  @Input() secondaryColor: string;
  @Input() secondaryOffset: number;

  circumference: number;
  strokeDashoffset: number;

  constructor() {
    this.strokeColor = '';
    this.secondaryColor = '';
    this.strokeDashoffset = 0;
    this.circumference = 2 * Math.PI * 47;
    this.secondaryOffset = 0;
    this.rotate = -90;
  }

  ngOnInit() {}

  ngOnChanges(changes: SimpleChanges) {
    if (changes['value']) {
      this.strokeDashoffset = this.calculateOffset(
        changes['value'].currentValue
      );
    }
  }

  calculateOffset(val: number): number {
    if (this.type === 'icon') {
      return 0;
    }
    return this.circumference - (val / 100) * this.circumference;
  }

  get SecondaryOffset() {
    return this.calculateOffset(this.secondaryOffset);
  }

  getSecondaryCircleStyles(): any {
    return {
      stroke: this.secondaryColor,
      'stroke-dasharray': this.circumference,
      'stroke-offset': this.SecondaryOffset
    };
  }

  getProgressCircleStyles(): any {
    return {
      stroke: this.strokeColor,
      'stroke-dashoffset': this.strokeDashoffset,
      'stroke-dasharray': this.circumference,
      'stroke-width': this.strokeWidth,
      transform: `rotate(${this.rotate}deg)`,
    };
  }
}
