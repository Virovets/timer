import {inject, Injectable} from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { GridData } from '../interfaces/interfaces';
import { LocalStorageService } from './local-storage.service';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  private localStorageService = inject(LocalStorageService);
  private readonly STORAGE_KEY = 'gridData';
  private _rowsData: GridData[] = this.loadState() || [{ fromSecond: 5, toSecond: 15, color: '#000000' }];
  private _tableData$ = new BehaviorSubject<GridData[]>(this._rowsData);

  get tableData$() {
    return this._tableData$.asObservable();
  }

  addRow(row: GridData) {
    this._rowsData.push(row);
    this._tableData$.next(this._rowsData);
    this.saveState();
  }


  removeRow(row: GridData) {
    this._rowsData = this._rowsData.filter(r => r !== row);
    this._tableData$.next(this._rowsData);
    this.saveState();
  }

  get rowsData() {
    return this._rowsData;
  }

  private saveState() {
    this.localStorageService.setItem(this.STORAGE_KEY, this._rowsData);
  }

  private loadState(): GridData[] | null {
    return this.localStorageService.getItem<GridData[]>(this.STORAGE_KEY);
  }
}

