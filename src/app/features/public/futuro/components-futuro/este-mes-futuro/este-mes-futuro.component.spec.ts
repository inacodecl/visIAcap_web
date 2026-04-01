import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { EsteMesFuturoComponent } from './este-mes-futuro.component';

describe('EsteMesFuturoComponent', () => {
  let component: EsteMesFuturoComponent;
  let fixture: ComponentFixture<EsteMesFuturoComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [EsteMesFuturoComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(EsteMesFuturoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
