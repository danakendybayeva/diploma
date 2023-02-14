import {AbstractControl, ValidationErrors, ValidatorFn} from '@angular/forms';
import * as moment from 'moment';
import {max} from 'rxjs/operators';

export class CustomValidators {
  static dateMinByDay(date: number, time?: string, timeDef?: string, type?: string): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (control.value == null) {
        return null;
      }

      let valueDate = new Date(control.value);
      const minCurrentDate = new Date();
      if (!time && !timeDef) {
        valueDate.setHours(0, 0, 0, 0);
        minCurrentDate.setHours(0, 0, 0, 0);
      } else {
        let valueTime = new Date(control.value + ' ' + timeDef);
        let minTime = new Date(control.value + ' ' + time);
        if (type === 'time') {
          valueTime = new Date(timeDef + ' ' + control.value);
          minTime = new Date(timeDef + ' ' + time);
        }
        valueDate = valueTime;
        minCurrentDate.setHours(minCurrentDate.getHours() - minTime.getHours(), minCurrentDate.getMinutes() - minTime.getMinutes(), 0, 0);
      }
      minCurrentDate.setDate(minCurrentDate.getDate() - Number(date));

      return minCurrentDate <= valueDate ? null : {
        'date-min-day': {
          'date-minimum': minCurrentDate,
          'actual': valueDate
        }
      };
    };
  }

  static dateMaxByDay(date: number, time?: string, timeDef?: string, type?: string): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (control.value == null) {
        return null;
      }

      let valueDate = new Date(control.value);
      const maxCurrentDate = new Date();
      if (!time && !timeDef) {
        valueDate.setHours(0, 0, 0, 0);
        maxCurrentDate.setHours(0, 0, 0, 0);
      } else {
        let valueTime = new Date(control.value + ' ' + timeDef);
        let maxTime = new Date(control.value + ' ' + time);
        if (type === 'time') {
          valueTime = new Date(timeDef + ' ' + control.value);
          maxTime = new Date(timeDef + ' ' + time);
        }
        valueDate = valueTime;
        maxCurrentDate.setHours(maxCurrentDate.getHours() + maxTime.getHours(), maxCurrentDate.getMinutes() + maxTime.getMinutes(), 0, 0);
      }
      maxCurrentDate.setDate(maxCurrentDate.getDate() + Number(date));

      return maxCurrentDate >= valueDate ? null : {
        'date-max-day': {
          'date-maximum': maxCurrentDate,
          'actual': valueDate
        }
      };
    };
  }

  static minTimestamp(date: Date): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (control.value == null || control.value.length < 10) {
        return null;
      }
      const valueDate = new Date(control.value);
      return date <= valueDate ? null : {
        'date-min-day': {
          'date-minimum': date,
          'actual': valueDate
        }
      };
    };
  }

  static maxTimestamp(date: Date): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (control.value == null || control.value.length < 10) {
        return null;
      }
      const valueDate = new Date(control.value);
      return date >= valueDate ? null : {
        'date-max-day': {
          'date-maximum': date,
          'actual': valueDate
        }
      };
    };
  }
}
