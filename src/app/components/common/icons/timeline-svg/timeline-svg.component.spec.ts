import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TimelineSvgComponent } from './timeline-svg.component';

describe('TimelineSvgComponent', () => {
  let component: TimelineSvgComponent;
  let fixture: ComponentFixture<TimelineSvgComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TimelineSvgComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TimelineSvgComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
