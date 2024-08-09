import {Component, OnInit, inject, signal, computed} from '@angular/core';
import { CommonModule } from '@angular/common';
import { AbstractControl, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { TimerComponent } from '../timer/timer.component';
import { MatError } from '@angular/material/form-field';
import { errors } from '../../../../core/helpers/static-data';
import {DataService} from "../../../../core/services/data.service";
import {ValidationService} from "../../../../core/services/validation.service";
import {GridData} from "../../../../core/interfaces/interfaces";
import {MaterialModule} from "../../../../core/modules/material.module";

@Component({
  selector: 'app-grid',
  templateUrl: './data-grid.component.html',
  styleUrls: ['./data-grid.component.scss']
})
export class GridComponent implements OnInit {
  private dataService = inject(DataService);
  private validationService = inject(ValidationService);
  public tableData$ = this.dataService.tableData$;
  public displayedColumns = ['fromSeconds', 'toSeconds', 'color', 'actions'];
  public newRowForm!: FormGroup;
  showNewRowForm = signal(false);
  currentSecond = signal(0);
  currentColor = computed(() => {
    const second = this.currentSecond();
    const row = this.dataService.rowsData.find(r => r.fromSecond <= second && r.toSecond >= second);
    return row ? row.color : '#ffffff';
  });
  private _fb = inject(FormBuilder);

  ngOnInit() {
    this.newRowForm = this._fb.group({
      fromSecond: ['', [Validators.required, Validators.min(0), Validators.max(58)]],
      toSecond: ['', [Validators.required, Validators.min(1), Validators.max(59)]],
      color: ['#000000', [Validators.required]],
    }, {
      validators: this.validationService.fromToValidator(),
      asyncValidators: [this.validationService.checkTimeConflict.bind(this.validationService), this.validationService.checkColorConflict.bind(this.validationService)]
    });
  }

  get control() {
    return this.newRowForm.controls;
  }

  checkRangeError(formControl: AbstractControl, formControlName: string): string {
    const errorMessages: any = errors[formControlName];
    for (let errorKey of Object.keys(errorMessages)) {
      if (formControl.hasError(errorKey)) {
        return errorMessages[errorKey];
      }
    }
    return '';
  }

  isFormError(error: string): boolean {
    return this.newRowForm.hasError(error);
  }

  checkColorError(): string {
    if (this.newRowForm.hasError('required')) {
      return 'Required';
    }
    if (this.newRowForm.hasError('colorConflict')) {
      return 'Color already exists.'
    }
    return '';
  }

  addRow() {
    if (this.newRowForm.valid) {
      this.dataService.addRow(this.newRowForm.value);
      this.newRowForm.reset({ color: '#ffffff' });
      this.showNewRowForm.set(false);
    }
  }

  removeRow(row: GridData) {
    this.dataService.removeRow(row);
  }

  updateCurrentSecond(second: number) {
    this.currentSecond.set(second);
  }

  toggleNewRowForm() {
    this.showNewRowForm.set(!this.showNewRowForm());
  }
}
