import { TestBed } from '@angular/core/testing';

import { FormCategoria } from '../form-categoria/form-categoria';

describe('FormCategoria', () => {
  let component: FormCategoria;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    component = TestBed.inject(FormCategoria);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
