import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ProximamenteFuturoComponent } from './proximamente-futuro.component';

describe('ProximamenteFuturoComponent', () => {
  let component: ProximamenteFuturoComponent;
  let fixture: ComponentFixture<ProximamenteFuturoComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [ProximamenteFuturoComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ProximamenteFuturoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
