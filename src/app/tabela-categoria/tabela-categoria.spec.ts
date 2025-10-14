import { TestBed } from '@angular/core/testing';

import { TabelaCategoria } from './tabela-categoria';

describe('TabelaCategoria', () => {
  let component: TabelaCategoria;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    component = TestBed.inject(TabelaCategoria);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
