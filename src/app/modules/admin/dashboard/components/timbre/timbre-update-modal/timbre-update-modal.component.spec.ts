import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TimbreUpdateModalComponent } from './timbre-update-modal.component';

describe('TimbreUpdateModalComponent', () => {
  let component: TimbreUpdateModalComponent;
  let fixture: ComponentFixture<TimbreUpdateModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TimbreUpdateModalComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TimbreUpdateModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
