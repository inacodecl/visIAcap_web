import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { NoticiasFuturoComponent } from './noticias-futuro.component';

describe('NoticiasFuturoComponent', () => {
  let component: NoticiasFuturoComponent;
  let fixture: ComponentFixture<NoticiasFuturoComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [NoticiasFuturoComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(NoticiasFuturoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
