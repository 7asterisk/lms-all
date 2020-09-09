import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AssingmentSubmissionsComponent } from './assingment-submissions.component';

describe('AssingmentSubmissionsComponent', () => {
  let component: AssingmentSubmissionsComponent;
  let fixture: ComponentFixture<AssingmentSubmissionsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AssingmentSubmissionsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AssingmentSubmissionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
