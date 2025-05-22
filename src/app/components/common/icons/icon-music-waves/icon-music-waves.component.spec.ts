import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IconMusicWavesComponent } from './icon-music-waves.component';

describe('IconMusicWavesComponent', () => {
  let component: IconMusicWavesComponent;
  let fixture: ComponentFixture<IconMusicWavesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IconMusicWavesComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(IconMusicWavesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
