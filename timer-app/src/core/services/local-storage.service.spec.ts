import { TestBed } from '@angular/core/testing';
import { LocalStorageService } from './local-storage.service';

describe('LocalStorageService', () => {
  let service: LocalStorageService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LocalStorageService);

    localStorage.clear();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should set and get an item', () => {
    const key = 'testKey';
    const value = { test: 'value' };

    service.setItem(key, value);

    const storedValue = service.getItem<{ test: string }>(key);
    expect(storedValue).toEqual(value);
  });

  it('should return null if item does not exist', () => {
    const key = 'nonExistentKey';
    const storedValue = service.getItem<{ test: string }>(key);
    expect(storedValue).toBeNull();
  });

  it('should remove an item', () => {
    const key = 'testKey';
    const value = { test: 'value' };

    service.setItem(key, value);
    service.removeItem(key);

    const storedValue = service.getItem<{ test: string }>(key);
    expect(storedValue).toBeNull();
  });

  it('should clear all items', () => {
    const key1 = 'testKey1';
    const value1 = { test: 'value1' };
    service.setItem(key1, value1);

    const key2 = 'testKey2';
    const value2 = { test: 'value2' };
    service.setItem(key2, value2);

    service.clear();

    expect(service.getItem<{ test: string }>(key1)).toBeNull();
    expect(service.getItem<{ test: string }>(key2)).toBeNull();
  });
});
