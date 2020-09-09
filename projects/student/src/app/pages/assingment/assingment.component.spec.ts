import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AssingmentComponent } from './assingment.component';

describe('AssingmentComponent', () => {
  let component: AssingmentComponent;
  let fixture: ComponentFixture<AssingmentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AssingmentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AssingmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
