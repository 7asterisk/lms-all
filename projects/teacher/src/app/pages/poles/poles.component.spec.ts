import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PolesComponent } from './poles.component';

describe('PolesComponent', () => {
  let component: PolesComponent;
  let fixture: ComponentFixture<PolesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PolesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PolesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
