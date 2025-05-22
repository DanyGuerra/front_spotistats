import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HomeAnimationComponent } from './home-animation.component';

describe('HomeAnimationComponent', () => {
  let component: HomeAnimationComponent;
  let fixture: ComponentFixture<HomeAnimationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HomeAnimationComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(HomeAnimationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
