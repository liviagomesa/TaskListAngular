import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PreferenciasDetailsComponent } from './preferencias-details.component';

describe('PreferenciasDetailsComponent', () => {
  let component: PreferenciasDetailsComponent;
  let fixture: ComponentFixture<PreferenciasDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PreferenciasDetailsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PreferenciasDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
