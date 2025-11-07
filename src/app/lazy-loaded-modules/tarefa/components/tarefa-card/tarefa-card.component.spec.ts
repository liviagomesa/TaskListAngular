import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TarefaDeListaComponent } from './tarefa-card.component';

describe('TarefaDeListaComponent', () => {
  let component: TarefaDeListaComponent;
  let fixture: ComponentFixture<TarefaDeListaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TarefaDeListaComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TarefaDeListaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
