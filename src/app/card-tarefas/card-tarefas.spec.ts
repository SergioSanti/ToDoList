import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CardTarefas } from './card-tarefas';

describe('CardTarefas', () => {
  let component: CardTarefas;
  let fixture: ComponentFixture<CardTarefas>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CardTarefas]
    }).compileComponents();

    fixture = TestBed.createComponent(CardTarefas);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
