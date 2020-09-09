import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateAssingmentComponent } from './create-assingment.component';

describe('CreateAssingmentComponent', () => {
  let component: CreateAssingmentComponent;
  let fixture: ComponentFixture<CreateAssingmentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateAssingmentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateAssingmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
