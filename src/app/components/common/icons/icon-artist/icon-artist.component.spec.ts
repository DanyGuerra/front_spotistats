import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IconArtistComponent } from './icon-artist.component';

describe('IconArtistComponent', () => {
  let component: IconArtistComponent;
  let fixture: ComponentFixture<IconArtistComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IconArtistComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(IconArtistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
