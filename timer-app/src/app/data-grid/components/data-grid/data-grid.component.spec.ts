import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { DataService } from '../../../../core/services/data.service';
import { ValidationService } from '../../../../core/services/validation.service';
import { of } from 'rxjs';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideHttpClient } from '@angular/common/http';
import {GridComponent} from "./data-grid.component";
import {TimerComponent} from "../timer/timer.component";

describe('GridComponent', () => {
  let component: GridComponent;
  let fixture: ComponentFixture<GridComponent>;
  let dataService: DataService;
  let validationService: ValidationService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [GridComponent, TimerComponent],
      imports: [
        ReactiveFormsModule,
        MatFormFieldModule,
        MatTableModule,
        MatButtonModule,
        MatIconModule,
        MatInputModule,
        BrowserAnimationsModule
      ],
      providers: [
        provideAnimations(),
        provideHttpClient(),
        {
          provide: DataService,
          useValue: {
            tableData$: of([]),
            rowsData: [],
            addRow: jasmine.createSpy('addRow'),
            removeRow: jasmine.createSpy('removeRow')
          }
        },
        {
          provide: ValidationService,
          useValue: {
            fromToValidator: jasmine.createSpy('fromToValidator').and.returnValue(() => null),
            checkTimeConflict: jasmine.createSpy('checkTimeConflict').and.returnValue(of(null)),
            checkColorConflict: jasmine.createSpy('checkColorConflict').and.returnValue(of(null))
          }
        }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(GridComponent);
    component = fixture.componentInstance;
    dataService = TestBed.inject(DataService);
    validationService = TestBed.inject(ValidationService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize newRowForm', () => {
    expect(component.newRowForm).toBeDefined();
    expect(component.newRowForm.controls['fromSecond']).toBeDefined();
    expect(component.newRowForm.controls['toSecond']).toBeDefined();
    expect(component.newRowForm.controls['color']).toBeDefined();
  });

  it('should add a row when form is valid', () => {
    component.newRowForm.setValue({ fromSecond: 0, toSecond: 10, color: '#ff0000' });
    component.addRow();
    expect(dataService.addRow).toHaveBeenCalledWith({ fromSecond: 0, toSecond: 10, color: '#ff0000' });
    expect(component.newRowForm.get('color')?.value).toEqual('#ffffff');
    expect(component.showNewRowForm()).toBeFalse();
  });

  it('should not add a row when form is invalid', () => {
    component.newRowForm.setValue({ fromSecond: '', toSecond: '', color: '' });
    component.addRow();
    expect(dataService.addRow).not.toHaveBeenCalled();
  });

  it('should remove a row', () => {
    const row = { fromSecond: 0, toSecond: 10, color: '#ff0000' };
    component.removeRow(row);
    expect(dataService.removeRow).toHaveBeenCalledWith(row);
  });

  it('should toggle new row form visibility', () => {
    component.showNewRowForm.set(false);
    component.toggleNewRowForm();
    expect(component.showNewRowForm()).toBeTrue();
    component.toggleNewRowForm();
    expect(component.showNewRowForm()).toBeFalse();
  });

  it('should update current second', () => {
    component.updateCurrentSecond(10);
    expect(component.currentSecond()).toBe(10);
  });

  it('should check color error', () => {
    component.newRowForm.setErrors({ required: true });
    let errorMessage = component.checkColorError();
    expect(errorMessage).toBe('Required');

    component.newRowForm.setErrors({ colorConflict: true });
    errorMessage = component.checkColorError();
    expect(errorMessage).toBe('Color already exists.');
  });
});
