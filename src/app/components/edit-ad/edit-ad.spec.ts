import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditAd } from './edit-ad';

describe('EditAd', () => {
  let component: EditAd;
  let fixture: ComponentFixture<EditAd>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditAd],
    }).compileComponents();

    fixture = TestBed.createComponent(EditAd);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
