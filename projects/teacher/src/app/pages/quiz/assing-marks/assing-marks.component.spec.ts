import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AssingMarksComponent } from './assing-marks.component';

describe('AssingMarksComponent', () => {
  let component: AssingMarksComponent;
  let fixture: ComponentFixture<AssingMarksComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AssingMarksComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AssingMarksComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
