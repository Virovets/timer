import { Injectable } from '@angular/core';
import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { DataService } from './data.service';

@Injectable({
  providedIn: 'root'
})
export class ValidationService {
  constructor(private dataService: DataService) {}

  fromToValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const fromSecond = control.get('fromSecond')?.value;
      const toSecond = control.get('toSecond')?.value;

      if (fromSecond !== null && toSecond !== null && fromSecond >= toSecond) {
        return { 'fromGreaterThanTo': true };
      }

      return null;
    };
  }

  checkTimeConflict(control: AbstractControl): Observable<ValidationErrors | null> {
    const { fromSecond, toSecond } = control.value;
    const timeConflict = this.dataService.rowsData.some(row =>
      (fromSecond >= row.fromSecond && fromSecond <= row.toSecond) ||
      (toSecond >= row.fromSecond && toSecond <= row.toSecond) ||
      (fromSecond <= row.fromSecond && toSecond >= row.toSecond)
    );

    const uniqueSeconds = !this.dataService.rowsData.some(row =>
      (fromSecond === row.fromSecond || toSecond === row.toSecond)
    );

    const errors: ValidationErrors = {};
    if (timeConflict) {
      errors['timeRangeConflict'] = true;
    }
    if (!uniqueSeconds) {
      errors['timeRangeConflict'] = true;
    }

    return of(Object.keys(errors).length ? errors : null).pipe(delay(500));
  }

  checkColorConflict(control: AbstractControl): Observable<ValidationErrors | null> {
    const color = control.get('color')?.value;
    const conflict = this.dataService.rowsData.some(row => row.color === color);
    return of(conflict ? { colorConflict: true } : null).pipe(delay(500));
  }
}
