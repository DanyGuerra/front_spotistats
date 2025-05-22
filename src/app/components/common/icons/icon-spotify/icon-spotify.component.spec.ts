import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SpotifyIconComponent } from './icon-spotify.component';

describe('SpotifyIconComponent', () => {
  let component: SpotifyIconComponent;
  let fixture: ComponentFixture<SpotifyIconComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SpotifyIconComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SpotifyIconComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
