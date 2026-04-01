import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ProyectosFuturoComponent } from './proyectos-futuro.component';

describe('ProyectosFuturoComponent', () => {
  let component: ProyectosFuturoComponent;
  let fixture: ComponentFixture<ProyectosFuturoComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [ProyectosFuturoComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ProyectosFuturoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
