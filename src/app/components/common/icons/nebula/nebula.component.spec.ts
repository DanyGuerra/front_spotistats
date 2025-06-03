import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NebulaComponent } from './nebula.component';

describe('NebulaComponent', () => {
  let component: NebulaComponent;
  let fixture: ComponentFixture<NebulaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NebulaComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(NebulaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
