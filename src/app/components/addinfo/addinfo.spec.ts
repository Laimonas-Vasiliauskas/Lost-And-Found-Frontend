import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Addinfo } from './addinfo';

describe('Addinfo', () => {
  let component: Addinfo;
  let fixture: ComponentFixture<Addinfo>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Addinfo],
    }).compileComponents();

    fixture = TestBed.createComponent(Addinfo);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
