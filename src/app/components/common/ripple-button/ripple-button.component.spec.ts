import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RippleButtonComponent } from './ripple-button.component';

describe('RippleButtonComponent', () => {
  let component: RippleButtonComponent;
  let fixture: ComponentFixture<RippleButtonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RippleButtonComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(RippleButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
