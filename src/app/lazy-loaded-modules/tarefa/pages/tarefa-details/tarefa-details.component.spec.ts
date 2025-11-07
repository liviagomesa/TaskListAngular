import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TarefaDetailsComponent } from './tarefa-details.component';

describe('TarefaDetailsComponent', () => {
  let component: TarefaDetailsComponent;
  let fixture: ComponentFixture<TarefaDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TarefaDetailsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TarefaDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
