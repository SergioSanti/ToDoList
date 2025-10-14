import { TestBed } from '@angular/core/testing';

import { CardCategoria } from './card-categoria';

describe('CardCategoria', () => {
  let component: CardCategoria;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    component = TestBed.inject(CardCategoria);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
