import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DescTopicComponent } from './desc-topic.component';

describe('DescTopicComponent', () => {
  let component: DescTopicComponent;
  let fixture: ComponentFixture<DescTopicComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DescTopicComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DescTopicComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
