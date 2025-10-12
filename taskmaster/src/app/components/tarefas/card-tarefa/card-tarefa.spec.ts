import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CardTarefa } from './card-tarefa';

describe('CardTarefa', () => {
  let component: CardTarefa;
  let fixture: ComponentFixture<CardTarefa>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CardTarefa]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CardTarefa);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
