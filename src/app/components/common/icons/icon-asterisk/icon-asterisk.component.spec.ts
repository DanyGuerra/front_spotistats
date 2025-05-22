import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IconAsteriskComponent } from './icon-asterisk.component';

describe('IconAsteriskComponent', () => {
  let component: IconAsteriskComponent;
  let fixture: ComponentFixture<IconAsteriskComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IconAsteriskComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(IconAsteriskComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
