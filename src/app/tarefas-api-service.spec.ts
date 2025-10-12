import { TestBed } from '@angular/core/testing';
import { TarefasApiService } from './tarefas-api-service';

describe('TarefasApiService', () => {
  let service: TarefasApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TarefasApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
