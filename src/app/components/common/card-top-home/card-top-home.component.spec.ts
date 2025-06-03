import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CardTopHomeComponent } from './card-top-home.component';

describe('CardTopHomeComponent', () => {
  let component: CardTopHomeComponent;
  let fixture: ComponentFixture<CardTopHomeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CardTopHomeComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CardTopHomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
