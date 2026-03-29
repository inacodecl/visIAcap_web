import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DesarrolladoresPage } from './desarrolladores.page';

describe('DesarrolladoresPage', () => {
  let component: DesarrolladoresPage;
  let fixture: ComponentFixture<DesarrolladoresPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(DesarrolladoresPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
