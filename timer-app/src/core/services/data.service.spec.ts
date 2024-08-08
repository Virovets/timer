import { TestBed } from '@angular/core/testing';
import { DataService } from './data.service';
import { LocalStorageService } from './local-storage.service';
import { GridData } from '../interfaces/interfaces';

describe('DataService', () => {
  let service: DataService;
  let localStorageService: jasmine.SpyObj<LocalStorageService>;

  beforeEach(() => {
    const spy = jasmine.createSpyObj('LocalStorageService', ['getItem', 'setItem', 'removeItem', 'clear']);

    TestBed.configureTestingModule({
      providers: [
        DataService,
        { provide: LocalStorageService, useValue: spy }
      ]
    });

    service = TestBed.inject(DataService);
    localStorageService = TestBed.inject(LocalStorageService) as jasmine.SpyObj<LocalStorageService>;
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should initialize with default _rowsData', () => {
    expect(service.rowsData).toEqual([{ fromSecond: 5, toSecond: 15, color: '#000000' }]);
  });

  it('should return an observable of _rowsData when accessing tableData$', () => {
    service.tableData$.subscribe(data => {
      expect(data).toEqual(service.rowsData);
    });
  });

  it('should add a new row to _rowsData when calling addRow', () => {
    const newRow: GridData = { fromSecond: 10, toSecond: 20, color: '#ff0000' };
    service.addRow(newRow);

    expect(service.rowsData).toContain(newRow);
    expect(localStorageService.setItem).toHaveBeenCalledWith('gridData', service.rowsData);
  });

  it('should remove a row from _rowsData when calling removeRow', () => {
    const row: GridData = { fromSecond: 5, toSecond: 15, color: '#000000' };
    service.addRow(row);
    service.removeRow(row);

    expect(localStorageService.setItem).toHaveBeenCalledWith('gridData', service.rowsData);
  });

});
