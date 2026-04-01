import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { HeroFuturoComponent } from './hero-futuro.component';

describe('HeroFuturoComponent', () => {
  let component: HeroFuturoComponent;
  let fixture: ComponentFixture<HeroFuturoComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [HeroFuturoComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(HeroFuturoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
