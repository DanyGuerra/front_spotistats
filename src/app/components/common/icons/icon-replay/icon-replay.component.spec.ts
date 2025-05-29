import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IconReplayComponent } from './icon-replay.component';

describe('IconReplayComponent', () => {
  let component: IconReplayComponent;
  let fixture: ComponentFixture<IconReplayComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IconReplayComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(IconReplayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
