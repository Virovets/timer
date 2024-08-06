import {Component, signal, computed, OnInit, inject} from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  ValidationErrors,
  ValidatorFn,
  Validators
} from '@angular/forms';
import {TimerComponent} from "../timer/timer.component";
import {BehaviorSubject, delay, Observable, of} from "rxjs";
import {MatError, MatFormField, MatLabel} from "@angular/material/form-field";
import {
  MatCell, MatCellDef,
  MatColumnDef,
  MatHeaderCell, MatHeaderCellDef,
  MatHeaderRow,
  MatHeaderRowDef,
  MatRow, MatRowDef,
  MatTable
} from "@angular/material/table";
import {MatButton} from "@angular/material/button";
import {MatIcon} from "@angular/material/icon";
import {MatInput} from "@angular/material/input";
import {GridData} from "../../../core/interfaces/interfaces";
import {errors} from "../../../core/helpers/static-data";

@Component({
  selector: 'app-grid',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    TimerComponent,
    ReactiveFormsModule,
    MatFormField,
    MatIcon,
    MatError,
    MatTable,
    MatColumnDef,
    MatHeaderCell,
    MatCell,
    MatButton,
    MatHeaderRow,
    MatRow,
    MatHeaderRowDef,
    MatRowDef,
    MatCellDef,
    MatHeaderCellDef,
    MatLabel,
    MatInput
  ],
  templateUrl: './data-grid.component.html',
  styleUrl: './data-grid.component.scss'
})
export class GridComponent implements OnInit {
  public tableData$: BehaviorSubject<GridData[]> = new BehaviorSubject<GridData[]>([]);
  public displayedColumns = ['fromSeconds', 'toSeconds', 'color', 'actions'];
  private _rowsData = [
    { fromSecond: 5, toSecond: 15, color: '#000000' },
  ];
  public newRowForm!: FormGroup;
  showNewRowForm = signal(false);
  currentSecond = signal(0);
  currentColor = computed(() => {
    const second = this.currentSecond();
    const row = this._rowsData.find(r => r.fromSecond <= second && r.toSecond >= second);
    return row ? row.color : '#ffffff';
  });
  private _fb = inject(FormBuilder);

  updateView() {
    this.tableData$.next(this._rowsData);
  }

  ngOnInit() {
    this.updateView();
    this.newRowForm = this._fb.group({
      fromSecond: ['', [Validators.required, Validators.min(0), Validators.max(58)]],
      toSecond: ['', [Validators.required, Validators.min(1), Validators.max(59)]],
      color:  ['#000000', [Validators.required]],
    }, {
      validators: this.fromToValidator(),
      asyncValidators: [this.checkTimeConflict.bind(this), this.checkColorConflict.bind(this)]
    });
  }


  checkTimeConflict(control: AbstractControl): Observable<ValidationErrors | null> {
      const { fromSecond, toSecond } = control.value;
      const timeConflict = this._rowsData.some(row =>
        (fromSecond >= row.fromSecond && fromSecond <= row.toSecond) ||
        (toSecond >= row.fromSecond && toSecond <= row.toSecond) ||
        (fromSecond <= row.fromSecond && toSecond >= row.toSecond)
      );

      const uniqueSeconds = !this._rowsData.some(row =>
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

  get control() {
    return this.newRowForm.controls;
  }

  checkRangeError(formControl: AbstractControl, formControlName: string): string {
    if (formControl.hasError('required')) {
      return errors[formControlName].required;
    }
    if (formControl.hasError('min')) {
      return errors[formControlName].min;
    }
    if (formControl.hasError('max')) {
      return errors[formControlName].max;
    }
    if (formControl.hasError('timeRangeConflict')) {
      return errors[formControlName].timeRangeConflict;
    }
    if (formControl.hasError('fromGreaterThanTo')) {
      return errors[formControlName].fromGreaterThanTo;
    }
    return ''
  }

  isFormError(error: string): boolean {
    return this.newRowForm.hasError(error);
  }


  checkColorConflict(control: AbstractControl): Observable<ValidationErrors | null> {
    const color = control.get('color')?.value;
    const conflict = this._rowsData.some(row => row.color === color);
    return of(conflict ? { colorConflict: true } : null).pipe(delay(500));
  }

  checkColorError(): string {
    if (this.newRowForm.hasError('required')) {
      return 'Required';
    }
    if (this.newRowForm.hasError('colorConflict')) {
      return 'Color already exists.'
    }
    return ''
  }

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

  addRow() {
    if (this.newRowForm.valid) {
      this._rowsData.push(this.newRowForm.value);
      this.newRowForm.reset({color: '#ffffff'});
      this.showNewRowForm.set(false);
      this.updateView();
    }
  }

  removeRow(row: GridData) {
    this._rowsData = this._rowsData.filter(r => r !== row);
    this.updateView();
  }

  updateCurrentSecond(second: number) {
    this.currentSecond.set(second);
  }

  toggleNewRowForm() {
    this.showNewRowForm.set(!this.showNewRowForm());
  }
}
