import { ComponentFixture, TestBed } from '@angular/core/testing';
import { GalleryManagerPage } from './gallery-manager.page';

describe('GalleryManagerPage', () => {
  let component: GalleryManagerPage;
  let fixture: ComponentFixture<GalleryManagerPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(GalleryManagerPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
