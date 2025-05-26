import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GraphSvgComponent } from './graph-svg.component';

describe('GraphSvgComponent', () => {
  let component: GraphSvgComponent;
  let fixture: ComponentFixture<GraphSvgComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GraphSvgComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(GraphSvgComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
