import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IconTrackComponent } from './icon-track.component';

describe('IconTrackComponent', () => {
  let component: IconTrackComponent;
  let fixture: ComponentFixture<IconTrackComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IconTrackComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(IconTrackComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
