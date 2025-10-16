import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { ListCardCategoria } from './list-card-categoria';
import { CategoriaApiService } from '../categoria-api-service';

describe('ListCardCategoria', () => {
  let component: ListCardCategoria;
  let mockCategoriaApiService: jasmine.SpyObj<CategoriaApiService>;

  beforeEach(() => {
    const spy = jasmine.createSpyObj('CategoriaApiService', ['listar']);
    spy.listar.and.returnValue(of([]));

    TestBed.configureTestingModule({
      providers: [
        { provide: CategoriaApiService, useValue: spy }
      ]
    });
    component = TestBed.inject(ListCardCategoria);
    mockCategoriaApiService = TestBed.inject(CategoriaApiService) as jasmine.SpyObj<CategoriaApiService>;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
