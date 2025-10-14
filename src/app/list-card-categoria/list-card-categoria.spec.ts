import { TestBed } from '@angular/core/testing';

import { ListCardCategoria } from './list-card-categoria';

describe('ListCardCategoria', () => {
  let component: ListCardCategoria;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    component = TestBed.inject(ListCardCategoria);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
